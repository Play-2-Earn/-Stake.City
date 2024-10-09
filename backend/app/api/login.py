from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from mongoengine import connect
import sqlite3
import uuid
from user_agents import parse
import requests
from ..api.models import User, Login
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from flask import current_app
# Create a Blueprint
login_bp = Blueprint('login', __name__)

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
# Function to get the user's IP address
def get_ip_address():
    if request.environ.get('HTTP_X_FORWARDED_FOR'):
        return request.environ['HTTP_X_FORWARDED_FOR'].split(',')[0]
    else:
        return request.remote_addr

# Function to parse the user agent and extract details
def get_device_info(user_agent_string):
    user_agent = parse(user_agent_string)
    
    # Get browser name from the user_agent object
    browser_name = user_agent.browser.family  # Use `family` to get the name
    return browser_name  # Return only browser name for now

def get_device_details(browser):
    url = 'http://api.userstack.com/detect'
    access_key = 'eefbce10f0cfe1f24406cf8e8352342c'  # Replace with your Userstack API access key
    browser_name = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    params = {
        'access_key': access_key,
        'ua': browser_name
    }

    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()

            # Print the entire response for debugging
            print(f"Userstack API response: {data}")  # Log the full API response

            # Extract device type and name from the Userstack API
            device_type = data.get('device', {}).get('type', 'Unknown')
            device_name = data.get('device', {}).get('name', None)

            # Check if device name is None
            if device_name is None:
                os_name = data.get('os', {}).get('name', 'Unknown')
                print(f"No device name found. Using OS name: {os_name}")  # Log fallback information
                return 'Unknown', 'Unknown', os_name, device_type
            
            # If device name is found
            if device_type in ['mobile', 'tablet']:
                brand = data.get('device', {}).get('brand', 'Unknown')
                model = data.get('device', {}).get('model', 'Unknown')
                return brand, model, device_name, device_type
            
            # For desktop
            elif device_type == 'desktop':
                os_name = data.get('os', {}).get('name', 'Unknown')
                print(f"Desktop detected. Using OS name: {os_name}")  # Log desktop information
                return 'Unknown', 'Unknown', os_name, device_type
            
            else:
                return 'Unknown', 'Unknown', 'Unknown', 'Unknown'
        else:
            print(f"Error: Userstack API returned status code {response.status_code}")
            return 'Unknown', 'Unknown', 'Unknown', 'Unknown'
    except Exception as e:
        print(f"Error getting device details from Userstack: {e}")
        return 'Unknown', 'Unknown', 'Unknown', 'Unknown'


# Function to get location coordinates from IP address using ip-api.com
def get_coordinates_from_ip(ip_address):
    url = f'http://ip-api.com/json/{ip_address}'
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data['status'] == 'success':
                lat = data.get('lat', 0)
                lon = data.get('lon', 0)
                return lat, lon
            else:
                return 0, 0
        else:
            return 0, 0
    except Exception as e:
        print(f"Error getting coordinates: {e}")
        return 0, 0

# Function to get location details from latitude and longitude using Nominatim API
def get_location_from_coordinates(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            city = data.get('address', {}).get('city', 'Unknown')
            region = data.get('address', {}).get('state', 'Unknown')
            country = data.get('address', {}).get('country', 'Unknown')
            return city, region, country
        else:
            return 'Unknown', 'Unknown', 'Unknown'
    except Exception as e:
        print(f"Error getting location data: {e}")
        return 'Unknown', 'Unknown', 'Unknown'




@login_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if the user exists using either email or username
    user = User.objects.filter(email=email).first()

    if not user:
        return jsonify({"message": "User not found."}), 400

    # Extract user data
    hashed_password = user.password
    full_name = user.full_name

    # Verify the password
    if not check_password_hash(hashed_password, password):
        return jsonify({"message": "Invalid password."}), 400

    # Get additional login information
    ip_address = get_ip_address()  # Get client IP
    browser_name = request.headers.get('User-Agent')  # Get browser/device info

    # Get browser name
    browser_name = get_device_info(browser_name)

    # Get device details from Userstack (or other methods)
    brand, model, device_name, device_type = get_device_details(browser_name)

    # Get coordinates from IP address
    lat, lon = get_coordinates_from_ip(ip_address)

    # Get location from coordinates
    city, region, country = get_location_from_coordinates(lat, lon)

    # Insert login activity into the LoginActivity collection
    login_activity = Login(
        user_name=user.user_name,
        ip_address=ip_address,
        browser_name=browser_name,
        device_type=device_type,
        device_name=device_name,
        brand=brand,
        model=model,
        city=city,
        region=region,
        country=country
    )
    login_activity.save()

    # Generate JWT token
    payload = {
        'user_name': str(user.user_name),
        'exp': datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    # Successful login response
    return jsonify({
        "message": f"Login successful. Welcome, {full_name}!",
        "token": token
    }), 200
