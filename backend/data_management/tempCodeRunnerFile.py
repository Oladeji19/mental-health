app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)

# Register the blueprints
app.register_blueprint(registration_and_login)
app.register_blueprint(matching_listeners)

# Create the tables and add problems
if __name__ == '__main__':
    create_t