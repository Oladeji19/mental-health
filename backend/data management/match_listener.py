import sqlite3
from flask import Flask, request, jsonify, Blueprint
from database_setup import create_connection, create_tables, add_problems

matching_listeners = Blueprint('matching_listeners', __name__)

# Sends a message from the user or listener to the other party
@matching_listeners.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    session_id = data.get('session_id')
    sender_type = data.get('sender_type')
    sender_id = data.get('sender_id')
    message = data.get('message')

    # Check if the session ID, sender type, sender ID, and message are provided
    if not all([session_id, sender_type, sender_id, message]):
        return jsonify({"error": "All fields are required"}), 400
    
    # Check if the sender type is valid
    if sender_type not in ['user', 'listener']:
        return jsonify({"error": "Invalid sender type"}), 400

    conn = create_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
        INSERT INTO messages (session_id, sender_type, sender_id, message)
        VALUES (?, ?, ?, ?)
        ''', (session_id, sender_type, sender_id, message))

        message_id = cursor.lastrowid
        conn.commit()

        return jsonify({
            "message": "Message sent successfully",
            "message_id": message_id
        }), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@matching_listeners.route('/get_session_history/<int:user_id>', methods=['GET'])
def get_session_history(user_id):
    conn = create_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
        SELECT as.id, as.problem_id, p.name as problem_name, 
               as.listener_id, l.username as listener_name, 
               as.start_time, as.end_time, as.status
        FROM session as
        JOIN problem p ON as.problem_id = p.id
        JOIN listener l ON as.listener_id = l.id
        WHERE as.user_id = ?
        ORDER BY as.start_time DESC
        ''', (user_id,))

        sessions = cursor.fetchall()

        return jsonify({
            "user_id": user_id,
            "sessions": [
                {
                    "id": session[0],
                    "problem_id": session[1],
                    "problem_name": session[2],
                    "listener_id": session[3],
                    "listener_name": session[4],
                    "start_time": session[5],
                    "end_time": session[6],
                    "status": session[7]
                } for session in sessions
            ]
        }), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Get all messages in a session
@matching_listeners.route('/get_session_messages/<int:session_id>', methods=['GET'])
def get_session_messages(session_id):
    conn = create_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
        SELECT id, sender_type, sender_id, message, timestamp
        FROM messages
        WHERE session_id = ?
        ORDER BY timestamp ASC
        ''', (session_id,))

        messages = cursor.fetchall()

        return jsonify({
            "session_id": session_id,
            "messages": [
                {
                    "id": msg[0],
                    "sender_type": msg[1],
                    "sender_id": msg[2],
                    "message": msg[3],
                    "timestamp": msg[4]
                } for msg in messages
            ]
        }), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


# match listern with user
@matching_listeners.route('/match_listener', methods=['POST'])
def match_listener():

    # Get the user ID, problem type, experience level, and language from the request data
    data = request.json

    user_id = data.get('user_id')
    preferences = data.get('preferences', {})
    problem_name = preferences.get('problemType')
    experience_level = preferences.get('experienceLevel')
    language = preferences.get('language')
 
    # Check if the user ID, problem type, experience level, and language are provided
    if not all([user_id, problem_name, experience_level, language]):
        return jsonify({"error": "User ID, problem type, experience level, language"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:

        # Get the problem ID where name is equal to the problem name
        cursor.execute('SELECT id FROM problem WHERE name = ?', (problem_name,))
        problem = cursor.fetchone()
        
        # If the problem does not exist, return an error
        if not problem:
            return jsonify({"error": "Problem not found"}), 404
        
        problem_id = problem[0]

        # Get all listeners that can help with the problem
        cursor.execute('''
        SELECT l.id, l.username, l.language, l.experience_level, p.name AS problem_name
        FROM listener l
        JOIN listener_problem lp ON l.id = lp.listener_id
        JOIN problem p ON lp.problem_id = p.id
        WHERE l.availability = 'available' 
        ''')
        listeners = cursor.fetchall()

      
        for listener in listeners:
            print(listener)
        
        # If no listeners are available, return an error
        if not listeners:
            return jsonify({"error": "No listeners available right now"}), 404
        
        # Calculate match scores for each listener
        scored_listeners = []
        for listener in listeners:
            listener_data = {
                "language": listener[2],
                "experience_level": listener[3],
                "problem_name": listener[4]
            }
            score = calculate_match_score(preferences, listener_data)
            print(f"Listener {listener[1]} scored {score}")
            scored_listeners.append((listener, score))
        
        # Sort listeners by score (highest first) and choose the best match
        best_match = max(scored_listeners, key=lambda x: x[1])[0]
        print(f"Best match: {best_match[1]}")
        
        # Insert the active session into the database
        cursor.execute('''
        INSERT INTO session (user_id, problem_id, listener_id, status)
        VALUES (?, ?, ?, 'active')
        ''', (user_id, problem_id, best_match[0]))
        
        session_id = cursor.lastrowid
        
        # Update the listener's availability to "unavailable" when they join session
        cursor.execute('''
        UPDATE listener
        SET availability = ?
        WHERE id = ?
        ''', ('unavailable', best_match[0]))
    
        # Create system message for session start
        cursor.execute('''
        INSERT INTO messages (session_id, sender_type, sender_id, message)
        VALUES (?, 'system', 0, ?)
        ''', (session_id, f"Session started. User {user_id} matched with listener {best_match[1]}."))
        conn.commit()

        # Return the session ID, listener ID, and listener name
        return jsonify({
            "message": "Listener matched successfully",
            "session_id": session_id,
            "listener_id": best_match[0],
            "listener_name": best_match[1]
        }), 201
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

#end the session between the user and the listener
@matching_listeners.route('/end_session', methods=['POST'])
def end_session():
    data = request.json
    session_id = data.get('session_id')
    
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400
    
    conn = create_connection()
    cursor = conn.cursor()
    
    try:

        # Get the listener ID from the session table
        cursor.execute('''
        SELECT listener_id FROM session
        WHERE id = ?
        ''', (session_id,))
        session = cursor.fetchone()
        
        if not session:
            return jsonify({"error": "Session not found"}), 404
        
        listener_id = session[0]

        # Delete the session from the session table
        cursor.execute('''
        DELETE FROM session
        WHERE id = ?
        ''', (session_id,))

        # Update the session status to 'completed' and set the end time
        cursor.execute('''
        UPDATE session
        SET status = 'completed', end_time = CURRENT_TIMESTAMP
        WHERE id = ?
        ''', (session_id,))
        
        # Update the listener's availability to "available"
        cursor.execute('''
        UPDATE listener
        SET availability = 'available'
        WHERE id = ?
        ''', (listener_id,))

        # Create final system message
        cursor.execute('''
        INSERT INTO messages (session_id, sender_type, sender_id, message)
        VALUES (?, 'system', 0, ?)
        ''', (session_id, "Session ended."))
        
        conn.commit()
        
        conn.commit()
        
        return jsonify({"message": "Session ended successfully"}), 200
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Determies the best listener for a user
def calculate_match_score(user_preferences, listener):
    score = 0
    
    if listener['problem_name'] == user_preferences['problemType']:
        score += 4
    
    if listener['experience_level'] == user_preferences['experienceLevel']:
        score += 3
    
    if user_preferences['language'] in listener['language']:
        score += 2
   
    return score
