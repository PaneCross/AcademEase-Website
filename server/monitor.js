const fetch = require('node-fetch');
const logger = require('./utils/logger');

// Set console to silent mode to prevent popup windows
process.env.SILENT_CONSOLE = 'true';

async function checkHealth() {
    const BASE_URL = 'https://academease-contact-dherfjbsb7csh7c6.westus-01.azurewebsites.net';
    const timestamp = new Date().toISOString();

    try {
        const healthCheck = await fetch(BASE_URL);
        const healthData = await healthCheck.json();

        const emailCheck = await fetch(`${BASE_URL}/api/send-email`, {
            method: 'OPTIONS'
        });

        const status = {
            baseEndpoint: healthCheck.ok,
            emailEndpoint: emailCheck.ok,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            timestamp
        };

        if (!healthCheck.ok || !emailCheck.ok) {
            logger.warn('Partial system degradation', status);
        }

        return status;
    } catch (error) {
        const errorStatus = {
            error: error.message,
            timestamp,
            memoryUsage: process.memoryUsage()
        };
        logger.error('Health check failed', errorStatus);
        return false;
    }
}

// Add metrics collection
let healthMetrics = {
    successCount: 0,
    failureCount: 0,
    lastFailure: null,
    uptime: 0
};

// Adaptive interval configuration
const config = {
    baseInterval: 5 * 60 * 1000,  // 5 minutes
    maxInterval: 15 * 60 * 1000,  // 15 minutes
    minInterval: 1 * 60 * 1000,   // 1 minute
    currentInterval: 5 * 60 * 1000
};

let checkTimer;

function adjustInterval(status) {
    if (!status || !status.baseEndpoint) {
        // Problem detected - check more frequently
        config.currentInterval = config.minInterval;
    } else if (healthMetrics.successCount > 10) {
        // System stable - check less frequently
        config.currentInterval = Math.min(config.currentInterval * 1.5, config.maxInterval);
    }

    // Reset timer with new interval
    clearInterval(checkTimer);
    checkTimer = setInterval(runHealthCheck, config.currentInterval);
}

async function runHealthCheck() {
    const status = await checkHealth();
    if (status && status.baseEndpoint) {
        healthMetrics.successCount++;
        // Silent success - no logging needed
    } else {
        healthMetrics.failureCount++;
        healthMetrics.lastFailure = new Date().toISOString();
        
        // Log to file instead of console to prevent popups
        logger.error('Health check failed:', {
            failureCount: healthMetrics.failureCount,
            lastFailure: healthMetrics.lastFailure,
            status
        });
    }
    healthMetrics.uptime = process.uptime();
    adjustInterval(status);
}

// Start with base interval
checkTimer = setInterval(runHealthCheck, config.currentInterval);

// Initial check - silent
runHealthCheck().catch(error => {
    logger.error('Initial health check failed:', error);
});

// Export metrics for external monitoring
module.exports = {
    getMetrics: () => healthMetrics,
    checkHealth
};