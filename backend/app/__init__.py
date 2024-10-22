from flask import Flask
from flask_mail import Mail
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=".env")

def create_app():
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

    CORS(app, supports_credentials=True ,resources={r"/*": {"origins": "http://localhost:5173", "allow_headers": ["Authorization", "Content-Type"]}})

    # Register blueprints
    from .api.Register import register_bp
    from .api.login import login_bp
    from .api.Reset import reset_password_bp
    from .api.question import question_bp
    from .api.answer import answer_bp
    from .api.User_dash import dashboard_bp

    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(reset_password_bp)
    app.register_blueprint(question_bp)
    app.register_blueprint(answer_bp)
    app.register_blueprint(dashboard_bp)


    return app
