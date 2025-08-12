// Enhanced Dashboard functionality with animations
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard JavaScript loaded successfully'); // Debug log
    
    // Initialize dashboard with animations
    initializeDashboard();
    
    // Add loading animations
    addLoadingAnimations();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

/**
 * Load data from server or shared JSON database
 */
async function loadFromSharedDatabase() {
    try {
        const serverResponse = await fetch('/responses');
        if (serverResponse.ok) {
            const serverData = await serverResponse.json();
            if (Array.isArray(serverData) && serverData.length > 0) {
                console.log('Loaded', serverData.length, 'responses from server database');
                return serverData;
            }
        }
    } catch (error) {
        console.log('Server database not available, trying local file');
    }

    try {
        const response = await fetch('./survey-database.json?t=' + Date.now()); // Cache busting
        if (response.ok) {
            const data = await response.json();
            console.log('Loaded', data.length, 'responses from shared database');
            return Array.isArray(data) ? data : [];
        }
    } catch (error) {
        console.log('Shared database not available, using localStorage only');
    }
    return [];
}

let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentSortColumn = null;
let currentSortDirection = 'asc';

function initializeDashboard() {
    console.log('Initializing dashboard...'); // Debug log
    
    // Check authentication
    checkAuthentication();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
}

function checkAuthentication() {
    console.log('Checking authentication...'); // Debug log
    const isAuthenticated = sessionStorage.getItem('dashboardAuthenticated') === 'true';
    console.log('Is authenticated:', isAuthenticated); // Debug log
    
    if (!isAuthenticated) {
        console.log('Not authenticated, showing auth modal'); // Debug log
        showAuthenticationModal();
    } else {
        console.log('Already authenticated, hiding auth modal'); // Debug log
        hideAuthenticationModal();
        // Load data immediately if already authenticated
        setTimeout(() => {
            loadDashboardData();
        }, 100);
    }
}

function showAuthenticationModal() {
    const overlay = document.getElementById('authOverlay');
    overlay.style.display = 'flex';
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('passwordInput').focus();
    }, 100);
}

function hideAuthenticationModal() {
    const overlay = document.getElementById('authOverlay');
    const dashboard = document.getElementById('dashboardContainer');
    
    overlay.style.display = 'none';
    dashboard.style.display = 'block';
}

function setupEventListeners() {
    console.log('Setting up event listeners...'); // Debug log
    
    // Authentication form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        console.log('Auth form found, adding event listener'); // Debug log
        authForm.addEventListener('submit', handleAuthentication);
    } else {
        console.log('Auth form NOT found!'); // Debug log
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter functionality
    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Pagination buttons - check both possible IDs
    const prevBtn = document.getElementById('prevPage') || document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPage') || document.getElementById('nextPageBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => changePage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changePage(1));

    // Table header sorting
    const tableHeaders = document.querySelectorAll('.data-table.enhanced th.sortable');
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortData(column);
        });
    });
}

function handleAuthentication(e) {
    e.preventDefault();
    console.log('Authentication form submitted'); // Debug log
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    console.log('Entered username:', username); // Debug log
    console.log('Password length:', password.length); // Debug log (don't log actual password)
    
    const correctUsername = 'admin';
    const correctPassword = 'sodexo2025';
    
    console.log('Expected username:', correctUsername); // Debug log
    console.log('Expected password length:', correctPassword.length); // Debug log
    
    if (username === correctUsername && password === correctPassword) {
        console.log('Authentication successful'); // Debug log
        sessionStorage.setItem('dashboardAuthenticated', 'true');
        hideAuthenticationModal();
        showSuccessMessage('הכניסה בוצעה בהצלחה / Login successful');
    } else {
        console.log('Authentication failed'); // Debug log
        showAuthError('שם משתמש או סיסמה שגויים / Incorrect username or password');
        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.focus();
    }
}

function showAuthError(message) {
    let errorDiv = document.getElementById('authError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'authError';
        errorDiv.className = 'auth-error';
        document.getElementById('authForm').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Hide error after 3 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

async function loadDashboardData() {
    console.log('Loading dashboard data...');

    // Show loading states for all dashboard elements
    const dashboardElements = document.querySelectorAll('.stat-card, .chart-container, .data-section');
    dashboardElements.forEach(element => showLoadingState(element));

    setTimeout(async () => {
        try {
            // First try to load from shared database
            let surveyData = await loadFromSharedDatabase();

            if (surveyData.length === 0) {
                console.warn('No data found in shared database.');
                showErrorState('No data available. Please check the database connection.');
                return;
            }

            console.log('Data loaded successfully:', surveyData);

            // Update dashboard elements with data
            updateStatistics(surveyData);
            updateCharts(surveyData);
            updateTable(surveyData);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showErrorState('Failed to load data. Please try again later.');
        } finally {
            // Remove loading states
            dashboardElements.forEach(element => hideLoadingState(element));
        }
    }, 500);
}

function updateStatistics(data) {
    const totalResponses = data.length;
    const overallAvg = calculateAverage(data, 'overall');
    const foodAvg = calculateAverage(data, 'food');
    const serviceAvg = calculateAverage(data, 'service');

    document.getElementById('totalResponses').textContent = totalResponses;
    document.getElementById('overallAvg').textContent = overallAvg.toFixed(1);
    document.getElementById('foodAvg').textContent = foodAvg.toFixed(1);
    document.getElementById('serviceAvg').textContent = serviceAvg.toFixed(1);
}

function calculateAverage(data, key) {
    const sum = data.reduce((acc, item) => acc + (parseFloat(item[key]) || 0), 0);
    return sum / data.length || 0;
}

function updateCharts(data) {
    // Placeholder for chart update logic
    console.log('Updating charts with data:', data);
}

function updateTable(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.timestamp || 'N/A'}</td>
            <td>${item.overall || 'N/A'}</td>
            <td>${item.food || 'N/A'}</td>
            <td>${item.service || 'N/A'}</td>
            <td>${item.recommend || 'N/A'}</td>
            <td>${item.comments || 'N/A'}</td>
        `;

        tableBody.appendChild(row);
    });
}

function showErrorState(message) {
    const dashboardElements = document.querySelectorAll('.stat-card, .chart-container, .data-section');
    dashboardElements.forEach(element => {
        element.innerHTML = `<div class="error-state">${message}</div>`;
        element.style.pointerEvents = 'none';
    });
}

// Refresh data
function refreshData() {
    showLoadingState();
    currentPage = 1;
    
    // Reset search and filter
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    if (searchInput) searchInput.value = '';
    if (filterSelect) filterSelect.value = 'all';
    
    // Clear sorting
    currentSortColumn = null;
    currentSortDirection = 'asc';
    document.querySelectorAll('.data-table.enhanced th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    setTimeout(() => {
        loadDashboardData();
        showSuccessMessage('הדשבורד רוענן בהצלחה / Dashboard refreshed successfully');
    }, 500);
}

// Logout functionality  
function logout() {
    if (confirm('האם אתה בטוח שברצונך להתנתק? / Are you sure you want to logout?')) {
        sessionStorage.removeItem('dashboardAuthenticated');
        showAuthenticationModal();
    }
}

// Clear data functionality
function clearData() {
    if (confirm('האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה ניתנת לביטול.\n\nAre you sure you want to delete all data? This action cannot be undone.')) {
        localStorage.removeItem('surveyResponses');
        allData = [];
        filteredData = [];
        currentPage = 1;
        updateDashboard();
        showSuccessMessage('הנתונים נמחקו בהצלחה / Data cleared successfully');
    }
}

// Additional functions for HTML button compatibility
function refreshDashboard() {
    refreshData();
}

function exportDataAsCSV() {
    exportData();
}

function clearSurveyData() {
    clearData();
}

// Initialize language support
function toggleLanguage() {
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const newLang = currentLang === 'en' ? 'he' : 'en';
    
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'he' ? 'rtl' : 'ltr');
    
    // Update language button text
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = newLang === 'he' ? 'English' : 'עברית';
    }
    
    // Re-render table with new language
    updateTable();
    
    // Save language preference
    localStorage.setItem('preferredLanguage', newLang);
}

// Load language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    document.documentElement.setAttribute('lang', savedLang);
    document.documentElement.setAttribute('dir', savedLang === 'he' ? 'rtl' : 'ltr');
    
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        langBtn.textContent = savedLang === 'he' ? 'English' : 'עברית';
    }
});

// Animation utilities
function addLoadingAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.stat-card, .chart-container, .data-section');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.stat-card, .chart-container, .data-table');
    animatableElements.forEach(el => observer.observe(el));
}

function showLoadingState(element) {
    element.classList.add('loading');
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.classList.remove('loading');
    element.style.pointerEvents = 'auto';
}

function animateCounter(element, endValue, duration = 2000) {
    const startValue = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = endValue;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(element => {
        const endValue = parseInt(element.textContent) || 0;
        if (endValue > 0) {
            element.textContent = '0';
            animateCounter(element, endValue, 1500);
        }
    });
}

/**
 * Upload updated database file
 */
function uploadDatabase() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const newData = JSON.parse(e.target.result);
                    if (Array.isArray(newData)) {
                        // Update localStorage with new data
                        localStorage.setItem('surveyResponses', JSON.stringify(newData));
                        
                        // Show success message
                        showNotification('מסד הנתונים עודכן בהצלחה! רוענן את הדף לראות את השינויים.', 'success');
                        
                        // Refresh dashboard after a short delay
                        setTimeout(() => {
                            loadDashboardData();
                        }, 1000);
                        
                    } else {
                        showNotification('קובץ לא תקין - חייב להכיל מערך של תגובות', 'error');
                    }
                } catch (error) {
                    showNotification('שגיאה בקריאת הקובץ - ודא שהוא קובץ JSON תקין', 'error');
                }
            };
            reader.readAsText(file);
        }
        
        // Remove the input element
        document.body.removeChild(input);
    };
    
    document.body.appendChild(input);
    input.click();
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed; 
            top: 20px; 
            right: 20px; 
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'}; 
            color: white; 
            padding: 15px 20px; 
            border-radius: 5px; 
            z-index: 10000; 
            max-width: 400px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        ">
            ${message}
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="
                        float: left; 
                        background: none; 
                        border: none; 
                        color: white; 
                        cursor: pointer; 
                        font-size: 18px;
                        margin-left: 10px;
                    ">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation for notifications
if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .upload-btn {
            background: #FF6B35 !important;
            color: white !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            margin-left: 10px !important;
            transition: background-color 0.3s !important;
        }
        
        .upload-btn:hover {
            background: #e55a2e !important;
        }
    `;
    document.head.appendChild(style);
}
