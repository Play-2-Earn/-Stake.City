from flask import Blueprint, jsonify, request
from ..api.models import Wallet, User
from datetime import datetime
import jwt
import os

wallet_bp = Blueprint('wallet', __name__)

# Get Wallet Data
@wallet_bp.route('/api/get_wallet', methods=['OPTIONS','GET'])
def get_wallet_data():
    if request.method == 'OPTIONS':
        return '', 200
    
    header = request.headers
    auth_token = header.get('Authorization')

    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401
    
    
    auth_token = auth_token.split(' ')[1]
  # Verify the token
    try:
        secret_key = os.getenv('SECRET_KEY')
        decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
        user_name = decoded_token.get('user_name')
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token."}), 401
    # Fetch the user by user_name
    user = User.objects(user_name=user_name).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    wallet = Wallet.objects(user=user).first()

    # Create wallet if not exist in DB
    if not wallet:
      wallet = Wallet(
          user=user,
          wallet_addr='', 
          balance=0.0,
          locked_amount=0.0,
      )
      new_wallet.save()
    
    response = {
      "wallet_addr": wallet.wallet_addr,
      "balance": wallet.balance,
    }

    return jsonify(response), 200

# Update Wallet Data
@wallet_bp.route('/api/update_wallet', methods=['PATCH'])
def update_wallet_data():
    header = request.headers
    auth_token = header.get('Authorization')
    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401
    
    auth_token = auth_token.split(' ')[1]
    try:
        secret_key = os.getenv('SECRET_KEY')
        decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
        user_name = decoded_token.get('user_name')
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token."}), 401
    
    # Fetch the user by user_name
    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Fetch Walelt by user object
    wallet = Wallet.objects(user=user).first()

    # Get data to be updated
    update_data = request.json

    if 'balance' in update_data:
        try:
            balance = float(update_data.get('balance'))
            wallet.balance += balance
        except ValueError:
            return jsonify({"error": "Invalid balance value"}), 400

    if 'locked_amount' in update_data:
        try:
            locked_amount = float(update_data.get('locked_amount'))
            wallet.locked_amount += locked_amount
        except ValueError:
            return jsonify({"error": "Invalid amount value"}), 400
    
    if "wallet_addr" in update_data:
        wallet_addr = update_data.get('wallet_addr')
        wallet.wallet_addr = wallet_addr

    # Save the updated wallet
    wallet.updated_at = datetime.utcnow()
    wallet.save()

    # Response
    response = {
      "wallet_addr": wallet.wallet_addr,
      "balance": wallet.balance,
    }

    return jsonify(response), 200
