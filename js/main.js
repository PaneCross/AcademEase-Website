// Main JavaScript file that imports all modules

// Import modules
import { initNavigation } from './modules/navigation.js';
import { initTestimonialSlider } from './modules/testimonials.js';
import { initContactForm } from './modules/contact-form.js';
import { initPhoneFormatter } from './modules/phone-formatter.js';
import { initTechShowcase } from './modules/tech-showcase.js';

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTestimonialSlider();
    initContactForm();
    initPhoneFormatter();
    initTechShowcase();
    
    // Other initialization code
    console.log('AcademEase website initialized');
});