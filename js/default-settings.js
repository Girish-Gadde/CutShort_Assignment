// Add initialization flag
let isDefaultSettingsInitialized = false;

// Define initializeDefaultSettings in global scope
function initializeDefaultSettings() {
    // Check if already initialized
    if (isDefaultSettingsInitialized) {
        console.log('Default settings already initialized, skipping...');
        return;
    }

    const form = document.querySelector('.default-settings-form');
    const saveButton = document.querySelector('.default-settings-save');
    const resetButton = document.querySelector('.default-settings-reset');

    // Debug check
    console.log('Form elements found:', {
        form: !!form,
        saveButton: !!saveButton,
        resetButton: !!resetButton
    });

    if (!form) {
        console.error('Form not found, cannot initialize default settings');
        return;
    }

    function saveSettings(e) {
        e.preventDefault();
        
        try {
            // Get all selected values
            const settings = {
                displaySettings: {
                    theme: form.querySelector('.settings-group:first-child .setting-item:first-child select')?.value || 'Select',
                    darkMode: form.querySelector('.settings-group:first-child .setting-item:nth-child(2) input[type="checkbox"]')?.checked || false,
                    compactView: form.querySelector('.settings-group:first-child .setting-item:nth-child(3) input[type="checkbox"]')?.checked || false
                },
                languageAndRegion: {
                    language: form.querySelector('.settings-group:nth-child(2) .setting-item:first-child select')?.value || 'Select',
                    timeZone: form.querySelector('.settings-group:nth-child(2) .setting-item:nth-child(2) select')?.value || 'Select',
                    dateFormat: form.querySelector('.settings-group:nth-child(2) .setting-item:nth-child(3) select')?.value || 'Select'
                },
                aiProcessingDefaults: {
                    defaultResolution: form.querySelector('.settings-group:nth-child(3) .setting-item:first-child select')?.value || 'Select',
                    processingQuality: form.querySelector('.settings-group:nth-child(3) .setting-item:nth-child(2) select')?.value || 'Select',
                    autoSaveResults: form.querySelector('.settings-group:nth-child(3) .setting-item:nth-child(3) input[type="checkbox"]')?.checked || false
                },
                systemPerformance: {
                    hardwareAcceleration: form.querySelector('.settings-group:nth-child(4) .setting-item:first-child input[type="checkbox"]')?.checked || false,
                    backgroundProcessing: form.querySelector('.settings-group:nth-child(4) .setting-item:nth-child(2) input[type="checkbox"]')?.checked || false
                }
            };

            // Log settings to console
            console.log('Default Settings Saved:', settings);

            // Save to localStorage
            localStorage.setItem('defaultSettings', JSON.stringify(settings));

            // Show success message
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Remove any existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Listen for form submit
    newForm.addEventListener('submit', saveSettings);

    // Handle Reset to Defaults
    if (resetButton) {
        // Remove any existing event listeners
        const newResetButton = resetButton.cloneNode(true);
        resetButton.parentNode.replaceChild(newResetButton, resetButton);
        
        newResetButton.addEventListener('click', () => {
            try {
                // Reset all selects to first option
                newForm.querySelectorAll('select').forEach(select => {
                    select.selectedIndex = 0;
                });

                // Uncheck all checkboxes
                newForm.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = false;
                });

                // Clear localStorage
                localStorage.removeItem('defaultSettings');

                console.log('Settings reset to defaults');
                alert('Settings have been reset to defaults');
            } catch (error) {
                console.error('Error resetting settings:', error);
            }
        });
    }

    // Load saved settings if they exist
    const savedSettings = localStorage.getItem('defaultSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            
            // Display Settings
            const themeSelect = newForm.querySelector('.settings-group:first-child .setting-item:first-child select');
            const darkModeCheckbox = newForm.querySelector('.settings-group:first-child .setting-item:nth-child(2) input[type="checkbox"]');
            const compactViewCheckbox = newForm.querySelector('.settings-group:first-child .setting-item:nth-child(3) input[type="checkbox"]');

            if (themeSelect) themeSelect.value = settings.displaySettings.theme;
            if (darkModeCheckbox) darkModeCheckbox.checked = settings.displaySettings.darkMode;
            if (compactViewCheckbox) compactViewCheckbox.checked = settings.displaySettings.compactView;

            // Language & Region
            const languageSelect = newForm.querySelector('.settings-group:nth-child(2) .setting-item:first-child select');
            const timeZoneSelect = newForm.querySelector('.settings-group:nth-child(2) .setting-item:nth-child(2) select');
            const dateFormatSelect = newForm.querySelector('.settings-group:nth-child(2) .setting-item:nth-child(3) select');

            if (languageSelect) languageSelect.value = settings.languageAndRegion.language;
            if (timeZoneSelect) timeZoneSelect.value = settings.languageAndRegion.timeZone;
            if (dateFormatSelect) dateFormatSelect.value = settings.languageAndRegion.dateFormat;

            // AI Processing Defaults
            const resolutionSelect = newForm.querySelector('.settings-group:nth-child(3) .setting-item:first-child select');
            const qualitySelect = newForm.querySelector('.settings-group:nth-child(3) .setting-item:nth-child(2) select');
            const autoSaveCheckbox = newForm.querySelector('.settings-group:nth-child(3) .setting-item:nth-child(3) input[type="checkbox"]');

            if (resolutionSelect) resolutionSelect.value = settings.aiProcessingDefaults.defaultResolution;
            if (qualitySelect) qualitySelect.value = settings.aiProcessingDefaults.processingQuality;
            if (autoSaveCheckbox) autoSaveCheckbox.checked = settings.aiProcessingDefaults.autoSaveResults;

            // System Performance
            const hardwareAccelCheckbox = newForm.querySelector('.settings-group:nth-child(4) .setting-item:first-child input[type="checkbox"]');
            const bgProcessingCheckbox = newForm.querySelector('.settings-group:nth-child(4) .setting-item:nth-child(2) input[type="checkbox"]');

            if (hardwareAccelCheckbox) hardwareAccelCheckbox.checked = settings.systemPerformance.hardwareAcceleration;
            if (bgProcessingCheckbox) bgProcessingCheckbox.checked = settings.systemPerformance.backgroundProcessing;

            console.log('Saved settings loaded:', settings);
        } catch (error) {
            console.error('Error loading saved settings:', error);
        }
    }

    isDefaultSettingsInitialized = true;
    console.log('Default settings initialized successfully');
}

// Initialize when the content is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.default-settings-form')) {
        initializeDefaultSettings();
    }
});

// Also listen for any dynamic content loading
const observer = new MutationObserver((mutations) => {
    if (document.querySelector('.default-settings-form')) {
        initializeDefaultSettings();
        observer.disconnect();
        console.log('Default settings initialized after dynamic load');
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Reset initialization when switching tabs and reinitialize when coming back
document.addEventListener('tabContentLoaded', (event) => {
    if (event.detail.tabName !== 'default-settings') {
        isDefaultSettingsInitialized = false;
    } else {
        initializeDefaultSettings();
    }
}); 