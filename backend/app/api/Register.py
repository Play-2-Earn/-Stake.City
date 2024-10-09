from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail
from mongoengine import connect
from werkzeug.security import generate_password_hash
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from ..api.models import User  # Import the User model
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from flask import current_app
# Create a Blueprint
register_bp = Blueprint('register', __name__)
import os
# Load environment
load_dotenv(dotenv_path=".env")

MONGODB_HOST = os.getenv("MONGO_URI")

# Connect to MongoDB on localhost
connect(
    db='stake_city',
    host=MONGODB_HOST,
)
def validate_password(password):
    """Validates the password based on certain criteria."""
    min_length = 8
    has_uppercase = re.search(r'[A-Z]', password)
    has_lowercase = re.search(r'[a-z]', password)
    has_number = re.search(r'[0-9]', password)
    has_special = re.search(r'[!@#$%^&*]', password)

    return (len(password) >= min_length and
            has_uppercase and
            has_lowercase and
            has_number and
            has_special)

def send_verification_email(user_name, receiver_email):
    """Sends a verification email to the user."""
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = current_app.config['MAIL_USERNAME']
    sender_pwd = current_app.config['MAIL_PASSWORD']
    
    subject = 'Email Verification'
    verification_link = f"http://localhost:5000/api/verify_email/{user_name}"
    
    body = f'''
        <html>
            <body>
                <p>Please click on the verification link: 
                <a href="{verification_link}">Click Here</a></p>
            </body>
        </html>
        '''
    
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_pwd)
        
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender_email
        msg["To"] = receiver_email
        msg.attach(MIMEText(body, "html"))
        
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
@register_bp.route('/api/register', methods=['POST'])
def register():
    user_data = request.get_json()

    # Extract details from request
    user_name = user_data.get('username')
    full_name = user_data.get('fullName')
    age = user_data.get('age')
    gender = user_data.get('gender')
    password = user_data.get('password')
    email = user_data.get('email')
    mobile = user_data.get('phone')
    terms_accepted = user_data.get('terms_accepted', True)

    # Validate password
    if not validate_password(password):
        return jsonify({"error": "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."}), 400
    
    # Ensure terms and conditions are accepted
    if not terms_accepted:
        return jsonify({"error": "You must accept the terms and conditions."}), 400

    # Check if the user already exists
    if User.objects(email=email).first() or User.objects(user_name=user_name).first():
        return jsonify({"error": "Email or username is already registered."}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Prepare user data
    new_user = User(
        user_name=user_name,
        full_name=full_name,
        age=age,
        gender=gender,
        password=hashed_password,
        email=email,
        mobile=mobile,
        terms_accepted=terms_accepted
    )

    # Save the user temporarily
    new_user.save()


    # Send verification email
    if send_verification_email(user_name, email):
        return jsonify({
            "message": "Verification email sent. Please verify your email to complete registration.",
        }), 200
    else:
        return jsonify({"error": "Failed to send verification email."}), 200 #Temporary pass
@register_bp.route('/api/verify_email/<user_name>', methods=['GET'])
def verify_email(user_name):
    """Verify email and complete user registration."""
    user = User.objects(user_name=user_name).first()
    
    if user and not user.verified_email:
        user.verified_email = True
        user.save()
        return jsonify({"message": "Email verified and registration completed!"}), 200
    else:
        return jsonify({"error": "User not found or already verified."}), 400
