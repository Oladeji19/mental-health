import sqlite3
from flask import Blueprint, request, jsonify
from database_setup import create_connection
import bcrypt
from flask_mail import Mail, Message 
from datetime import datetime, timedelta
import secrets

auth = Blueprint('auth', __name__)

# Hashes the password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Verifies the password
def verify_password(provided_password, stored_password_hash):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password_hash)

# Registers a user
@auth.route('/register_user', methods=['POST'])
def register_user():
    data = request.json
    required_fields = ['email', 'username', 'password']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Email, username, and password are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        # Insert the user's email, username, and hashed password into the user table
        hashed_password = hash_password(data['password'])
        cursor.execute('''
        INSERT INTO user (email, username, password)
        VALUES (?, ?, ?)
        ''', (data['email'], data['username'], hashed_password))

        user_id = cursor.lastrowid
        conn.commit()
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username or email already exists"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Login user
@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    if not all(key in data for key in ['username', 'password']):
        return jsonify({"error": "Username and password are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:
        # Check the user table for the username
        cursor.execute('''
        SELECT id, username, password, has_2_factor FROM user
        WHERE username = ?
        ''', (data['username'],))
        user = cursor.fetchone()
        
        # If a user is found, verify the password
        if user and verify_password(data['password'], user[2]):
            if user[3]:  # has_2_factor
                return initiate_2fa(user[0], user[1])
            
            # If the login is successful, return the user ID and username
            return jsonify({
                "message": "Login successful",
                "user_id": user[0],
                "username": user[1]
            }), 200
        
        # If no user is found, return an error
        return jsonify({"error": "Invalid username or password"}), 401
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#logout user
@auth.route('/logout', methods=['POST'])
def logout():
    data = request.json
    if not all(key in data for key in ['user_id']):
        return jsonify({"error": "User ID and user type are required"}), 400
    
   
#initiates 2fa
def initiate_2fa(user_id, username):

    conn = create_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(f'SELECT email FROM user WHERE id = ?', (user_id,))
        email = cursor.fetchone()[0]
        
        otp = secrets.randbelow(90000) + 10000  # 5-digit OTP
        expiration_time = datetime.now() + timedelta(minutes=5)
        
        # First, try to update an existing request
        cursor.execute('''
        UPDATE current_verification_requests 
        SET code_sent = ?, time_sent = ? 
        WHERE username = ?
        ''', (otp, expiration_time.isoformat(), username))
        
        # If no rows were updated, insert a new request
        if cursor.rowcount == 0:
            cursor.execute('''
            INSERT INTO current_verification_requests (username, code_sent, time_sent)
            VALUES (?, ?, ?)
            ''', (username, otp, expiration_time.isoformat()))
        
        conn.commit()
        
        send_2fa_email(email, otp)
        
        return jsonify({"message": "2FA code sent", "requires_2fa": True}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

def send_2fa_email(email, otp):
    message = Message(subject="Your Verification Code", recipients=[email], sender='your_email@example.com')
    message.body = f"Your verification code is: {otp}"
    mail = Mail()  # Assuming you've set up Flask-Mail in your app
    mail.send(message)

@auth.route('/2fa/verify', methods=['POST'])
def verify_2fa():
    data = request.json
    if not all(key in data for key in ['username', 'code']):
        return jsonify({"error": "Username, code, and user type are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    try:

        # Check if there is a pending 2FA request for the user
        cursor.execute('''
        SELECT code_sent, time_sent FROM current_verification_requests
        WHERE username = ?
        ''', (data['username']))
        result = cursor.fetchone()
        
        if not result:
            return jsonify({"error": "No pending 2FA request found"}), 400
        
        # Check if the 2FA code has expired
        stored_code, expiration_time = result
        if datetime.now() > datetime.fromisoformat(expiration_time):
            return jsonify({"error": "2FA code has expired"}), 400
        
        # Check if the provided 2FA code matches the stored code
        if int(data['code']) != stored_code:
            return jsonify({"error": "Invalid 2FA code"}), 401
        
        # If the 2FA code is valid, update the user's availability and delete the verification request
        cursor.execute(f'SELECT id FROM user WHERE username = ?', (data['username'],))
        user_id = cursor.fetchone()[0]
        
        
        conn.commit()
        
        return jsonify({
            "message": "2FA verified successfully",
            "user_id": user_id,
            "username": data['username'],
        
        }), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Toggle 2FA
@auth.route('/2fa/toggle', methods=['POST'])
def toggle_2fa():
    data = request.json
    if not all(key in data for key in ['username', 'enable']):
        return jsonify({"error": "Username and enable flag are required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    try:
        # Update the user's 2FA status
        cursor.execute('UPDATE user SET has_2_factor = ? WHERE username = ?',
                       (1 if data['enable'] else 0, data['username']))
        conn.commit()
        action = "enabled" if data['enable'] else "disabled"
        return jsonify({"message": f"Two-factor authentication {action}"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
