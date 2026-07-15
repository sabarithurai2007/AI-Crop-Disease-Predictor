import os
import sqlite3
import mysql.connector
from mysql.connector import errorcode

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "")
DB_NAME = os.environ.get("DB_NAME", "crop_disease_db")

_is_sqlite = False

def get_db_connection():
    """
    Tries to connect to MySQL. If it fails, falls back to SQLite.
    Returns (connection, is_sqlite)
    """
    global _is_sqlite
    
    # 1. Try MySQL
    try:
        # First connect without database to create it if it doesn't exist
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD
        )
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        cursor.close()
        conn.close()
        
        # Now connect to the specific database
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        _is_sqlite = False
        return conn, False
    except Exception as mysql_err:
        print(f"MySQL connection failed: {mysql_err}")
        print("Falling back to SQLite (crop_disease.db)...")
        
        # 2. Fall back to SQLite
        try:
            db_dir = os.path.dirname(os.path.abspath(__file__))
            sqlite_path = os.path.join(db_dir, 'crop_disease.db')
            conn = sqlite3.connect(sqlite_path)
            # Enable row factory for dictionary-like results
            conn.row_factory = sqlite3.Row
            _is_sqlite = True
            return conn, True
        except Exception as sqlite_err:
            print(f"SQLite connection failed: {sqlite_err}")
            raise sqlite_err

def init_db():
    """
    Initialize the database, creating tables if they do not exist.
    """
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create Users table
        if is_sqlite:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    crop_name TEXT NOT NULL,
                    disease_name TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    status TEXT NOT NULL,
                    image_path TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            ''')
        else:
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS predictions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    crop_name VARCHAR(50) NOT NULL,
                    disease_name VARCHAR(100) NOT NULL,
                    confidence FLOAT NOT NULL,
                    status VARCHAR(20) NOT NULL,
                    image_path VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''')
            
        conn.commit()
        print("Database tables verified/initialized successfully.")
    except Exception as e:
        print(f"Error initializing database tables: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

# Database Helper Functions
def register_user(username, email, password_hash):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    success = False
    try:
        if is_sqlite:
            cursor.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                (username, email, password_hash)
            )
        else:
            cursor.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                (username, email, password_hash)
            )
        conn.commit()
        success = True
    except Exception as e:
        print(f"Database error registering user: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
    return success

def get_user_by_email(email):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    user = None
    try:
        if is_sqlite:
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            row = cursor.fetchone()
            if row:
                user = dict(row)
        else:
            cursor.execute("SELECT id, username, email, password_hash, created_at FROM users WHERE email = %s", (email,))
            row = cursor.fetchone()
            if row:
                user = {
                    "id": row[0],
                    "username": row[1],
                    "email": row[2],
                    "password_hash": row[3],
                    "created_at": row[4]
                }
    except Exception as e:
        print(f"Database error fetching user by email: {e}")
    finally:
        cursor.close()
        conn.close()
    return user

def get_user_by_id(user_id):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    user = None
    try:
        if is_sqlite:
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                user = dict(row)
        else:
            cursor.execute("SELECT id, username, email, created_at FROM users WHERE id = %s", (user_id,))
            row = cursor.fetchone()
            if row:
                user = {
                    "id": row[0],
                    "username": row[1],
                    "email": row[2],
                    "created_at": row[3]
                }
    except Exception as e:
        print(f"Database error fetching user by id: {e}")
    finally:
        cursor.close()
        conn.close()
    return user

def save_prediction(user_id, crop_name, disease_name, confidence, status, image_path):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    pred_id = None
    try:
        if is_sqlite:
            cursor.execute(
                """INSERT INTO predictions 
                   (user_id, crop_name, disease_name, confidence, status, image_path) 
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (user_id, crop_name, disease_name, confidence, status, image_path)
            )
            pred_id = cursor.lastrowid
        else:
            cursor.execute(
                """INSERT INTO predictions 
                   (user_id, crop_name, disease_name, confidence, status, image_path) 
                   VALUES (%s, %s, %s, %s, %s, %s)""",
                (user_id, crop_name, disease_name, confidence, status, image_path)
            )
            pred_id = cursor.lastrowid
        conn.commit()
    except Exception as e:
        print(f"Database error saving prediction: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
    return pred_id

def get_predictions(user_id):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    history = []
    try:
        if is_sqlite:
            cursor.execute(
                "SELECT * FROM predictions WHERE user_id = ? ORDER BY created_at DESC", 
                (user_id,)
            )
            rows = cursor.fetchall()
            history = [dict(row) for row in rows]
        else:
            cursor.execute(
                """SELECT id, user_id, crop_name, disease_name, confidence, status, image_path, created_at 
                   FROM predictions WHERE user_id = %s ORDER BY created_at DESC""", 
                (user_id,)
            )
            rows = cursor.fetchall()
            for row in rows:
                history.append({
                    "id": row[0],
                    "user_id": row[1],
                    "crop_name": row[2],
                    "disease_name": row[3],
                    "confidence": row[4],
                    "status": row[5],
                    "image_path": row[6],
                    "created_at": row[7].strftime("%Y-%m-%d %H:%M:%S") if row[7] else None
                })
    except Exception as e:
        print(f"Database error fetching predictions: {e}")
    finally:
        cursor.close()
        conn.close()
    return history

def get_prediction_by_id(pred_id):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    prediction = None
    try:
        if is_sqlite:
            cursor.execute("SELECT * FROM predictions WHERE id = ?", (pred_id,))
            row = cursor.fetchone()
            if row:
                prediction = dict(row)
        else:
            cursor.execute(
                """SELECT id, user_id, crop_name, disease_name, confidence, status, image_path, created_at 
                   FROM predictions WHERE id = %s""", 
                (pred_id,)
            )
            row = cursor.fetchone()
            if row:
                prediction = {
                    "id": row[0],
                    "user_id": row[1],
                    "crop_name": row[2],
                    "disease_name": row[3],
                    "confidence": row[4],
                    "status": row[5],
                    "image_path": row[6],
                    "created_at": row[7].strftime("%Y-%m-%d %H:%M:%S") if row[7] else None
                }
    except Exception as e:
        print(f"Database error fetching prediction by id: {e}")
    finally:
        cursor.close()
        conn.close()
    return prediction

def get_predictions_statistics(user_id):
    conn, is_sqlite = get_db_connection()
    cursor = conn.cursor()
    stats = {
        "total": 0,
        "healthy": 0,
        "diseased": 0,
        "avg_confidence": 0.0,
        "crop_counts": {},
        "disease_counts": {},
        "timeline": []
    }
    try:
        # Load basic aggregates
        if is_sqlite:
            cursor.execute("SELECT COUNT(*), AVG(confidence) FROM predictions WHERE user_id = ?", (user_id,))
            total, avg_conf = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) FROM predictions WHERE user_id = ? AND status = 'Healthy'", (user_id,))
            healthy = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM predictions WHERE user_id = ? AND status = 'Diseased'", (user_id,))
            diseased = cursor.fetchone()[0]
        else:
            cursor.execute("SELECT COUNT(*), AVG(confidence) FROM predictions WHERE user_id = %s", (user_id,))
            total, avg_conf = cursor.fetchone()
            
            cursor.execute("SELECT COUNT(*) FROM predictions WHERE user_id = %s AND status = 'Healthy'", (user_id,))
            healthy = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM predictions WHERE user_id = %s AND status = 'Diseased'", (user_id,))
            diseased = cursor.fetchone()[0]
            
        stats["total"] = total or 0
        stats["healthy"] = healthy or 0
        stats["diseased"] = diseased or 0
        stats["avg_confidence"] = round(float(avg_conf or 0.0), 2)
        
        # Load crop distribution
        if is_sqlite:
            cursor.execute("SELECT crop_name, COUNT(*) FROM predictions WHERE user_id = ? GROUP BY crop_name", (user_id,))
        else:
            cursor.execute("SELECT crop_name, COUNT(*) FROM predictions WHERE user_id = %s GROUP BY crop_name", (user_id,))
        for crop, count in cursor.fetchall():
            stats["crop_counts"][crop] = count
            
        # Load disease distribution (only diseased crops)
        if is_sqlite:
            cursor.execute("SELECT disease_name, COUNT(*) FROM predictions WHERE user_id = ? AND status = 'Diseased' GROUP BY disease_name", (user_id,))
        else:
            cursor.execute("SELECT disease_name, COUNT(*) FROM predictions WHERE user_id = %s AND status = 'Diseased' GROUP BY disease_name", (user_id,))
        for disease, count in cursor.fetchall():
            stats["disease_counts"][disease] = count
            
        # Load daily history timeline (last 7 days/diagnoses)
        # We group by date
        if is_sqlite:
            cursor.execute(
                """SELECT date(created_at) as diag_date, COUNT(*), SUM(CASE WHEN status='Diseased' THEN 1 ELSE 0 END) as diseased_count
                   FROM predictions WHERE user_id = ? GROUP BY diag_date ORDER BY diag_date ASC LIMIT 10""", 
                (user_id,)
            )
        else:
            cursor.execute(
                """SELECT DATE(created_at) as diag_date, COUNT(*), SUM(CASE WHEN status='Diseased' THEN 1 ELSE 0 END) as diseased_count
                   FROM predictions WHERE user_id = %s GROUP BY diag_date ORDER BY diag_date ASC LIMIT 10""", 
                (user_id,)
            )
            
        rows = cursor.fetchall()
        for row in rows:
            stats["timeline"].append({
                "date": str(row[0]),
                "total": row[1],
                "diseased": row[2]
            })
            
    except Exception as e:
        print(f"Database error fetching statistics: {e}")
    finally:
        cursor.close()
        conn.close()
    return stats
