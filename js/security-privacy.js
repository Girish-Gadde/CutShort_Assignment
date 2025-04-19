document.addEventListener('DOMContentLoaded', () => {
    // Get action buttons
    const downloadDataBtn = document.querySelector('[data-action="download-data"]');
    const clearLogsBtn = document.querySelector('[data-action="clear-logs"]');
    const deleteAccountBtn = document.querySelector('.btn-danger');

    // Get toggle switches
    const dataSharingToggle = document.querySelector('[data-setting="data-sharing"]');
    const analyticsToggle = document.querySelector('[data-setting="analytics"]');
    const cookieSettingsBtn = document.querySelector('[data-action="cookie-settings"]');

    // Handle data download
    downloadDataBtn?.addEventListener('click', () => {
        console.log('Initiating data download...');
        // In a real application, this would trigger an API call to generate and download the data
        const userData = {
            timestamp: new Date().toISOString(),
            action: 'data_download_requested'
        };
        console.log('Download request logged:', userData);
    });

    // Handle activity logs clearing
    clearLogsBtn?.addEventListener('click', () => {
        console.log('Clearing activity logs...');
        const clearAction = {
            timestamp: new Date().toISOString(),
            action: 'activity_logs_cleared'
        };
        console.log('Clear logs action logged:', clearAction);
    });

    // Handle privacy controls
    const savePrivacySettings = () => {
        const privacyData = {
            dataSharing: dataSharingToggle?.checked || false,
            analyticsTracking: analyticsToggle?.checked || false,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('privacySettings', JSON.stringify(privacyData));
        console.log('Privacy Settings Saved:', privacyData);
    };

    // Add event listeners to toggles
    dataSharingToggle?.addEventListener('change', savePrivacySettings);
    analyticsToggle?.addEventListener('change', savePrivacySettings);

    // Handle cookie preferences
    cookieSettingsBtn?.addEventListener('click', () => {
        console.log('Opening cookie preferences...');
        // This would typically open a modal with detailed cookie settings
    });

    // Handle account deletion
    deleteAccountBtn?.addEventListener('click', () => {
        const confirmDeletion = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (confirmDeletion) {
            console.log('Account deletion requested...');
            const deletionRequest = {
                timestamp: new Date().toISOString(),
                action: 'account_deletion_requested'
            };
            console.log('Deletion request logged:', deletionRequest);
        }
    });

    // Load saved privacy settings on page load
    const loadSavedSettings = () => {
        const savedSettings = localStorage.getItem('privacySettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply saved settings to toggles
            if (dataSharingToggle) dataSharingToggle.checked = settings.dataSharing;
            if (analyticsToggle) analyticsToggle.checked = settings.analyticsTracking;
            
            console.log('Loaded saved privacy settings:', settings);
        }
    };

    loadSavedSettings();
}); 