// Settings management system
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeSettings();
        this.bindEvents();
    }

    // Default settings
    getDefaultSettings() {
        return {
            general: {
                language: 'en',
                currency: 'USD',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12',
                darkMode: false,
                notifications: true
            },
            pharmacy: {
                name: 'MediCare Pharmacy',
                licenseNumber: 'PH-2023-001',
                address: '123 Healthcare Street, Medical District, City, State 12345',
                phone: '+1 (555) 123-4567',
                email: 'info@medicarepos.com',
                taxId: 'TAX-123456789',
                website: 'https://www.medicarepos.com'
            },
            pos: {
                taxRate: 8.5,
                discountLimit: 20,
                autoCalculateTax: true,
                requireCustomerInfo: false,
                allowPartialPayment: true,
                lowStockThreshold: 10
            },
            receipt: {
                width: '80',
                template: 'standard',
                printLogo: true,
                printBarcode: true,
                autoPrint: false,
                footer: 'Thank you for choosing MediCare Pharmacy!\nVisit us again for all your healthcare needs.\nwww.medicarepos.com',
                storageFolder: 'receipts'
            },
            backup: {
                autoBackup: false,
                frequency: 'weekly'
            },
            security: {
                minPasswordLength: 8,
                requireSpecialChars: true,
                requireNumbers: true,
                sessionTimeout: 30,
                autoLogout: true,
                enableAuditLog: true,
                logRetention: 90
            }
        };
    }

    // Load settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('medicareSettings');
        if (saved) {
            try {
                return { ...this.getDefaultSettings(), ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error loading settings:', e);
                return this.getDefaultSettings();
            }
        }
        return this.getDefaultSettings();
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            localStorage.setItem('medicareSettings', JSON.stringify(this.settings));
            this.showNotification('Settings saved successfully!', 'success');
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            this.showNotification('Error saving settings!', 'error');
            return false;
        }
    }

    // Initialize form fields with current settings
    initializeSettings() {
        // General settings
        this.setFieldValue('language', this.settings.general.language);
        this.setFieldValue('currency', this.settings.general.currency);
        this.setFieldValue('dateFormat', this.settings.general.dateFormat);
        this.setFieldValue('timeFormat', this.settings.general.timeFormat);
        this.setFieldValue('darkMode', this.settings.general.darkMode);
        this.setFieldValue('notifications', this.settings.general.notifications);

        // Pharmacy settings
        this.setFieldValue('pharmacyName', this.settings.pharmacy.name);
        this.setFieldValue('licenseNumber', this.settings.pharmacy.licenseNumber);
        this.setFieldValue('pharmacyAddress', this.settings.pharmacy.address);
        this.setFieldValue('pharmacyPhone', this.settings.pharmacy.phone);
        this.setFieldValue('pharmacyEmail', this.settings.pharmacy.email);
        this.setFieldValue('taxId', this.settings.pharmacy.taxId);
        this.setFieldValue('pharmacyWebsite', this.settings.pharmacy.website);

        // POS settings
        this.setFieldValue('taxRate', this.settings.pos.taxRate);
        this.setFieldValue('discountLimit', this.settings.pos.discountLimit);
        this.setFieldValue('autoCalculateTax', this.settings.pos.autoCalculateTax);
        this.setFieldValue('requireCustomerInfo', this.settings.pos.requireCustomerInfo);
        this.setFieldValue('allowPartialPayment', this.settings.pos.allowPartialPayment);
        this.setFieldValue('lowStockThreshold', this.settings.pos.lowStockThreshold);

        // Receipt settings
        this.setFieldValue('receiptWidth', this.settings.receipt.width);
        this.setFieldValue('receiptTemplate', this.settings.receipt.template);
        this.setFieldValue('printLogo', this.settings.receipt.printLogo);
        this.setFieldValue('printBarcode', this.settings.receipt.printBarcode);
        this.setFieldValue('autoPrint', this.settings.receipt.autoPrint);
        this.setFieldValue('receiptFooter', this.settings.receipt.footer);
        this.setFieldValue('receiptFolder', this.settings.receipt.storageFolder);

        // Backup settings
        this.setFieldValue('autoBackup', this.settings.backup.autoBackup);
        this.setFieldValue('backupFrequency', this.settings.backup.frequency);

        // Security settings
        this.setFieldValue('minPasswordLength', this.settings.security.minPasswordLength);
        this.setFieldValue('requireSpecialChars', this.settings.security.requireSpecialChars);
        this.setFieldValue('requireNumbers', this.settings.security.requireNumbers);
        this.setFieldValue('sessionTimeout', this.settings.security.sessionTimeout);
        this.setFieldValue('autoLogout', this.settings.security.autoLogout);
        this.setFieldValue('enableAuditLog', this.settings.security.enableAuditLog);
        this.setFieldValue('logRetention', this.settings.security.logRetention);

        // Apply dark mode if enabled
        if (this.settings.general.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    // Set field value helper
    setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = value;
            } else {
                field.value = value;
            }
        }
    }

    // Get field value helper
    getFieldValue(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                return field.checked;
            } else {
                return field.value;
            }
        }
        return null;
    }

    // Bind event listeners
    bindEvents() {
        // Auto-save on change
        const fields = document.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.addEventListener('change', () => {
                this.updateSettingsFromForm();
                this.saveSettings();
            });
        });

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkMode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            });
        }
    }

    // Update settings object from form values
    updateSettingsFromForm() {
        // General settings
        this.settings.general.language = this.getFieldValue('language');
        this.settings.general.currency = this.getFieldValue('currency');
        this.settings.general.dateFormat = this.getFieldValue('dateFormat');
        this.settings.general.timeFormat = this.getFieldValue('timeFormat');
        this.settings.general.darkMode = this.getFieldValue('darkMode');
        this.settings.general.notifications = this.getFieldValue('notifications');

        // Pharmacy settings
        this.settings.pharmacy.name = this.getFieldValue('pharmacyName');
        this.settings.pharmacy.licenseNumber = this.getFieldValue('licenseNumber');
        this.settings.pharmacy.address = this.getFieldValue('pharmacyAddress');
        this.settings.pharmacy.phone = this.getFieldValue('pharmacyPhone');
        this.settings.pharmacy.email = this.getFieldValue('pharmacyEmail');
        this.settings.pharmacy.taxId = this.getFieldValue('taxId');
        this.settings.pharmacy.website = this.getFieldValue('pharmacyWebsite');

        // POS settings
        this.settings.pos.taxRate = parseFloat(this.getFieldValue('taxRate'));
        this.settings.pos.discountLimit = parseInt(this.getFieldValue('discountLimit'));
        this.settings.pos.autoCalculateTax = this.getFieldValue('autoCalculateTax');
        this.settings.pos.requireCustomerInfo = this.getFieldValue('requireCustomerInfo');
        this.settings.pos.allowPartialPayment = this.getFieldValue('allowPartialPayment');
        this.settings.pos.lowStockThreshold = parseInt(this.getFieldValue('lowStockThreshold'));

        // Receipt settings
        this.settings.receipt.width = this.getFieldValue('receiptWidth');
        this.settings.receipt.template = this.getFieldValue('receiptTemplate');
        this.settings.receipt.printLogo = this.getFieldValue('printLogo');
        this.settings.receipt.printBarcode = this.getFieldValue('printBarcode');
        this.settings.receipt.autoPrint = this.getFieldValue('autoPrint');
        this.settings.receipt.footer = this.getFieldValue('receiptFooter');
        this.settings.receipt.storageFolder = this.getFieldValue('receiptFolder');

        // Backup settings
        this.settings.backup.autoBackup = this.getFieldValue('autoBackup');
        this.settings.backup.frequency = this.getFieldValue('backupFrequency');

        // Security settings
        this.settings.security.minPasswordLength = parseInt(this.getFieldValue('minPasswordLength'));
        this.settings.security.requireSpecialChars = this.getFieldValue('requireSpecialChars');
        this.settings.security.requireNumbers = this.getFieldValue('requireNumbers');
        this.settings.security.sessionTimeout = parseInt(this.getFieldValue('sessionTimeout'));
        this.settings.security.autoLogout = this.getFieldValue('autoLogout');
        this.settings.security.enableAuditLog = this.getFieldValue('enableAuditLog');
        this.settings.security.logRetention = parseInt(this.getFieldValue('logRetention'));
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.settings-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} settings-notification`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
            ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1050;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    }

    // Reset to default settings
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
            this.settings = this.getDefaultSettings();
            this.initializeSettings();
            this.saveSettings();
            this.showNotification('Settings reset to defaults successfully!', 'success');
        }
    }

    // Get current settings
    getSettings() {
        return this.settings;
    }
}

// Initialize settings manager
let settingsManager;

document.addEventListener('DOMContentLoaded', function() {
    settingsManager = new SettingsManager();
    
    // Load current user info
    loadCurrentUser();
    
    // Initialize mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
});

// Load current user information
function loadCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userNameElement = document.getElementById('currentUserName');
    if (userNameElement && currentUser.username) {
        userNameElement.textContent = currentUser.role || currentUser.username;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Save all settings
function saveAllSettings() {
    const button = event.target;
    button.classList.add('loading');
    
    setTimeout(() => {
        settingsManager.updateSettingsFromForm();
        const success = settingsManager.saveSettings();
        
        button.classList.remove('loading');
        
        if (success) {
            settingsManager.showNotification('All settings saved successfully!', 'success');
        }
    }, 1000);
}

// Reset settings
function resetSettings() {
    settingsManager.resetToDefaults();
}

// Select receipt folder
function selectReceiptFolder() {
    // In a real application, this would open a folder picker dialog
    const newFolder = prompt('Enter receipt storage folder name:', settingsManager.getSettings().receipt.storageFolder);
    if (newFolder && newFolder.trim()) {
        document.getElementById('receiptFolder').value = newFolder.trim();
        settingsManager.updateSettingsFromForm();
        settingsManager.saveSettings();
    }
}

// Backup functions
function createBackup() {
    const button = event.target;
    button.classList.add('loading');
    
    setTimeout(() => {
        // Simulate backup creation
        const backupData = {
            settings: settingsManager.getSettings(),
            medicines: JSON.parse(localStorage.getItem('medicines') || '[]'),
            customers: JSON.parse(localStorage.getItem('customers') || '[]'),
            transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
            timestamp: new Date().toISOString()
        };
        
        // Create download link
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `medicare-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        button.classList.remove('loading');
        settingsManager.showNotification('Backup created successfully!', 'success');
    }, 2000);
}

function restoreBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (confirm('Are you sure you want to restore from this backup? This will overwrite all current data.')) {
                        // Restore data
                        if (backupData.settings) {
                            localStorage.setItem('medicareSettings', JSON.stringify(backupData.settings));
                        }
                        if (backupData.medicines) {
                            localStorage.setItem('medicines', JSON.stringify(backupData.medicines));
                        }
                        if (backupData.customers) {
                            localStorage.setItem('customers', JSON.stringify(backupData.customers));
                        }
                        if (backupData.transactions) {
                            localStorage.setItem('transactions', JSON.stringify(backupData.transactions));
                        }
                        
                        settingsManager.showNotification('Backup restored successfully! Please refresh the page.', 'success');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                } catch (error) {
                    settingsManager.showNotification('Invalid backup file!', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Export data functions
function exportData(type) {
    const button = event.target;
    button.classList.add('loading');
    
    setTimeout(() => {
        let data = [];
        let filename = '';
        
        switch (type) {
            case 'inventory':
                data = JSON.parse(localStorage.getItem('medicines') || '[]');
                filename = 'inventory-export';
                break;
            case 'customers':
                data = JSON.parse(localStorage.getItem('customers') || '[]');
                filename = 'customers-export';
                break;
            case 'sales':
                data = JSON.parse(localStorage.getItem('transactions') || '[]');
                filename = 'sales-export';
                break;
        }
        
        // Convert to CSV
        if (data.length > 0) {
            const csv = convertToCSV(data);
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            settingsManager.showNotification(`${type} data exported successfully!`, 'success');
        } else {
            settingsManager.showNotification(`No ${type} data to export!`, 'warning');
        }
        
        button.classList.remove('loading');
    }, 1000);
}

// Convert array to CSV
function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(','))
    ].join('\n');
    
    return csvContent;
}

// Reset all data
function resetAllData() {
    const confirmation = prompt('This will delete ALL data permanently. Type "DELETE ALL DATA" to confirm:');
    if (confirmation === 'DELETE ALL DATA') {
        localStorage.clear();
        settingsManager.showNotification('All data has been reset!', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        settingsManager.showNotification('Data reset cancelled.', 'info');
    }
}

