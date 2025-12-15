#!/bin/bash
# SSL Certificate Setup Script
# Run this after the main EC2 setup
# Requires: Domain pointed to EC2 instance

set -e

DOMAIN="linguardian.com"
WWW_DOMAIN="www.linguardian.com"

echo "🔐 Setting up SSL certificates for $DOMAIN..."

# Check if nginx is running
if ! sudo systemctl is-active --quiet nginx; then
    echo "❌ nginx is not running. Please run setup-ec2.sh first."
    exit 1
fi

# Get SSL certificate using certbot
echo "📜 Obtaining SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN --non-interactive --agree-tos --email YOUR_EMAIL_HERE

# Verify certificate renewal timer is active
echo "⏰ Checking certificate renewal timer..."
sudo systemctl status certbot.timer

echo "✅ SSL setup complete!"
echo ""
echo "🔒 Certificate details:"
echo "  - Certificate: /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "  - Private key: /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo "  - Auto-renewal: Active (runs twice daily)"
echo ""
echo "🧪 Test your SSL setup: https://$DOMAIN"
