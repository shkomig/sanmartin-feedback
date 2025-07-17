// Enhanced Dashboard functionality

const dashboardTranslations = {
    en: {
        dashboardTitle: 'Survey Dashboard',
        backLink: '← Back to Survey',
        refreshBtn: '🔄 Refresh',
        totalResponsesLabel: 'Total Responses',
        overallAvgLabel: 'Overall Average',
        foodAvgLabel: 'Food Average',
        serviceAvgLabel: 'Service Average',
        ratingDistributionTitle: 'Rating Distribution',
        recommendationDistributionTitle: 'Recommendation Distribution',
        surveyResponsesTitle: 'Survey Responses',
        exportCsvBtn: '📥 Export CSV',
        clearDataBtn: '🗑️ Clear Data',
        recentCommentsTitle: 'Recent Comments',
        langBtn: 'עברית',
        noDataAvailable: 'No data available',
        noComments: 'No comments yet',
        noSurveyResponses: 'No survey responses yet',
        refreshingText: 'Refreshing...',
        refreshSuccess: 'Dashboard refreshed successfully!',
        analyticsReportBtn: '📊 Analytics Report',
        passwordModalTitle: 'Dashboard Access',
        passwordModalText: 'Please enter the password to view dashboard data:',
        submitBtn: 'Submit',
        cancelBtn: 'Cancel',
        passwordSuccess: 'Access granted!',
        passwordError: 'Incorrect password!',
        loadError: 'Error loading dashboard data'
    },
    he: {
        dashboardTitle: 'דשבורד סקרים',
        backLink: '← חזור לסקר',
        refreshBtn: '🔄 רענן',
        totalResponsesLabel: 'סה״כ תגובות',
        overallAvgLabel: 'ממוצע כללי',
        foodAvgLabel: 'ממוצע אוכל',
        serviceAvgLabel: 'ממוצע שירות',
        ratingDistributionTitle: 'התפלגות דירוגים',
        recommendationDistributionTitle: 'התפלגות המלצות',
        surveyResponsesTitle: 'תגובות סקר',
        exportCsvBtn: '📥 ייצא CSV',
        clearDataBtn: '🗑️ נקה נתונים',
        recentCommentsTitle: 'הערות אחרונות',
        langBtn: 'English',
        noDataAvailable: 'אין נתונים זמינים',
        noComments: 'אין הערות עדיין',
        noSurveyResponses: 'אין תגובות סקר עדיין',
        refreshingText: 'מרענן...',
        refreshSuccess: 'הדשבורד רוענן בהצלחה!',
        analyticsReportBtn: '📊 דוח אנליטיקה',
        passwordModalTitle: 'גישה לדשבורד',
        passwordModalText: 'אנא הזן את הסיסמה לצפייה בנתוני הדשבורד:',
        submitBtn: 'שלח',
        cancelBtn: 'ביטול',
        passwordSuccess: 'גישה אושרה!',
        passwordError: 'סיסמה שגויה!',
        loadError: 'שגיאה בטעינת נתוני הדשבורד'
    }
};

/**
 * Toggle between English and Hebrew languages for dashboard
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'he' : 'en';
    updateDashboardLanguage();
}

/**
 * Update dashboard language
 */
function updateDashboardLanguage() {
    const html = document.documentElement;
    const lang = dashboardTranslations[currentLanguage];
    
    // Update HTML direction and lang attributes
    html.setAttribute('dir', currentLanguage === 'he' ? 'rtl' : 'ltr');
    html.setAttribute('lang', currentLanguage === 'he' ? 'he' : 'en');
    
    // Update dashboard content
    const elements = {
        'dashboardTitle': lang.dashboardTitle,
        'backLink': lang.backLink,
        'totalResponsesLabel': lang.totalResponsesLabel,
        'overallAvgLabel': lang.overallAvgLabel,
        'foodAvgLabel': lang.foodAvgLabel,
        'serviceAvgLabel': lang.serviceAvgLabel,
        'langBtn': lang.langBtn,
        'ratingDistributionTitle': lang.ratingDistributionTitle,
        'recommendationDistributionTitle': lang.recommendationDistributionTitle,
        'surveyResponsesTitle': lang.surveyResponsesTitle,
        'recentCommentsTitle': lang.recentCommentsTitle
    };
    
    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    });
    
    // Update refresh button HTML
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.innerHTML = lang.refreshBtn;
    
    // Update action buttons
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.innerHTML = lang.exportCsvBtn;
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.innerHTML = lang.clearDataBtn;
    
    // Update analytics report button if it exists
    const analyticsBtn = document.querySelector('.action-btn[onclick="generateAnalyticsReport()"]');
    if (analyticsBtn) analyticsBtn.innerHTML = lang.analyticsReportBtn;
    
    // Save language preference
    localStorage.setItem('sodexoLanguage', currentLanguage);
}

/**
 * Initialize dashboard language
 */
function initializeDashboardLanguage() {
    const savedLanguage = localStorage.getItem('sodexoLanguage') || 'en';
    currentLanguage = savedLanguage;
    updateDashboardLanguage();
}

// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language first
    initializeDashboardLanguage();
    
    // Check if user needs to authenticate
    const savedAuth = sessionStorage.getItem('dashboardAuth');
    if (savedAuth === 'true') {
        isAuthenticated = true;
        loadDashboard();
    } else {
        // Show password modal after a short delay for better UX
        setTimeout(() => {
            showPasswordModal();
        }, 500);
    }
});

/**
 * Load and display dashboard data
 */
function loadDashboard() {
    if (!isAuthenticated) {
        showPasswordModal();
        return;
    }
    
    try {
        const stats = getSurveyStats();
        
        // Show loading state
        showLoadingState();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            // Update statistics cards
            updateStatistics(stats);
            
            // Update charts
            updateRatingChart(stats);
            updateRecommendationChart(stats);
            
            // Update data table
            updateDataTable();
            
            // Update comments section
            updateComments(stats);
            
            // Hide loading state
            hideLoadingState();
            
            // Add fade-in animation
            animateDashboardElements();
            
            // Update language-specific content
            updateDashboardLanguage();
            
        }, 800);
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showNotification(dashboardTranslations[currentLanguage].loadError || 'Error loading dashboard data', 'error');
        hideLoadingState();
    }
}

/**
 * Password protection and data security
 */
const DASHBOARD_PASSWORD = 'sodexo2025';
let isAuthenticated = false;

/**
 * Show password modal for dashboard access
 */
function showPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'password-modal';
    modal.innerHTML = `
        <div class="password-modal-content">
            <h2 id="passwordModalTitle">Dashboard Access</h2>
            <p id="passwordModalText">Please enter the password to view dashboard data:</p>
            <input type="password" id="passwordInput" placeholder="Enter password">
            <div style="margin-top: 20px;">
                <button onclick="checkPassword()" id="submitPasswordBtn">Submit</button>
                <button onclick="closePasswordModal()" class="cancel-btn" id="cancelPasswordBtn">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('passwordInput').focus();
    
    // Allow Enter key to submit
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Update modal text based on current language
    updatePasswordModalLanguage();
}

/**
 * Check if entered password is correct
 */
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const enteredPassword = passwordInput.value;
    
    if (enteredPassword === DASHBOARD_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem('dashboardAuth', 'true');
        closePasswordModal();
        loadDashboard();
        showNotification(dashboardTranslations[currentLanguage].passwordSuccess || 'Access granted!', 'success');
    } else {
        passwordInput.style.borderColor = '#f44336';
        passwordInput.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            passwordInput.style.borderColor = '#e0e0e0';
            passwordInput.style.animation = '';
            passwordInput.value = '';
            passwordInput.focus();
        }, 500);
        
        showNotification(dashboardTranslations[currentLanguage].passwordError || 'Incorrect password!', 'error');
    }
}

/**
 * Close password modal
 */
function closePasswordModal() {
    const modal = document.querySelector('.password-modal');
    if (modal) {
        modal.remove();
    }
    
    if (!isAuthenticated) {
        window.location.href = 'index.html';
    }
}

/**
 * Update password modal language
 */
function updatePasswordModalLanguage() {
    const lang = dashboardTranslations[currentLanguage];
    const modal = document.querySelector('.password-modal');
    if (modal) {
        const title = modal.querySelector('#passwordModalTitle');
        const text = modal.querySelector('#passwordModalText');
        const submitBtn = modal.querySelector('#submitPasswordBtn');
        const cancelBtn = modal.querySelector('#cancelPasswordBtn');
        
        if (title) title.textContent = lang.passwordModalTitle || 'Dashboard Access';
        if (text) text.textContent = lang.passwordModalText || 'Please enter the password to view dashboard data:';
        if (submitBtn) submitBtn.textContent = lang.submitBtn || 'Submit';
        if (cancelBtn) cancelBtn.textContent = lang.cancelBtn || 'Cancel';
    }
}

/**
 * Show loading state for dashboard elements
 */
function showLoadingState() {
    const sections = ['.stats-overview', '.charts-section', '.data-section', '.comments-section'];
    
    sections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="loading-spinner"></div>';
            section.style.position = 'relative';
            section.appendChild(overlay);
        }
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => {
        overlay.remove();
    });
}

/**
 * Animate dashboard elements on load
 */
function animateDashboardElements() {
    const elements = document.querySelectorAll('.stat-card, .chart-container, .data-section, .comments-section');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

/**
 * Enhanced update statistics with better data validation
 */
function updateStatistics(stats) {
    try {
        const totalElement = document.getElementById('totalResponses');
        const overallElement = document.getElementById('overallAvg');
        const foodElement = document.getElementById('foodAvg');
        const serviceElement = document.getElementById('serviceAvg');
        
        if (totalElement) {
            animateNumber(totalElement, 0, stats.totalResponses, 1000);
        }
        
        if (overallElement) {
            animateNumber(overallElement, 0, parseFloat(stats.averageRatings.overall || 0), 1000, 1);
        }
        
        if (foodElement) {
            animateNumber(foodElement, 0, parseFloat(stats.averageRatings.food || 0), 1000, 1);
        }
        
        if (serviceElement) {
            animateNumber(serviceElement, 0, parseFloat(stats.averageRatings.service || 0), 1000, 1);
        }
        
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

/**
 * Animate number changes for better visual feedback
 */
function animateNumber(element, start, end, duration, decimals = 0) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * easeOutCubic(progress);
        element.textContent = current.toFixed(decimals);
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = end.toFixed(decimals);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

/**
 * Easing function for smooth animations
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * Enhanced data table update with better performance
 */
function updateDataTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    try {
        const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
        
        if (data.length === 0) {
            const lang = dashboardTranslations[currentLanguage];
            tableBody.innerHTML = `<tr><td colspan="6" class="no-data">${lang.noSurveyResponses || 'No survey responses yet'}</td></tr>`;
            return;
        }
        
        // Sort by timestamp (newest first)
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Create table rows with proper language support
        const tableHTML = sortedData.map((response, index) => {
            const date = new Date(response.timestamp);
            const formattedDate = date.toLocaleDateString(currentLanguage === 'he' ? 'he-IL' : 'en-US') + 
                                ' ' + date.toLocaleTimeString(currentLanguage === 'he' ? 'he-IL' : 'en-US');
            
            const ratingTranslations = {
                en: { excellent: 'Excellent', good: 'Good', average: 'Average', poor: 'Poor' },
                he: { excellent: 'מעולה', good: 'טוב', average: 'בינוני', poor: 'גרוע' }
            };
            
            const recommendTranslations = {
                en: { definitely: 'Definitely', probably: 'Probably', maybe: 'Maybe', no: 'No' },
                he: { definitely: 'בהחלט', probably: 'כנראה', maybe: 'אולי', no: 'לא' }
            };
            
            return `
                <tr style="animation: fadeInRow 0.5s ease ${index * 0.1}s both;">
                    <td>${formattedDate}</td>
                    <td><span class="rating-badge rating-${response.overall}">${ratingTranslations[currentLanguage][response.overall] || response.overall}</span></td>
                    <td><span class="rating-badge rating-${response.food}">${ratingTranslations[currentLanguage][response.food] || response.food}</span></td>
                    <td><span class="rating-badge rating-${response.service}">${ratingTranslations[currentLanguage][response.service] || response.service}</span></td>
                    <td><span class="rating-badge rating-${response.recommend}">${recommendTranslations[currentLanguage][response.recommend] || response.recommend}</span></td>
                    <td>${response.comments ? `<span title="${response.comments}">${response.comments.substring(0, 50)}${response.comments.length > 50 ? '...' : ''}</span>` : '-'}</td>
                </tr>
            `;
        }).join('');
        
        tableBody.innerHTML = tableHTML;
        
        // Add CSS for row animation
        if (!document.getElementById('tableAnimationStyles')) {
            const style = document.createElement('style');
            style.id = 'tableAnimationStyles';
            style.textContent = `
                @keyframes fadeInRow {
                    from {
                        opacity: 0;
                        transform: translateX(${currentLanguage === 'he' ? '30px' : '-30px'});
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }
        
    } catch (error) {
        console.error('Error updating data table:', error);
        const lang = dashboardTranslations[currentLanguage];
        tableBody.innerHTML = `<tr><td colspan="6" class="no-data">${lang.loadError || 'Error loading data'}</td></tr>`;
    }
}

/**
 * Update rating distribution chart
 */
function updateRatingChart(stats) {
    const chartBars = document.getElementById('chartBars');
    
    if (stats.totalResponses === 0) {
        chartBars.innerHTML = '<div class="no-data">No data available</div>';
        return;
    }
    
    const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
    const categories = ['overall', 'food', 'service'];
    const ratings = ['excellent', 'good', 'average', 'poor'];
    const colors = ['#4caf50', '#8bc34a', '#ff9800', '#f44336'];
    
    let chartHTML = '';
    
    categories.forEach(category => {
        const categoryData = ratings.map(rating => {
            return data.filter(response => response[category] === rating).length;
        });
        
        const maxValue = Math.max(...categoryData);
        const categoryHTML = categoryData.map((count, index) => {
            const height = maxValue > 0 ? (count / maxValue) * 100 : 0;
            return `
                <div class="chart-bar" style="height: ${height}%; background: ${colors[index]};" title="${ratings[index]}: ${count} responses">
                    <span class="chart-bar-value">${count}</span>
                    <span class="chart-bar-label">${ratings[index]}</span>
                </div>
            `;
        }).join('');
        
        chartHTML += `
            <div class="category-group">
                <h4 style="text-align: center; margin-bottom: 10px; color: #1976d2; text-transform: capitalize;">${category}</h4>
                <div style="display: flex; gap: 5px; align-items: end; height: 120px;">
                    ${categoryHTML}
                </div>
            </div>
        `;
    });
    
    chartBars.innerHTML = chartHTML;
}

/**
 * Update recommendation pie chart
 */
function updateRecommendationChart(stats) {
    const chartContainer = document.getElementById('recommendChart');
    
    if (stats.totalResponses === 0) {
        chartContainer.innerHTML = '<div class="no-data">No data available</div>';
        return;
    }
    
    const recommendations = stats.recommendations;
    const total = Object.values(recommendations).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
        chartContainer.innerHTML = '<div class="no-data">No recommendation data</div>';
        return;
    }
    
    const colors = {
        definitely: '#4caf50',
        probably: '#8bc34a',
        maybe: '#ff9800',
        no: '#f44336'
    };
    
    const labels = {
        definitely: 'Definitely',
        probably: 'Probably',
        maybe: 'Maybe',
        no: 'No'
    };
    
    let angle = 0;
    let pieHTML = '<div style="width: 150px; height: 150px; border-radius: 50%; position: relative; margin: 0 auto;">';
    
    Object.entries(recommendations).forEach(([key, count]) => {
        const percentage = (count / total) * 100;
        const sliceAngle = (count / total) * 360;
        
        pieHTML += `
            <div class="pie-slice" 
                 style="
                     background: conic-gradient(from ${angle}deg, ${colors[key]} 0deg, ${colors[key]} ${sliceAngle}deg, transparent ${sliceAngle}deg);
                     width: 150px; 
                     height: 150px;
                 " 
                 title="${labels[key]}: ${count} (${percentage.toFixed(1)}%)">
            </div>
        `;
        angle += sliceAngle;
    });
    
    pieHTML += '</div>';
    
    // Add legend
    const legendHTML = `
        <div class="pie-legend">
            ${Object.entries(recommendations).map(([key, count]) => `
                <div class="legend-item">
                    <div class="legend-color" style="background: ${colors[key]};"></div>
                    <span>${labels[key]}: ${count}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    chartContainer.innerHTML = pieHTML + legendHTML;
}

/**
 * Update comments section
 */
function updateComments(stats) {
    const commentsContainer = document.getElementById('commentsContainer');
    const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
    
    // Filter responses with comments
    const responsesWithComments = data
        .filter(response => response.comments && response.comments.trim() !== '')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5); // Show last 5 comments
    
    if (responsesWithComments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-data">No comments yet</div>';
        return;
    }
    
    const commentsHTML = responsesWithComments.map(response => {
        const date = new Date(response.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        return `
            <div class="comment-card">
                <div class="comment-meta">
                    <span>${formattedDate}</span>
                    <div class="comment-ratings">
                        <span class="rating-badge rating-${response.overall}">Overall: ${response.overall}</span>
                        <span class="rating-badge rating-${response.food}">Food: ${response.food}</span>
                        <span class="rating-badge rating-${response.service}">Service: ${response.service}</span>
                    </div>
                </div>
                <div class="comment-text">"${response.comments}"</div>
            </div>
        `;
    }).join('');
    
    commentsContainer.innerHTML = commentsHTML;
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn.innerHTML;
    const lang = dashboardTranslations[currentLanguage];
    
    refreshBtn.innerHTML = `<span class="loading"></span> ${lang.refreshingText}`;
    refreshBtn.disabled = true;
    
    // Simulate loading time
    setTimeout(() => {
        loadDashboard();
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        
        // Show success message
        showNotification(lang.refreshSuccess, 'success');
    }, 1000);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

/**
 * Generate detailed analytics report
 */
function generateAnalyticsReport() {
    const data = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
    
    if (data.length === 0) {
        alert('No data available for analytics report');
        return;
    }
    
    const stats = getSurveyStats();
    const ratingCounts = {
        overall: { excellent: 0, good: 0, average: 0, poor: 0 },
        food: { excellent: 0, good: 0, average: 0, poor: 0 },
        service: { excellent: 0, good: 0, average: 0, poor: 0 }
    };
    
    // Count ratings
    data.forEach(response => {
        ['overall', 'food', 'service'].forEach(category => {
            if (ratingCounts[category][response[category]]) {
                ratingCounts[category][response[category]]++;
            }
        });
    });
    
    // Generate report
    const report = `
        SODEXO SURVEY ANALYTICS REPORT
        Generated: ${new Date().toLocaleString()}
        
        SUMMARY STATISTICS
        ==================
        Total Responses: ${stats.totalResponses}
        Average Overall Rating: ${stats.averageRatings.overall}/4.0
        Average Food Rating: ${stats.averageRatings.food}/4.0
        Average Service Rating: ${stats.averageRatings.service}/4.0
        
        RATING DISTRIBUTION
        ===================
        Overall Experience:
        - Excellent: ${ratingCounts.overall.excellent} (${((ratingCounts.overall.excellent / data.length) * 100).toFixed(1)}%)
        - Good: ${ratingCounts.overall.good} (${((ratingCounts.overall.good / data.length) * 100).toFixed(1)}%)
        - Average: ${ratingCounts.overall.average} (${((ratingCounts.overall.average / data.length) * 100).toFixed(1)}%)
        - Poor: ${ratingCounts.overall.poor} (${((ratingCounts.overall.poor / data.length) * 100).toFixed(1)}%)
        
        Food Quality:
        - Excellent: ${ratingCounts.food.excellent} (${((ratingCounts.food.excellent / data.length) * 100).toFixed(1)}%)
        - Good: ${ratingCounts.food.good} (${((ratingCounts.food.good / data.length) * 100).toFixed(1)}%)
        - Average: ${ratingCounts.food.average} (${((ratingCounts.food.average / data.length) * 100).toFixed(1)}%)
        - Poor: ${ratingCounts.food.poor} (${((ratingCounts.food.poor / data.length) * 100).toFixed(1)}%)
        
        Service Quality:
        - Excellent: ${ratingCounts.service.excellent} (${((ratingCounts.service.excellent / data.length) * 100).toFixed(1)}%)
        - Good: ${ratingCounts.service.good} (${((ratingCounts.service.good / data.length) * 100).toFixed(1)}%)
        - Average: ${ratingCounts.service.average} (${((ratingCounts.service.average / data.length) * 100).toFixed(1)}%)
        - Poor: ${ratingCounts.service.poor} (${((ratingCounts.service.poor / data.length) * 100).toFixed(1)}%)
        
        RECOMMENDATIONS
        ===============
        ${Object.entries(stats.recommendations).map(([key, count]) => 
            `${key.charAt(0).toUpperCase() + key.slice(1)}: ${count} (${((count / data.length) * 100).toFixed(1)}%)`
        ).join('\n        ')}
        
        INSIGHTS
        ========
        ${generateInsights(stats, ratingCounts)}
    `;
    
    // Download report as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sodexo-analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Generate insights based on survey data
 */
function generateInsights(stats, ratingCounts) {
    const insights = [];
    const total = stats.totalResponses;
    
    // Overall satisfaction insights
    const excellentPercent = ((ratingCounts.overall.excellent / total) * 100);
    const poorPercent = ((ratingCounts.overall.poor / total) * 100);
    
    if (excellentPercent > 70) {
        insights.push("✓ Excellent customer satisfaction with over 70% excellent ratings");
    } else if (poorPercent > 20) {
        insights.push("⚠ High percentage of poor ratings - immediate attention needed");
    }
    
    // Food vs Service comparison
    const foodExcellent = ((ratingCounts.food.excellent / total) * 100);
    const serviceExcellent = ((ratingCounts.service.excellent / total) * 100);
    
    if (foodExcellent > serviceExcellent + 10) {
        insights.push("✓ Food quality is significantly better than service quality");
    } else if (serviceExcellent > foodExcellent + 10) {
        insights.push("✓ Service quality is significantly better than food quality");
    }
    
    // Recommendation insights
    const recommendPercent = Object.entries(stats.recommendations)
        .filter(([key]) => ['definitely', 'probably'].includes(key))
        .reduce((sum, [, count]) => sum + count, 0) / total * 100;
    
    if (recommendPercent > 80) {
        insights.push("✓ Strong recommendation rate - customers are likely to refer others");
    } else if (recommendPercent < 50) {
        insights.push("⚠ Low recommendation rate - focus on improving customer experience");
    }
    
    return insights.length > 0 ? insights.join('\n        ') : "No specific insights available with current data";
}

// Add analytics report button to dashboard
document.addEventListener('DOMContentLoaded', function() {
    const tableActions = document.querySelector('.table-actions');
    if (tableActions) {
        const analyticsBtn = document.createElement('button');
        analyticsBtn.className = 'action-btn';
        analyticsBtn.style.background = 'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)';
        analyticsBtn.style.color = 'white';
        analyticsBtn.innerHTML = '📊 Analytics Report';
        analyticsBtn.onclick = generateAnalyticsReport;
        tableActions.appendChild(analyticsBtn);
    }
});

/**
 * Add sample data for testing (development only)
 */
function addSampleData() {
    const sampleData = [
        {
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            overall: 'excellent',
            food: 'good',
            service: 'excellent',
            recommend: 'definitely',
            comments: 'Great experience! The food was delicious and the service was outstanding.'
        },
        {
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            overall: 'good',
            food: 'excellent',
            service: 'good',
            recommend: 'probably',
            comments: 'Very satisfied with the quality of food.'
        },
        {
            timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            overall: 'average',
            food: 'average',
            service: 'good',
            recommend: 'maybe',
            comments: 'Food was okay, service could be improved.'
        },
        {
            timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            overall: 'excellent',
            food: 'excellent',
            service: 'excellent',
            recommend: 'definitely',
            comments: 'Perfect dining experience! Will definitely come back.'
        },
        {
            timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            overall: 'good',
            food: 'good',
            service: 'average',
            recommend: 'probably',
            comments: ''
        }
    ];
    
    // Get existing data
    const existingData = JSON.parse(localStorage.getItem('sodexoSurveyData')) || [];
    
    // Add sample data only if no data exists
    if (existingData.length === 0) {
        localStorage.setItem('sodexoSurveyData', JSON.stringify(sampleData));
        console.log('Sample data added to localStorage');
        return true;
    }
    
    return false;
}

/**
 * Clear authentication (for testing)
 */
function logout() {
    sessionStorage.removeItem('dashboardAuth');
    isAuthenticated = false;
    window.location.reload();
}

// Add sample data button to dashboard (development mode)
document.addEventListener('DOMContentLoaded', function() {
    // Add development tools in debug mode
    if (window.location.search.includes('debug=true')) {
        const tableActions = document.querySelector('.table-actions');
        if (tableActions) {
            const sampleDataBtn = document.createElement('button');
            sampleDataBtn.className = 'action-btn';
            sampleDataBtn.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
            sampleDataBtn.style.color = 'white';
            sampleDataBtn.innerHTML = '🔧 Add Sample Data';
            sampleDataBtn.onclick = function() {
                const added = addSampleData();
                if (added) {
                    showNotification('Sample data added successfully!', 'success');
                    setTimeout(() => loadDashboard(), 1000);
                } else {
                    showNotification('Sample data already exists!', 'info');
                }
            };
            tableActions.appendChild(sampleDataBtn);
            
            const logoutBtn = document.createElement('button');
            logoutBtn.className = 'action-btn';
            logoutBtn.style.background = 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)';
            logoutBtn.style.color = 'white';
            logoutBtn.innerHTML = '🚪 Logout';
            logoutBtn.onclick = logout;
            tableActions.appendChild(logoutBtn);
        }
    }
});
