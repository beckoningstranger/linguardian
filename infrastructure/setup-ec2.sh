#!/bin/bash
# Linguardian EC2 Setup Script
# Run this on a fresh Ubuntu 24.04 EC2 instance
# Make executable: chmod +x setup-ec2.sh

set -e

echo "🚀 Starting Linguardian EC2 Setup..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "📦 Installing Docker, nginx, and SSL tools..."
sudo apt install -y docker.io nginx certbot python3-certbot-nginx docker-compose-plugin

# Start and enable services
echo "🔧 Configuring services..."
sudo systemctl enable docker
sudo systemctl enable nginx
sudo usermod -aG docker ubuntu

# Configure firewall
echo "🔥 Setting up firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Create nginx configuration
echo "🌐 Configuring nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/linguardian.com > /dev/null <<EOF
server {
    listen 80;
    server_name linguardian.com www.linguardian.com;

    location / {
        proxy_pass http://localhost:3000;  # Redirect traffic to your Docker container
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name linguardian.com www.linguardian.com;

    # INSERT_SSL_CERTIFICATES_HERE
    # ssl_certificate /etc/letsencrypt/live/linguardian.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/linguardian.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;  # Redirect traffic to your Docker container
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/linguardian.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

# Restart services
echo "🔄 Starting services..."
sudo systemctl restart nginx
sudo systemctl restart docker

echo "✅ EC2 setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run SSL certificate setup: sudo certbot --nginx -d linguardian.com -d www.linguardian.com"
echo "2. Deploy your application using GitHub Actions or manual docker-compose"
echo "3. Test the setup by visiting your domain"
echo ""
echo "🔐 Note: SSL certificates will be obtained when you run the certbot command above"
