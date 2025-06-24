// Admin Panel Management System
class AdminPanel {
    constructor() {
        this.currentSection = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.bindEvents();
        this.loadDashboardData();
        this.initializeCharts();
        this.loadRecentActivities();
    }

    loadUserInfo() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userNameElement = document.getElementById('adminUserName');
        const userRoleElement = document.getElementById('adminUserRole');
        
        if (userNameElement && currentUser.username) {
            userNameElement.textContent = currentUser.role || 'Administrator';
            if (userRoleElement) {
                userRoleElement.textContent = currentUser.role || 'System Admin';
            }
        }
    }

    bindEvents() {
        // Navigation events
        document.querySelectorAll('.admin-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Sidebar toggle events
        document.getElementById('mobileSidebarToggle')?.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.toggle('active');
        });

        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            document.getElementById('adminSidebar').classList.remove('active');
        });

        // Window resize event
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.admin-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = this.getSectionTitle(sectionName);
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
        this.currentSection = sectionName;
    }

    getSectionTitle(sectionName) {
        const titles = {
            dashboard: 'Dashboard',
            users: 'User Management',
            inventory: 'Inventory Control',
            sales: 'Sales Analytics',
            reports: 'Reports',
            system: 'System Settings',
            backup: 'Backup & Restore',
            logs: 'System Logs'
        };
        return titles[sectionName] || 'Admin Panel';
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'users':
                this.loadUsersData();
                break;
            case 'inventory':
                this.loadInventoryData();
                break;
            case 'sales':
                this.loadSalesData();
                break;
            case 'reports':
                this.loadReportsData();
                break;
            case 'system':
                this.loadSystemData();
                break;
            case 'backup':
                this.loadBackupData();
                break;
            case 'logs':
                this.loadLogsData();
                break;
        }
    }

    loadDashboardData() {
        // Load dashboard statistics
        this.updateDashboardStats();
        this.loadRecentActivities();
        this.loadSystemAlerts();
    }

    updateDashboardStats() {
        // Get data from localStorage
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');

        // Calculate today's sales
        const today = new Date().toDateString();
        const todayTransactions = transactions.filter(t => 
            new Date(t.timestamp).toDateString() === today
        );
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);

        // Calculate low stock items
        const lowStockItems = medicines.filter(m => m.stock < 10).length;

        // Update UI
        document.getElementById('todaySales').textContent = `$${todaySales.toFixed(2)}`;
        document.getElementById('totalMedicines').textContent = medicines.length.toString();
        document.getElementById('totalCustomers').textContent = customers.length.toString();
        document.getElementById('lowStockItems').textContent = lowStockItems.toString();
    }

    initializeCharts() {
        this.initSalesChart();
        this.initCategoryChart();
        this.initSalesPerformanceChart();
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        // Generate sample data for last 7 days
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            data.push(Math.floor(Math.random() * 1000) + 500);
        }

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales ($)',
                    data: data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Antibiotics', 'Pain Killers', 'Vitamins', 'Supplements', 'Others'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#3498db',
                        '#27ae60',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    initSalesPerformanceChart() {
        const ctx = document.getElementById('salesPerformanceChart');
        if (!ctx) return;

        // Generate sample monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const salesData = [12000, 15000, 13500, 18000, 16500, 20000];
        const targetData = [15000, 15000, 15000, 15000, 15000, 15000];

        this.charts.salesPerformance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Actual Sales',
                        data: salesData,
                        backgroundColor: '#3498db',
                        borderRadius: 4
                    },
                    {
                        label: 'Target',
                        data: targetData,
                        backgroundColor: '#27ae60',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    loadRecentActivities() {
        const container = document.getElementById('recentTransactions');
        if (!container) return;

        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const recentTransactions = transactions.slice(-5).reverse();

        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">No recent transactions</p>';
            return;
        }

        const activitiesHTML = recentTransactions.map(transaction => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-cash-register"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">Sale #${transaction.invoiceNumber}</div>
                    <div class="activity-time">
                        ${new Date(transaction.timestamp).toLocaleString()} • $${transaction.total.toFixed(2)}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = activitiesHTML;
    }

    loadSystemAlerts() {
        const container = document.getElementById('systemAlerts');
        if (!container) return;

        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        const lowStockMedicines = medicines.filter(m => m.stock < 10);

        const alerts = [
            ...lowStockMedicines.map(med => ({
                type: 'warning',
                title: `Low Stock: ${med.name}`,
                message: `Only ${med.stock} units remaining`,
                time: 'Just now'
            })),
            {
                type: 'info',
                title: 'System Backup Completed',
                message: 'Daily backup completed successfully',
                time: '2 hours ago'
            },
            {
                type: 'danger',
                title: 'Failed Login Attempt',
                message: 'Multiple failed login attempts detected',
                time: '4 hours ago'
            }
        ].slice(0, 5);

        const alertsHTML = alerts.map(alert => `
            <div class="alert-item">
                <div class="alert-icon ${alert.type}">
                    <i class="fas ${alert.type === 'warning' ? 'fa-exclamation-triangle' : 
                                   alert.type === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-time">${alert.message} • ${alert.time}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = alertsHTML || '<p class="text-muted text-center">No system alerts</p>';
    }

    loadUsersData() {
        const tableBody = document.querySelector('#usersTable tbody');
        if (!tableBody) return;

        // Sample user data
        const users = [
            {
                id: 1,
                username: 'admin',
                role: 'Administrator',
                email: 'admin@medicarepos.com',
                status: 'active',
                lastLogin: '2023-10-26 09:30 AM'
            },
            {
                id: 2,
                username: 'pharmacist',
                role: 'Pharmacist',
                email: 'pharmacist@medicarepos.com',
                status: 'active',
                lastLogin: '2023-10-26 08:15 AM'
            },
            {
                id: 3,
                username: 'cashier',
                role: 'Cashier',
                email: 'cashier@medicarepos.com',
                status: 'active',
                lastLogin: '2023-10-25 06:45 PM'
            }
        ];

        const usersHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>${user.lastLogin}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = usersHTML;
    }

    loadInventoryData() {
        const tableBody = document.querySelector('#inventoryTable tbody');
        if (!tableBody) return;

        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');

        if (medicines.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No medicines in inventory</td></tr>';
            return;
        }

        const inventoryHTML = medicines.map(medicine => {
            const stockStatus = medicine.stock < 10 ? 'low-stock' : 
                               medicine.stock < 50 ? 'normal-stock' : 'high-stock';
            const stockLabel = medicine.stock < 10 ? 'Low Stock' : 
                              medicine.stock < 50 ? 'Normal' : 'High Stock';

            return `
                <tr>
                    <td>${medicine.id}</td>
                    <td>${medicine.name}</td>
                    <td>${medicine.category || 'General'}</td>
                    <td>${medicine.stock}</td>
                    <td>$${medicine.price.toFixed(2)}</td>
                    <td>${medicine.expiryDate || 'N/A'}</td>
                    <td><span class="status-badge ${stockStatus}">${stockLabel}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editMedicine('${medicine.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteMedicine('${medicine.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        tableBody.innerHTML = inventoryHTML;
    }

    loadSalesData() {
        // Update sales analytics data
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
        const totalTransactions = transactions.length;
        const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalTransactions').textContent = totalTransactions.toString();
        document.getElementById('avgTransactionValue').textContent = `$${avgTransaction.toFixed(2)}`;

        // Find top selling medicine
        const medicinesSold = {};
        transactions.forEach(t => {
            t.items.forEach(item => {
                medicinesSold[item.name] = (medicinesSold[item.name] || 0) + item.quantity;
            });
        });

        const topMedicine = Object.keys(medicinesSold).reduce((a, b) => 
            medicinesSold[a] > medicinesSold[b] ? a : b, 'N/A'
        );

        document.getElementById('topSellingMedicine').textContent = topMedicine;
    }

    loadReportsData() {
        // Placeholder for reports functionality
        console.log('Loading reports data...');
    }

    loadSystemData() {
        // Placeholder for system settings
        console.log('Loading system data...');
    }

    loadBackupData() {
        // Placeholder for backup functionality
        console.log('Loading backup data...');
    }

    loadLogsData() {
        // Placeholder for logs functionality
        console.log('Loading logs data...');
    }

    resizeCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.resize();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.admin-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} admin-notification`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                           type === 'error' ? 'fa-exclamation-circle' : 
                           type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
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

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, 4000);
    }
}

// Global functions for admin panel
function refreshData() {
    if (window.adminPanel) {
        window.adminPanel.loadSectionData(window.adminPanel.currentSection);
        window.adminPanel.showNotification('Data refreshed successfully!', 'success');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../login.html';
    }
}

function showAddUserModal() {
    alert('Add User functionality will be implemented with backend integration');
}

function editUser(userId) {
    alert(`Edit User ${userId} functionality will be implemented with backend integration`);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        alert(`Delete User ${userId} functionality will be implemented with backend integration`);
    }
}

function showAddMedicineModal() {
    alert('Add Medicine functionality will be implemented with backend integration');
}

function editMedicine(medicineId) {
    alert(`Edit Medicine ${medicineId} functionality will be implemented with backend integration`);
}

function deleteMedicine(medicineId) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        alert(`Delete Medicine ${medicineId} functionality will be implemented with backend integration`);
    }
}

function generateInventoryReport() {
    alert('Generate Inventory Report functionality will be implemented with backend integration');
}

function filterInventory() {
    alert('Filter Inventory functionality will be implemented with backend integration');
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has admin privileges
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username) {
        window.location.href = '../login.html';
        return;
    }

    // Initialize admin panel
    window.adminPanel = new AdminPanel();
});

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
`;
document.head.appendChild(style);

