const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('length');
const lengthInput = document.getElementById('lengthInput');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsSimpleCheck = document.getElementById('symbolsSimple');
const symbolsComplexCheck = document.getElementById('symbolsComplex');
const excludeSimilarCheck = document.getElementById('excludeSimilar');
const strengthText = document.getElementById('strengthText');
const crackTimeEl = document.getElementById('crackTime');
const charsetSizeEl = document.getElementById('charsetSize');
const combinationsEl = document.getElementById('combinations');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolSimpleChars = '!@#$';
const symbolComplexChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const similarChars = 'il1Lo0O';


function generatePassword() {
    let charset = '';
    let password = '';
    
    if (uppercaseCheck.checked) charset += uppercaseChars;
    if (lowercaseCheck.checked) charset += lowercaseChars;
    if (numbersCheck.checked) charset += numberChars;
    if (symbolsSimpleCheck.checked) charset += symbolSimpleChars;
    if (symbolsComplexCheck.checked) charset += symbolComplexChars;
    
    if (charset === '') {
        alert('Please select at least one character type!');
        return '';
    }
    
    if (excludeSimilarCheck.checked) {
        charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    const length = parseInt(lengthSlider.value);
    
    const guaranteedChars = [];
    if (uppercaseCheck.checked) {
        const filteredUpper = excludeSimilarCheck.checked 
            ? uppercaseChars.split('').filter(char => !similarChars.includes(char)).join('')
            : uppercaseChars;
        guaranteedChars.push(filteredUpper[Math.floor(Math.random() * filteredUpper.length)]);
    }
    if (lowercaseCheck.checked) {
        const filteredLower = excludeSimilarCheck.checked 
            ? lowercaseChars.split('').filter(char => !similarChars.includes(char)).join('')
            : lowercaseChars;
        guaranteedChars.push(filteredLower[Math.floor(Math.random() * filteredLower.length)]);
    }
    if (numbersCheck.checked) {
        const filteredNumbers = excludeSimilarCheck.checked 
            ? numberChars.split('').filter(char => !similarChars.includes(char)).join('')
            : numberChars;
        guaranteedChars.push(filteredNumbers[Math.floor(Math.random() * filteredNumbers.length)]);
    }
    if (symbolsSimpleCheck.checked) {
        guaranteedChars.push(symbolSimpleChars[Math.floor(Math.random() * symbolSimpleChars.length)]);
    }
    if (symbolsComplexCheck.checked) {
        guaranteedChars.push(symbolComplexChars[Math.floor(Math.random() * symbolComplexChars.length)]);
    }
    
    for (let i = guaranteedChars.length; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    password = password.split('');
    guaranteedChars.forEach((char, index) => {
        const randomPos = Math.floor(Math.random() * (password.length + index + 1));
        password.splice(randomPos, 0, char);
    });
    
    password = password.slice(0, length).join('');
    
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
}

function calculateStrength(seconds) {
    let strengthLabel = 'Weak';
    let activeBars = 1;
    let colorClass = 'active-weak';
    let textColor = '#f56565';
    
    // Base strength on crack time
    if (seconds < 1) {
        // Less than 1 second - Very Weak
        strengthLabel = 'Weak';
        activeBars = 1;
        colorClass = 'active-weak';
        textColor = '#f56565';
    } else if (seconds < 86400) {
        // Less than 1 day - Fair
        strengthLabel = 'Fair';
        activeBars = 2;
        colorClass = 'active-fair';
        textColor = '#ed8936';
    } else if (seconds < 31536000) {
        // Less than 1 year - Good
        strengthLabel = 'Good';
        activeBars = 3;
        colorClass = 'active-good';
        textColor = '#ecc94b';
    } else {
        // 1 year or more - Strong
        strengthLabel = 'Strong';
        activeBars = 4;
        colorClass = 'active-strong';
        textColor = '#48bb78';
    }
    
    // Update bars
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => bar.className = 'bar');
    
    for (let i = 0; i < activeBars; i++) {
        bars[i].classList.add(colorClass);
    }
    
    // Update text
    strengthText.textContent = strengthLabel;
    strengthText.style.color = textColor;
}

function calculateCrackTime(password) {
    let charsetSize = 0;
    
    // Calculate charset size based on selected options
    if (uppercaseCheck.checked) {
        let upperSize = 26;
        if (excludeSimilarCheck.checked) {
            // Remove similar chars: L, O
            upperSize -= 2;
        }
        charsetSize += upperSize;
    }
    
    if (lowercaseCheck.checked) {
        let lowerSize = 26;
        if (excludeSimilarCheck.checked) {
            // Remove similar chars: i, l, o
            lowerSize -= 3;
        }
        charsetSize += lowerSize;
    }
    
    if (numbersCheck.checked) {
        let numberSize = 10;
        if (excludeSimilarCheck.checked) {
            // Remove similar chars: 1, 0
            numberSize -= 2;
        }
        charsetSize += numberSize;
    }
    
    if (symbolsSimpleCheck.checked) {
        // Simple symbols (!@#$) don't have similar characters
        charsetSize += 4;
    }
    
    if (symbolsComplexCheck.checked) {
        // Complex symbols don't have similar characters
        charsetSize += 22;
    }
    
    const passwordLength = password.length;
    const combinations = Math.pow(charsetSize, passwordLength);
    
    // Update display values
    charsetSizeEl.textContent = charsetSize;
    combinationsEl.textContent = formatNumber(combinations);
    
    // Calculate time assuming 10 billion attempts per second (modern GPU)
    const attemptsPerSecond = 10000000000;
    const seconds = combinations / attemptsPerSecond;
    
    // Format time
    let timeString = formatTime(seconds);
    crackTimeEl.textContent = timeString;
    
    // Color code based on security
    if (seconds < 1) {
        crackTimeEl.style.color = '#f56565';
    } else if (seconds < 86400) { // Less than 1 day
        crackTimeEl.style.color = '#ed8936';
    } else if (seconds < 31536000) { // Less than 1 year
        crackTimeEl.style.color = '#ecc94b';
    } else {
        crackTimeEl.style.color = '#48bb78';
    }
    
    // Update strength based on crack time
    calculateStrength(seconds);
    
    return seconds;
}

function formatNumber(num) {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1e6) return (num / 1e3).toFixed(1) + 'K';
    if (num < 1e9) return (num / 1e6).toFixed(1) + 'M';
    if (num < 1e12) return (num / 1e9).toFixed(1) + 'B';
    if (num < 1e15) return (num / 1e12).toFixed(1) + 'T';
    if (num < 1e18) return (num / 1e15).toFixed(1) + 'Q';
    return num.toExponential(2);
}

function formatTime(seconds) {
    if (seconds < 0.001) return 'Instant';
    if (seconds < 1) return Math.floor(seconds * 1000) + ' milliseconds';
    if (seconds < 60) return Math.floor(seconds) + ' seconds';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' days';
    if (seconds < 31536000) return Math.floor(seconds / 2592000) + ' months';
    if (seconds < 315360000) return Math.floor(seconds / 31536000) + ' years';
    if (seconds < 3153600000) return Math.floor(seconds / 315360000) + ' decades';
    if (seconds < 31536000000) return Math.floor(seconds / 3153600000) + ' centuries';
    if (seconds < 315360000000) return Math.floor(seconds / 31536000000) + ' millennia';
    
    // For extremely large numbers
    const years = seconds / 31536000;
    if (years < 1e6) return formatNumber(years) + ' years';
    if (years < 1e9) return formatNumber(years / 1e6) + ' million years';
    if (years < 1e12) return formatNumber(years / 1e9) + ' billion years';
    if (years < 1e15) return formatNumber(years / 1e12) + ' trillion years';
    
    return 'Virtually impossible';
}

function regeneratePassword() {
    const password = generatePassword();
    if (password) {
        passwordOutput.value = password;
        calculateStrength(password);
        calculateCrackTime(password);
    }
}

// Add event listeners for all settings to auto-generate password
lengthSlider.addEventListener('input', () => {
    lengthInput.value = lengthSlider.value;
    regeneratePassword();
});

lengthInput.addEventListener('input', () => {
    let value = parseInt(lengthInput.value);
    if (isNaN(value)) return;
    
    // Clamp value between min and max
    value = Math.max(4, Math.min(50, value));
    lengthInput.value = value;
    lengthSlider.value = value;
    regeneratePassword();
});

lengthInput.addEventListener('blur', () => {
    // Ensure valid value on blur
    if (lengthInput.value === '' || parseInt(lengthInput.value) < 4) {
        lengthInput.value = 4;
        lengthSlider.value = 4;
        regeneratePassword();
    } else if (parseInt(lengthInput.value) > 50) {
        lengthInput.value = 50;
        lengthSlider.value = 50;
        regeneratePassword();
    }
});

uppercaseCheck.addEventListener('change', regeneratePassword);
lowercaseCheck.addEventListener('change', regeneratePassword);
numbersCheck.addEventListener('change', regeneratePassword);
symbolsSimpleCheck.addEventListener('change', regeneratePassword);
symbolsComplexCheck.addEventListener('change', regeneratePassword);
excludeSimilarCheck.addEventListener('change', regeneratePassword);

function showCopyNotification() {
    const toast = document.getElementById('copyToast');
    
    // Show toast notification
    toast.classList.remove('hide');
    toast.classList.add('show');
    
    // Hide after 2.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    }, 2500);
}

function createRippleEffect() {
    const ripple = document.createElement('div');
    ripple.className = 'copy-effect';
    copyBtn.style.position = 'relative';
    copyBtn.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}


// Fallback function for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    
    document.body.removeChild(textArea);
    return success;
}

// Copy to clipboard with fallback
function copyToClipboard(text) {
    // Check if Clipboard API is available
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern Clipboard API
        return navigator.clipboard.writeText(text);
    } else {
        // Use fallback method
        return new Promise((resolve, reject) => {
            const success = fallbackCopyToClipboard(text);
            if (success) {
                resolve();
            } else {
                reject(new Error('Copy failed'));
            }
        });
    }
}

copyBtn.addEventListener('click', () => {
    if (passwordOutput.value) {
        copyToClipboard(passwordOutput.value).then(() => {
            // Add multiple visual feedbacks
            copyBtn.classList.add('copied');
            createRippleEffect();
            showCopyNotification();
            
            // Change icon
            copyBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            
            // Pulse the password field
            passwordOutput.style.background = '#002200';
            passwordOutput.style.borderColor = '#00ff00';
            passwordOutput.style.transform = 'scale(1.02)';
            passwordOutput.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
            
            setTimeout(() => {
                passwordOutput.style.background = '#000000';
                passwordOutput.style.borderColor = '#00ff00';
                passwordOutput.style.transform = 'scale(1)';
                passwordOutput.style.boxShadow = 'none';
            }, 300);
            
            // Reset button after delay
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy password:', err);
            // Try fallback if modern API fails
            if (fallbackCopyToClipboard(passwordOutput.value)) {
                // Still show success feedback if fallback worked
                copyBtn.classList.add('copied');
                createRippleEffect();
                showCopyNotification();
                
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            } else {
                alert('Failed to copy password. Please copy manually.');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const password = generatePassword();
    if (password) {
        passwordOutput.value = password;
        calculateStrength(password);
        calculateCrackTime(password);
    }
});