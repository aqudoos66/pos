# MediCare POS - Deployment Guide

## 🚀 Deployment Options

### Option 1: Local Development Setup

#### Requirements
- Modern web browser
- Local web server (optional but recommended)

#### Steps
1. **Download all files** to a local directory
2. **For basic testing:** Open `login.html` directly in browser
3. **For full functionality:** Set up local web server

#### Local Web Server Setup

**Using Python (Recommended for testing):**
```bash
# Navigate to project directory
cd /path/to/medicare-pos

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Access at: http://localhost:8000/login.html
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Navigate to project directory
cd /path/to/medicare-pos

# Start server
http-server -p 8000

# Access at: http://localhost:8000/login.html
```

**Using PHP:**
```bash
# Navigate to project directory
cd /path/to/medicare-pos

# Start PHP built-in server
php -S localhost:8000

# Access at: http://localhost:8000/login.html
```

### Option 2: Production Deployment

#### Apache Web Server

**1. Install Apache:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install apache2

# CentOS/RHEL
sudo yum install httpd
```

**2. Configure Virtual Host:**
```apache
<VirtualHost *:80>
    ServerName medicarepos.local
    DocumentRoot /var/www/medicare-pos
    
    <Directory /var/www/medicare-pos>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/medicare-pos_error.log
    CustomLog ${APACHE_LOG_DIR}/medicare-pos_access.log combined
</VirtualHost>
```

**3. Deploy Files:**
```bash
# Copy files to web directory
sudo cp -r /path/to/medicare-pos/* /var/www/medicare-pos/

# Set permissions
sudo chown -R www-data:www-data /var/www/medicare-pos
sudo chmod -R 755 /var/www/medicare-pos
```

#### Nginx Web Server

**1. Install Nginx:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

**2. Configure Server Block:**
```nginx
server {
    listen 80;
    server_name medicarepos.local;
    root /var/www/medicare-pos;
    index login.html index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    error_log /var/log/nginx/medicare-pos_error.log;
    access_log /var/log/nginx/medicare-pos_access.log;
}
```

**3. Deploy Files:**
```bash
# Copy files to web directory
sudo cp -r /path/to/medicare-pos/* /var/www/medicare-pos/

# Set permissions
sudo chown -R nginx:nginx /var/www/medicare-pos
sudo chmod -R 755 /var/www/medicare-pos
```

### Option 3: Cloud Deployment

#### GitHub Pages (Free Static Hosting)

**1. Create GitHub Repository:**
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit - MediCare POS v2.0"

# Add remote repository
git remote add origin https://github.com/yourusername/medicare-pos.git
git push -u origin main
```

**2. Enable GitHub Pages:**
- Go to repository Settings
- Scroll to Pages section
- Select source: Deploy from a branch
- Choose branch: main
- Access at: `https://yourusername.github.io/medicare-pos/login.html`

#### Netlify (Free with Custom Domain)

**1. Deploy via Git:**
- Connect GitHub repository to Netlify
- Set build command: (none for static site)
- Set publish directory: `/`
- Deploy automatically on git push

**2. Deploy via Drag & Drop:**
- Zip all project files
- Drag and drop to Netlify dashboard
- Get instant deployment URL

#### Vercel (Free with Excellent Performance)

**1. Install Vercel CLI:**
```bash
npm install -g vercel
```

**2. Deploy:**
```bash
# Navigate to project directory
cd /path/to/medicare-pos

# Deploy
vercel

# Follow prompts for configuration
```

## 🔧 Backend Integration Setup

### Node.js + Express Backend

**1. Initialize Backend Project:**
```bash
mkdir medicare-pos-backend
cd medicare-pos-backend
npm init -y

# Install dependencies
npm install express cors helmet morgan bcryptjs jsonwebtoken
npm install sqlite3 sequelize
npm install --save-dev nodemon
```

**2. Basic Server Setup (server.js):**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Serve frontend files
app.use(express.static('../medicare-pos'));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/users', require('./routes/users'));

// Start server
app.listen(PORT, () => {
    console.log(`MediCare POS Backend running on port ${PORT}`);
});
```

**3. Database Setup (models/index.js):**
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// Import models
const User = require('./User')(sequelize);
const Medicine = require('./Medicine')(sequelize);
const Customer = require('./Customer')(sequelize);
const Transaction = require('./Transaction')(sequelize);

// Define associations
Transaction.belongsTo(User);
Transaction.belongsTo(Customer);

module.exports = {
    sequelize,
    User,
    Medicine,
    Customer,
    Transaction
};
```

### PHP + MySQL Backend

**1. Database Setup (database.sql):**
```sql
CREATE DATABASE medicare_pos;
USE medicare_pos;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'pharmacist', 'cashier') NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    customer_id INT,
    total DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**2. API Configuration (config/database.php):**
```php
<?php
class Database {
    private $host = 'localhost';
    private $db_name = 'medicare_pos';
    private $username = 'your_username';
    private $password = 'your_password';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

## 🔒 Security Configuration

### HTTPS Setup (Production)

**1. SSL Certificate (Let's Encrypt):**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get certificate
sudo certbot --apache -d medicarepos.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

**2. Security Headers:**
```apache
# Apache .htaccess
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' cdn.jsdelivr.net; img-src 'self' data:; font-src 'self' cdnjs.cloudflare.com"
```

### Environment Variables

**1. Create .env file:**
```bash
# Database Configuration
DB_HOST=localhost
DB_NAME=medicare_pos
DB_USER=your_username
DB_PASS=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=24h

# Application Configuration
APP_ENV=production
APP_DEBUG=false
APP_URL=https://medicarepos.com

# Email Configuration (for notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

## 📊 Performance Optimization

### Frontend Optimization

**1. Minify CSS and JavaScript:**
```bash
# Install build tools
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js
uglifyjs login-script.js -o login-script.min.js
uglifyjs settings-script.js -o settings-script.min.js
uglifyjs admin/assets/js/admin-script.js -o admin/assets/js/admin-script.min.js

# Minify CSS
cleancss style.css -o style.min.css
cleancss login-style.css -o login-style.min.css
cleancss settings-style.css -o settings-style.min.css
cleancss admin/assets/css/admin-style.css -o admin/assets/css/admin-style.min.css
```

**2. Image Optimization:**
```bash
# Install imagemin
npm install -g imagemin-cli imagemin-pngquant imagemin-mozjpeg

# Optimize images
imagemin images/*.png --out-dir=images/optimized --plugin=pngquant
imagemin images/*.jpg --out-dir=images/optimized --plugin=mozjpeg
```

### Caching Configuration

**1. Apache Caching:**
```apache
# Enable mod_expires
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

**2. Nginx Caching:**
```nginx
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
    access_log off;
}
```

## 🔍 Monitoring & Maintenance

### Log Configuration

**1. Application Logs:**
```javascript
// Frontend error logging
window.addEventListener('error', function(e) {
    console.error('Frontend Error:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
    
    // Send to logging service
    fetch('/api/logs/frontend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            level: 'error',
            message: e.message,
            stack: e.error?.stack,
            timestamp: new Date().toISOString()
        })
    });
});
```

**2. Server Monitoring:**
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor logs
sudo tail -f /var/log/apache2/medicare-pos_access.log
sudo tail -f /var/log/apache2/medicare-pos_error.log
```

### Backup Strategy

**1. Database Backup:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/medicare-pos"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u username -p medicare_pos > $BACKUP_DIR/database_$DATE.sql

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/medicare-pos

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

**2. Automated Backup (Cron):**
```bash
# Add to crontab
sudo crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/medicare-pos-backup.log 2>&1
```

## 🚨 Troubleshooting

### Common Deployment Issues

**1. File Permissions:**
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/medicare-pos
sudo find /var/www/medicare-pos -type d -exec chmod 755 {} \;
sudo find /var/www/medicare-pos -type f -exec chmod 644 {} \;
```

**2. Database Connection:**
```bash
# Test database connection
mysql -u username -p -e "SELECT 1"

# Check database exists
mysql -u username -p -e "SHOW DATABASES LIKE 'medicare_pos'"
```

**3. Web Server Issues:**
```bash
# Check Apache status
sudo systemctl status apache2

# Check Nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/nginx/error.log
```

### Performance Issues

**1. Check Resource Usage:**
```bash
# Monitor system resources
htop
iotop
df -h
free -h
```

**2. Optimize Database:**
```sql
-- Analyze tables
ANALYZE TABLE users, medicines, customers, transactions;

-- Optimize tables
OPTIMIZE TABLE users, medicines, customers, transactions;

-- Check slow queries
SHOW PROCESSLIST;
```

## 📞 Support

For deployment assistance:
- **Email:** support@medicarepos.com
- **Documentation:** This deployment guide
- **Issues:** Check troubleshooting section first

---

**MediCare POS v2.0 Deployment Guide**
*Complete deployment instructions for all environments*

