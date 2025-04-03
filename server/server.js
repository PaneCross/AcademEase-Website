require('isomorphic-fetch');
const express = require('express');
const cors = require('cors');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
const fs = require('fs').promises;
const path = require('path');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

// Health check endpoint with detailed status
app.get('/', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    };
    res.json(health);
});

// Configure Microsoft Graph client
const credential = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
);

async function getGraphClient() {
    const token = await credential.getToken(['https://graph.microsoft.com/.default']);
    return Client.init({
        authProvider: (done) => {
            done(null, token.token);
        }
    });
}

// Email endpoint
app.post('/api/send-email', async (req, res) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Received email request from: ${req.body.email}`);
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
                    { emailAddress: { address: 'tj@acdmease.com' } }
                ]
            }
        };

        await graphClient
            .api('/users/tj@acdmease.com/sendMail')
            .post(mailBody);

        console.log(`[${timestamp}] Email sent successfully to: tj@acdmease.com`);
        res.json({ 
            success: true, 
            message: 'Email sent successfully',
            timestamp: timestamp
        });
    } catch (error) {
        console.error(`[${timestamp}] Email error:`, error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            timestamp: timestamp
        });
    }
});

// Error monitoring middleware
app.use((err, req, res, next) => {
    const timestamp = new Date().toISOString();
    const errorLog = {
        timestamp,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        headers: req.headers
    };
    
    logger.error('Application error:', errorLog);
    next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});