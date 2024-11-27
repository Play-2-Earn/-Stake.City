from flask import Blueprint, request, jsonify
from mongoengine import connect
from ..api.models import User, UserDashboard, Payment, Answer, Question, SelectedAnswer
from datetime import datetime
from dotenv import load_dotenv
import stripe
import os

# Load environment variables from .env file
load_dotenv()

# Configure Stripe with your public & secret keys
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
stripe_public_key = os.getenv('STRIPE_PUBLIC_KEY')

# Create a new Blueprint for payments
payment_bp = Blueprint('payments', __name__)

# Return Stripe Public Key
@payment_bp.route('/api/get-stripe-public', methods=['GET'])
def get_stripe_public():
    if not stripe_public_key:
        return jsonify({"error": "Error retrieving stripe public key"}), 500
    return jsonify({"stripe_publicKey": stripe_public_key})


# Create Payment Intent & Obtain Client Secret
@payment_bp.route('/api/create-payment-intent', methods=['POST', 'OPTIONS'])
def create_payment_intent():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Get amount from request data
        data = request.get_json()
        amount = data.get('amount')
        currency = data.get('currency')
        amount_in_cents = round(float(amount) * 100)

        if not amount:
            return jsonify({"error": "Amount is required"}), 400

        # Create a PaymentIntent with the specified amount
        intent = stripe.PaymentIntent.create(
            amount=amount_in_cents,  # Amount in cents
            currency=currency,
            automatic_payment_methods={"enabled": True},
        )
        # Return the client_secret to the client
        return jsonify({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return jsonify(error=str(e)), 500