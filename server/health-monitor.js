const fetch = require('node-fetch');

async function checkApiHealth() {
    const BASE_URL = 'https://academease-contact-dherfjbsb7csh7c6.westus-01.azurewebsites.net';
    const timestamp = new Date().toISOString();

    try {
        const response = await fetch(`${BASE_URL}/`);
        const status = response.ok ? '✅' : '❌';
        console.log(`[${timestamp}] API Health ${status} (${response.status})`);
        return response.ok;
    } catch (error) {
        console.error(`[${timestamp}] ❌ API Error:`, error.message);
        return false;
    }
}

// Run every 6 hours
setInterval(checkApiHealth, 6 * 60 * 60 * 1000);
checkApiHealth();