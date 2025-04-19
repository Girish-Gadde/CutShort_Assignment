// Add initialization flag
let isChangePasswordInitialized = false;

function initializeChangePassword() {
    // Check if already initialized
    if (isChangePasswordInitialized) {
        console.log('Change password already initialized, skipping...');
        return;
    }

    // Get form elements
    const form = document.querySelector('.change-password-form');
    if (!form) {
        console.log('Change password form not found');
        return;
    }

    // Debug check if form is found
    console.log('Change password form found, initializing...');

    // Remove any existing event listeners by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Get all elements after cloning
    const elements = {
        form: newForm,
        toggleButtons: newForm.querySelectorAll('.password-toggle'),
        currentPassword: newForm.querySelector('#currentPassword'),
        newPassword: newForm.querySelector('#newPassword'),
        confirmPassword: newForm.querySelector('#confirmPassword'),
        requirementsList: document.querySelectorAll('.requirements-list li'),
        cancelButton: newForm.querySelector('.btn-text'),
        submitButton: newForm.querySelector('.btn-primary')
    };

    // Debug check if elements are found
    console.log('Change Password Form Elements:', {
        form: !!elements.form,
        toggleButtons: elements.toggleButtons.length,
        currentPassword: !!elements.currentPassword,
        newPassword: !!elements.newPassword,
        confirmPassword: !!elements.confirmPassword,
        requirementsList: elements.requirementsList.length,
        cancelButton: !!elements.cancelButton,
        submitButton: !!elements.submitButton
    });

    // Password requirements validation
    const requirements = [
        { regex: /.{8,}/, index: 0, message: 'Minimum 8 characters' },
        { regex: /[A-Z]/, index: 1, message: 'At least one uppercase letter' },
        { regex: /[0-9]/, index: 2, message: 'At least one number' },
        { regex: /[!@#$%^&*(),.?":{}|<>]/, index: 3, message: 'At least one special character' }
    ];

    // Initialize requirements to white circles
    function resetRequirementIcons() {
        elements.requirementsList.forEach(item => {
            const icon = item.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-check-circle');
                icon.classList.add('fa-circle');
                icon.style.color = '#fff';
            }
        });
        console.log('Password requirement icons reset');
    }

    // Reset all password fields to password type and eye icons
    function resetPasswordVisibility() {
        elements.toggleButtons.forEach(button => {
            const targetId = button.getAttribute('data-target');
            const passwordInput = elements.form.querySelector(`#${targetId}`);
            const icon = button.querySelector('i');
            if (passwordInput && icon) {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
        console.log('Password visibility reset');
    }

    // Reset the entire form
    function resetForm() {
        elements.form.reset();
        resetPasswordVisibility();
        resetRequirementIcons();
        console.log('Form reset complete');
    }

    // Initialize with white circles
    resetRequirementIcons();

    // Check password requirements
    function checkPasswordRequirements(password) {
        requirements.forEach((requirement, index) => {
            const isValid = requirement.regex.test(password);
            const requirementItem = elements.requirementsList[index];
            const icon = requirementItem?.querySelector('i');
            
            if (icon) {
                if (isValid) {
                    icon.classList.remove('fa-circle');
                    icon.classList.add('fa-check-circle');
                    icon.style.color = '#6C5DD3';
                } else {
                    icon.classList.remove('fa-check-circle');
                    icon.classList.add('fa-circle');
                    icon.style.color = '#fff';
                }
            }
        });
    }

    // Handle password visibility toggle
    elements.toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = button.getAttribute('data-target');
            const passwordInput = elements.form.querySelector(`#${targetId}`);
            const icon = button.querySelector('i');

            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
                console.log(`Password visibility toggled for ${targetId}`);
            }
        });
    });

    // Validate password sequence
    elements.confirmPassword?.addEventListener('focus', () => {
        if (!elements.currentPassword.value) {
            alert('Please enter your current password first');
            elements.currentPassword.focus();
            return;
        }
        if (!elements.newPassword.value) {
            alert('Please enter your new password first');
            elements.newPassword.focus();
            return;
        }
    });

    // Check requirements as user types in new password
    elements.newPassword?.addEventListener('input', () => {
        const password = elements.newPassword.value;
        checkPasswordRequirements(password);
        console.log('Password requirements checked');
    });

    // Handle form submission
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = elements.currentPassword.value;
        const newPassword = elements.newPassword.value;
        const confirmPassword = elements.confirmPassword.value;

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match');
            return;
        }

        // Check if all password requirements are met
        const allRequirementsMet = requirements.every(requirement => 
            requirement.regex.test(newPassword)
        );

        if (!allRequirementsMet) {
            alert('Please ensure all password requirements are met');
            return;
        }

        // Log password data
        console.log('Password Change Requested:', {
            currentPassword,
            newPassword,
            timestamp: new Date().toISOString()
        });

        // Show success message
        alert('Password change request submitted successfully!');

        // Reset form
        resetForm();
    });

    // Handle cancel button
    elements.cancelButton?.addEventListener('click', () => {
        resetForm();
    });

    isChangePasswordInitialized = true;
    console.log('Change password initialization complete');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.change-password-form')) {
        initializeChangePassword();
    }
});

// Reset initialization when switching tabs and reinitialize when coming back
document.addEventListener('tabContentLoaded', (event) => {
    if (event.detail.tabName !== 'change-password') {
        isChangePasswordInitialized = false;
        console.log('Change password initialization reset');
    } else {
        initializeChangePassword();
        console.log('Change password reinitialized after tab switch');
    }
}); 