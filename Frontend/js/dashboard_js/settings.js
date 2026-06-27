// Immediate check to prevent page flash and handle back button from cache
if (!localStorage.getItem('token')) {
    window.location.replace('dashboard-login.html');
}
window.addEventListener('pageshow', (event) => {
    if (event.persisted && !localStorage.getItem('token')) {
        window.location.replace('dashboard-login.html');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.replace('dashboard-login.html');
        return;
    }

    fetchSettings();
});

// ─── FETCH SETTINGS ─────────────────────────────────────────────────────────
async function fetchSettings() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${ENV.API_BASE_URL}/settings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await res.json();

        if (res.ok && data.success && data.data) {
            populateForm(data.data);
        } else {
            showToast(data.message || 'Error fetching site settings');
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        showToast('Server error – could not load settings');
    }
}

// ─── POPULATE FORM ──────────────────────────────────────────────────────────
function populateForm(settings) {
    // 1. General Settings
    const g = settings.general || {};
    const gf = g.features || {};
    document.getElementById('s-siteName').value = g.siteName || '';
    document.getElementById('s-tagline').value = g.tagline || '';
    document.getElementById('s-description').value = g.description || '';
    document.getElementById('s-language').value = g.language || 'English';
    document.getElementById('s-timezone').value = g.timezone || 'Asia/Jerusalem';
    
    document.getElementById('s-maintenanceMode').checked = !!gf.maintenanceMode;
    document.getElementById('s-allowComments').checked = gf.allowComments !== false;
    document.getElementById('s-emailNotifications').checked = gf.emailNotifications !== false;
    document.getElementById('s-analyticsTracking').checked = gf.analyticsTracking !== false;

    // 2. Contact Details
    const c = settings.contact || {};
    document.getElementById('s-email').value = c.email || '';
    document.getElementById('s-phone').value = c.phone || '';
    document.getElementById('s-address').value = c.address || '';
    document.getElementById('s-businessHours').value = c.businessHours || '';
    document.getElementById('s-supportEmail').value = c.supportEmail || '';

    // 3. Social Media Link
    const s = settings.social || {};
    document.getElementById('s-facebook').value = s.facebook || '';
    document.getElementById('s-twitter').value = s.twitter || '';
    document.getElementById('s-linkedin').value = s.linkedin || '';
    document.getElementById('s-instagram').value = s.instagram || '';

    // 4. SEO Config
    const seo = settings.seo || {};
    document.getElementById('s-metaTitle').value = seo.metaTitle || '';
    document.getElementById('s-metaDescription').value = seo.metaDescription || '';
    document.getElementById('s-metaKeywords').value = seo.metaKeywords || '';
    document.getElementById('s-googleAnalyticsId').value = seo.googleAnalyticsId || '';
    document.getElementById('s-robots').value = seo.robots || 'index, follow';
}

// ─── SAVE SETTINGS ──────────────────────────────────────────────────────────
async function saveSettings() {
    const token = localStorage.getItem('token');
    
    // Construct payload strictly matching the backend model schema
    const payload = {
        general: {
            siteName: document.getElementById('s-siteName').value.trim(),
            tagline: document.getElementById('s-tagline').value.trim(),
            description: document.getElementById('s-description').value.trim(),
            language: document.getElementById('s-language').value,
            timezone: document.getElementById('s-timezone').value,
            features: {
                maintenanceMode: document.getElementById('s-maintenanceMode').checked,
                allowComments: document.getElementById('s-allowComments').checked,
                emailNotifications: document.getElementById('s-emailNotifications').checked,
                analyticsTracking: document.getElementById('s-analyticsTracking').checked
            }
        },
        contact: {
            email: document.getElementById('s-email').value.trim(),
            phone: document.getElementById('s-phone').value.trim(),
            address: document.getElementById('s-address').value.trim(),
            businessHours: document.getElementById('s-businessHours').value.trim(),
            supportEmail: document.getElementById('s-supportEmail').value.trim()
        },
        social: {
            facebook: document.getElementById('s-facebook').value.trim(),
            twitter: document.getElementById('s-twitter').value.trim(),
            linkedin: document.getElementById('s-linkedin').value.trim(),
            instagram: document.getElementById('s-instagram').value.trim()
        },
        seo: {
            metaTitle: document.getElementById('s-metaTitle').value.trim(),
            metaDescription: document.getElementById('s-metaDescription').value.trim(),
            metaKeywords: document.getElementById('s-metaKeywords').value.trim(),
            googleAnalyticsId: document.getElementById('s-googleAnalyticsId').value.trim(),
            robots: document.getElementById('s-robots').value
        }
    };

    try {
        const res = await fetch(`${ENV.API_BASE_URL}/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (res.ok && data.success) {
            showToast('Settings saved successfully!');
            fetchSettings();
        } else {
            showToast(data.message || 'Error saving settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Server error – could not save settings');
    }
}

// ─── RESET TO DEFAULTS ──────────────────────────────────────────────────────
function resetToDefaults() {
    if (!confirm('Are you sure you want to reset settings to default values? (Changes will be saved immediately)')) return;
    
    // Set standard defaults
    const defaultSettings = {
        general: {
            siteName: 'Neoteric Technologies',
            tagline: 'Creative Solutions for Modern Businesses',
            description: 'Neoteric Technologies provides professional design and development services for businesses of all sizes.',
            language: 'English',
            timezone: 'Asia/Jerusalem',
            features: {
                maintenanceMode: false,
                allowComments: true,
                emailNotifications: true,
                analyticsTracking: true
            }
        },
        contact: {
            email: 'hello@neoteric.tech',
            phone: '+970 59 000 0000',
            address: 'Nablus, West Bank, Palestine',
            businessHours: 'Sun–Thu, 9AM–5PM',
            supportEmail: 'support@neoteric.tech'
        },
        social: {
            facebook: 'https://facebook.com/neoteric',
            twitter: 'https://twitter.com/neoteric',
            linkedin: 'https://linkedin.com/company/neoteric',
            instagram: 'https://instagram.com/neoteric'
        },
        seo: {
            metaTitle: 'Neoteric Technologies – Creative Design & Development',
            metaDescription: 'Professional web design, UI/UX, motion graphics and digital marketing services in Palestine.',
            metaKeywords: 'web design, UI/UX, motion graphics, Palestine, digital agency',
            googleAnalyticsId: '',
            robots: 'index, follow'
        }
    };
    
    populateForm(defaultSettings);
    saveSettings();
}

// Expose functions globally for HTML event handlers
window.saveSettings = saveSettings;
window.resetToDefaults = resetToDefaults;
