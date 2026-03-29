const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const lengthSlider = document.getElementById('length');
const lengthInput = document.getElementById('lengthInput');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsSimpleCheck = document.getElementById('symbolsSimple');
const symbolsComplexCheck = document.getElementById('symbolsComplex');

// Add mutual exclusion for symbol checkboxes
symbolsSimpleCheck.addEventListener('change', function() {
    if (this.checked && symbolsComplexCheck.checked) {
        symbolsComplexCheck.checked = false;
        regeneratePassword();
    }
});

symbolsComplexCheck.addEventListener('change', function() {
    if (this.checked && symbolsSimpleCheck.checked) {
        symbolsSimpleCheck.checked = false;
        regeneratePassword();
    }
});
const excludeSimilarCheck = document.getElementById('excludeSimilar');
const strengthText = document.getElementById('strengthText');
const crackTimeEl = document.getElementById('crackTime');
const crackTimeQuantumEl = document.getElementById('crackTimeQuantum');
const charsetSizeEl = document.getElementById('charsetSize');
const combinationsEl = document.getElementById('combinations');

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolSimpleChars = '!@#$';
const symbolComplexChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const similarChars = 'il1Lo0O';


function secureRandomIndex(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function secureShuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = secureRandomIndex(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generatePassword() {
    let charset = '';

    if (uppercaseCheck.checked) charset += uppercaseChars;
    if (lowercaseCheck.checked) charset += lowercaseChars;
    if (numbersCheck.checked) charset += numberChars;
    if (symbolsSimpleCheck.checked) charset += symbolSimpleChars;
    if (symbolsComplexCheck.checked) charset += symbolComplexChars;

    if (charset === '') {
        alert('少なくとも1つの文字種を選択してください');
        return '';
    }

    if (excludeSimilarCheck.checked) {
        charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }

    const length = parseInt(lengthSlider.value);

    const guaranteedChars = [];
    if (uppercaseCheck.checked) {
        const filtered = excludeSimilarCheck.checked
            ? uppercaseChars.split('').filter(char => !similarChars.includes(char)).join('')
            : uppercaseChars;
        guaranteedChars.push(filtered[secureRandomIndex(filtered.length)]);
    }
    if (lowercaseCheck.checked) {
        const filtered = excludeSimilarCheck.checked
            ? lowercaseChars.split('').filter(char => !similarChars.includes(char)).join('')
            : lowercaseChars;
        guaranteedChars.push(filtered[secureRandomIndex(filtered.length)]);
    }
    if (numbersCheck.checked) {
        const filtered = excludeSimilarCheck.checked
            ? numberChars.split('').filter(char => !similarChars.includes(char)).join('')
            : numberChars;
        guaranteedChars.push(filtered[secureRandomIndex(filtered.length)]);
    }
    if (symbolsSimpleCheck.checked) {
        guaranteedChars.push(symbolSimpleChars[secureRandomIndex(symbolSimpleChars.length)]);
    }
    if (symbolsComplexCheck.checked) {
        guaranteedChars.push(symbolComplexChars[secureRandomIndex(symbolComplexChars.length)]);
    }

    const chars = [];
    for (let i = guaranteedChars.length; i < length; i++) {
        chars.push(charset[secureRandomIndex(charset.length)]);
    }
    chars.push(...guaranteedChars);

    const password = secureShuffleArray(chars).join('');
    return password;
}

function calculateStrength(seconds) {
    let strengthLabel = '弱い';
    let activeBars = 1;
    let colorClass = 'active-weak';
    let textColor = '#f56565';

    if (seconds < 1) {
        strengthLabel = '弱い';
        activeBars = 1;
        colorClass = 'active-weak';
        textColor = '#f56565';
    } else if (seconds < 86400) {
        strengthLabel = 'やや弱い';
        activeBars = 2;
        colorClass = 'active-fair';
        textColor = '#ed8936';
    } else if (seconds < 31536000) {
        strengthLabel = '良好';
        activeBars = 3;
        colorClass = 'active-good';
        textColor = '#ecc94b';
    } else {
        strengthLabel = '強い';
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

function colorByTime(el, seconds) {
    if (seconds < 1) {
        el.style.color = '#f56565';
    } else if (seconds < 86400) {
        el.style.color = '#ed8936';
    } else if (seconds < 31536000) {
        el.style.color = '#ecc94b';
    } else {
        el.style.color = '#48bb78';
    }
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
        charsetSize += symbolSimpleChars.length;
    }
    
    if (symbolsComplexCheck.checked) {
        // Complex symbols don't have similar characters
        charsetSize += symbolComplexChars.length;
    }
    
    const passwordLength = password.length;
    const combinations = Math.pow(charsetSize, passwordLength);
    
    // Update display values
    charsetSizeEl.textContent = charsetSize;
    combinationsEl.textContent = formatNumber(combinations);
    
    // GPU: 10 billion attempts per second
    const attemptsPerSecond = 10000000000;
    const seconds = combinations / attemptsPerSecond;

    // Quantum: Grover's algorithm reduces search space to sqrt(N)
    const quantumCombinations = Math.sqrt(combinations);
    const quantumSeconds = quantumCombinations / attemptsPerSecond;

    crackTimeEl.textContent = formatTime(seconds);
    crackTimeQuantumEl.textContent = formatTime(quantumSeconds);

    colorByTime(crackTimeEl, seconds);
    colorByTime(crackTimeQuantumEl, quantumSeconds);

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
    if (seconds < 0.001) return '一瞬';
    if (seconds < 1) return Math.floor(seconds * 1000) + ' ミリ秒';
    if (seconds < 60) return Math.floor(seconds) + ' 秒';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' 分';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' 時間';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' 日';
    if (seconds < 31536000) return Math.floor(seconds / 2592000) + ' ヶ月';

    const years = seconds / 31536000;
    return formatYears(years);
}

function formatYears(years) {
    if (years < 1e4) return Math.floor(years).toLocaleString() + ' 年';
    if (years < 1e8) return (years / 1e4).toFixed(1).replace(/\.0$/, '') + ' 万年';
    if (years < 1e12) return (years / 1e8).toFixed(1).replace(/\.0$/, '') + ' 億年';
    if (years < 1e16) return (years / 1e12).toFixed(1).replace(/\.0$/, '') + ' 兆年';
    if (years < 1e20) return (years / 1e16).toFixed(1).replace(/\.0$/, '') + ' 京年';
    return '事実上不可能';
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
    
    // Only sync with slider if value is within valid range
    if (value >= 4 && value <= 50) {
        lengthSlider.value = value;
        regeneratePassword();
    }
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

regenerateBtn.addEventListener('click', () => {
    const svg = regenerateBtn.querySelector('svg');
    svg.classList.add('regenerating');
    regeneratePassword();
    setTimeout(() => {
        svg.classList.remove('regenerating');
    }, 500);
});

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
                alert('コピーに失敗しました。手動でコピーしてください。');
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