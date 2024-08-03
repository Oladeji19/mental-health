import sqlite3
from aem import app
from flask import Blueprint, request, jsonify
from database_setup import create_connection
import bcrypt

# Create a blueprint for the registration and login routes
registration_and_login = Blueprint('auth', __name__)

# Helper function to hash a password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to verify a password
def verify_password(provided_password, stored_password_hash):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password_hash)

# Registers a new user
@registration_and_login.route('/register_user', methods=['POST'])
def register_user():

    data = request.json

    # Get the email, username, and password from the request data
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    # Check if the email, username, and password are provided
    if not all([email, username, password]):
        return jsonify({"error": "Email, username, and password are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        # Hash the password before storing it in the database
        hashed_password = hash_password(password)
        cursor.execute('''
        INSERT INTO user (email, username, password)
        VALUES (?, ?, ?)
        ''', (email, username, hashed_password))
        
        user_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Registers a new user
@registration_and_login.route('/register_listener', methods=['POST'])
def register_listener():

    # Get the email, username, password, language, experience level, and problem that listener specializes from the request data
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    language = data.get('language')
    experience_level = data.get('experience_level')
    problems = data.get('problems') 
    
    # Check if the email, username, password, language, experience level, and problems are provided
    if not all([email, username, password, language, experience_level, problems]):
        return jsonify({"error": "All fields are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        
        # Insert the listener into the database
        hashed_password = hash_password(password)
        cursor.execute('''
    INSERT INTO listener (email, username, password, language, experience_level)
    VALUES (?, ?, ?, ?, ?)
    ''', (email, username, hashed_password, language, experience_level))

        listener_id = cursor.lastrowid
        
        for problem_name in problems:

            # Get the problem ID where name is equal to the problem name
            cursor.execute('''
            SELECT id FROM problem WHERE name = ?
            ''', (problem_name,))
            problem = cursor.fetchone()
            
            # If the problem exists that the listener selected from drop down, insert the listener ID and problem ID into the listener_problem table
            if problem:
                problem_id = problem[0]
                cursor.execute('''
                INSERT INTO listener_problem (listener_id, problem_id)
                VALUES (?, ?)
                ''', (listener_id, problem_id))
            else:
                print(f"Problem '{problem_name}' not found")
        
        conn.commit()
        return jsonify({"message": "Listener registered successfully", "listener_id": listener_id}), 201
    
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Log in as user or listener
@registration_and_login.route('/login', methods=['POST'])
def login():
    
    username = request.json.get('username')
    password = request.json.get('password')
    
    # Check if the username and password are provided
    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:

        # Check if the person logging in is a user
        cursor.execute('''
        SELECT id, username, password FROM user
        WHERE username = ?
        ''', (username,))
        user = cursor.fetchone()
        
        # If the user exists and the password is correct, return a success message
        if user and verify_password(password, user[2]):
            return jsonify({
                "message": "Login successful",
                "user_id": user[0],
                "username": user[1],
                "user_type": "user"
            }), 200
        
        # If not a user, check if the person logging in is a listener
        cursor.execute('''
        SELECT id, username, password FROM listener
        WHERE username = ?
        ''', (username,))
        listener = cursor.fetchone()
        
        # If the listener exists and the password is correct, update the listener's availability to 'available'
        if listener and verify_password(password, listener[2]):
            cursor.execute('''UPDATE listener
            SET availability = 'available'
            WHERE id = ?
            ''', (listener[0],))
            
            conn.commit()

            return jsonify({
                "message": "Login successful",
                "user_id": listener[0],
                "username": listener[1],
                "user_type": "listener"
            }), 200
        
        # Error message if username or password is incorrect
        return jsonify({"error": "Invalid username or password"}), 401
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Log out as listener
@registration_and_login.route('/logout', methods=['POST'])
def logout():
    data = request.json
    user_id = data.get('user_id')
    user_type = data.get('user_type')

    # Check if the user ID and user type are provided
    if not user_id or not user_type:
        return jsonify({"error": "User ID and user type are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        if user_type == 'listener':

            # Update listener availability to 'unavailable'
            cursor.execute('''
            UPDATE listener
            SET availability = 'unavailable'
            WHERE id = ?
            ''', (user_id,))
        
            conn.commit()
            return jsonify({"message": "Logout successful a"}), 200
            
        return jsonify({"message": "Logout successful b"}), 200
    
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()





