document.addEventListener('DOMContentLoaded', function() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-labelledby', 'modalTitle');
    
    // Create modal content (image)
    const modalImg = document.createElement('img');
    modalImg.className = 'modal-content';
    modalImg.setAttribute('alt', 'Enlarged view');
    modalImg.setAttribute('tabindex', '0');
    modalImg.id = 'modalImage';
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'close-modal';
    closeBtn.setAttribute('tabindex', '0');
    closeBtn.setAttribute('role', 'button');
    closeBtn.setAttribute('aria-label', 'Close image view');
    
    // Add hidden title for screen readers
    const srTitle = document.createElement('span');
    srTitle.id = 'modalTitle';
    srTitle.className = 'sr-only';
    srTitle.textContent = 'Image Viewer';
    srTitle.style.position = 'absolute';
    srTitle.style.width = '1px';
    srTitle.style.height = '1px';
    srTitle.style.padding = '0';
    srTitle.style.margin = '-1px';
    srTitle.style.overflow = 'hidden';
    srTitle.style.clip = 'rect(0, 0, 0, 0)';
    srTitle.style.whiteSpace = 'nowrap';
    srTitle.style.border = '0';
    
    // Append elements to modal
    modal.appendChild(srTitle);
    modal.appendChild(closeBtn);
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Get the about image
    const aboutImg = document.querySelector('.about-image img');
    
    if (aboutImg) {
        // Add click event to about image
        aboutImg.addEventListener('click', function() {
            // Set the source of the modal image
            modalImg.src = this.src;
            modalImg.alt = this.alt || 'Enlarged view of ' + (this.alt || 'image');
            
            // Make sure modal is displayed
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Use setTimeout to ensure display:flex is applied before adding the active class
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Focus the modal image for keyboard navigation
            setTimeout(() => {
                modalImg.focus();
            }, 300);
        });
        
        // Add keyboard accessibility to about image
        aboutImg.setAttribute('tabindex', '0');
        aboutImg.setAttribute('role', 'button');
        aboutImg.setAttribute('aria-label', 'View larger image');
        aboutImg.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to the about image
        if (aboutImg) {
            setTimeout(() => {
                aboutImg.focus();
            }, 300);
        }
        
        // Wait for animation to finish before changing display
        setTimeout(() => {
            // Don't set display:none if modal was reopened during animation
            if (!modal.classList.contains('active')) {
                modal.style.display = '';
            }
        }, 300);
    }
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Add keyboard support for close button
    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeModal();
        }
    });
});
