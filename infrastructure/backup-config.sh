#!/bin/bash
# Configuration Backup Script
# Run this on your current EC2 instance to backup configurations
# This creates a backup that can be restored on a new instance

set -e

BACKUP_DIR="ec2-config-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "💾 Backing up EC2 configuration to $BACKUP_DIR..."

# System configurations
echo "📄 Backing up system configurations..."
sudo cp /etc/nginx/sites-available/linguardian.com "$BACKUP_DIR/" 2>/dev/null || echo "Warning: nginx config not found"
sudo cp /etc/nginx/nginx.conf "$BACKUP_DIR/" 2>/dev/null || echo "Warning: nginx.conf not found"

# SSL certificates (public info only - private keys are not backed up)
sudo cp /etc/letsencrypt/live/linguardian.com/fullchain.pem "$BACKUP_DIR/ssl-cert.pem" 2>/dev/null || echo "Warning: SSL cert not found"

# Docker configurations
cp ~/.docker/config.json "$BACKUP_DIR/docker-config.json" 2>/dev/null || echo "Warning: Docker config not found"

# Firewall rules
sudo ufw status > "$BACKUP_DIR/ufw-rules.txt"

# System information
echo "📊 Gathering system information..."
cat > "$BACKUP_DIR/system-info.txt" << EOF
EC2 Instance Setup Information
==============================
Backup Date: $(date)
Ubuntu Version: $(lsb_release -d | cut -f2)
Kernel: $(uname -r)
Docker Version: $(docker --version)
nginx Version: $(nginx -v 2>&1 | cut -d'/' -f2)

Installed Packages:
$(dpkg -l | grep -E '(nginx|docker|certbot)' | awk '{print $2 " " $3}')

Active Services:
$(systemctl list-units --type=service --state=active | grep -E '(nginx|docker)' | awk '{print $1}')

Firewall Status:
$(sudo ufw status)

Docker Networks:
$(docker network ls)

SSL Certificates:
$(sudo certbot certificates 2>/dev/null || echo "No certificates found")
EOF

# Create restore script template
cat > "$BACKUP_DIR/restore-instructions.md" << 'EOF'
# EC2 Configuration Restore Instructions

This backup contains your Linguardian EC2 instance configuration.

## Files Included:
- nginx configuration
- SSL certificate (public portion only)
- Docker configuration
- Firewall rules
- System information

## To Restore on a New EC2 Instance:

1. Run the main setup script:
   ```bash
   ./infrastructure/setup-ec2.sh
   ```

2. Run SSL setup:
   ```bash
   ./infrastructure/setup-ssl.sh
   ```

3. Deploy your application via GitHub Actions or manually

## Important Notes:
- SSL private keys are NOT backed up for security
- Regenerate SSL certificates on the new instance
- Update DNS to point to the new instance IP
- Update GitHub secrets with new AWS credentials if needed

## Security Considerations:
- Private keys and secrets are intentionally NOT included
- Generate new SSH keypairs for new instances
- Update AWS IAM credentials as needed
EOF

# Create archive
echo "📦 Creating backup archive..."
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

echo "✅ Backup complete!"
echo "📁 Backup location: $BACKUP_DIR/"
echo "📦 Archive: ${BACKUP_DIR}.tar.gz"
echo ""
echo "💡 Copy this backup to a safe location (S3, local machine, etc.)"
