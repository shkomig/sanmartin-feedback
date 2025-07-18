// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language first
    initializeLanguage();
    
    const form = document.getElementById('satisfactionForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const surveyData = {
            timestamp: new Date().toISOString(),
            overall: formData.get('overall'),
            food: formData.get('food'),
            service: formData.get('service'),
            recommend: formData.get('recommend'),
            comments: formData.get('comments') || ''
        };
        
        // Store data in localStorage
        storeSurveyData(surveyData);
        
        // Show thank you message
        showThankYouMessage();
        
        // Reset form
        form.reset();
    });
    
    // Add smooth transitions to radio buttons
    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Add ripple effect
            createRipple(this, event);
        });
    });
    
    // Initialize language
    initializeLanguage();
});

// Language Support
let currentLanguage = 'en';

const translations = {
    en: {
        title: 'Customer Satisfaction Survey',
        question1: 'How would you rate your overall experience?',
        question2: 'How would you rate the food quality?',
        question3: 'How would you rate the service?',
        question4: 'Would you recommend us to others?',
        commentsLabel: 'Additional Comments (Optional):',
        commentsPlaceholder: 'Please share any additional feedback...',
        submitBtn: 'Submit Survey',
        dashboardLink: 'View Dashboard',
        thankYouTitle: 'Thank You!',
        thankYouText: 'Your feedback has been successfully submitted. We appreciate your time and input!',
        anotherResponseBtn: 'Submit Another Response',
        langBtn: 'עברית'
    },
    he: {
        title: 'סקר שביעות רצון לקוחות',
        question1: 'איך היית מדרג את החוויה הכללית שלך?',
        question2: 'איך היית מדרג את איכות האוכל?',
        question3: 'איך היית מדרג את השירות?',
        question4: 'האם היית ממליץ עלינו לאחרים?',
        commentsLabel: 'הערות נוספות (אופציונלי):',
        commentsPlaceholder: 'אנא שתף אותנו במשוב נוסף...',
        submitBtn: 'שלח סקר',
        dashboardLink: 'צפה בדשבורד',
        thankYouTitle: 'תודה רבה!',
        thankYouText: 'המשוב שלך נשלח בהצלחה. אנו מעריכים את הזמן והקלט שלך!',
        anotherResponseBtn: 'שלח תגובה נוספת',
        langBtn: 'English'
    }
};

/**
 * Toggle between English and Hebrew languages
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'he' : 'en';
    updateLanguage();
}

/**
 * Update all text content based on current language
 */
function updateLanguage() {
    const html = document.documentElement;
    const lang = translations[currentLanguage];
    
    // Update HTML direction and lang attributes
    html.setAttribute('dir', currentLanguage === 'he' ? 'rtl' : 'ltr');
    html.setAttribute('lang', currentLanguage === 'he' ? 'he' : 'en');
    
    // Update main content
    document.getElementById('mainTitle').textContent = lang.title;
    document.getElementById('question1').textContent = lang.question1;
    document.getElementById('question2').textContent = lang.question2;
    document.getElementById('question3').textContent = lang.question3;
    document.getElementById('question4').textContent = lang.question4;
    document.getElementById('commentsLabel').textContent = lang.commentsLabel;
    document.getElementById('comments').placeholder = lang.commentsPlaceholder;
    document.getElementById('submitBtn').textContent = lang.submitBtn;
    document.getElementById('dashboardLink').textContent = lang.dashboardLink;
    document.getElementById('thankYouTitle').textContent = lang.thankYouTitle;
    document.getElementById('thankYouText').textContent = lang.thankYouText;
    document.getElementById('anotherResponseBtn').textContent = lang.anotherResponseBtn;
    document.getElementById('langBtn').textContent = lang.langBtn;
    
    // Update radio button options
    const optionTexts = document.querySelectorAll('.option-text');
    optionTexts.forEach(element => {
        const key = currentLanguage === 'he' ? 'data-he' : 'data-en';
        element.textContent = element.getAttribute(key);
    });
    
    // Save language preference
    localStorage.setItem('sodexoLanguage', currentLanguage);
}

/**
 * Initialize language on page load
 */
function initializeLanguage() {
    // Get saved language preference or default to English
    const savedLanguage = localStorage.getItem('sodexoLanguage') || 'en';
    currentLanguage = savedLanguage;
    updateLanguage();
}

/**
 * Store survey data in localStorage
 * @param {Object} surveyData - The survey response data
 */
function storeSurveyData(surveyData) {
    try {
        // Get existing data or initialize empty array
        let existingData = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
        
        // Add new response
        existingData.push(surveyData);
        
        // Store back in localStorage
        localStorage.setItem('sodexoSurveyData', JSON.stringify(existingData));
        
        console.log('Survey data stored successfully:', surveyData);
    } catch (error) {
        console.error('Error storing survey data:', error);
        alert('There was an error saving your response. Please try again.');
    }
}

/**
 * Show thank you message and hide form
 */
function showThankYouMessage() {
    const form = document.getElementById('satisfactionForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Hide form with fade out effect
    form.style.opacity = '0';
    form.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        form.style.display = 'none';
        thankYouMessage.style.display = 'block';
        thankYouMessage.style.opacity = '0';
        thankYouMessage.style.transform = 'translateY(20px)';
        
        // Animate thank you message in
        setTimeout(() => {
            thankYouMessage.style.transition = 'all 0.5s ease';
            thankYouMessage.style.opacity = '1';
            thankYouMessage.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

/**
 * Reset form and show it again
 */
function resetForm() {
    const form = document.getElementById('satisfactionForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Hide thank you message
    thankYouMessage.style.opacity = '0';
    thankYouMessage.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        thankYouMessage.style.display = 'none';
        form.style.display = 'block';
        form.style.opacity = '0';
        form.style.transform = 'translateY(20px)';
        
        // Animate form in
        setTimeout(() => {
            form.style.transition = 'all 0.5s ease';
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
}

/**
 * Create ripple effect on button click
 * @param {Element} element - The element to add ripple effect to
 * @param {Event} event - The click event
 */
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(25, 118, 210, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
        if (element.querySelectorAll('span').length === 0) {
            style.remove();
        }
    }, 600);
}

/**
 * Get survey statistics for dashboard
 * @returns {Object} Statistics object
 */
function getSurveyStats() {
    try {
        const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
        
        if (data.length === 0) {
            return {
                totalResponses: 0,
                averageRatings: {},
                recommendations: {},
                recentResponses: []
            };
        }
        
        const stats = {
            totalResponses: data.length,
            averageRatings: {},
            recommendations: {},
            recentResponses: data.slice(-5).reverse() // Last 5 responses
        };
        
        // Calculate averages for each category
        const categories = ['overall', 'food', 'service'];
        const ratingValues = { excellent: 4, good: 3, average: 2, poor: 1 };
        
        categories.forEach(category => {
            const sum = data.reduce((acc, response) => {
                return acc + (ratingValues[response[category]] || 0);
            }, 0);
            stats.averageRatings[category] = (sum / data.length).toFixed(1);
        });
        
        // Calculate recommendation distribution
        const recommendCounts = data.reduce((acc, response) => {
            acc[response.recommend] = (acc[response.recommend] || 0) + 1;
            return acc;
        }, {});
        
        stats.recommendations = recommendCounts;
        
        return stats;
    } catch (error) {
        console.error('Error calculating stats:', error);
        return {
            totalResponses: 0,
            averageRatings: {},
            recommendations: {},
            recentResponses: []
        };
    }
}

/**
 * Export data as CSV
 */
function exportDataAsCSV() {
    try {
        const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
        
        if (data.length === 0) {
            alert('No data to export');
            return;
        }
        
        // Create CSV content
        const headers = ['Timestamp', 'Overall', 'Food', 'Service', 'Recommend', 'Comments'];
        const csvContent = [
            headers.join(','),
            ...data.map(row => [
                row.timestamp,
                row.overall,
                row.food,
                row.service,
                row.recommend,
                `"${(row.comments || '').replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sodexo-survey-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error exporting data. Please try again.');
    }
}

/**
 * Clear all survey data
 */
function clearSurveyData() {
    if (confirm('Are you sure you want to clear all survey data? This action cannot be undone.')) {
        localStorage.removeItem('sodexoSurveyData');
        alert('All survey data has been cleared.');
        
        // Refresh dashboard if on dashboard page
        if (window.location.pathname.includes('dashboard.html')) {
            location.reload();
        }
    }
}

// Make functions available globally for dashboard
window.getSurveyStats = getSurveyStats;
window.exportDataAsCSV = exportDataAsCSV;
window.clearSurveyData = clearSurveyData;
