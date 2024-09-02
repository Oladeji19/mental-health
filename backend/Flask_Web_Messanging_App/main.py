from flask import Flask, render_template, request, session, redirect, url_for
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
        code = "".join(random.choice(ascii_letters) for _ in range(length))
        if code not in rooms:
            break
    return code

@app.route('/', methods=['POST', 'GET'])
def home():
    session.clear()
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
        
        if action == "join" and not code:
            return render_template('home.html', error="Please enter a room code to join", code=code, name=name, rooms=rooms)

        if action == "create":
            room = generate_unique_code(4)
            rooms[room] = {"members": {}, "messages": []}
        else:
            room = code
            if room not in rooms:
                return render_template('home.html', error="Room does not exist", code=code, name=name, rooms=rooms)
        
        user_info = {
            "name": name,
            "experience": experience,
            "feeling": feeling,
            "additional_feeling": additional_feeling,
            "language": language,
            "anything": anything
        }

        rooms[room]["members"][name] = user_info
        session["room"] = room
        session["name"] = name
        
        return redirect(url_for("room"))
    
    return render_template('home.html', rooms=rooms)

# Room page
@app.route('/room')
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in rooms:
        return redirect(url_for("home"))
    return render_template('room.html', code=room, name=session.get("name"), messages=rooms[room]["messages"], members=rooms[room]["members"])

# API to get the room details
@socketio.on('message')
def message(data):
    room = session.get("room")
    if room not in rooms:
        return
    content = {
        "name": session.get("name"),
        "message": data["data"]
    }
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
    
    join_room(room)
    send({"name": name, "message": "has entered the chat room"}, to=room)
    emit('update_members', rooms[room]["members"], to=room)
    print(f"{name} joined room {room}")

@socketio.on('disconnect')
def disconnect():
    room = session.get("room")
    name = session.get("name")
    leave_room(room)
    if room in rooms:
        rooms[room]["members"].pop(name, None)
        if len(rooms[room]["members"]) <= 0:
            del rooms[room]
        else:
            emit('update_members', rooms[room]["members"], to=room)
    send({"name": name, "message": "has left the chat room"}, to=room)
    print(f"{name} has left the room {room}")

# Run the app
if __name__ == "__main__":
    socketio.run(app, debug=True)
