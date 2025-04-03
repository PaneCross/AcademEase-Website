document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('Contact form not found!');
        return;
    }

    // Add status message div after the form
    const statusMessage = document.createElement('div');
    statusMessage.className = 'form-status';
    statusMessage.style.cssText = 'margin-top: 1rem; padding: 1rem; display: none;';
    contactForm.parentNode.insertBefore(statusMessage, contactForm.nextSibling);

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear any existing status messages
        statusMessage.style.display = 'none';
        statusMessage.textContent = '';
        
        // Capture form data before any processing
        const formData = {};
        const formElements = new FormData(contactForm);
        formElements.forEach((value, key) => {
            formData[key] = value.trim();
        });

        // Validate form data
        if (!formData.name || !formData.email || !formData.area || !formData.message) {
            statusMessage.style.display = 'block';
            statusMessage.style.color = '#dc3545';
            statusMessage.textContent = 'Please fill out all required fields';
            return;
        }

        try {
            console.log('Sending form data:', formData);
            
            const response = await fetch('https://academease-contact.azurewebsites.net/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await response.json();
            console.log('Server response:', responseData);

            if (response.ok) {
                console.log('Form submission successful');
                statusMessage.style.display = 'block';
                statusMessage.style.color = '#28a745';
                statusMessage.textContent = 'Thank you for your message. We will contact you soon!';
                contactForm.reset();
            } else {
                throw new Error(responseData.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error details:', error);
            statusMessage.style.display = 'block';
            statusMessage.style.color = '#dc3545';
            statusMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
        }
    });

    // Debug: Log form values on input change
    ['name', 'email', 'phone', 'area', 'message'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                console.log(`${id} current value:`, element.value);
            });
        }
    });
});