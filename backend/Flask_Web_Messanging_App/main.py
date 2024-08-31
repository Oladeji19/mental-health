from flask import Flask, render_template, request, session, jsonify, redirect, url_for
from flask_socketio import join_room, leave_room, send, emit, SocketIO
import random
from string import ascii_letters

app = Flask(__name__)
app.config['SECRET_KEY'] = "sdafadfasdfsadfsdf"
socketio = SocketIO(app)

rooms = {}

# Generate a unique code for the room
def generate_unique_code(length):
    while True:
        code = ""
        for _ in range(length):
            code += random.choice(ascii_letters)
        if code not in rooms:
            break
    return code

# Home page
@app.route('/', methods=['POST', 'GET'])
def home():
    session.clear()

    # If the form is submitted
    if request.method == 'POST':
        name = request.form.get("name")
        code = request.form.get("code")
        join = request.form.get("join", False)
        create = request.form.get("create", False)
        experience = request.form.get("experience")
        problems = request.form.getlist("problems[]")
        language = request.form.get("language[]")

        if not name:
            return render_template('home.html', error="Please enter a name", code=code, name=name, rooms=rooms)
        
        if join != False and not code:
            return render_template('home.html', error="Please enter a code", code=code, name=name, rooms=rooms)

      
        room = code

        # Check if the user wants to create a room
        if create != False:
            # Generate a unique code for the room and add it to the rooms dictionary
            room = generate_unique_code(4)
            rooms[room] = {"members": {}, "messages": []}
        # Check if the room exists
        elif code not in rooms:
            return render_template('home.html', error="Room does not exist", code=code, name=name, rooms=rooms)
        
        # Add user to the room
        user_info = {
            "name": name,
            "experience": experience,
            "problems": problems,
            "language": language
        }

        # Add user to the room
        rooms[room]["members"][name] = user_info
        
        #Store the room and name in the session
        session["room"] = room
        session["name"] = name
        
        return redirect(url_for("room"))
    
    #if not post request, render home.html
    return render_template('home.html', rooms=rooms)

# Room page
@app.route('/room')
def room():

    #Get the room from the session and check if it exists
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home"))
    return render_template('room.html', code=room, name=session.get("name"), messages=rooms[room]["messages"], members=rooms[room]["members"])

# API to get the room details
@socketio.on('message')
def message(data):

    # Get the room from the session
    room = session.get("room")

    # Check if the room exists
    if room not in rooms:
        return
    content = {
        "name": session.get("name"),
        "message": data["data"]
    }

    # Send the message to all clients in the room
    send(content, to=room)
    rooms[room]["messages"].append(content)
    print(f"{session.get('name')} said: {data['data']}")

@socketio.on('connect')
def connect(auth):
    room = session.get("room")
    name = session.get("name")
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    
    #method from flask_socketio to join the room
    join_room(room)

    # Send a message to all clients in the room that 
    send({"name": name, "message": "has entered the chat room"}, to=room)
    
    # Emit updated member list to all clients in the room
    emit('update_members', rooms[room]["members"], to=room)
    
    print(f"{name} joined room {room}")

# Disconnect event
@socketio.on('disconnect')
def disconnect():

    # Get the room and name from the session
    room = session.get("room")
    name = session.get("name")

   #method from flask_socketio to leave the room
    leave_room(room)

    # Check if the room exists
    if room in rooms:

        # Remove the user from the room
        rooms[room]["members"].pop(name, None)

        # If there are no members in the room, delete the room
        if len(rooms[room]["members"]) <= 0:
            del rooms[room]
        else:
            # Emit updated member list to all clients in the room
            emit('update_members', rooms[room]["members"], to=room)
    
    # Send a message to all clients in the room that the user has left
    send({"name": name, "message": "has left the chat room"}, to=room)
    print(f"{name} has left the room {room}")

# Run the app
if __name__ == "__main__":
    socketio.run(app, debug=True)