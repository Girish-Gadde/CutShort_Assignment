document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const saveButton = document.querySelector('.btn-primary');
    const webhookInput = document.querySelector('input[type="text"]');
    const copyButton = document.querySelector('button[title="Copy URL"]');
    const smtpEditButton = document.querySelector('.setting-item .btn-icon');

    // Handle form submission
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        const integrationData = {
            webhookUrl: webhookInput.value,
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('integrationSettings', JSON.stringify(integrationData));

        // Log the saved data
        console.log('Integration Settings Saved:', integrationData);
    });

    // Handle webhook URL copying
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(webhookInput.value);
            console.log('Webhook URL copied to clipboard:', webhookInput.value);
            
            // Optional: Show a temporary success message
            copyButton.setAttribute('title', 'Copied!');
            setTimeout(() => {
                copyButton.setAttribute('title', 'Copy URL');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });

    // Handle SMTP setup button
    smtpEditButton.addEventListener('click', () => {
        // This would typically open a modal or navigate to SMTP setup page
        console.log('Opening SMTP configuration...');
    });

    // Load saved settings on page load
    const loadSavedSettings = () => {
        const savedSettings = localStorage.getItem('integrationSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            webhookInput.value = settings.webhookUrl;
            console.log('Loaded saved integration settings:', settings);
        }
    };

    loadSavedSettings();
}); 