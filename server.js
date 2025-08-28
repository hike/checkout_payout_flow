const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// For Node.js 18+ fetch is available globally
// If you're using an older version, uncomment the line below:
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';
const apiBaseUrl = isProduction 
    ? 'https://api.checkout.com' 
    : 'https://api.sandbox.checkout.com';

// Route for card storage using internal API
app.get('/saveCardInfo/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    
    try {
        // Call internal API to get session data
        const apiResponse = await fetch('http://payments-api-int.rushstaging.com:8080/v1/payment/session/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'serviceId': 'CS',
                'serviceSecret': 'HGF$%^83'
            },
            body: JSON.stringify({
                metadata: {
                    sessionId: sessionId
                },
                pgType: 'CHECKOUT'
            })
        });

        if (!apiResponse.ok) {
            throw new Error(`Internal API error: ${apiResponse.status}`);
        }

        const sessionData = await apiResponse.json();
        
        console.log('Session data retrieved from internal API:', sessionData);

        // Check if the API call was successful
        if (!sessionData.success) {
            throw new Error(`Internal API returned error: ${sessionData.message}`);
        }

        // Serve HTML page with session data
        res.send(generateSaveCardInfoHTML(sessionData.data, sessionId));

    } catch (error) {
        console.error('Error calling internal API:', error);
        res.status(500).send(generateErrorHTML(error.message));
    }
});

// Simple template rendering function
function renderTemplate(templatePath, data = {}) {
    try {
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        let rendered = templateContent;
        
        // Replace template variables
        for (const [key, value] of Object.entries(data)) {
            const placeholder = `{{${key}}}`;
            const replacement = typeof value === 'object' ? JSON.stringify(value) : value;
            rendered = rendered.replace(new RegExp(placeholder, 'g'), replacement);
        }
        
        return rendered;
    } catch (error) {
        console.error('Error rendering template:', error);
        throw new Error('Template rendering failed');
    }
}

// Helper function to generate HTML for card info page
function generateSaveCardInfoHTML(sessionData, sessionId) {
    const publicKey = process.env.CHECKOUT_PUBLIC_KEY;
    const environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
    
    return renderTemplate(path.join(__dirname, 'templates', 'payment-form.html'), {
        SESSION_DATA: sessionData,
        PUBLIC_KEY: publicKey,
        ENVIRONMENT: environment
    });
}

// Helper function to generate error HTML
function generateErrorHTML(errorMessage) {
    return renderTemplate(path.join(__dirname, 'templates', 'error.html'), {
        ERROR_MESSAGE: errorMessage
    });
}


// Start server
app.listen(port, () => {
    console.log(`Checkout.com Flow test server running on port ${port}`);
    console.log(`Environment: ${isProduction ? 'production' : 'sandbox'}`);
    console.log(`API Base URL: ${apiBaseUrl}`);
    console.log(`\nMake sure to set your CHECKOUT_SECRET_KEY in the .env file!`);
    console.log(`Open http://localhost:${port} to test the integration`);
});

module.exports = app;
