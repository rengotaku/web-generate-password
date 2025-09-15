# Password Generator

🔐 A secure and customizable password generator web application.

## 🌐 Live Site
- **Production**: https://password-generator.v41.me
- **Cloudflare Pages**: https://web-generate-password.pages.dev

## ✨ Features
- Secure password generation with customizable options
- Character set selection (uppercase, lowercase, numbers, symbols)
- Password length configuration
- One-click copy to clipboard
- Responsive design
- Security headers and optimizations

## 🚀 Deployment

This project is automatically deployed to Cloudflare Pages using GitHub Actions.

### Deployment Workflow
- **Main Branch**: Automatically deploys to production (password-generator.v41.me)
- **Pull Requests**: Creates preview deployments for testing
- **All Branches**: Runs build validation checks

### Required Secrets
Configure these in your GitHub repository settings:
```
CLOUDFLARE_API_TOKEN     # Cloudflare API token with Pages permissions
CLOUDFLARE_ACCOUNT_ID    # Your Cloudflare account ID
SLACK_WEBHOOK_URL        # (Optional) Slack notifications
```

### Manual Deployment
```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name=web-generate-password
```

## 🛠️ Development

This is a static HTML/CSS/JavaScript application:
- `index.html` - Main page structure
- `style.css` - Styling and responsive design
- `script.js` - Password generation logic
- `_headers` - Security headers configuration
- `_redirects` - URL routing rules

## 🔧 Project Structure
```
web-generate-password/
├── index.html          # Main HTML page
├── style.css           # Styling
├── script.js           # Password generation logic
├── _headers            # Cloudflare security headers
├── _redirects          # URL routing
├── wrangler.toml       # Cloudflare configuration
└── .github/
    └── workflows/
        └── deploy.yml  # CI/CD pipeline
```

## 📋 Security Features
- Content Security Policy (CSP)
- X-Frame-Options protection
- No external dependencies
- Client-side only (no data transmission)
- Secure random generation using Web Crypto API
