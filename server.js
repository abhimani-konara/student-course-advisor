// ===================================================================
// Student Course Advisor - Backend Server
// ===================================================================
// Developer: Abhimani Konara (KIC-DCSAI-251-F-028)
// Role: Backend Development, API Integration, Database Management
// Group 7 - NIBM Final Project
// Technology Stack: Node.js + Express + SWI-Prolog + SQLite
// ===================================================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const dbPath = path.join(__dirname, 'backend', 'database', 'students.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ==================== API ENDPOINTS ====================

// User Signup
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.run(query, [username, password, 'student'], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.json({ success: false, message: 'Username already exists' });
            } else {
                res.json({ success: false, message: 'Signup failed' });
            }
        } else {
            res.json({ success: true, message: 'Signup successful', userId: this.lastID });
        }
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    
    const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';
    db.get(query, [username, password, role], (err, user) => {
        if (err) {
            res.json({ success: false, message: 'Login error' });
        } else if (user) {
            res.json({ success: true, message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Get Recommendation from Prolog
app.post('/api/recommend', (req, res) => {
    const { username, stream, interest, gpa, subjects, results } = req.body;
    
    // First, get user ID
    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const userId = user.id;
        
        // Call Prolog to get recommendation
        const prologPath = path.join(__dirname, 'backend', 'prolog', 'advisor.pl');
        const prolog = spawn('swipl', [
            '-s', prologPath,
            '-g', `recommend("${stream}","${interest}",${gpa || 0},X),write(X),halt`,
            '-t', 'halt(1)'
        ]);

        let result = '';
        let error = '';

        prolog.stdout.on('data', (data) => {
            result += data.toString();
        });

        prolog.stderr.on('data', (data) => {
            error += data.toString();
        });

        prolog.on('close', (code) => {
            const recommendation = result.trim() || 'General Studies / Design & Multimedia';
            
            // Save to database
            const checkQuery = 'SELECT id FROM student_profiles WHERE user_id = ?';
            db.get(checkQuery, [userId], (err, profile) => {
                if (profile) {
                    // Update existing profile
                    const updateQuery = `
                        UPDATE student_profiles 
                        SET stream = ?, subject1 = ?, subject2 = ?, subject3 = ?,
                            result1 = ?, result2 = ?, result3 = ?, gpa = ?, 
                            interest = ?, recommendation = ?, updated_at = CURRENT_TIMESTAMP
                        WHERE user_id = ?
                    `;
                    db.run(updateQuery, [stream, subjects[0], subjects[1], subjects[2], 
                                        results[0], results[1], results[2], gpa, 
                                        interest, recommendation, userId]);
                } else {
                    // Insert new profile
                    const insertQuery = `
                        INSERT INTO student_profiles 
                        (user_id, stream, subject1, subject2, subject3, result1, result2, result3, gpa, interest, recommendation)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    db.run(insertQuery, [userId, stream, subjects[0], subjects[1], subjects[2],
                                        results[0], results[1], results[2], gpa, interest, recommendation]);
                }
            });
            
            res.json({ 
                success: true, 
                recommendation: recommendation 
            });
        });
    });
});

// Get all students (for advisor)
app.get('/api/students', (req, res) => {
    const query = `
        SELECT u.username, p.stream, p.interest, p.recommendation, p.gpa
        FROM users u
        LEFT JOIN student_profiles p ON u.id = p.user_id
        WHERE u.role = 'student'
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            res.json({ success: false, message: 'Error fetching students' });
        } else {
            res.json({ success: true, students: rows });
        }
    });
});

// Get feedback for a student
app.get('/api/feedback/:username', (req, res) => {
    const { username } = req.params;
    
    const query = `
        SELECT f.feedback, f.feedback_date
        FROM advisor_feedback f
        JOIN users u ON f.student_id = u.id
        WHERE u.username = ?
        ORDER BY f.feedback_date DESC
        LIMIT 1
    `;
    
    db.get(query, [username], (err, row) => {
        if (err) {
            res.json({ success: false, feedback: '' });
        } else {
            res.json({ success: true, feedback: row ? row.feedback : '' });
        }
    });
});

// Save feedback
app.post('/api/feedback', (req, res) => {
    const { student, advisor, feedback } = req.body;
    
    // Get student ID
    db.get('SELECT id FROM users WHERE username = ?', [student], (err, user) => {
        if (err || !user) {
            return res.json({ success: false, message: 'Student not found' });
        }
        
        const query = 'INSERT INTO advisor_feedback (student_id, advisor_username, feedback) VALUES (?, ?, ?)';
        db.run(query, [user.id, advisor, feedback], function(err) {
            if (err) {
                res.json({ success: false, message: 'Error saving feedback' });
            } else {
                res.json({ success: true, message: 'Feedback saved' });
            }
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🚀 Student Course Advisor Backend Server');
    console.log('='.repeat(60));
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`✅ API endpoints: http://localhost:${PORT}/api`);
    console.log(`✅ Frontend: http://localhost:${PORT}`);
    console.log(`✅ Database: ${dbPath}`);
    console.log(`✅ Prolog Engine: SWI-Prolog 9.2.9`);
    console.log('='.repeat(60));
    console.log('📝 Developed by: Abhimani Konara (KIC-DCSAI-251-F-028)');
    console.log('👥 Group 7 - NIBM Final Project');
    console.log('='.repeat(60));
});