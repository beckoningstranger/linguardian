# 🏗️ Linguardian Infrastructure Setup

Complete setup scripts and documentation for deploying Linguardian on AWS EC2.

## 📋 Current Infrastructure Overview

### Architecture
```
Internet → AWS EC2 (Ubuntu 24.04)
    ↓
nginx (reverse proxy with SSL)
    ↓
Docker Containers (localhost:3000)
    ├── Frontend (Next.js)
    └── Backend (Express.js)
```

### Key Components
- **Web Server**: nginx with reverse proxy
- **SSL**: Let's Encrypt certificates (auto-renewal)
- **Containerization**: Docker + Docker Compose
- **Firewall**: UFW (ports 22, 80, 443)
- **Domain**: linguardian.com + www.linguardian.com

## 🚀 Quick Setup (New EC2 Instance)

### Prerequisites
- Ubuntu 24.04 EC2 instance
- SSH access with private key
- Domain name pointing to EC2 instance
- Security group allowing ports 22, 80, 443

### Step 1: Initial Setup
```bash
# Clone repository and run setup
git clone <your-repo>
cd linguardian
chmod +x infrastructure/*.sh
./infrastructure/setup-ec2.sh
```

### Step 2: SSL Certificates
```bash
# Edit the script and add your email
nano infrastructure/setup-ssl.sh
# Replace YOUR_EMAIL_HERE with your actual email

# Run SSL setup
./infrastructure/setup-ssl.sh
```

### Step 3: Deploy Application
```bash
# Via GitHub Actions (recommended)
git push origin main

# Or manually
docker-compose -f docker-compose.deploy.yml up -d
```

## 📁 Scripts Overview

### `setup-ec2.sh`
- Installs Docker, nginx, certbot
- Configures firewall (UFW)
- Sets up nginx reverse proxy
- Enables required services

### `setup-ssl.sh`
- Obtains Let's Encrypt SSL certificates
- Configures nginx for HTTPS
- Sets up automatic renewal

### `backup-config.sh`
- Backs up current EC2 configuration
- Creates restore documentation
- Safe for sharing (no sensitive data)

## 🔐 Sensitive Information

The scripts are designed to avoid storing sensitive information:

### Required Secrets (Set in GitHub or Environment)
```bash
# AWS Credentials (for ECR access)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-central-1
AWS_ID=977099010577

# Application Secrets
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_ID=your-google-oauth-id
GOOGLE_SECRET=your-google-oauth-secret
MONGO_URL=your-mongodb-connection-string

# SSL Setup
YOUR_EMAIL_HERE=your-email@example.com
```

### SSH Access
- Generate new keypair for each instance:
```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/new-instance-key
```

## 🔄 Backup & Restore

### Create Backup (Current Instance)
```bash
./infrastructure/backup-config.sh
```

### Restore on New Instance
1. Launch new EC2 instance with same specs
2. Run setup scripts above
3. Deploy application
4. Update DNS to new instance IP

## 🛠️ Manual Configuration Reference

### nginx Configuration
```nginx
# /etc/nginx/sites-available/linguardian.com
server {
    listen 80;
    server_name linguardian.com www.linguardian.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

### Firewall Rules
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
```

### Docker Networks
- Custom bridge network for container communication
- Ports 3000 (frontend) and 8000 (backend) exposed

## 🔍 Troubleshooting

### Check Service Status
```bash
sudo systemctl status nginx
sudo systemctl status docker
sudo ufw status
```

### View Logs
```bash
# nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Docker logs
docker-compose -f docker-compose.deploy.yml logs -f
```

### SSL Issues
```bash
# Check certificates
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run
```

## 📞 Support

If you need to recreate this setup:
1. Run the setup scripts in order
2. Update all secrets and credentials
3. Test thoroughly before going live
4. Keep backups of configurations

---

**Last updated:** December 2025
**Tested on:** Ubuntu 24.04 LTS, AWS EC2 t2.micro
