class SPA {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.setupMobileMenu();
        this.loadTab('profile-settings'); // Load default tab
    }

    initializeElements() {
        this.navButtons = document.querySelectorAll('.nav-button');
        this.mainContent = document.getElementById('main-content');
        this.sidebar = document.querySelector('.sidebar');
        
        // Create mobile menu toggle button
        this.createMobileMenuToggle();
    }

    createMobileMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        toggle.style.display = 'none'; // Initially hidden
        document.body.appendChild(toggle);
        this.mobileMenuToggle = toggle;
    }

    addEventListeners() {
        // Tab switching
        this.navButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button));
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupMobileMenu() {
        this.mobileMenuToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('active');
            this.mobileMenuToggle.innerHTML = this.sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 576 && 
                !this.sidebar.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.sidebar.classList.remove('active');
                this.mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Initial check for mobile view
        this.handleResize();
    }

    async switchTab(selectedButton) {
        // Update active states for buttons
        this.navButtons.forEach(button => {
            button.classList.toggle('active', button === selectedButton);
        });

        // Load and show selected tab content
        const tabName = selectedButton.dataset.tab;
        await this.loadTab(tabName);

        // Close sidebar on mobile after tab selection
        if (window.innerWidth <= 576) {
            this.sidebar.classList.remove('active');
            this.mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    async loadTab(tabName) {
        try {
            const response = await fetch(`tabs/${tabName}.html`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            
            // Create a promise for the fade transition
            await new Promise((resolve) => {
                // Add fade out effect
                this.mainContent.style.opacity = '0';
                
                // Update content after a short delay
                setTimeout(() => {
                    this.mainContent.innerHTML = content;
                    this.mainContent.style.opacity = '1';
                    resolve();
                }, 200);
            });

            // Dispatch event when content is loaded
            const event = new CustomEvent('tabContentLoaded', { 
                detail: { tabName } 
            });
            document.dispatchEvent(event);

            // Reinitialize tab-specific functionality
            switch(tabName) {
                case 'profile-settings':
                    if (typeof initializeProfileSettings === 'function') {
                        initializeProfileSettings();
                    }
                    if (typeof initializeProfilePictureUpload === 'function') {
                        initializeProfilePictureUpload();
                    }
                    break;
                case 'change-password':
                    if (typeof initializePasswordForm === 'function') {
                        initializePasswordForm();
                    }
                    break;
                case 'notification-settings':
                    if (typeof initializeNotificationSettings === 'function') {
                        initializeNotificationSettings();
                    }
                    break;
                case 'security-privacy':
                    if (typeof initializeSecurityPrivacy === 'function') {
                        initializeSecurityPrivacy();
                    }
                    break;
                case 'integration-settings':
                    if (typeof initializeIntegrationSettings === 'function') {
                        initializeIntegrationSettings();
                    }
                    break;
                case 'default-settings':
                    if (typeof initializeDefaultSettings === 'function') {
                        initializeDefaultSettings();
                    }
                    break;
            }

        } catch (error) {
            console.error('Error loading tab content:', error);
            this.mainContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <h2>Error Loading Content</h2>
                    <p>Sorry, we couldn't load the requested content. Please try again later.</p>
                </div>
            `;
        }
    }

    handleResize() {
        if (window.innerWidth <= 576) {
            this.mobileMenuToggle.style.display = 'block';
        } else {
            this.mobileMenuToggle.style.display = 'none';
            this.sidebar.classList.remove('active');
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SPA();
    initializeHeaderAvatar();
});

// Initialize header avatar with saved profile picture
function initializeHeaderAvatar() {
    const headerAvatar = document.querySelector('.user-info .avatar');
    if (headerAvatar) {
        const savedProfilePicture = localStorage.getItem('profilePicture');
        if (savedProfilePicture) {
            headerAvatar.src = savedProfilePicture;
        }
    }
}

// Listen for profile picture updates
document.addEventListener('profilePictureUpdated', (event) => {
    const headerAvatar = document.querySelector('.user-info .avatar');
    if (headerAvatar && event.detail.imageUrl) {
        headerAvatar.src = event.detail.imageUrl;
    }
}); 