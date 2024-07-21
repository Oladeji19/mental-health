from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Dictionary to store mental health problems and associated listeners
mental_health_problems = {
    "World Issues": ["listener1", "listener2", "listener3"],
    "Relationship Issues": ["listener4", "listener5", "listener6"],
    "Family Issues": ["listener7", "listener8", "listener9"],
    "Other": ["listener10", "listener11", "listener12"]
}

# Dictionary to store active sessions
active_sessions = {}

#Join the session
@app.route('/join_problem', methods=['POST'])
def join_problem():

    #Get the problem and user_id from the request
    data = request.json
    problem = data.get('problem')
    user_id = data.get('user_id')

    #Check if the user is already in a session
    if user_id in active_sessions:
        return jsonify({"error": "User already in a session"}), 400
    
    #get the available listeners for the problem
    available_listeners = mental_health_problems[problem]

    if not available_listeners:
        return jsonify({"error": "No listeners available for this problem"}), 503

    #Assign a random listener to the user
    listener = random.choice(available_listeners)
    active_sessions[user_id] = {"problem": problem, "listener": listener}

    return jsonify({
        "message": "Successfully joined problem",
        "problem": problem,
        "listener": listener
    }), 200

#Leave the session
@app.route('/leave_session', methods=['POST'])
def leave_session():
    data = request.json
    user_id = data.get('user_id')

    if user_id not in active_sessions:
        return jsonify({"error": "User not in an active session"}), 400

    #Remove the user from the active sessions
    del active_sessions[user_id]
    return jsonify({"message": "Successfully left the session"}), 200

@app.route('/active_sessions', methods=['GET'])
def get_active_sessions():
    return jsonify(active_sessions), 200

if __name__ == '__main__':
    app.run(debug=False)