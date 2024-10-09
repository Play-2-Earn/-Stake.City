from flask import Flask
from flask_mail import Mail
from Register import register_bp
from login import login_bp
from Reset import reset_password_bp 
from google_reg import google_bp
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")

app = Flask(__name__)
# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'testingben12@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'qxxa yqbu boeq dojd'          # Replace with your email password
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)
app.secret_key = os.getenv('SECRET_KEY')


CORS(app, resources={r"/*": {"origins": "*"}})
# Register the blueprint

# Register the blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(reset_password_bp)
app.register_blueprint(google_bp, url_prefix='/google')

if __name__ == '__main__':
    app.run(port=8080,debug=True)
