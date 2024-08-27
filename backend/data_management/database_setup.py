import sqlite3

# Create a connection to the database
def create_connection():
    conn = sqlite3.connect('m_health.db')
    return conn

# Create tables if they do not exist
def create_tables():
    conn = None
    try:
        conn = create_connection()
        cursor = conn.cursor()

        cursor.execute('''
        CREATE TABLE IF NOT EXISTS current_verification_requests(
                        username TEXT NOT NULL UNIQUE,
                        code_sent INTEGER,
                        time_sent TEXT
        )
        ''')
        
        # Create the user table. This table stores the user's email, username, password, and if they have 2-factor authentication
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            has_2_factor INTEGER DEFAULT 0,
            sleep_goal_hours INT,
            exercise_goal_minutes INT,
            meditation_goal INT, 
            last_healthcare_log TEXT,
            has_entered INT DEFAULT 0,
            list_of_last_7_days_sleep TEXT,
            list_of_last_7_days_exercise TEXT,
            list_of_last_7_days_meditation TEXT
        )
        ''')
        
        conn.commit()
        print("Tables created successfully")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()
