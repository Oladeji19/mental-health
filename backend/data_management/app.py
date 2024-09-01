import os
from flask import Flask
from flask_mail import Mail
from registration_and_login import auth 
from healthcare import healthcare
#from matching_listeners import matching_listeners
from database_setup import create_tables

def create_app():
    app = Flask(__name__)
    
    app.secret_key = os.urandom(24)

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
    
    app.run(debug=True)
