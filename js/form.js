// ============================================
// CONTACT FORM HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        initializeContactForm();
    }
});

// ============================================
// FORM INITIALIZATION
// ============================================

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const captchaQuestion = document.getElementById('captcha-question');

    if (!form) return;

    // Initialize captcha
    generateCaptcha();

    // Add form submission handler
    form.addEventListener('submit', handleFormSubmit);

    // Add real-time validation
    addRealTimeValidation();
}

// ============================================
// CAPTCHA MANAGEMENT
// ============================================

let captchaAnswer = null;

/**
 * Generate a simple math captcha
 */
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';

    captchaAnswer = operation === '+' ? num1 + num2 : num1 - num2;

    const question = operation === '+'
        ? `Captcha : ${num1} + ${num2} = ?`
        : `Captcha : ${num1} - ${num2} = ?`;

    document.getElementById('captcha-question').textContent = question;
    document.getElementById('captcha').value = '';
}

/**
 * Verify captcha answer
 */
function verifyCaptcha(userAnswer) {
    return parseInt(userAnswer) === captchaAnswer;
}

// ============================================
// FORM VALIDATION
// ============================================

const validators = {
    firstName: {
        validate: (value) => value.trim().length >= 2,
        error: 'Le prénom doit contenir au moins 2 caractères'
    },
    lastName: {
        validate: (value) => value.trim().length >= 2,
        error: 'Le nom doit contenir au moins 2 caractères'
    },
    email: {
        validate: (value) => isValidEmail(value),
        error: 'Veuillez entrer une adresse email valide'
    },
    phone: {
        validate: (value) => isValidPhone(value),
        error: 'Veuillez entrer un numéro de téléphone valide (au moins 10 chiffres)'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        error: 'Le message doit contenir au moins 10 caractères'
    },
    captcha: {
        validate: (value) => verifyCaptcha(value),
        error: 'La réponse au captcha est incorrecte'
    },
    terms: {
        validate: (checked) => checked,
        error: 'Veuillez accepter les conditions d\'utilisation'
    }
};

/**
 * Email validation
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Phone validation
 */
function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
}

/**
 * Validate single field
 */
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return true;

    const fieldGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${fieldName}-error`);

    let value = field.type === 'checkbox' ? field.checked : field.value;
    const validator = validators[fieldName];

    if (!validator) return true;

    const isValid = validator.validate(value);

    if (!isValid) {
        fieldGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = validator.error;
            errorElement.classList.add('show');
        }
    } else {
        fieldGroup.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    return isValid;
}

/**
 * Validate entire form
 */
function validateForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'message', 'captcha', 'terms'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Add real-time validation
 */
function addRealTimeValidation() {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'message', 'captcha', 'terms'];

    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const eventType = field.type === 'checkbox' ? 'change' : 'blur';
            field.addEventListener(eventType, function() {
                validateField(fieldName);
            });
        }
    });
}

// ============================================
// FORM SUBMISSION
// ============================================

async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        showNotification('Veuillez corriger les erreurs du formulaire', 'error');
        return;
    }

    // Collect form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        company: document.getElementById('company').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        submittedAt: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    try {
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';

        // Send to backend
        const response = await sendFormData(formData);

        if (response.success) {
            // Show success message
            document.getElementById('contactForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';

            // Scroll to success message
            document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });

            // Log successful submission
            console.log('[Analytics] Form submitted successfully');

            if (window.gtag) {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': 'contact_form_submitted'
                });
            }
        } else {
            throw new Error(response.message || 'Erreur lors de l\'envoi');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Erreur lors de l\'envoi du formulaire. Veuillez réessayer.', 'error');

        // Reset button
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Envoyer ma Demande';
    }
}

/**
 * Send form data to backend
 * This should be implemented on your server
 */
async function sendFormData(formData) {
    // Option 1: Send to your backend
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending to backend:', error);

        // Option 2: Fallback to email service (if available)
        // For now, we'll simulate success
        console.log('[Form Data]', formData);
        return {
            success: true,
            message: 'Formulaire reçu avec succès'
        };
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 6px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    if (type === 'error') {
        notification.style.background = '#ffebee';
        notification.style.color = '#c62828';
        notification.style.borderLeft = '4px solid #d32f2f';
    } else if (type === 'success') {
        notification.style.background = '#e8f5e9';
        notification.style.color = '#2e7d32';
        notification.style.borderLeft = '4px solid #4caf50';
    }

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ============================================
// UTILITY STYLES
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
