from flask import Blueprint, request, jsonify
from mongoengine import connect, ValidationError
from ..api.models import User , UserDashboard
from dotenv import load_dotenv
import os
from ..api.Register import validate_password
from bson import ObjectId  # Import for handling MongoDB ObjectId

# Create a new Blueprint for players
user_bp = Blueprint('user', __name__)

# Load environment variables
load_dotenv(dotenv_path=".env")

# MongoDB configuration
MONGODB_HOST = os.getenv("MONGO_URI")

# Connect to MongoDB
connect(
    db='stake_city',
    host=MONGODB_HOST,
)
import re

@user_bp.route('/api/get_all_users_sorted', methods=['GET'])
def get_all_users_sorted():
    try:
        # Fetch all users and dashboards in a single query
        users = User.objects()
        dashboards = {dashboard.user_name: dashboard for dashboard in UserDashboard.objects()}

        # Combine user and dashboard information
        users_with_dashboard = []
        for user in users:
            dashboard = dashboards.get(user.user_name)  # Retrieve dashboard from the mapping

            # Handle cases where a dashboard is missing
            if not dashboard:
                continue  # Skip users without dashboards (optional: you can create it here if needed)

            # Append user data with stake amount and reputation badge to the list
            users_with_dashboard.append({
                "id": str(user.id),
                "user_name": user.user_name,
                "full_name": user.full_name,
                "email": user.email,
                "mobile": user.mobile,
                "age": user.age,
                "gender": user.gender,
                "location": user.location,
                "verified_email": user.verified_email,
                "terms_accepted": user.terms_accepted,
                "stake_amount": dashboard.total_staked,
                "reputation_badge": dashboard.asker_badge_name
            })

        # Sort the list by stake_amount in descending order
        users_with_dashboard.sort(key=lambda x: x['stake_amount'], reverse=True)

        # Return the sorted users
        return jsonify({"users": users_with_dashboard}), 200

    except Exception as e:
        # Handle exceptions gracefully
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


