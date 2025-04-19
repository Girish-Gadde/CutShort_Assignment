// Add initialization flag
let isNotificationSettingsInitialized = false;

function initializeNotificationSettings() {
    // Check if already initialized
    if (isNotificationSettingsInitialized) {
        console.log('Notification settings already initialized, skipping...');
        return;
    }

    // Get form elements
    const form = document.querySelector('.notification-settings-form');
    const saveButton = document.querySelector('.btn-primary');
    const resetButton = document.querySelector('.btn-text');
    
    // Get all toggle switches
    const emailToggles = {
        processingCompleted: document.querySelector('[data-setting="email-processing"]'),
        newFeatures: document.querySelector('[data-setting="email-features"]'),
        accountUpdates: document.querySelector('[data-setting="email-updates"]')
    };

    const inAppToggles = {
        processingStatus: document.querySelector('[data-setting="inapp-processing"]'),
        systemAlerts: document.querySelector('[data-setting="inapp-alerts"]'),
        tipsAndSuggestions: document.querySelector('[data-setting="inapp-tips"]')
    };

    const mobileToggles = {
        enablePush: document.querySelector('[data-setting="mobile-enable"]'),
        processingCompleted: document.querySelector('[data-setting="mobile-processing"]'),
        criticalAlerts: document.querySelector('[data-setting="mobile-alerts"]')
    };

    // Get schedule selectors
    const quietHoursToggle = document.querySelector('[data-setting="quiet-hours"]');
    const timeRangeSelect = document.querySelector('select[data-setting="time-range"]');
    const frequencySelect = document.querySelector('select[data-setting="notification-frequency"]');

    // Debug check if elements are found
    console.log('Notification Settings Elements Found:', {
        form: !!form,
        saveButton: !!saveButton,
        resetButton: !!resetButton,
        timeRangeSelect: !!timeRangeSelect,
        frequencySelect: !!frequencySelect,
        emailToggles: Object.values(emailToggles).every(el => !!el),
        inAppToggles: Object.values(inAppToggles).every(el => !!el),
        mobileToggles: Object.values(mobileToggles).every(el => !!el),
        quietHoursToggle: !!quietHoursToggle
    });

    function saveSettings(e) {
        e.preventDefault();
        console.log('Save settings called');
        
        const notificationData = {
            emailNotifications: {
                processingCompleted: emailToggles.processingCompleted?.checked || false,
                newFeatures: emailToggles.newFeatures?.checked || false,
                accountUpdates: emailToggles.accountUpdates?.checked || false
            },
            inAppNotifications: {
                processingStatus: inAppToggles.processingStatus?.checked || false,
                systemAlerts: inAppToggles.systemAlerts?.checked || false,
                tipsAndSuggestions: inAppToggles.tipsAndSuggestions?.checked || false
            },
            mobileNotifications: {
                enablePush: mobileToggles.enablePush?.checked || false,
                processingCompleted: mobileToggles.processingCompleted?.checked || false,
                criticalAlerts: mobileToggles.criticalAlerts?.checked || false
            },
            schedule: {
                quietHoursEnabled: quietHoursToggle?.checked || false,
                timeRange: timeRangeSelect?.value || 'Select',
                frequency: frequencySelect?.value || 'Select'
            },
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('notificationSettings', JSON.stringify(notificationData));

        // Log the saved data
        console.log('Notification Settings Saved:', notificationData);

        // Show success message
        alert('Notification settings saved successfully!');
    }

    // Handle form submission
    if (form) {
        // Remove any existing event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        console.log('Adding submit event listener to form');
        newForm.addEventListener('submit', saveSettings);
    }

    // Handle reset to defaults
    if (resetButton) {
        // Remove any existing event listeners
        const newResetButton = resetButton.cloneNode(true);
        resetButton.parentNode.replaceChild(newResetButton, resetButton);
        console.log('Adding click event listener to reset button');
        newResetButton.addEventListener('click', () => {
            const defaultSettings = {
                emailNotifications: {
                    processingCompleted: true,
                    newFeatures: true,
                    accountUpdates: true
                },
                inAppNotifications: {
                    processingStatus: true,
                    systemAlerts: true,
                    tipsAndSuggestions: true
                },
                mobileNotifications: {
                    enablePush: true,
                    processingCompleted: true,
                    criticalAlerts: true
                },
                schedule: {
                    quietHoursEnabled: false,
                    timeRange: 'Select',
                    frequency: 'Select'
                }
            };

            // Apply default settings to form
            applySettings(defaultSettings);
            console.log('Reset to default notification settings:', defaultSettings);
            alert('Settings have been reset to defaults');
        });
    }

    // Function to apply settings to form
    const applySettings = (settings) => {
        try {
            // Apply email notification settings
            if (emailToggles.processingCompleted) emailToggles.processingCompleted.checked = settings.emailNotifications.processingCompleted;
            if (emailToggles.newFeatures) emailToggles.newFeatures.checked = settings.emailNotifications.newFeatures;
            if (emailToggles.accountUpdates) emailToggles.accountUpdates.checked = settings.emailNotifications.accountUpdates;

            // Apply in-app notification settings
            if (inAppToggles.processingStatus) inAppToggles.processingStatus.checked = settings.inAppNotifications.processingStatus;
            if (inAppToggles.systemAlerts) inAppToggles.systemAlerts.checked = settings.inAppNotifications.systemAlerts;
            if (inAppToggles.tipsAndSuggestions) inAppToggles.tipsAndSuggestions.checked = settings.inAppNotifications.tipsAndSuggestions;

            // Apply mobile notification settings
            if (mobileToggles.enablePush) mobileToggles.enablePush.checked = settings.mobileNotifications.enablePush;
            if (mobileToggles.processingCompleted) mobileToggles.processingCompleted.checked = settings.mobileNotifications.processingCompleted;
            if (mobileToggles.criticalAlerts) mobileToggles.criticalAlerts.checked = settings.mobileNotifications.criticalAlerts;

            // Apply schedule settings
            if (quietHoursToggle) quietHoursToggle.checked = settings.schedule.quietHoursEnabled;
            if (timeRangeSelect) timeRangeSelect.value = settings.schedule.timeRange;
            if (frequencySelect) frequencySelect.value = settings.schedule.frequency;
        } catch (error) {
            console.error('Error applying settings:', error);
        }
    };

    // Load saved settings
    const loadSavedSettings = () => {
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                applySettings(settings);
                console.log('Loaded saved notification settings:', settings);
            } catch (error) {
                console.error('Error loading saved settings:', error);
            }
        }
    };

    loadSavedSettings();
    isNotificationSettingsInitialized = true;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Try to initialize immediately if the form exists
    if (document.querySelector('.notification-settings-form')) {
        initializeNotificationSettings();
    }

    // Also watch for dynamic content loading
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const form = document.querySelector('.notification-settings-form');
                if (form) {
                    console.log('Notification settings form detected, initializing...');
                    initializeNotificationSettings();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Reset initialization when switching tabs and reinitialize when coming back
document.addEventListener('tabContentLoaded', (event) => {
    if (event.detail.tabName !== 'notification-settings') {
        isNotificationSettingsInitialized = false;
    } else {
        initializeNotificationSettings();
    }
}); 