from flask import Flask, render_template, request, session, redirect, url_for
from flask_socketio import join_room, leave_room, send, emit, SocketIO
import random
from string import ascii_letters

app = Flask(__name__)
app.config['SECRET_KEY'] = "sdafadfasdfsadfsdf"
socketio = SocketIO(app)

#Dictionary to store the rooms
rooms = {}

# Generate a unique code for the room
def generate_unique_code(length):
    while True:
        code = "".join(random.choice(ascii_letters) for _ in range(length))
        if code not in rooms:
            break
    return code

@app.route('/', methods=['POST', 'GET'])
def home():
    
    session.clear()

    # If the user submits the form
    if request.method == 'POST':
        name = request.form.get("name")
        code = request.form.get("code")
        action = request.form.get("action")
        experience = request.form.get("experience")
        feeling = request.form.get("feeling")
        additional_feeling = request.form.get("additionalFeeling")
        language = request.form.get("language")
        anything = request.form.get("anything")

        if not name:
            return render_template('home.html', error="Please enter a name", code=code, name=name, rooms=rooms)
       
        #if the action is join and the code is not entered, return an error
        if action == "join" and not code:
            return render_template('home.html', error="Please enter a room code to join", code=code, name=name, rooms=rooms)

        #if the action is create, generate a unique code for the room
        if action == "create":
            room = generate_unique_code(4)
            rooms[room] = {"members": {}, "messages": []}
        else:
            room = code

        #if the room does not exist, return an error
        if room not in rooms:
            return render_template('home.html', error="Room does not exist", code=code, name=name, rooms=rooms)
        
        #create a dictionary with the user information
        user_info = {
            "name": name,
            "experience": experience,
            "feeling": feeling,
            "additional_feeling": additional_feeling,
            "language": language,
            "anything": anything
        }

        #add the user to the room
        rooms[room]["members"][name] = user_info

        #set the room and name in the session
        session["room"] = room
        session["name"] = name
        
        #if method is get request then redirect to the room page
        return redirect(url_for("room"))
    
    return render_template('home.html', rooms=rooms)

# Room page
@app.route('/room')
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home"))
    return render_template('room.html', code=room, name=session.get("name"), messages=rooms[room]["messages"], members=rooms[room]["members"])

# handles incoming messages
@socketio.on('message')
def message(data):

    #get the room from the session
    room = session.get("room")
    if room not in rooms:
        return
    
    #create a dictionary with the name and message content
    content = {
        "name": session.get("name"),
        "message": data["data"]
    }

    #send the message to the room
    send(content, to=room)

    #add the message to the room's message list
    rooms[room]["messages"].append(content)

    print(f"{session.get('name')} said: {data['data']}")

#handles the connection of the user
@socketio.on('connect')
def connect(auth):

    #get the room and name of the user from the session
    room = session.get("room")
    name = session.get("name")

    #if the room or name is not set, return
    if not room or not name:
        return
    if room not in rooms:
        leave_room(room)
        return
    
    #join the room. method from flask_socketio
    join_room(room)

    # send a message to the room that the user has joined
    send({"name": name, "message": "has entered the chat room"}, to=room)

    #send the updated members list to the room. 'update_members' is the event name that is listened in the frontend
    emit('update_members', rooms[room]["members"], to=room)

    print(f"{name} joined room {room}")

# Disconnect the user
@socketio.on('disconnect')
def disconnect():

    #get the room and name from the session
    room = session.get("room")
    name = session.get("name")


    leave_room(room)

    #if the room is in the rooms, remove the user from the room
    if room in rooms:
        rooms[room]["members"].pop(name, None)

        #if there are no members in the room, delete the room
        if len(rooms[room]["members"]) <= 0:
            del rooms[room]
        else:
            emit('update_members', rooms[room]["members"], to=room)

    #send a message to the room that the user has left
    send({"name": name, "message": "has left the chat room"}, to=room)
    print(f"{name} has left the room {room}")

# Run the app
if __name__ == "__main__":
    socketio.run(app, debug=True)
