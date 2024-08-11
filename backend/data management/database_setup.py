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
                        time_sent TEXT,
                        user_type TEXT
        
        )
        ''')
        # Create the problem table
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS problem (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
        ''')
        
        # Create the listener table. When the listeners, registers they select their problem specialization, availability, language, if they have 2-factor authentication and experience level
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS listener (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            language TEXT NOT NULL,
            experience_level TEXT NOT NULL,
            availability TEXT DEFAULT 'unavailable'
            has_2_factor INTEGER DEFAULT 0
        )
        ''')

        # Create the listener_problem table. This table stores the problems that a listener can help. 
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS listener_problem (
            listener_id INTEGER,
            problem_id INTEGER,
            FOREIGN KEY (listener_id) REFERENCES listener (id),
            FOREIGN KEY (problem_id) REFERENCES problem (id),
            PRIMARY KEY (listener_id, problem_id)
        )
        ''')
        
        # Create the user table. This table stores the user's email, username, password, and if they have 2-factor authentication
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
            has_2_factor INTEGER DEFAULT 0
        )
        ''')
        
        # Create the active_session table. This table stores the active session between a user and a listener
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS session (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                problem_id INTEGER,
                listener_id INTEGER,
                status TEXT DEFAULT 'active',
                start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                end_time TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user (id),
                FOREIGN KEY (problem_id) REFERENCES problem (id),
                FOREIGN KEY (listener_id) REFERENCES listener (id)
            )
            ''') 

        # Create the messages table. This table stores the messages exchanged between a user and a listener
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            sender_type TEXT NOT NULL,  -- 'user' or 'listener'
            sender_id INTEGER NOT NULL,  -- id from either user or listener table
            message TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES active_session (id)
        )
        ''')
    
        conn.commit()
        print("Tables created successfully")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

# Adds a problem to the database
def add_problem(problem_name):
    conn = create_connection()
    cursor = conn.cursor()
        
    try:
        cursor.execute('SELECT id FROM problem WHERE name = ?', (problem_name,))
        existing_problem = cursor.fetchone()
            
        if existing_problem:
            print(f"Problem '{problem_name}' already exists in the database.")
        else:
            cursor.execute('INSERT INTO problem (name) VALUES (?)', (problem_name,))
            conn.commit()
            print(f"Problem '{problem_name}' added successfully.")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()
  
# Adds problems to the database
def add_problems():
    problems = ['Grief', 'Health Issues', 'Disappointments', 'Family Issues', 'Work Issues', 'Loneliness', 'Worldwide Issues', 'Boring Tasks', 'Social Tasks', 'Delays', 
                'Weather Conditions', 'Health', 'Phobias', 'Failure', 'Environmental Threats', 'Worldwide Threats', 'Social Fear', 'Popularity', 'Appearances', 'Talent', 'Skill', 'Traits']

    for problem in problems:
        add_problem(problem)

