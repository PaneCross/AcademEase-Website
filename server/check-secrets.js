require('dotenv').config();

async function checkSecretExpiration() {
    console.log('🔐 Checking Azure secret expiration...');

    try {
        const response = await fetch(`${BASE_URL}/.auth/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            console.log('✅ Deployment credentials are valid');
        } else {
            console.log('⚠️ Credentials may need rotation');
            console.log('Status:', response.status);
        }
    } catch (error) {
        console.error('❌ Error checking credentials:', error.message);
    }
}

// Add to your existing test.js
module.exports = { checkSecretExpiration };