// ===================================================================
// Database Setup - SQLite
// ===================================================================
// Developer: Abhimani Konara (KIC-DCSAI-251-F-028)
// Role: Database Integration & Version Control
// Group 7 - NIBM Final Project
// ===================================================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file
const dbPath = path.join(__dirname, 'students.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    
    // Users table - stores login credentials
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Student profiles table - stores academic information
    db.run(`
        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            stream TEXT NOT NULL,
            subject1 TEXT,
            subject2 TEXT,
            subject3 TEXT,
            result1 TEXT,
            result2 TEXT,
            result3 TEXT,
            gpa REAL,
            interest TEXT NOT NULL,
            recommendation TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Advisor feedback table
    db.run(`
        CREATE TABLE IF NOT EXISTS advisor_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            advisor_username TEXT NOT NULL,
            feedback TEXT,
            feedback_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES users(id)
        )
    `);

    // Insert default advisor account
    db.run(`
        INSERT OR IGNORE INTO users (username, password, role) 
        VALUES ('advisor', 'admin123', 'advisor')
    `);

    console.log('✅ Database tables created successfully!');
    console.log('✅ Default advisor account created (username: advisor, password: admin123)');
});

// Export database connection
module.exports = db;