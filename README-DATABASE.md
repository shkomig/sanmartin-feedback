# הוראות לעדכון מסד נתונים משותף

## בעיית שיתוף נתונים
כיוון ש-localStorage פועל רק על המחשב המקומי, כל משתמש רואה רק את התגובות שלו.

## הפתרון שיושם
1. **קובץ JSON משותף**: `survey-database.json` משמש כמסד נתונים מרכזי
2. **שמירה אוטומטית**: כל תגובה חדשה נשמרת גם ב-localStorage וגם מתווספת לקובץ המשותף
3. **טעינה מועדפת**: הדשבורד קורא תחילה מהקובץ המשותף, ורק אז מ-localStorage

## איך לעדכן את מסד הנתונים:

### דרך 1: עדכון ידני
1. פתח את קובץ `survey-database.json`
2. הוסף תגובות חדשות בפורמט JSON
3. שמור את הקובץ
4. רענן את הדשבורד

### דרך 2: משרת פשוט (מומלץ)
להקמת שרת מקומי פשוט:

```bash
# התקן http-server (פעם אחת)
npm install -g http-server

# הרץ שרת מקומי בתיקיה
http-server . -p 8080

# גש לכתובת: http://localhost:8080
```

### דרך 3: שרת PHP פשוט
צור קובץ `save-survey.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $database = json_decode(file_get_contents('survey-database.json'), true) ?: [];
    $database[] = $input;
    
    file_put_contents('survey-database.json', json_encode($database, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true]);
} else {
    echo file_get_contents('survey-database.json');
}
?>
```

## מבנה התגובה
```json
{
  "id": "unique_id_timestamp",
  "timestamp": "2025-07-21T12:00:00.000Z",
  "overall": "excellent|good|average|poor",
  "food": "excellent|good|average|poor", 
  "service": "excellent|good|average|poor",
  "recommend": "definitely|probably|maybe|no",
  "recommendation": "definitely|probably|maybe|no",
  "comments": "הערות המשתמש...",
  "userIdentifier": "user_unique_id"
}
```

## בדיקת תקינות
1. פתח את הקונסול בדפדפן (F12)
2. הזן: `showStoredData()` לראות נתונים מקומיים
3. בדשבורד: בדוק שמופיעות תגובות מהקובץ המשותף

## הערות חשובות
- הקובץ `survey-database.json` חייב להיות נגיש לכל המשתמשים
- לסביבת production, יש להקים שרת עם API endpoint
- כרגע התגובות החדשות נשמרות מקומית ומייצרות קובץ להורדה
