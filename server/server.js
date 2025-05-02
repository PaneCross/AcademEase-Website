// Set silent console mode to prevent popup windows
process.env.SILENT_CONSOLE = 'true';
process.env.NODE_NO_WARNINGS = '1'; // Suppress Node.js warnings
// Override console methods that might trigger popups
const originalConsoleError = console.error;
console.error = (...args) => {
    if (process.env.SILENT_CONSOLE === 'true') {
        return;
    }
    originalConsoleError(...args);
};

require('isomorphic-fetch');
const express = require('express');
const cors = require('cors');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

// Prevent Windows Error Reporting dialogs
// Remove ffi-napi dependency as it might be causing issues
if (process.platform === 'win32') {
    try {
        // Use process.on approach instead of ffi
        process.env.NODE_OPTIONS = '--no-warnings';
    } catch (e) {
        logger.warn('Could not configure Windows error handling', e);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Add logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Simple placeholder route instead of health check
app.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

// Lazy-load Azure credentials only when needed
let credential = null;
async function getCredential() {
    if (!credential) {
        credential = new ClientSecretCredential(
            process.env.TENANT_ID,
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );
    }
    return credential;
}

// Only initialize graph client when sending email
async function getGraphClient() {
    try {
        const cred = await getCredential();
        const token = await cred.getToken(['https://graph.microsoft.com/.default']);
        return Client.init({
            authProvider: (done) => {
                done(null, token.token);
            },
            debugLogging: false
        });
    } catch (error) {
        logger.error('Error initializing Graph client:', error);
        throw error;
    }
}

// Email endpoint
app.post('/api/send-email', async (req, res) => {
    const timestamp = new Date().toISOString();
    logger.info(`Received email request from: ${req.body.email}`);
    try {
        const { name, email, phone, area, message } = req.body;
        const graphClient = await getGraphClient();

        const mailBody = {
            message: {
                subject: 'New Contact Form Submission - AcademEase',
                body: {
                    contentType: 'HTML',
                    content: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Area:</strong> ${area}</p>
                        <p><strong>Message:</strong> ${message}</p>
                    `
                },
                toRecipients: [
                    { emailAddress: { address: 'tj@acdmease.com' } },
                    { emailAddress: { address: 'eduardo@acdmease.com' } },
                    { emailAddress: { address: 'charles@acdmease.com' } }
                ]
            }
        };

        await graphClient
            .api('/users/tj@acdmease.com/sendMail')
            .post(mailBody);

        logger.info(`Email sent successfully to multiple recipients`);
        res.json({ 
            success: true, 
            message: 'Email sent successfully',
            timestamp: timestamp
        });
    } catch (error) {
        logger.error(`Email error:`, { error: error.message, stack: error.stack, timestamp });
        res.status(500).json({ 
            success: false, 
            message: error.message,
            timestamp: timestamp
        });
    }
});

// Enhanced error monitoring middleware
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const errorLog = {
        timestamp,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    };
    
    logger.error('Application error:', errorLog);
    next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', { message: err.message });
    res.status(500).json({ 
        success: false, 
        message: process.env.NODE_ENV === 'production' 
            ? 'An unexpected error occurred' 
            : err.message 
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Performing graceful shutdown...');
    server.close(() => {
        logger.info('Server closed. Exiting process.');
        process.exit(0);
    });
});

// Handle uncaught exceptions and unhandled rejections to prevent popups
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { message: error.message });
    // Don't exit the process to keep the application running
});

process.on('unhandledRejection', (reason, promise) => {
    let reasonMessage = reason;
    if (reason instanceof Error) {
        reasonMessage = reason.message;
    }
    logger.error('Unhandled Rejection:', { reason: reasonMessage });
    // Don't exit the process to keep the application running
});

// Disable Node.js debugging that might trigger popups
process.traceDeprecation = false;
process.throwDeprecation = false;

// Add additional popup prevention
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Prevent SSL certificate popups

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});