require('dotenv').config();
const { checkSecretExpiration } = require('./check-secrets');

/**
 * Test data for email submissions
 */
const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    area: "San Diego",
    message: "This is a final test message"
};

const BASE_URL = 'https://academease-contact-dherfjbsb7csh7c6.westus-01.azurewebsites.net';

/**
 * Checks API endpoint availability and status
 */
async function checkPaths() {
    const paths = [
        { path: '/', method: 'GET', expectedStatus: 200 },
        { path: '/api/send-email', method: 'POST', expectedStatus: 200 }
    ];

    console.log('🔍 Checking API endpoints...\n');

    for (const { path, method, expectedStatus } of paths) {
        try {
            const response = await fetch(BASE_URL + path, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            const status = `${response.status} ${response.statusText}`;
            const icon = response.status === expectedStatus ? '✅' : '⚠️';
            
            console.log(`${icon} ${method} ${path}:`);
            console.log(`   Status: ${status}`);
        } catch (error) {
            console.error(`❌ ${method} ${path} error:`, error.message);
        }
    }
}

/**
 * Tests the email submission endpoint
 */
async function testEmailEndpoint() {
    try {
        console.log('\n📧 Testing email submission...');
        console.log('Request:', testData);

        const response = await fetch(`${BASE_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData)
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            console.log('\n✅ Test successful!');
            console.log('Status:', response.status);
            console.log('Response:', data);
        } else {
            console.log('\n⚠️ Test completed with warnings');
            console.log('Status:', response.status);
            console.log('Response:', data);
        }
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting API tests...\n');
    await checkSecretExpiration();
    await checkPaths();
    await testEmailEndpoint();
    console.log('\n✨ Tests completed!');
}

runTests();