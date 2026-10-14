package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"
    "time"

    _ "modernc.org/sqlite" // استخدام SQLite بدون الحاجة لـ CGO لتجنب أي مشاكل في التثبيت
)

// هيكل بيانات المستخدم المسجل
type User struct {
    FullName string `json:"fullName,omitempty"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

// هيكل بيانات المشروع
type Project struct {
    ID              string    `json:"id"`
    UserEmail       string    `json:"userEmail"` // لربط المشروع بملف المستخدم الشخصي
    Title           string    `json:"title"`
    Type            string    `json:"type"` // "3d" أو "2d"
    PreviewGradient string    `json:"previewGradient,omitempty"`
    CreatedAt       time.Time `json:"createdAt"`
}

// طلب التسجيل / تسجيل الدخول الوارد من الواجهة
type AuthRequest struct {
    FullName string `json:"fullName,omitempty"`
    Email    string `json:"email"`
    Password string `json:"password"`
}

// طلب إنشاء مشروع جديد
type CreateProjectRequest struct {
    Title           string `json:"title"`
    Type            string `json:"type"` // "3d" أو "2d"
    PreviewGradient string `json:"previewGradient,omitempty"`
}

// استجابة التوثيق
type AuthResponse struct {
    Success bool   `json:"success"`
    Message string `json:"message"`
    Token   string `json:"token,omitempty"`
    User    *User  `json:"user,omitempty"`
}

// متغير قاعدة البيانات العام
var db *sql.DB

// تهيئة قاعدة البيانات وإنشاء الجداول تلقائياً بمسار ذكي سحابياً ومحلياً
func initDatabase() {
    var err error
    
    // تحديد مسار قاعدة البيانات: /tmp للسحاب لتجنب مشاكل الصلاحيات، ومحلياً حسب الحاجة
    dbPath := "./fluxgo.db"
    if os.Getenv("PORT") != "" {
        dbPath = "/tmp/fluxgo.db"
    }

    db, err = sql.Open("sqlite", dbPath)
    if err != nil {
        log.Fatalf("❌ Failed to connect to database: %v", err)
    }

    // اختبار الاتصال
    if err = db.Ping(); err != nil {
        log.Fatalf("❌ Database ping failed: %v", err)
    }

    // إنشاء جدول المستخدمين
    usersTableQuery := `
    CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        full_name TEXT,
        password TEXT NOT NULL
    );`

    // إنشاء جدول المشاريع
    projectsTableQuery := `
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        user_email TEXT,
        title TEXT,
        type TEXT,
        preview_gradient TEXT,
        created_at DATETIME,
        FOREIGN KEY(user_email) REFERENCES users(email)
    );`

    // إنشاء جدول التوكنات (الجلسات)
    tokensTableQuery := `
    CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_email TEXT,
        FOREIGN KEY(user_email) REFERENCES users(email)
    );`

    _, err = db.Exec(usersTableQuery)
    if err != nil {
        log.Fatalf("❌ Failed to create users table: %v", err)
    }

    _, err = db.Exec(projectsTableQuery)
    if err != nil {
        log.Fatalf("❌ Failed to create projects table: %v", err)
    }

    _, err = db.Exec(tokensTableQuery)
    if err != nil {
        log.Fatalf("❌ Failed to create sessions table: %v", err)
    }

    fmt.Printf("📦 SQLite Database initialized successfully (%s)\n", dbPath)
}

// Middleware لدعم CORS والسماح لطلبات React بالوصول للسيرفر
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        // التعامل مع طلبات Preflight الإعدادية من المتصفح
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next(w, r)
    }
}

// Middleware للتحقق من التوكن ومعرفة المستخدم الحالي من قاعدة البيانات
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "غير مرخص، يجب تسجيل الدخول"})
            return
        }

        token := strings.TrimPrefix(authHeader, "Bearer ")

        var email string
        err := db.QueryRow("SELECT user_email FROM sessions WHERE token = ?", token).Scan(&email)
        if err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "التوكن غير صالح أو منتهي الصلاحية"})
            return
        }

        // تمرير البريد الإلكتروني عبر الـ Header
        r.Header.Set("X-User-Email", email)
        next(w, r)
    }
}

// Handler إنشاء حساب جديد (Register) مع الحفظ في قاعدة البيانات
func registerHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "Method not allowed"})
        return
    }

    var req AuthRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil || strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "يرجى إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح"})
        return
    }

    emailKey := strings.ToLower(strings.TrimSpace(req.Email))

    // التحقق مما إذا كان المستخدم موجوداً مسبقاً
    var existingEmail string
    err = db.QueryRow("SELECT email FROM users WHERE email = ?", emailKey).Scan(&existingEmail)
    if err == nil {
        w.WriteHeader(http.StatusConflict)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "البريد الإلكتروني مسجل بالفعل"})
        return
    }

    // إدخال المستخدم الجديد في قاعدة البيانات
    _, err = db.Exec("INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)", emailKey, req.FullName, req.Password)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "حدث خطأ أثناء حفظ المستخدم في قاعدة البيانات"})
        return
    }

    token := fmt.Sprintf("fluxgo_jwt_token_%d_%s", time.Now().UnixNano(), emailKey)
    _, err = db.Exec("INSERT INTO sessions (token, user_email) VALUES (?, ?)", token, emailKey)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "حدث خطأ أثناء إنشاء الجلسة"})
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(AuthResponse{
        Success: true,
        Message: "تم إنشاء الحساب بنجاح",
        Token:   token,
        User:    &User{FullName: req.FullName, Email: emailKey},
    })
}

// Handler تسجيل الدخول (Login) والتحقق من قاعدة البيانات
func loginHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

    if r.Method != http.MethodPost {
        w.WriteHeader(http.StatusMethodNotAllowed)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "Method not allowed"})
        return
    }

    var req AuthRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil || strings.TrimSpace(req.Email) == "" || strings.TrimSpace(req.Password) == "" {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "بيانات الدخول غير مكتملة"})
        return
    }

    emailKey := strings.ToLower(strings.TrimSpace(req.Email))

    var dbPassword, fullName string
    err = db.QueryRow("SELECT password, full_name FROM users WHERE email = ?", emailKey).Scan(&dbPassword, &fullName)
    if err != nil || dbPassword != req.Password {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"})
        return
    }

    token := fmt.Sprintf("fluxgo_jwt_token_%d_%s", time.Now().UnixNano(), emailKey)
    _, err = db.Exec("INSERT INTO sessions (token, user_email) VALUES (?, ?)", token, emailKey)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(AuthResponse{Success: false, Message: "حدث خطأ أثناء إنشاء الجلسة"})
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(AuthResponse{
        Success: true,
        Message: "تم تسجيل الدخول بنجاح",
        Token:   token,
        User:    &User{FullName: fullName, Email: emailKey},
    })
}

// Handler موحد لمسار /api/projects لجلب المشاريع وحفظها في قاعدة البيانات
func projectsHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    userEmail := r.Header.Get("X-User-Email")

    // طلب GET: جلب جميع المشاريع الخاصة بالمستخدم الحالي من قاعدة البيانات
    if r.Method == http.MethodGet {
        rows, err := db.Query("SELECT id, user_email, title, type, preview_gradient, created_at FROM projects WHERE user_email = ?", userEmail)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "فشل في جلب المشاريع"})
            return
        }
        defer rows.Close()

        userProjects := []Project{}
        for rows.Next() {
            var proj Project
            err := rows.Scan(&proj.ID, &proj.UserEmail, &proj.Title, &proj.Type, &proj.PreviewGradient, &proj.CreatedAt)
            if err == nil {
                userProjects = append(userProjects, proj)
            }
        }

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(userProjects)
        return
    }

    // طلب طلب POST: إنشاء مشروع جديد وحفظه في قاعدة البيانات
    if r.Method == http.MethodPost {
        var req CreateProjectRequest
        err := json.NewDecoder(r.Body).Decode(&req)
        if err != nil || (req.Type != "3d" && req.Type != "2d") {
            w.WriteHeader(http.StatusBadRequest)
            json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "بيانات المشروع غير صالحة"})
            return
        }

        projectToken := fmt.Sprintf("proj_%s_%d", strings.ToLower(req.Type), time.Now().UnixNano())
        if req.Title == "" {
            if req.Type == "3d" {
                req.Title = "New 3D Project"
            } else {
                req.Title = "New 2D Project"
            }
        }

        createdAt := time.Now()

        _, err = db.Exec(
            "INSERT INTO projects (id, user_email, title, type, preview_gradient, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            projectToken, userEmail, req.Title, req.Type, req.PreviewGradient, createdAt,
        )
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "فشل في حفظ المشروع في قاعدة البيانات"})
            return
        }

        newProject := Project{
            ID:              projectToken,
            UserEmail:       userEmail,
            Title:           req.Title,
            Type:            req.Type,
            PreviewGradient: req.PreviewGradient,
            CreatedAt:       createdAt,
        }

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(newProject)
        return
    }

    w.WriteHeader(http.StatusMethodNotAllowed)
    json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Method not allowed"})
}

// Handler الصفحة الرئيسية
func homeHandler(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/" {
        http.NotFound(w, r)
        return
    }
    fmt.Fprintf(w, "Welcome to FluxGO 3D & 2D API Server with SQLite Database!")
}

// Handler اختبار صحة السيرفر
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status": "ok", "database": "connected", "timestamp": "` + time.Now().Format(time.RFC3339) + `"}`))
}

func main() {
    // تهيئة قاعدة البيانات أولاً
    initDatabase()
    defer db.Close()

    http.HandleFunc("/", homeHandler)
    http.HandleFunc("/health", healthHandler)
    http.HandleFunc("/api/register", enableCORS(registerHandler))
    http.HandleFunc("/api/login", enableCORS(loginHandler))
    
    // مسار المشاريع يدعم GET و POST محمي بـ Auth Middleware
    http.HandleFunc("/api/projects", enableCORS(authMiddleware(projectsHandler)))

    // التقاط المنفذ الديناميكي لبيئة السحاب أو محلياً
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    serverAddr := ":" + port
    fmt.Printf("🚀 Server is running on port %s\n", port)
    fmt.Println("📍 Endpoints:")
    fmt.Println("   - POST /api/register")
    fmt.Println("   - POST /api/login")
    fmt.Println("   - GET/POST /api/projects (Requires Bearer Token)")

    err := http.ListenAndServe(serverAddr, nil)
    if err != nil {
        log.Fatalf("❌ Failed to start server: %v", err)
    }
}