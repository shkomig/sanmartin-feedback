# Sodexo Customer Satisfaction Survey Application / אפליקציית סקר שביעות רצון לקוחות Sodexo

A complete bilingual web application for collecting and analyzing customer satisfaction surveys with a beautiful, modern interface matching the Sodexo brand theme. Now supports both English and Hebrew languages.

אפליקציית אינטרנט דו-לשונית מלאה לאיסוף וניתוח סקרי שביעות רצון לקוחות עם ממשק יפה ומודרני התואם לנושא המותג של Sodexo. כעת תומכת בשפות אנגלית ועברית.

## 🌟 Features / תכונות

### Bilingual Support / תמיכה דו-לשונית
- **English / עברית**: Complete interface translation
- **RTL Support**: Right-to-left text direction for Hebrew
- **Language Toggle**: Easy switching between languages
- **Persistent Preference**: Language choice saved in localStorage

### Survey Form (`index.html` / `index-he.html`)
- **Modern Design**: Clean, responsive design with Sodexo branding
- **Custom Logo**: High-quality SVG Sodexo logo
- **Interactive Form**: Radio button selection for satisfaction ratings
- **Gradient Buttons**: Blue-to-red gradient styling matching Sodexo theme
- **Real-time Validation**: Form validation with visual feedback
- **Thank You Message**: Dynamic confirmation after submission
- **Local Storage**: Automatic data persistence

### Dashboard (`dashboard.html`)
- ✅ **Password Protection**: Secure access with password authentication
- ✅ **Real-time Analytics**: Live statistics and charts with smooth animations
- ✅ **Modern Design**: Gradient headers, enhanced hover effects, and responsive layout
- ✅ **Data Visualization**: Interactive rating distribution charts and recommendation pie chart
- ✅ **Enhanced Data Table**: Sortable, filterable table with smooth row animations
- ✅ **Export Functionality**: CSV export with proper Hebrew support
- ✅ **Analytics Reports**: Automated insights and recommendations
- ✅ **Comments Display**: Recent customer feedback showcase with enhanced styling
- ✅ **Loading States**: Professional loading animations and error handling

### Security Features / תכונות אבטחה
- **Password Protection**: Dashboard access requires password (`sodexo2025`)
- **Session Management**: Authentication persists during browser session
- **Data Validation**: Proper input validation and error handling
- **Secure Storage**: Local data encryption and validation

### Enhanced UI/UX / ממשק משתמש משופר
- **Gradient Designs**: Modern gradient headers and buttons
- **Smooth Animations**: CSS transitions and JavaScript animations
- **Responsive Layout**: Mobile-first design with tablet/desktop optimization
- **Hover Effects**: Interactive feedback on all elements
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages and recovery

## 📋 Survey Questions

1. **Overall Experience**: Excellent, Good, Average, Poor
2. **Food Quality**: Excellent, Good, Average, Poor
3. **Service Quality**: Excellent, Good, Average, Poor
4. **Recommendation**: Definitely, Probably, Maybe, No
5. **Additional Comments**: Optional text feedback

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Download all files to a folder
2. Open `index.html` in your web browser to start the survey
3. Access `dashboard.html` to view analytics and responses

### File Structure / מבנה קבצים
```
├── index.html              # Main survey form (English) / טופס סקר ראשי (אנגלית)
├── index-he.html           # Hebrew survey form / טופס סקר בעברית
├── dashboard.html          # Analytics dashboard (English) / דשבורד אנליטיקה (אנגלית)
├── dashboard-he.html       # Hebrew analytics dashboard / דשבורד אנליטיקה בעברית
├── styles.css             # Main stylesheet / גיליון עיצוב ראשי
├── dashboard-styles.css   # Dashboard-specific styles / עיצוב ייעודי לדשבורד
├── script.js              # Survey functionality / פונקציונליות הסקר
├── dashboard.js           # Dashboard functionality / פונקציונליות הדשבורד
├── sodexo-logo.svg        # Custom Sodexo logo / לוגו Sodexo מותאם אישית
└── README.md              # This file / קובץ זה
```

## 💾 Data Management

### Local Storage
- All survey responses are stored in browser's localStorage
- Data persists between browser sessions
- Key: `sodexoSurveyData`

### Data Export
- **CSV Export**: Download all responses in CSV format
- **Analytics Report**: Generate detailed insights report
- **Data Clearing**: Option to clear all stored data

### Data Structure
```javascript
{
  timestamp: "2025-01-16T10:30:00.000Z",
  overall: "excellent",
  food: "good",
  service: "excellent",
  recommend: "definitely",
  comments: "Great experience!"
}
```

## 📊 Analytics Features

### Statistics Overview
- Total response count
- Average ratings for each category
- Visual rating badges with color coding

### Charts & Visualizations
- **Rating Distribution**: Bar charts showing response distribution
- **Recommendation Chart**: Pie chart for recommendation breakdown
- **Trend Analysis**: Time-based response patterns

### Automated Insights
- Customer satisfaction trends
- Area improvement recommendations
- Performance benchmarking

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#1976d2) - Sodexo brand color
- **Secondary**: Light blue gradient background
- **Accent**: Red gradient for CTAs
- **Status Colors**: Green (excellent), Orange (average), Red (poor)

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

### Visual Elements
- Sodexo logo integration
- Smooth animations and transitions
- Gradient backgrounds and buttons
- Card-based layout design
- Custom radio button styling

## 🔧 Customization

### Modifying Questions
1. Edit the form structure in `index.html`
2. Update validation logic in `script.js`
3. Adjust dashboard display in `dashboard.js`

### Styling Changes
1. **Colors**: Modify CSS variables in `styles.css`
2. **Layout**: Adjust grid and flexbox properties
3. **Animations**: Update transition and keyframe animations

### Adding Features
1. **New Question Types**: Extend form with dropdowns, checkboxes
2. **Advanced Analytics**: Add more chart types and calculations
3. **Data Integration**: Connect to external databases or APIs

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Features Used
- CSS Grid and Flexbox
- LocalStorage API
- ES6+ JavaScript
- CSS Animations
- Responsive Design

## 🛠️ Troubleshooting

### Common Issues

**Data Not Saving**
- Check if localStorage is enabled in browser
- Verify no private/incognito mode restrictions

**Charts Not Displaying**
- Ensure JavaScript is enabled
- Check browser console for errors

**Mobile Display Issues**
- Clear browser cache
- Ensure viewport meta tag is present

**Export Not Working**
- Check popup blocker settings
- Verify download permissions

## 📈 Performance

### Optimization Features
- Efficient data storage and retrieval
- Optimized image loading
- CSS animations with hardware acceleration
- Minimal external dependencies
- Progressive enhancement approach

## 🔒 Security & Privacy

### Data Handling
- All data stored locally in browser
- No external data transmission
- User has full control over data
- Option to clear all data anytime

### Privacy Considerations
- No personal information collected by default
- Anonymous survey responses
- No tracking or analytics cookies
- GDPR-friendly approach

## 🚀 Future Enhancements

### Planned Features
- [ ] Email notification system
- [ ] Advanced filtering and search
- [ ] Multi-language support
- [ ] PDF report generation
- [ ] Cloud data synchronization
- [ ] Real-time collaboration features

### Integration Possibilities
- CRM system integration
- Email marketing platforms
- Business intelligence tools
- Social media sharing
- API development for mobile apps

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all files are in the same directory
4. Verify internet connection for logo loading

## 📄 License

This project is created for Sodexo internal use. Please ensure compliance with company policies when using or modifying this application.

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Developed for**: Sodexo Customer Experience Team

## 🔐 Dashboard Access

### Password Protection
- **Default Password**: `sodexo2025`
- **Access Level**: Full dashboard functionality
- **Session Duration**: Until browser session ends
- **Security**: Password required for each new session

### Testing Mode
- Add `?debug=true` to dashboard URL for development tools
- Sample data generation for testing
- Logout functionality for re-authentication testing

Example: `dashboard.html?debug=true`

## 🎯 **Quick Start Guide**

### **For Survey Collection:**
1. Open `index.html` or `index-he.html`
2. Fill out the satisfaction survey
3. Submit responses (stored locally)
4. Switch languages using the toggle button

### **For Data Analysis:**
1. Open `dashboard.html` or `dashboard-he.html` 
2. Enter password: `sodexo2025`
3. View real-time analytics and statistics
4. Export data using CSV export button
5. Generate analytics reports for insights

## 🛠️ **Advanced Features**
