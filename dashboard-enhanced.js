// Enhanced Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
});

let allData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentSortColumn = null;
let currentSortDirection = 'asc';

function initializeDashboard() {
    // Check authentication
    checkAuthentication();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load dashboard data
    loadDashboardData();
}

function checkAuthentication() {
    const isAuthenticated = sessionStorage.getItem('dashboardAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        showAuthenticationModal();
    } else {
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
    // Authentication form
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthentication);
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
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    const correctUsername = 'admin';
    const correctPassword = 'sodexo2024';
    
    if (username === correctUsername && password === correctPassword) {
        sessionStorage.setItem('dashboardAuthenticated', 'true');
        hideAuthenticationModal();
        showSuccessMessage('הכניסה בוצעה בהצלחה / Login successful');
    } else {
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

function loadDashboardData() {
    showLoadingState();
    
    setTimeout(() => {
        const surveyData = JSON.parse(localStorage.getItem('surveyResponses') || '[]');
        
        if (surveyData.length === 0) {
            generateSampleData();
        } else {
            allData = surveyData;
            filteredData = [...allData];
            updateDashboard();
        }
        
        hideLoadingState();
    }, 500); // Simulate loading delay
}

function generateSampleData() {
    const sampleData = [
        {
            timestamp: new Date('2024-01-15T10:30:00').toISOString(),
            overall: 'excellent',
            food: 'good', 
            service: 'excellent',
            recommendation: 'yes',
            comments: 'המזון היה טעים מאוד והשירות מצוין',
            language: 'he'
        },
        {
            timestamp: new Date('2024-01-15T14:45:00').toISOString(),
            overall: 'good',
            food: 'excellent',
            service: 'good', 
            recommendation: 'yes',
            comments: 'Great food quality, friendly staff',
            language: 'en'
        },
        {
            timestamp: new Date('2024-01-16T12:20:00').toISOString(),
            overall: 'average',
            food: 'average',
            service: 'good',
            recommendation: 'maybe',
            comments: 'השירות טוב אבל האוכל יכול להיות טוב יותר',
            language: 'he'
        },
        {
            timestamp: new Date('2024-01-16T16:30:00').toISOString(),
            overall: 'excellent',
            food: 'excellent',
            service: 'excellent', 
            recommendation: 'yes',
            comments: 'Outstanding experience! Will definitely come back.',
            language: 'en'
        },
        {
            timestamp: new Date('2024-01-17T11:15:00').toISOString(),
            overall: 'good',
            food: 'good',
            service: 'average',
            recommendation: 'yes',
            comments: 'האוכל טוב, השירות יכול להיות מהיר יותר',
            language: 'he'
        },
        {
            timestamp: new Date('2024-01-18T13:00:00').toISOString(),
            overall: 'excellent',
            food: 'excellent',
            service: 'excellent',
            recommendation: 'yes',
            comments: 'Perfect lunch experience!',
            language: 'en'
        },
        {
            timestamp: new Date('2024-01-19T12:45:00').toISOString(),
            overall: 'poor',
            food: 'poor',
            service: 'average',
            recommendation: 'no',
            comments: 'האוכל היה קר והשירות איטי',
            language: 'he'
        },
        {
            timestamp: new Date('2024-01-20T15:30:00').toISOString(),
            overall: 'good',
            food: 'average',
            service: 'good',
            recommendation: 'maybe',
            comments: 'Service was good but food could be better',
            language: 'en'
        },
        {
            timestamp: new Date('2024-01-21T12:00:00').toISOString(),
            overall: 'excellent',
            food: 'excellent',
            service: 'excellent',
            recommendation: 'yes',
            comments: 'הכל היה מושלם! אוכל טעים ושירות מהיר',
            language: 'he'
        },
        {
            timestamp: new Date('2024-01-22T16:15:00').toISOString(),
            overall: 'good',
            food: 'good',
            service: 'good',
            recommendation: 'yes',
            comments: 'Consistent quality, always a good choice',
            language: 'en'
        }
    ];
    
    localStorage.setItem('surveyResponses', JSON.stringify(sampleData));
    allData = sampleData;
    filteredData = [...allData];
    updateDashboard();
}

function updateDashboard() {
    updateStatistics(filteredData);
    updateTable();
    updatePagination();
}

function updateStatistics(data) {
    const totalResponses = data.length;
    
    // Calculate satisfaction percentages
    const excellentCount = data.filter(item => item.overall === 'excellent').length;
    const goodCount = data.filter(item => item.overall === 'good').length;
    const averageCount = data.filter(item => item.overall === 'average').length;
    const poorCount = data.filter(item => item.overall === 'poor').length;
    
    // Calculate recommendation rate
    const recommendYes = data.filter(item => item.recommendation === 'yes').length;
    const recommendationRate = totalResponses > 0 ? Math.round((recommendYes / totalResponses) * 100) : 0;
    
    // Update statistics cards (if they exist)
    const totalEl = document.getElementById('totalResponses');
    const excellentEl = document.getElementById('excellentPercentage');
    const recommendEl = document.getElementById('recommendationRate');
    const avgRatingEl = document.getElementById('averageRating');
    
    if (totalEl) totalEl.textContent = totalResponses;
    if (excellentEl) {
        excellentEl.textContent = totalResponses > 0 ? Math.round((excellentCount / totalResponses) * 100) + '%' : '0%';
    }
    if (recommendEl) recommendEl.textContent = recommendationRate + '%';
    
    // Calculate average rating (simplified)
    if (avgRatingEl) {
        const avgRating = totalResponses > 0 ? 
            ((excellentCount * 5 + goodCount * 4 + averageCount * 3 + poorCount * 2) / totalResponses).toFixed(1) : '0';
        avgRatingEl.textContent = avgRating + '/5';
    }
}

function updateTable() {
    const tableBody = document.getElementById('tableBody') || document.getElementById('responseTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="loading-state">אין נתונים להצגה / No data to display</td></tr>';
        return;
    }
    
    pageData.forEach((response, index) => {
        const row = tableBody.insertRow();
        
        // Format date
        const date = new Date(response.timestamp);
        const formattedDate = date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Create rating badge
        const overallBadge = `<span class="rating-badge rating-${response.overall}">${getRatingText(response.overall)}</span>`;
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${overallBadge}</td>
            <td><span class="rating-badge rating-${response.food}">${getRatingText(response.food)}</span></td>
            <td><span class="rating-badge rating-${response.service}">${getRatingText(response.service)}</span></td>
            <td><span class="recommendation-${response.recommendation}">${getRecommendationText(response.recommendation)}</span></td>
            <td class="comments-cell" title="${response.comments || ''}">${
                response.comments ? 
                    (response.comments.length > 50 ? response.comments.substring(0, 50) + '...' : response.comments) 
                    : '-'
            }</td>
        `;
        
        // Add hover animation
        row.style.animation = `fadeInRow 0.3s ease ${index * 0.05}s both`;
    });
    
    // Update results info
    const tableInfo = document.getElementById('tableInfo');
    if (tableInfo) {
        tableInfo.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length} responses`;
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    const prevBtn = document.getElementById('prevPage') || document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPage') || document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    if (pageInfo) pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    updateTable();
    updatePagination();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredData = allData.filter(item => {
        return (
            item.comments?.toLowerCase().includes(searchTerm) ||
            item.overall.toLowerCase().includes(searchTerm) ||
            item.food.toLowerCase().includes(searchTerm) ||
            item.service.toLowerCase().includes(searchTerm) ||
            item.recommendation.toLowerCase().includes(searchTerm) ||
            getRatingText(item.overall).toLowerCase().includes(searchTerm) ||
            getRatingText(item.food).toLowerCase().includes(searchTerm) ||
            getRatingText(item.service).toLowerCase().includes(searchTerm)
        );
    });
    
    currentPage = 1;
    updateDashboard();
}

function handleFilter(e) {
    const filterValue = e.target.value;
    
    if (filterValue === 'all') {
        filteredData = [...allData];
    } else {
        filteredData = allData.filter(item => item.overall === filterValue);
    }
    
    currentPage = 1;
    updateDashboard();
}

function sortData(column) {
    if (currentSortColumn === column) {
        // Toggle direction if same column
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        // New column, default to ascending
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    // Remove existing sort classes
    document.querySelectorAll('.data-table.enhanced th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add sort class to current column
    const currentHeader = document.querySelector(`[data-column="${column}"]`);
    if (currentHeader) {
        currentHeader.classList.add(`sort-${currentSortDirection}`);
    }
    
    // Sort the data
    filteredData.sort((a, b) => {
        let valueA, valueB;
        
        switch (column) {
            case 'date':
                valueA = new Date(a.timestamp);
                valueB = new Date(b.timestamp);
                break;
            case 'overall':
            case 'food':
            case 'service':
                const ratingOrder = { 'excellent': 4, 'good': 3, 'average': 2, 'poor': 1 };
                valueA = ratingOrder[a[column]] || 0;
                valueB = ratingOrder[b[column]] || 0;
                break;
            case 'recommendation':
                const recommendOrder = { 'yes': 3, 'maybe': 2, 'no': 1 };
                valueA = recommendOrder[a.recommendation] || 0;
                valueB = recommendOrder[b.recommendation] || 0;
                break;
            case 'language':
                valueA = a.language || '';
                valueB = b.language || '';
                break;
            default:
                valueA = a[column] || '';
                valueB = b[column] || '';
        }
        
        if (currentSortDirection === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
    });
    
    currentPage = 1;
    updateTable();
    updatePagination();
}

function getRatingText(rating) {
    const ratingTexts = {
        'excellent': 'מצוין / Excellent',
        'good': 'טוב / Good', 
        'average': 'ממוצע / Average',
        'poor': 'גרוע / Poor'
    };
    return ratingTexts[rating] || rating;
}

function getRecommendationText(recommendation) {
    const recommendationTexts = {
        'yes': 'כן / Yes',
        'no': 'לא / No',
        'maybe': 'אולי / Maybe'
    };
    return recommendationTexts[recommendation] || recommendation;
}

function showLoadingState() {
    const tableBody = document.getElementById('responseTableBody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="8" class="loading-state"><div class="spinner"></div>טוען נתונים...</td></tr>';
    }
}

function hideLoadingState() {
    // Loading is hidden when data is loaded
}

function showSuccessMessage(message) {
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.right = '20px';
    successDiv.style.zIndex = '10000';
    successDiv.style.borderRadius = '8px';
    successDiv.style.padding = '15px 25px';
    successDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    successDiv.style.animation = 'slideInRight 0.3s ease';
    
    document.body.appendChild(successDiv);
    
    // Add animation style
    if (!document.getElementById('messageAnimations')) {
        const style = document.createElement('style');
        style.id = 'messageAnimations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeInRow {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        if (document.body.contains(successDiv)) {
            document.body.removeChild(successDiv);
        }
    }, 3000);
}

// Export functionality
function exportData() {
    const data = filteredData.length > 0 ? filteredData : allData;
    
    if (data.length === 0) {
        alert('אין נתונים לייצוא / No data to export');
        return;
    }
    
    // Create CSV content
    const headers = 'מזהה,תאריך ושעה,דירוג כללי,דירוג אוכל,דירוג שירות,המלצה,הערות,שפה\nID,Date Time,Overall Rating,Food Rating,Service Rating,Recommendation,Comments,Language\n';
    
    const csvContent = data.map((item, index) => {
        const date = new Date(item.timestamp).toLocaleString();
        return `${index + 1},"${date}","${item.overall}","${item.food}","${item.service}","${item.recommendation}","${(item.comments || '').replace(/"/g, '""')}","${item.language}"`;
    }).join('\n');
    
    const fullCsv = headers + csvContent;
    
    // Download CSV
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sodexo-survey-data-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showSuccessMessage('הנתונים יוצאו בהצלחה / Data exported successfully');
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
