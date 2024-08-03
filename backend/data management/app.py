from flask import Flask
from database_setup import create_tables,  add_problems
from  registration_and_login import registration_and_login
from match_listener import matching_listeners

# Create the Flask app
app = Flask(__name__)

# Register the blueprints
app.register_blueprint(registration_and_login)
app.register_blueprint(matching_listeners)

# Create the tables and add problems
if __name__ == '__main__':
    create_tables()
    add_problems()
    app.run(debug=True)
