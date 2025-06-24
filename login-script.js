// Demo user credentials
const users = {
    admin: { password: 'admin123', role: 'Administrator', permissions: ['all'] },
    pharmacist: { password: 'pharma123', role: 'Pharmacist', permissions: ['inventory', 'billing', 'customers', 'reports'] },
    cashier: { password: 'cash123', role: 'Cashier', permissions: ['billing', 'customers'] }
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const userTypeSelect = document.getElementById('userType');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.rememberMe) {
            redirectToDashboard();
            return;
        }
    }
    
    // Load saved username if remember me was checked
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMeCheckbox.checked = true;
    }
    
    // Add form validation
    addFormValidation();
    
    // Add enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !loadingOverlay.style.display) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userType = userTypeSelect.value;
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Validate inputs
    if (!userType || !username || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Show loading
    showLoading();
    
    // Simulate authentication delay
    setTimeout(() => {
        authenticateUser(userType, username, password, rememberMe);
    }, 1500);
});

// Authenticate user
function authenticateUser(userType, username, password, rememberMe) {
    const user = users[username];
    
    if (!user || user.password !== password) {
        hideLoading();
        showError('Invalid username or password');
        return;
    }
    
    // Check if user type matches
    if (userType !== 'admin' && username !== userType) {
        hideLoading();
        showError('User type does not match credentials');
        return;
    }
    
    // Successful login
    const userData = {
        username: username,
        role: user.role,
        permissions: user.permissions,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };
    
    // Save user data
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    if (rememberMe) {
        localStorage.setItem('savedUsername', username);
    } else {
        localStorage.removeItem('savedUsername');
    }
    
    // Show success message
    showSuccess('Login successful! Redirecting...');
    
    // Redirect after short delay
    setTimeout(() => {
        redirectToDashboard();
    }, 1000);
}

// Fill demo credentials
function fillDemoCredentials(userType) {
    userTypeSelect.value = userType;
    usernameInput.value = userType;
    
    switch(userType) {
        case 'admin':
            passwordInput.value = 'admin123';
            break;
        case 'pharmacist':
            passwordInput.value = 'pharma123';
            break;
        case 'cashier':
            passwordInput.value = 'cash123';
            break;
    }
    
    // Add visual feedback
    const demoUsers = document.querySelectorAll('.demo-user');
    demoUsers.forEach(user => user.style.background = 'white');
    event.target.style.background = 'var(--primary-color)';
    event.target.style.color = 'white';
    
    setTimeout(() => {
        event.target.style.background = 'white';
        event.target.style.color = 'inherit';
    }, 1000);
}

// Toggle password visibility
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Form validation
function addFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validate based on field type
    switch(field.id) {
        case 'userType':
            if (!value) {
                showFieldError(field, 'Please select a user type');
            }
            break;
        case 'username':
            if (!value) {
                showFieldError(field, 'Username is required');
            } else if (value.length < 3) {
                showFieldError(field, 'Username must be at least 3 characters');
            }
            break;
        case 'password':
            if (!value) {
                showFieldError(field, 'Password is required');
            } else if (value.length < 6) {
                showFieldError(field, 'Password must be at least 6 characters');
            }
            break;
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.style.borderColor = 'var(--danger-color)';
    
    // Create or update error message
    let errorMsg = field.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        field.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    errorMsg.style.color = 'var(--danger-color)';
    errorMsg.style.fontSize = '0.8rem';
    errorMsg.style.marginTop = '5px';
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    field.style.borderColor = '#e1e5e9';
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Utility functions
function showLoading() {
    loadingOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

function redirectToDashboard() {
    window.location.href = 'index.html';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .form-control.error {
        border-color: var(--danger-color) !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(style);

