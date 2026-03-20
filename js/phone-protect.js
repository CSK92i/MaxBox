// ============================================
// PHONE NUMBER PROTECTION
// ============================================

/**
 * Protect phone numbers from spam bots
 * Displays "Afficher le téléphone" button that reveals the number on click
 */

document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with phone-link class
    const phoneLinks = document.querySelectorAll('.phone-link, .phone-link-large');

    phoneLinks.forEach(link => {
        const phoneNumber = link.getAttribute('data-phone');

        if (phoneNumber) {
            // Create a data attribute with encrypted-like obfuscation
            // (simple obfuscation - not real encryption for frontend)
            link.setAttribute('data-phone-obfuscated', obfuscatePhone(phoneNumber));

            // Add click event listener
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Check if already revealed
                if (this.textContent.includes(' ')) {
                    // Already revealed, make it clickable to call
                    window.location.href = `tel:${phoneNumber}`;
                } else {
                    // Reveal the phone number
                    const formatted = formatPhoneNumber(phoneNumber);
                    this.textContent = formatted;
                    this.href = `tel:${phoneNumber}`;
                    this.style.cursor = 'pointer';

                    // Log attempt (for analytics if needed)
                    logPhoneReveal();
                }
            });
        }
    });
});

/**
 * Simple phone obfuscation
 * @param {string} phone - The phone number
 * @returns {string} Obfuscated phone number
 */
function obfuscatePhone(phone) {
    // Simple character replacement for frontend obfuscation
    return phone.split('').map(char => {
        if (/\d/.test(char)) {
            return String.fromCharCode(char.charCodeAt(0) + 1);
        }
        return char;
    }).join('');
}

/**
 * Format phone number for display
 * @param {string} phone - The phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as French phone number (XX XX XX XX XX)
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    } else if (cleaned.length === 9) {
        // International format without leading 0
        return cleaned.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '+33 $1 $2 $3 $4 $5');
    }

    return phone;
}

/**
 * Log phone reveal for analytics
 * You can replace this with your analytics service (Google Analytics, etc.)
 */
function logPhoneReveal() {
    // Example: Send to analytics
    if (window.gtag) {
        gtag('event', 'phone_revealed', {
            'event_category': 'engagement',
            'event_label': 'phone_number_revealed'
        });
    }

    // Console log for debugging
    console.log('[Analytics] Phone number revealed');
}

/**
 * Alternative: Decode phone from data attribute
 * Useful when you want to pass encoded phone to other functions
 */
function decodePhoneData(encoded) {
    return encoded.split('').map(char => {
        if (/\d/.test(String.fromCharCode(char.charCodeAt(0) - 1))) {
            return String.fromCharCode(char.charCodeAt(0) - 1);
        }
        return char;
    }).join('');
}

// ============================================
// BOT DETECTION & PREVENTION
// ============================================

/**
 * Simple bot detection based on behavior patterns
 */
const botDetector = {
    suspiciousBehaviors: 0,
    threshold: 5,

    /**
     * Check if multiple phone reveals happen too quickly
     */
    trackPhoneReveal() {
        this.suspiciousBehaviors++;
        if (this.suspiciousBehaviors > this.threshold) {
            this.flagAsSuspicious();
        }
    },

    /**
     * Flag suspicious activity
     */
    flagAsSuspicious() {
        console.warn('[Security] Suspicious activity detected');
        // You could implement rate limiting or temporary blocking here
    },

    /**
     * Reset counter for new user session
     */
    reset() {
        this.suspiciousBehaviors = 0;
    }
};

// Track phone reveals
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('phone-link') || e.target.classList.contains('phone-link-large')) {
        botDetector.trackPhoneReveal();
    }
});
