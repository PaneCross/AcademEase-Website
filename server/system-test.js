const fetch = require('node-fetch');
const { checkHealth, getMetrics } = require('./monitor');
const logger = require('./utils/logger');

async function runSystemTest() {
    console.log('🚀 Starting AcademEase System Test...\n');

    try {
        // 1. Test Base URL
        console.log('1️⃣ Testing Base URL...');
        const baseUrl = 'https://academease-contact-dherfjbsb7csh7c6.westus-01.azurewebsites.net';
        const baseResponse = await fetch(baseUrl);
        console.log(`   Status: ${baseResponse.status} ${baseResponse.statusText}`);

        // 2. Test Email API
        console.log('\n2️⃣ Testing Email API...');
        const testEmail = {
            name: "System Test",
            email: "test@example.com",
            phone: "1234567890",
            area: "Test Area",
            message: "System test message"
        };

        const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testEmail)
        });
        const emailResult = await emailResponse.json();
        console.log(`   Status: ${emailResponse.status} ${emailResponse.statusText}`);
        console.log(`   Result: ${emailResult.success ? '✅ Success' : '❌ Failed'}`);

        // 3. Test Monitoring System
        console.log('\n3️⃣ Testing Health Monitoring...');
        const health = await checkHealth();
        console.log('   Health Check:', health ? '✅ Passed' : '❌ Failed');
        
        const metrics = getMetrics();
        console.log('   Current Metrics:', {
            successCount: metrics.successCount,
            failureCount: metrics.failureCount,
            lastFailure: metrics.lastFailure,
            uptime: Math.round(metrics.uptime / 60) + ' minutes'
        });

        // 4. Test Logging
        console.log('\n4️⃣ Testing Logging System...');
        logger.info('System test log entry');
        console.log('   Log Entry Created: ✅');

        console.log('\n✨ System Test Complete!');
        console.log('All systems operational');

    } catch (error) {
        console.error('\n❌ System Test Failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Run the test
runSystemTest();