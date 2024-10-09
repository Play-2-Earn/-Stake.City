from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import smtplib
from mongoengine import connect
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..api.models import User, PreviousPasswords  # Import the new model for previous passwords
import re
from dotenv import load_dotenv
# Create a Blueprint
reset_password_bp = Blueprint('reset', __name__)

# MongoDB configuration
import os
# Load environment
load_dotenv(dotenv_path=".env")

MONGODB_HOST = os.getenv("MONGO_URI")

# Connect to MongoDB on localhost
connect(
    db='stake_city',
    host=MONGODB_HOST,
)
# Function to send the reset password email
def send_reset_email(user_email):
    smtp_server = "smtp.gmail.com"
    port = 587
    sender_email = "testingben12@gmail.com"
    sender_pwd = "qxxa yqbu boeq dojd"
    subject = 'Password Reset Request'
    
    # Static reset link (no token)
    reset_link = "http://localhost:5000/api/reset_password"  

    body = f'''
        <html>
            <body>
                <p>You requested to reset your password. Please click on the link below to reset your password:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>If you did not make this request, you can safely ignore this email.</p>
            </body>
        </html>
    '''

    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = user_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))

    # Send the email
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(sender_email, sender_pwd)
    server.send_message(msg)
    server.close()

# Route to handle the "Forgot Password" request
@reset_password_bp.route('/api/forgot_password', methods=['POST'])
def forgot_password():
    user_data = request.json
    email = user_data.get('email')

    if not email:
        return jsonify({"message": "Email is required."}), 400

    # Check if user exists in the database
    user = User.objects(email=email).first()

    if not user:
        return jsonify({"message": "No user found with that email address."}), 404

    # Send reset password email
    send_reset_email(email)

    return jsonify({"message": "Password reset link has been sent to your email."}), 200

@reset_password_bp.route('/api/reset_password', methods=['POST'])
def reset_password():
    user_data = request.json
    email = user_data.get('email')
    new_password = user_data.get('new_password')
    confirm_password = user_data.get('confirm_password')  # Added confirm password

    if not all([email, new_password, confirm_password]):
        return jsonify({"message": "Email, new password, and confirm password are required."}), 400

    # Check if new password matches the confirmation password
    if new_password != confirm_password:
        return jsonify({"message": "New password and confirm password do not match."}), 400

    # Validate new password strength
    if not validate_password(new_password):
        return jsonify({
            "message": "New password must be at least 8 characters long, "
                       "contain at least one uppercase letter, one lowercase letter, "
                       "one number, and one special character."
        }), 400

    # Find the user by email
    user = User.objects(email=email).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # Check if the new password matches any of the last 3 saved passwords
    previous_passwords = PreviousPasswords.objects(email=email).order_by('-reset_timestamp').limit(3)
    for prev_password in previous_passwords:
        if check_password_hash(prev_password.old_password, new_password):
            return jsonify({"message": "New password cannot be one of the last 3 passwords."}), 400

    # Save the old password in the PreviousPasswords collection
    previous_password = PreviousPasswords(
        email=email,  # Store the email directly
        old_password=user.password  # Store the current password
    )
    previous_password.save()

    # Hash the new password and update the user's password
    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password
    user.save()

    return jsonify({"message": "Password has been reset successfully."}), 200


# Password validation function
def validate_password(password):
    min_length = 8
    has_uppercase = re.search(r'[A-Z]', password)
    has_lowercase = re.search(r'[a-z]', password)
    has_number = re.search(r'[0-9]', password)
    has_special = re.search(r'[!@#$%^&*]', password)

    if (len(password) < min_length or not has_uppercase or
            not has_lowercase or not has_number or not has_special):
        return False
    return True