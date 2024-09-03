import os
from dotenv import load_dotenv
from flask import Flask
from flask_mail import Mail
from registration_and_login import auth 
from healthcare import healthcare
#from matching_listeners import matching_listeners
from database_setup import create_tables
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()
    app.config["CORS_HEADERS"] = "Content-Type"
    #app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

    
    # Configure email settings
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = os.getenv('EMAIL')
    app.config['MAIL_PASSWORD'] = os.getenv('APP_PASSWORD')
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    
    # Initialize Flask-Mail
    mail = Mail(app)
    
    # Register blueprints
    app.register_blueprint(auth)
    app.register_blueprint(healthcare)
    
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    # Create tables and add problems
    create_tables()
    
    app.run(debug=True, port = 5001)