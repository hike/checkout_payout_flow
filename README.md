# Checkout.com Flow Testing Environment

This is a complete testing environment for Checkout.com Flow integration, following the official upgrade guide from Frames to Flow.

## Features

- ✅ Complete Flow integration implementation
- ✅ Payment session creation
- ✅ Webhook handling
- ✅ Success/failure page handling  
- ✅ Content Security Policy configuration
- ✅ Error handling and logging
- ✅ Test card support

## Prerequisites

- Node.js (v14 or higher)
- Checkout.com account with API keys
- npm or yarn package manager

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` file and add your Checkout.com keys:
```bash
# Get these from your Checkout.com Dashboard
CHECKOUT_SECRET_KEY=sk_test_your_actual_secret_key_here
```

### 3. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

### 4. Open the Test Page

Navigate to http://localhost:3000 in your browser.

## Usage Instructions

### 1. Enter Your Public Key
- In the web interface, enter your Checkout.com public key (starts with `pk_test_`)
- Select the environment (Sandbox for testing)

### 2. Initialize Payment
- Click "Initialize Payment" to create a payment session
- The Flow component will load automatically

### 3. Test Payments
Use these test card numbers:

**Successful Payments:**
- `4242424242424242` (Visa)
- `4000000000000002` (Visa - requires 3DS)

**Failed Payments:**
- `4000000000000119` (Processing error)
- `4000000000000127` (Incorrect CVC)

**Card Details for Testing:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Name: Any name

## File Structure

```
checkout_flow_testing/
├── index.html          # Main payment page
├── script.js           # Client-side Flow integration
├── server.js           # Node.js backend server
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .env                # Your actual environment variables (create this)
└── README.md          # This file
```

## Key Implementation Details

### Client-Side Integration

1. **Flow Library**: Loaded from Checkout.com CDN
2. **Payment Session**: Retrieved from your server
3. **Flow Component**: Mounted to DOM container
4. **Event Handling**: Success, error, and redirect flows

### Server-Side Integration

1. **Payment Sessions**: Creates payment sessions via Checkout.com API
2. **Webhooks**: Handles payment status notifications
3. **Static Files**: Serves the web interface
4. **CORS**: Configured for local development

### Security Features

1. **Content Security Policy**: Configured for Checkout.com domains
2. **API Key Management**: Secret keys stored server-side only
3. **Environment Separation**: Sandbox/production configuration

## Testing Different Payment Flows

### Synchronous Payments
- Standard card payments that complete immediately
- Success handled via `onPaymentCompleted` callback

### Asynchronous Payments  
- 3D Secure authentication flows
- Redirect-based payment methods
- Success/failure pages handle the response

### Webhook Testing
- Monitor server logs for webhook events
- Use tools like ngrok for webhook testing with external services

## Troubleshooting

### Common Issues

1. **"Public key is required"**
   - Make sure to enter your public key in the web interface

2. **"Server configuration error: CHECKOUT_SECRET_KEY not found"**
   - Check your `.env` file has the correct secret key

3. **CORS errors**
   - Ensure you're accessing via http://localhost:3000, not file://

4. **Payment session creation fails**
   - Verify your secret key is valid and has correct scopes
   - Check server logs for detailed error messages

### Key Scopes Required

Your API keys need these scopes:
- **Public key**: `payment-sessions:pay` and `vault-tokenization`
- **Secret key**: `payment-sessions`

## API Endpoints

- `POST /create-payment-session` - Creates a new payment session
- `GET /payment/:paymentId` - Retrieves payment details
- `POST /webhook` - Handles Checkout.com webhooks
- `GET /health` - Health check endpoint

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use production API keys (starting with `sk_` and `pk_`)
3. Configure proper webhook URLs in Checkout.com Dashboard
4. Set up SSL/HTTPS for your domain
5. Update CSP headers for your production domain

## Support

- [Checkout.com Flow Documentation](https://www.checkout.com/docs/payments/accept-payments/upgrade-to-flow-from-frames/upgrade-from-frames-for-web)
- [Test Cards Reference](https://www.checkout.com/docs/testing/test-cards)
- [Checkout.com Dashboard](https://dashboard.checkout.com/)

## License

MIT License - See LICENSE file for details.
