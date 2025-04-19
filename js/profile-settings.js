// Make initialization functions available globally
let isInitialized = false;

function updateHeaderUserInfo(name, email) {
    const userNameElement = document.querySelector('.user-info .user-name');
    const userEmailElement = document.querySelector('.user-info .user-email');
    
    if (userNameElement) {
        userNameElement.textContent = name || 'Admin User';
    }
    if (userEmailElement) {
        userEmailElement.textContent = email || 'admin@techai.com';
    }
    console.log('Header user info updated:', { name, email });
}

function initializeProfileSettings() {
    if (isInitialized) {
        console.log('Profile settings already initialized, skipping...');
        return;
    }

    // Get form elements
    const form = document.getElementById('profileSettingsForm');
    if (!form) {
        console.log('Profile settings form not found');
        return;
    }

    // Remove any existing event listeners by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Get all input fields after cloning
    const elements = {
        form: newForm,
        fullName: newForm.querySelector('#fullName'),
        email: newForm.querySelector('#email'),
        jobTitle: newForm.querySelector('#jobTitle'),
        bio: newForm.querySelector('#bio'),
        phone: newForm.querySelector('#phone'),
        altEmail: newForm.querySelector('#altEmail'),
        language: newForm.querySelector('#language'),
        timezone: newForm.querySelector('#timezone'),
        dateFormat: newForm.querySelector('#dateFormat'),
        cancelButton: newForm.querySelector('.form-actions .btn-secondary')
    };

    // Debug check if elements are found
    console.log('Profile Settings Initialized:', {
        form: !!elements.form,
        fullName: !!elements.fullName,
        email: !!elements.email,
        jobTitle: !!elements.jobTitle,
        bio: !!elements.bio,
        phone: !!elements.phone,
        altEmail: !!elements.altEmail,
        language: !!elements.language,
        timezone: !!elements.timezone,
        dateFormat: !!elements.dateFormat,
        cancelButton: !!elements.cancelButton
    });

    // Handle form submission
    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submission triggered');
        
        const profileData = {
            personalInfo: {
                fullName: elements.fullName?.value || '',
                email: elements.email?.value || '',
                jobTitle: elements.jobTitle?.value || '',
                bio: elements.bio?.value || ''
            },
            contactDetails: {
                phone: elements.phone?.value || '',
                alternativeEmail: elements.altEmail?.value || ''
            },
            preferences: {
                language: elements.language?.value || 'en',
                timezone: elements.timezone?.value || 'UTC',
                dateFormat: elements.dateFormat?.value || 'MM/DD/YYYY'
            },
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('profileSettings', JSON.stringify(profileData));

        // Update header user info
        updateHeaderUserInfo(profileData.personalInfo.fullName, profileData.personalInfo.email);

        // Log the saved data
        console.log('Profile Settings Saved:', profileData);

        // Show success message
        alert('Profile settings saved successfully!');
    });

    // Handle cancel button
    if (elements.cancelButton) {
        elements.cancelButton.addEventListener('click', () => {
            loadSavedSettings();
            console.log('Changes cancelled, form reset to saved settings');
        });
    }

    // Load saved settings
    loadSavedSettings();
    
    isInitialized = true;
}

let isPhotoUploadInitialized = false;

function initializeProfilePictureUpload() {
    if (isPhotoUploadInitialized) {
        console.log('Profile picture upload already initialized, skipping...');
        return;
    }

    const uploadButton = document.getElementById('uploadPhotoBtn');
    const fileInput = document.getElementById('profilePictureInput');
    const profileImage = document.getElementById('profilePicture');
    const headerAvatar = document.querySelector('.user-info .avatar');

    console.log('Profile Picture Upload Initialized:', {
        uploadButton: !!uploadButton,
        fileInput: !!fileInput,
        profileImage: !!profileImage,
        headerAvatar: !!headerAvatar
    });

    if (uploadButton && fileInput && (profileImage || headerAvatar)) {
        // Remove any existing event listeners
        const newUploadButton = uploadButton.cloneNode(true);
        const newFileInput = fileInput.cloneNode(true);
        
        uploadButton.parentNode.replaceChild(newUploadButton, uploadButton);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);

        // Click the hidden file input when upload button is clicked
        newUploadButton.addEventListener('click', () => {
            console.log('Upload button clicked');
            newFileInput.click();
        });

        // Handle file selection
        newFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select an image file');
                    return;
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    alert('Image size should be less than 5MB');
                    return;
                }

                // Create FileReader to read the image
                const reader = new FileReader();
                reader.onload = (event) => {
                    updateProfilePicture(event.target.result);
                    
                    console.log('Profile picture updated:', {
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: `${(file.size / 1024).toFixed(2)}KB`
                    });
                };

                reader.readAsDataURL(file);
            }
        });

        // Load saved profile picture if exists
        const savedProfilePicture = localStorage.getItem('profilePicture');
        if (savedProfilePicture) {
            updateProfilePicture(savedProfilePicture);
        }
    }
    
    isPhotoUploadInitialized = true;
}

function updateProfilePicture(imageUrl) {
    const profileImage = document.getElementById('profilePicture');
    const headerAvatar = document.querySelector('.user-info .avatar');
    
    // Update profile page image
    if (profileImage) {
        profileImage.src = imageUrl;
    }
    
    // Update header avatar
    if (headerAvatar) {
        headerAvatar.src = imageUrl;
    }
    
    // Save to localStorage
    localStorage.setItem('profilePicture', imageUrl);
    
    // Dispatch a custom event for other parts of the app
    const event = new CustomEvent('profilePictureUpdated', { 
        detail: { imageUrl } 
    });
    document.dispatchEvent(event);
}

function loadSavedSettings() {
    const savedSettings = localStorage.getItem('profileSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Get form elements
            const elements = {
                fullName: document.querySelector('#fullName'),
                email: document.querySelector('#email'),
                jobTitle: document.querySelector('#jobTitle'),
                bio: document.querySelector('#bio'),
                phone: document.querySelector('#phone'),
                altEmail: document.querySelector('#altEmail'),
                language: document.querySelector('#language'),
                timezone: document.querySelector('#timezone'),
                dateFormat: document.querySelector('#dateFormat')
            };

            // Populate personal info
            if (elements.fullName) elements.fullName.value = settings.personalInfo.fullName || '';
            if (elements.email) elements.email.value = settings.personalInfo.email || '';
            if (elements.jobTitle) elements.jobTitle.value = settings.personalInfo.jobTitle || '';
            if (elements.bio) elements.bio.value = settings.personalInfo.bio || '';

            // Populate contact details
            if (elements.phone) elements.phone.value = settings.contactDetails.phone || '';
            if (elements.altEmail) elements.altEmail.value = settings.contactDetails.alternativeEmail || '';

            // Populate preferences
            if (elements.language) elements.language.value = settings.preferences.language || 'en';
            if (elements.timezone) elements.timezone.value = settings.preferences.timezone || 'UTC';
            if (elements.dateFormat) elements.dateFormat.value = settings.preferences.dateFormat || 'MM/DD/YYYY';

            // Update header user info
            updateHeaderUserInfo(settings.personalInfo.fullName, settings.personalInfo.email);

            console.log('Loaded saved profile settings:', settings);
        } catch (error) {
            console.error('Error loading saved settings:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings for header even if not on profile tab
    const savedSettings = localStorage.getItem('profileSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            updateHeaderUserInfo(settings.personalInfo.fullName, settings.personalInfo.email);
        } catch (error) {
            console.error('Error loading saved settings for header:', error);
        }
    }

    if (document.querySelector('.profile-details')) {
        initializeProfileSettings();
        initializeProfilePictureUpload();
    }
});

// Reset initialization flags when switching tabs and reinitialize when coming back
document.addEventListener('tabContentLoaded', (event) => {
    // Always try to update header user info when switching tabs
    const savedSettings = localStorage.getItem('profileSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            updateHeaderUserInfo(settings.personalInfo.fullName, settings.personalInfo.email);
        } catch (error) {
            console.error('Error loading saved settings for header:', error);
        }
    }

    if (event.detail.tabName !== 'profile-settings') {
        isInitialized = false;
        isPhotoUploadInitialized = false;
    } else {
        initializeProfileSettings();
        initializeProfilePictureUpload();
    }
}); 