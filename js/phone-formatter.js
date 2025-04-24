document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        // Format as the user types
        phoneInput.addEventListener('input', function(e) {
            // Get only the digits from the input
            let digits = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            digits = digits.substring(0, 10);
            
            // Format the phone number
            let formattedNumber = '';
            if (digits.length > 0) {
                // Add opening parenthesis for area code
                formattedNumber = '(' + digits.substring(0, 3);
                
                if (digits.length > 3) {
                    // Add closing parenthesis and space after area code
                    formattedNumber += ') ' + digits.substring(3, 6);
                    
                    if (digits.length > 6) {
                        // Add hyphen after exchange code
                        formattedNumber += '-' + digits.substring(6, 10);
                    }
                }
            }
            
            // Set the formatted value
            e.target.value = formattedNumber;
        });
        
        // Format on initial load or autofill
        phoneInput.addEventListener('blur', function(e) {
            // Get only the digits from the input
            let digits = e.target.value.replace(/\D/g, '');
            
            // If we have digits, format them
            if (digits.length > 0) {
                // Format phone number
                let formattedNumber = '';
                
                // Add area code with parentheses
                formattedNumber = '(' + digits.substring(0, Math.min(3, digits.length));
                
                if (digits.length > 3) {
                    // Add closing parenthesis and space
                    formattedNumber += ') ' + digits.substring(3, Math.min(6, digits.length));
                    
                    if (digits.length > 6) {
                        // Add hyphen
                        formattedNumber += '-' + digits.substring(6, Math.min(10, digits.length));
                    }
                }
                
                e.target.value = formattedNumber;
            }
        });
        
        // Ensure the form submission uses the raw number
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // Get the form data
                const phoneValue = phoneInput.value;
                
                // Store the raw digits for submission
                const rawDigits = phoneValue.replace(/\D/g, '');
                
                // You can either:
                // 1. Update the input with raw digits before submitting
                // phoneInput.value = rawDigits;
                
                // 2. Or create a hidden field for the raw digits
                // This allows keeping the formatted display while submitting raw digits
                const hiddenPhone = document.createElement('input');
                hiddenPhone.type = 'hidden';
                hiddenPhone.name = 'rawPhone';
                hiddenPhone.value = rawDigits;
                contactForm.appendChild(hiddenPhone);
            });
        }
    }
});
