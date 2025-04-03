require('isomorphic-fetch');
const express = require('express');
const cors = require('cors');
const { Client } = require('@microsoft/microsoft-graph-client');
const { ClientSecretCredential } = require('@azure/identity');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

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

app.post('/api/send-email', async (req, res) => {
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

        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            message: 'Failed to send email', 
            error: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});