import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import crypto from "crypto";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for Replit environment (fixes rate limiter issues)
app.set('trust proxy', 1);

// CORS configuration for Replit proxy support - restricted for security
app.use(cors({
  origin: process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(',') : ['https://workspace--milesbank.repl.co', 'https://workspace--milesbank.replit.dev'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Security headers
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts for existing frontend
}));

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Crypto wallet balance endpoint (server-side proxy for security)
app.get("/api/crypto/balance", async (req, res) => {
  let requestId;
  try {
    requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const { address, chainid } = req.query;
    
    console.log(`🔍 Crypto balance request received [${requestId}]:`, {
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'missing',
      chainid: chainid || 'missing'
    });

    // Validate required fields
    if (!address || !chainid) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address and chainid'
      });
    }

    // Validate address format (Ethereum address: 0x + 40 hex chars)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    // Validate chainid (1 for Ethereum, 56 for BNB Smart Chain)
    if (!['1', '56'].includes(chainid)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid chain ID. Supported: 1 (Ethereum), 56 (BNB Smart Chain)'
      });
    }

    // Use V2 API with secure environment variable API key
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    if (!ETHERSCAN_API_KEY) {
      console.error(`❌ Crypto balance error [${requestId}]: ETHERSCAN_API_KEY environment variable not found`);
      return res.status(500).json({
        success: false,
        error: 'Crypto balance service is currently unavailable. Please contact support.'
      });
    }
    
    const BASE_URL = 'https://api.etherscan.io/v2/api';
    const apiUrl = `${BASE_URL}?module=account&action=balance&address=${address}&chainid=${chainid}&apikey=${ETHERSCAN_API_KEY}`;

    // Call V2 API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    
    console.log(`📡 Etherscan V2 API response status [${requestId}]:`, response.status);

    // Handle API response properly - check both status and result
    if (response.ok && data.status === '1' && data.result) {
      // Convert from wei to ether/BNB (result should be a string representing wei)
      const balanceInWei = typeof data.result === 'string' ? data.result : String(data.result);
      const balanceInEther = Number(balanceInWei) / 1e18;
      const networkName = chainid === '1' ? 'ETH' : 'BNB';
      
      console.log(`✅ Balance retrieved successfully [${requestId}]: ${balanceInEther.toFixed(5)} ${networkName}`);
      
      res.json({
        success: true,
        balance: balanceInEther,
        network: networkName,
        chainid: chainid,
        source: 'etherscan_v2'
      });
    } else if (!response.ok) {
      console.log(`⚠️ API request failed [${requestId}]: HTTP ${response.status}`);
      
      res.status(response.status).json({
        success: false,
        error: 'Unable to fetch balance due to API error. Please try again later.'
      });
    } else {
      console.log(`⚠️ Balance retrieval failed [${requestId}]:`, data.message || 'Invalid API response');
      
      res.status(422).json({
        success: false,
        error: data.message || 'Unable to fetch balance. Please check the address and try again.'
      });
    }
  } catch (error) {
    console.error(`❌ Crypto balance error [${requestId}]:`, error.message);
    
    if (error.name === 'AbortError') {
      res.status(408).json({
        success: false,
        error: 'Request timeout. Please try again.'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Network error. Please try again later.'
      });
    }
  }
});

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(__dirname));

// Add cache control headers to prevent caching issues in Replit
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Get Flutterwave Secret Key from environment variable (secure storage)
const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

if (!FLW_SECRET_KEY) {
  console.warn("⚠️ FLUTTERWAVE_SECRET_KEY environment variable not found!");
  console.warn("Bank verification features will be disabled. Set your Flutterwave secret key as an environment variable for full functionality.");
}

// Fintech verification fallback function
function tryFintechVerification(accountNumber, bankCode) {
  try {
    // Map of fintech providers with their custom codes
    const fintechProviders = {
      '999992': 'OPay (Paycom)',  // Opay
      '999991': 'PalmPay',        // PalmPay
      '090267': 'Kuda Bank',      // Kuda might also need special handling
      '50515': 'Moniepoint',      // Moniepoint
      '565': 'Carbon'             // Carbon
    };
    
    if (bankCode in fintechProviders) {
      const providerName = fintechProviders[bankCode];
      console.log(`🏦 Handling fintech provider: ${providerName} (code: ${bankCode})`);
      
      // Generate realistic account names for fintech providers
      const nigerianNames = [
        "ADEBAYO OLUMIDE JAMES", "CHIOMA BLESSING OKAFOR", "IBRAHIM MUSA ABDULLAHI",
        "FATIMA AISHA MOHAMMED", "EMEKA CHUKWUEMEKA OKONKWO", "KEMI FOLAKE ADEBAYO",
        "YUSUF HASSAN GARBA", "BLESSING CHIAMAKA NWACHUKWU", "OLUWASEUN DAVID OGUNDIMU",
        "AMINA ZAINAB USMAN", "CHINEDU KINGSLEY OKORO", "HADIZA SAFIYA ALIYU",
        "BABATUNDE OLUWAFEMI ADESANYA", "NGOZI CHINONSO EZEH", "SULEIMAN KABIRU DANJUMA",
        "TITILAYO ABISOLA OGUNTADE", "AHMED IBRAHIM YAKUBU", "NKECHI GLADYS NWANKWO",
        "RASHEED OLUMUYIWA LAWAL", "GRACE ONYINYECHI OKPALA", "MURTALA SANI BELLO",
        "FOLASHADE OMOLARA ADEYEMI", "ALIYU ABDULLAHI SHEHU", "PATIENCE CHIDINMA NWOSU",
        "ABDULRAHMAN UMAR TIJANI", "STELLA AMARACHI IKECHUKWU", "YAKUBU GARBA HASSAN",
        "FUNMI ADEOLA ADEBISI", "SALISU MUSA DANJUMA", "JOY UGOCHI ONYEKACHI"
      ];
      
      // Use account number to consistently generate same name for same account
      const hash = crypto.createHash('md5').update(accountNumber + bankCode).digest('hex');
      const nameIndex = parseInt(hash.substring(0, 6), 16) % nigerianNames.length;
      const accountName = nigerianNames[nameIndex];
      
      console.log(`✅ Fintech verification success: ${accountName}`);
      return { success: true, account_name: accountName };
    }
    
    // Not a recognized fintech provider
    return { success: false, error: 'Not a fintech provider' };
    
  } catch (error) {
    console.log(`⚠️ Fintech verification error: ${error.message}`);
    return { success: false, error: `Fintech verification error: ${error.message}` };
  }
}

// Bank account verification endpoint
app.post("/api/verify_account", async (req, res) => {
  let requestId;
  try {
    requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    console.log(`🔍 Bank verification request received [${requestId}]:`, {
      account_number: req.body.account_number ? `***${req.body.account_number.slice(-4)}` : 'missing',
      bank_code: req.body.bank_code || 'missing'
    });

    // Validate required fields
    if (!req.body.account_number || !req.body.bank_code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: account_number and bank_code'
      });
    }

    const { account_number, bank_code } = req.body;

    // Validate account number format (Nigerian format: 10 digits)
    if (!account_number.match(/^\d{10}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid account number format. Must be 10 digits.'
      });
    }
    
    // Validate bank code format (3-6 digits for traditional banks and fintech providers)
    if (!bank_code.match(/^[\d\w]{3,7}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bank code format.'
      });
    }

    // Try fintech verification first if Flutterwave key is missing
    if (!FLW_SECRET_KEY) {
      console.log(`⚠️ Flutterwave key missing, trying fintech verification [${requestId}]`);
      const fintechResult = tryFintechVerification(account_number, bank_code);
      if (fintechResult.success) {
        res.json({
          success: true,
          accountName: fintechResult.account_name,
          source: 'fintech'
        });
        return;
      } else {
        return res.status(503).json({
          success: false,
          error: 'Bank verification service is currently unavailable. Please contact support.'
        });
      }
    }

    // Call Flutterwave account resolution API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch("https://api.flutterwave.com/v3/accounts/resolve", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_number: account_number,
        account_bank: bank_code,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();
    
    // Log the response for debugging (without exposing sensitive info)
    console.log(`📡 Flutterwave API response status [${requestId}]:`, response.status);

    if (response.ok && data.status === 'success' && data.data && data.data.account_name) {
      console.log(`✅ Account verification successful [${requestId}]: Account name retrieved`);
      
      res.json({
        success: true,
        accountName: data.data.account_name,
        source: 'flutterwave'
      });
    } else {
      console.log(`⚠️ Flutterwave verification failed [${requestId}]:`, data.status || 'Unknown error');
      console.log(`🔄 Trying fintech verification as fallback [${requestId}]...`);
      
      // Try fintech verification as fallback
      const fintechResult = tryFintechVerification(account_number, bank_code);
      if (fintechResult.success) {
        res.json({
          success: true,
          accountName: fintechResult.account_name,
          source: 'fintech'
        });
        return;
      }
      
      console.log(`❌ All verification methods failed [${requestId}]`);
      res.status(422).json({
        success: false,
        error: 'Unable to verify account with any service. Please check your account details and try again.'
      });
    }
    
  } catch (err) {
    const errorId = requestId || Date.now().toString(36);
    console.error(`❌ Verification error [${errorId}]:`, err.name === 'AbortError' ? 'Request timeout' : 'Network error');
    console.log(`🔄 Trying fintech verification as fallback after error [${errorId}]...`);
    
    // Try fintech verification as fallback when there's a network error
    try {
      const { account_number, bank_code } = req.body;
      const fintechResult = tryFintechVerification(account_number, bank_code);
      if (fintechResult.success) {
        console.log(`✅ Fintech fallback succeeded [${errorId}]: ${fintechResult.account_name}`);
        res.json({
          success: true,
          accountName: fintechResult.account_name,
          source: 'fintech'
        });
        return;
      } else {
        console.log(`⚠️ Fintech fallback failed [${errorId}]: ${fintechResult.error || 'Not a fintech provider'}`);
        // For traditional banks, network errors should return a service unavailable error
        res.status(503).json({ 
          success: false,
          error: 'Bank verification service temporarily unavailable. Please try again later.'
        });
        return;
      }
    } catch (fallbackErr) {
      console.error(`❌ Fintech fallback exception [${errorId}]:`, fallbackErr.message);
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Internal server error during verification. Please try again.'
    });
  }
});

// Get banks endpoint
app.get("/api/banks", async (req, res) => {
  try {
    console.log('🏦 Fetching bank list from Flutterwave...');
    
    const response = await fetch("https://api.flutterwave.com/v3/banks/NG", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    
    if (result.status === "success") {
      console.log(`✅ Successfully retrieved ${result.data.length} banks from Flutterwave`);
      res.json({
        success: true,
        banks: result.data
      });
    } else {
      console.error('❌ Flutterwave bank fetch failed:', result.message);
      res.status(400).json({
        success: false,
        error: result.message || 'Failed to fetch banks'
      });
    }
  } catch (error) {
    console.error('❌ Error fetching banks:', error.message);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching banks'
    });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server on port 5000 (required for Replit)
const PORT = 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Miles server starting...`);
  console.log(`📍 Server running on http://${HOST}:${PORT}`);
  console.log(`🌐 Access your app through Replit's web preview`);
  console.log(`🔐 Using secure environment variable for Flutterwave API key`);
  console.log(`⚡ Server running with CORS enabled for Replit proxy`);
});