


document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const sections = document.querySelectorAll('section[id$="-section"]');

    // Toggle sidebar on mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Handle navigation clicks to show/hide sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSectionId = this.dataset.section + '-section';

            // Remove active class from all nav links and add to clicked one
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Hide all sections and show the target one
            sections.forEach(section => {
                section.style.display = 'none';
            });
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }

            // Hide sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Initial load: ensure dashboard is visible and active
    const dashboardLink = document.querySelector('.sidebar .nav-link[data-section="dashboard"]');
    if (dashboardLink) {
        dashboardLink.click();
    }
});



// Sample data for demonstration
let medicines = [
    { id: '001', name: 'Paracetamol 500mg', category: 'Painkiller', price: 2.50, stock: 150, expiry: '2025-12-31', supplier: 'PharmaCorp' },
    { id: '002', name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 5.75, stock: 80, expiry: '2024-11-15', supplier: 'MediSupply' },
    { id: '003', name: 'Omeprazole 20mg', category: 'Antacid', price: 3.20, stock: 200, expiry: '2026-06-30', supplier: 'GlobalPharm' },
    { id: '004', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 1.80, stock: 120, expiry: '2025-09-01', supplier: 'PharmaCorp' },
    { id: '005', name: 'Ibuprofen 400mg', category: 'Painkiller', price: 4.00, stock: 90, expiry: '2024-10-20', supplier: 'MediSupply' }
];

let customers = [
    { id: 'C001', name: 'John Smith', phone: '+1 (555) 123-4567', address: '123 Oak Ave, Cityville', totalPurchases: 560.20 },
    { id: 'C002', name: 'Sarah Johnson', phone: '+1 (555) 987-6543', address: '456 Pine St, Townsville', totalPurchases: 320.50 },
    { id: 'C003', name: 'David Lee', phone: '+1 (555) 111-2222', address: '789 Maple Rd, Villageton', totalPurchases: 780.00 }
];

let cart = [];
let invoiceCounter = 1053;

// Utility functions
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function generateInvoiceNumber() {
    return 'INV-2023-' + (invoiceCounter++);
}

function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Cart management functions
function addToCart(medicineId, quantity = 1) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) {
        alert('Medicine not found!');
        return;
    }

    if (medicine.stock < quantity) {
        alert('Insufficient stock!');
        return;
    }

    const existingItem = cart.find(item => item.id === medicineId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: medicineId,
            name: medicine.name,
            price: medicine.price,
            quantity: quantity
        });
    }

    updateCartDisplay();
}

function removeFromCart(medicineId) {
    cart = cart.filter(item => item.id !== medicineId);
    updateCartDisplay();
}

function updateCartQuantity(medicineId, newQuantity) {
    const item = cart.find(item => item.id === medicineId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(medicineId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="alert alert-info text-center">No items in cart.</div>';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${formatCurrency(item.price)} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <strong>${formatCurrency(itemTotal)}</strong>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = cartHTML;
    cartTotalElement.textContent = formatCurrency(total);
}

function processSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    const customerName = document.getElementById('customerNameBilling').value || 'Walk-in Customer';
    const invoiceNumber = generateInvoiceNumber();
    const dateTime = getCurrentDateTime();
    let total = 0;

    // Update stock and calculate total
    cart.forEach(item => {
        const medicine = medicines.find(m => m.id === item.id);
        if (medicine) {
            medicine.stock -= item.quantity;
        }
        total += item.price * item.quantity;
    });

    // Display last invoice
    displayLastInvoice(invoiceNumber, customerName, dateTime, cart, total);

    // Clear cart
    cart = [];
    updateCartDisplay();
    document.getElementById('customerNameBilling').value = '';

    alert(`Sale processed successfully! Invoice: ${invoiceNumber}`);
}

function displayLastInvoice(invoiceNumber, customerName, dateTime, items, total) {
    const invoiceContainer = document.querySelector('.card:has(.barcode-placeholder)').parentElement;
    
    let itemsHTML = '';
    items.forEach(item => {
        itemsHTML += `
            <div class="invoice-item d-flex justify-content-between">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `;
    });

    invoiceContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Last Invoice</h5>
                <div class="text-center mb-3">
                    <div class="barcode-placeholder">Barcode: ${invoiceNumber}</div>
                    <p class="mb-0"><strong>Invoice #${invoiceNumber}</strong></p>
                    <p class="text-muted">Customer: ${customerName}</p>
                    <p class="text-muted">Date: ${dateTime}</p>
                </div>
                ${itemsHTML}
                <div class="invoice-total d-flex justify-content-between mt-3">
                    <span>Grand Total:</span>
                    <span>${formatCurrency(total)}</span>
                </div>
                <button class="btn btn-outline-primary w-100 mt-3" onclick="printInvoice()">
                    <i class="fas fa-print me-2"></i>Print Invoice
                </button>
            </div>
        </div>
    `;
}

function printInvoice() {
    window.print();
}

// Medicine search functionality
function searchMedicine() {
    const searchTerm = document.querySelector('input[placeholder*="Search medicine"]').value.toLowerCase();
    const foundMedicine = medicines.find(m => 
        m.name.toLowerCase().includes(searchTerm) || 
        m.id.toLowerCase().includes(searchTerm)
    );

    if (foundMedicine) {
        const quantity = parseInt(prompt(`Found: ${foundMedicine.name}\nPrice: ${formatCurrency(foundMedicine.price)}\nStock: ${foundMedicine.stock}\n\nEnter quantity:`, '1'));
        if (quantity && quantity > 0) {
            addToCart(foundMedicine.id, quantity);
        }
    } else {
        alert('Medicine not found!');
    }
}

// Form submission handlers
function handleInventoryForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newMedicine = {
        id: String(medicines.length + 1).padStart(3, '0'),
        name: formData.get('medicineName'),
        category: formData.get('medicineCategory'),
        price: parseFloat(formData.get('medicinePrice')),
        stock: parseInt(formData.get('medicineStock')),
        expiry: formData.get('medicineExpiry'),
        supplier: formData.get('medicineSupplier')
    };

    medicines.push(newMedicine);
    updateInventoryTable();
    event.target.reset();
    alert('Medicine added successfully!');
}

function handleCustomerForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newCustomer = {
        id: 'C' + String(customers.length + 1).padStart(3, '0'),
        name: formData.get('customerName'),
        phone: formData.get('customerPhone'),
        address: formData.get('customerAddress'),
        totalPurchases: 0
    };

    customers.push(newCustomer);
    updateCustomerTable();
    event.target.reset();
    alert('Customer added successfully!');
}

function updateInventoryTable() {
    const tbody = document.querySelector('#inventory-section tbody');
    if (!tbody) return;

    tbody.innerHTML = medicines.map(medicine => `
        <tr>
            <td>${medicine.id}</td>
            <td>${medicine.name}</td>
            <td>${medicine.category}</td>
            <td>${formatCurrency(medicine.price)}</td>
            <td>${medicine.stock}</td>
            <td>${medicine.expiry}</td>
            <td>${medicine.supplier}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="editMedicine('${medicine.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMedicine('${medicine.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateCustomerTable() {
    const tbody = document.querySelector('#customers-section tbody');
    if (!tbody) return;

    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
            <td>${formatCurrency(customer.totalPurchases)}</td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="editCustomer('${customer.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer('${customer.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function editMedicine(id) {
    const medicine = medicines.find(m => m.id === id);
    if (medicine) {
        // Fill form with existing data for editing
        document.getElementById('medicineName').value = medicine.name;
        document.getElementById('medicineCategory').value = medicine.category;
        document.getElementById('medicinePrice').value = medicine.price;
        document.getElementById('medicineStock').value = medicine.stock;
        document.getElementById('medicineExpiry').value = medicine.expiry;
        document.getElementById('medicineSupplier').value = medicine.supplier;
        
        // Remove the medicine from array (will be re-added when form is submitted)
        medicines = medicines.filter(m => m.id !== id);
        updateInventoryTable();
    }
}

function deleteMedicine(id) {
    if (confirm('Are you sure you want to delete this medicine?')) {
        medicines = medicines.filter(m => m.id !== id);
        updateInventoryTable();
        alert('Medicine deleted successfully!');
    }
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerAddress').value = customer.address;
        
        customers = customers.filter(c => c.id !== id);
        updateCustomerTable();
    }
}

function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        customers = customers.filter(c => c.id !== id);
        updateCustomerTable();
        alert('Customer deleted successfully!');
    }
}

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Existing navigation code...
    
    // Add event listeners for forms
    const inventoryForm = document.querySelector('#inventory-section form');
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', handleInventoryForm);
    }

    const customerForm = document.querySelector('#customers-section form');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerForm);
    }

    // Add event listener for medicine search
    const searchButton = document.querySelector('#button-addon2');
    if (searchButton) {
        searchButton.addEventListener('click', searchMedicine);
    }

    // Add event listener for process sale button
    const processSaleButton = document.querySelector('.btn-success:has(.fa-cash-register)');
    if (processSaleButton) {
        processSaleButton.addEventListener('click', processSale);
    }

    // Allow Enter key to search medicines
    const searchInput = document.querySelector('input[placeholder*="Search medicine"]');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMedicine();
            }
        });
    }

    // Initialize tables
    updateInventoryTable();
    updateCustomerTable();
});


// Enhanced POS System with Receipt Generation
class POSSystem {
    constructor() {
        this.cart = [];
        this.currentTransaction = null;
        this.settings = this.loadSettings();
        this.initializePOS();
    }

    loadSettings() {
        const saved = localStorage.getItem('medicareSettings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            pharmacy: {
                name: 'MediCare Pharmacy',
                address: '123 Healthcare Street, Medical District, City, State 12345',
                phone: '+1 (555) 123-4567',
                email: 'info@medicarepos.com',
                taxId: 'TAX-123456789'
            },
            pos: {
                taxRate: 8.5,
                discountLimit: 20
            },
            receipt: {
                storageFolder: 'receipts',
                footer: 'Thank you for choosing MediCare Pharmacy!\nVisit us again for all your healthcare needs.\nwww.medicarepos.com'
            }
        };
    }

    initializePOS() {
        this.bindEvents();
        this.updateCartDisplay();
        this.updateReceiptPreview();
    }

    bindEvents() {
        // Medicine search
        const searchInput = document.getElementById('medicineSearch');
        const searchBtn = document.getElementById('button-addon2');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.searchMedicine());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchMedicine();
            });
        }

        // Amount received calculation
        const amountReceived = document.getElementById('amountReceived');
        if (amountReceived) {
            amountReceived.addEventListener('input', () => this.calculateChange());
        }
    }

    searchMedicine() {
        const searchTerm = document.getElementById('medicineSearch').value.trim();
        if (!searchTerm) return;

        // Find medicine in inventory
        const medicine = medicines.find(med => 
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.barcode === searchTerm
        );

        if (medicine) {
            this.addToCart(medicine);
            document.getElementById('medicineSearch').value = '';
        } else {
            this.showNotification('Medicine not found!', 'warning');
        }
    }

    quickAdd(medicineId) {
        const medicine = medicines.find(med => med.id === medicineId);
        if (medicine) {
            this.addToCart(medicine);
        }
    }

    addToCart(medicine) {
        const existingItem = this.cart.find(item => item.id === medicine.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...medicine,
                quantity: 1,
                total: medicine.price
            });
        }
        
        this.updateCartDisplay();
        this.updateReceiptPreview();
        this.showNotification(`${medicine.name} added to cart!`, 'success');
    }

    removeFromCart(medicineId) {
        this.cart = this.cart.filter(item => item.id !== medicineId);
        this.updateCartDisplay();
        this.updateReceiptPreview();
    }

    updateQuantity(medicineId, newQuantity) {
        const item = this.cart.find(item => item.id === medicineId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(medicineId);
            } else {
                item.quantity = newQuantity;
                item.total = item.price * newQuantity;
                this.updateCartDisplay();
                this.updateReceiptPreview();
            }
        }
    }

    clearCart() {
        if (this.cart.length > 0 && confirm('Are you sure you want to clear the cart?')) {
            this.cart = [];
            this.updateCartDisplay();
            this.updateReceiptPreview();
            this.showNotification('Cart cleared!', 'info');
        }
    }

    updateCartDisplay() {
        const cartContainer = document.getElementById('cart-items');
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const discountElement = document.getElementById('cart-discount');
        const totalElement = document.getElementById('cart-total');

        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-shopping-cart me-2"></i>
                    No items in cart. Search and add medicines to get started.
                </div>
            `;
            this.updateTotals(0, 0, 0, 0);
            return;
        }

        const cartHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-header">
                    <div class="cart-item-name">${item.name}</div>
                    <button class="btn btn-sm btn-outline-danger" onclick="posSystem.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="posSystem.updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <div class="quantity-display">${item.quantity}</div>
                        <button class="quantity-btn" onclick="posSystem.updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">$${item.total.toFixed(2)}</div>
                </div>
                <div class="text-muted small">
                    ${item.dosage} • $${item.price.toFixed(2)} each
                </div>
            </div>
        `).join('');

        cartContainer.innerHTML = cartHTML;

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * (this.settings.pos.taxRate / 100);
        const discount = 0; // Can be implemented later
        const total = subtotal + tax - discount;

        this.updateTotals(subtotal, tax, discount, total);
    }

    updateTotals(subtotal, tax, discount, total) {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const discountElement = document.getElementById('cart-discount');
        const totalElement = document.getElementById('cart-total');

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (discountElement) discountElement.textContent = `$${discount.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

        this.calculateChange();
    }

    calculateChange() {
        const totalElement = document.getElementById('cart-total');
        const amountReceivedElement = document.getElementById('amountReceived');
        const changeElement = document.getElementById('changeAmount');

        if (!totalElement || !amountReceivedElement || !changeElement) return;

        const total = parseFloat(totalElement.textContent.replace('$', ''));
        const amountReceived = parseFloat(amountReceivedElement.value) || 0;
        const change = amountReceived - total;

        changeElement.textContent = `$${Math.max(0, change).toFixed(2)}`;
        changeElement.style.color = change >= 0 ? 'green' : 'red';
    }

    updateReceiptPreview() {
        const receiptContainer = document.getElementById('receiptPreview');
        const printBtn = document.getElementById('printReceiptBtn');
        const saveBtn = document.getElementById('saveReceiptBtn');

        if (!receiptContainer) return;

        if (this.cart.length === 0) {
            receiptContainer.innerHTML = `
                <div class="receipt-placeholder">
                    <i class="fas fa-receipt"></i>
                    <p>Receipt will appear here after adding items</p>
                </div>
            `;
            if (printBtn) printBtn.disabled = true;
            if (saveBtn) saveBtn.disabled = true;
            return;
        }

        const receiptHTML = this.generateReceiptHTML();
        receiptContainer.innerHTML = receiptHTML;

        if (printBtn) printBtn.disabled = false;
        if (saveBtn) saveBtn.disabled = false;
    }

    generateReceiptHTML() {
        const now = new Date();
        const invoiceNumber = `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        const subtotal = this.cart.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * (this.settings.pos.taxRate / 100);
        const total = subtotal + tax;

        const customerName = document.getElementById('customerNameBilling')?.value || 'Walk-in Customer';
        const customerPhone = document.getElementById('customerPhone')?.value || '';
        const paymentMethod = document.getElementById('paymentMethod')?.value || 'cash';

        return `
            <div class="receipt-content">
                <div class="receipt-header">
                    <div class="receipt-logo">🏥</div>
                    <div class="receipt-pharmacy-name">${this.settings.pharmacy.name}</div>
                    <div class="receipt-address">${this.settings.pharmacy.address}</div>
                    <div class="receipt-contact">Tel: ${this.settings.pharmacy.phone}</div>
                    <div class="receipt-contact">Email: ${this.settings.pharmacy.email}</div>
                    <div class="receipt-contact">Tax ID: ${this.settings.pharmacy.taxId}</div>
                </div>

                <div class="receipt-invoice-info">
                    <div class="receipt-invoice-number">INVOICE #${invoiceNumber}</div>
                    <div class="receipt-datetime">${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
                </div>

                <div class="receipt-customer">
                    <div><strong>Customer:</strong> ${customerName}</div>
                    ${customerPhone ? `<div><strong>Phone:</strong> ${customerPhone}</div>` : ''}
                    <div><strong>Payment:</strong> ${paymentMethod.toUpperCase()}</div>
                </div>

                <div class="receipt-items">
                    ${this.cart.map(item => `
                        <div class="receipt-item">
                            <div class="receipt-item-details">
                                <div class="receipt-item-name">${item.name}</div>
                                <div class="receipt-item-qty-price">${item.quantity} x $${item.price.toFixed(2)}</div>
                            </div>
                            <div class="receipt-item-total">$${item.total.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="receipt-summary">
                    <div class="receipt-summary-line">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="receipt-summary-line">
                        <span>Tax (${this.settings.pos.taxRate}%):</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                </div>

                <div class="receipt-total">
                    <span>TOTAL:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>

                <div class="receipt-payment">
                    <div class="receipt-payment-line">
                        <span>Amount Received:</span>
                        <span>$${(document.getElementById('amountReceived')?.value || total).toString()}</span>
                    </div>
                    <div class="receipt-payment-line">
                        <span>Change:</span>
                        <span>$${Math.max(0, (parseFloat(document.getElementById('amountReceived')?.value || 0) - total)).toFixed(2)}</span>
                    </div>
                </div>

                <div class="receipt-barcode">
                    ||||| ${invoiceNumber} |||||
                </div>

                <div class="receipt-footer">
                    <div class="receipt-thank-you">THANK YOU!</div>
                    <div>${this.settings.receipt.footer.replace(/\n/g, '<br>')}</div>
                    <div style="margin-top: 10px;">
                        <small>Served by: ${this.getCurrentUser()}</small>
                    </div>
                </div>
            </div>
        `;
    }

    getCurrentUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        return currentUser.username || 'System';
    }

    processSale() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!', 'warning');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + item.total, 0);
        const tax = total * (this.settings.pos.taxRate / 100);
        const grandTotal = total + tax;
        const amountReceived = parseFloat(document.getElementById('amountReceived')?.value || 0);

        if (amountReceived < grandTotal) {
            this.showNotification('Insufficient payment amount!', 'error');
            return;
        }

        // Process the sale
        const transaction = {
            id: Date.now().toString(),
            invoiceNumber: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            items: [...this.cart],
            customer: {
                name: document.getElementById('customerNameBilling')?.value || 'Walk-in Customer',
                phone: document.getElementById('customerPhone')?.value || ''
            },
            subtotal: total,
            tax: tax,
            total: grandTotal,
            amountReceived: amountReceived,
            change: amountReceived - grandTotal,
            paymentMethod: document.getElementById('paymentMethod')?.value || 'cash',
            timestamp: new Date().toISOString(),
            cashier: this.getCurrentUser()
        };

        // Save transaction
        this.saveTransaction(transaction);

        // Show success message
        this.showNotification('Sale processed successfully!', 'success');

        // Auto-save receipt as PNG
        this.saveReceiptAsPNG(transaction.invoiceNumber);

        // Clear cart
        this.cart = [];
        this.updateCartDisplay();
        this.updateReceiptPreview();

        // Reset form
        document.getElementById('customerNameBilling').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('amountReceived').value = '';
    }

    saveTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    holdTransaction() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty!', 'warning');
            return;
        }

        const heldTransactions = JSON.parse(localStorage.getItem('heldTransactions') || '[]');
        const heldTransaction = {
            id: Date.now().toString(),
            cart: [...this.cart],
            customer: {
                name: document.getElementById('customerNameBilling')?.value || '',
                phone: document.getElementById('customerPhone')?.value || ''
            },
            timestamp: new Date().toISOString()
        };

        heldTransactions.push(heldTransaction);
        localStorage.setItem('heldTransactions', JSON.stringify(heldTransactions));

        this.showNotification('Transaction held successfully!', 'success');
        
        // Clear current cart
        this.cart = [];
        this.updateCartDisplay();
        this.updateReceiptPreview();
    }

    printReceipt() {
        const receiptContent = document.querySelector('.receipt-content');
        if (!receiptContent) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body { font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
                        .receipt-content { max-width: 300px; margin: 0 auto; }
                        ${document.querySelector('style')?.textContent || ''}
                    </style>
                </head>
                <body>
                    ${receiptContent.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    async saveReceiptAsPNG(customFileName = null) {
        const receiptContent = document.querySelector('.receipt-content');
        if (!receiptContent) return;

        try {
            // Use html2canvas library if available, otherwise show message
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(receiptContent, {
                    backgroundColor: 'white',
                    scale: 2
                });
                
                const link = document.createElement('a');
                link.download = customFileName ? `${customFileName}.png` : `receipt-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
                
                this.showNotification('Receipt saved as PNG!', 'success');
            } else {
                this.showNotification('PNG export feature requires html2canvas library', 'info');
            }
        } catch (error) {
            console.error('Error saving receipt as PNG:', error);
            this.showNotification('Error saving receipt as PNG', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.pos-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} pos-notification`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2"></i>
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
        }, 3000);
    }
}

// Global functions for onclick handlers
function quickAdd(medicineId) {
    if (window.posSystem) {
        window.posSystem.quickAdd(medicineId);
    }
}

function clearCart() {
    if (window.posSystem) {
        window.posSystem.clearCart();
    }
}

function processSale() {
    if (window.posSystem) {
        window.posSystem.processSale();
    }
}

function holdTransaction() {
    if (window.posSystem) {
        window.posSystem.holdTransaction();
    }
}

function printReceipt() {
    if (window.posSystem) {
        window.posSystem.printReceipt();
    }
}

function saveReceiptAsPNG() {
    if (window.posSystem) {
        window.posSystem.saveReceiptAsPNG();
    }
}

function scanBarcode() {
    // Simulate barcode scanning
    const barcodes = ['001', '002', '003', '004', '005'];
    const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
    document.getElementById('medicineSearch').value = randomBarcode;
    if (window.posSystem) {
        window.posSystem.searchMedicine();
    }
}

function searchCustomer() {
    // Simulate customer search
    const customers = [
        { name: 'John Doe', phone: '+1 (555) 123-4567' },
        { name: 'Jane Smith', phone: '+1 (555) 987-6543' },
        { name: 'Bob Johnson', phone: '+1 (555) 456-7890' }
    ];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    document.getElementById('customerNameBilling').value = randomCustomer.name;
    document.getElementById('customerPhone').value = randomCustomer.phone;
}

// Initialize POS system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize POS system only if we're on the main page
    if (document.getElementById('cart-items')) {
        window.posSystem = new POSSystem();
    }
});

