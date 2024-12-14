from flask import Blueprint, jsonify, request, Flask
from flask.views import MethodView
from .models import User, UserStellar, UserDashboard, Wallet, Transaction
from bson import ObjectId  # To handle ObjectId conversion

from flask import Blueprint, jsonify, request
from stellar_sdk import Server, Keypair, TransactionBuilder, Asset, Network
import requests
import jwt
import os
from datetime import datetime

# Define the blueprint
stellar_bp = Blueprint('Stellar', __name__)

# Stellar SDK initialization
HORIZON_URL = os.getenv("HORIZON_URL", "https://horizon-testnet.stellar.org")
STELLAR_SECRET = os.getenv("STELLAR_SECRET")
server = Server(horizon_url=HORIZON_URL)
source_keypair = Keypair.from_secret(STELLAR_SECRET)
# Array of APIs for fetching XLM/USD price
PRICE_APIS = [
    "https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd",
    "https://min-api.cryptocompare.com/data/price?fsym=XLM&tsyms=USD",
    "https://api.binance.com/api/v3/ticker/price?symbol=XLMUSDT"
]

class CoinRedeemView(MethodView):

    def fetch_price(self):  # Added `self` to method signature
        for api in PRICE_APIS:
            try:
                response = requests.get(api, timeout=10)
                response.raise_for_status()
                data = response.json()
                if "coingecko" in api:
                    return data["stellar"]["usd"]
                elif "cryptocompare" in api:
                    return data["USD"]
                elif "binance" in api:
                    return float(data["price"])
            except Exception as e:
                print(f"Failed to fetch price from {api}: {str(e)}")
                continue
        raise Exception("All price APIs failed.")

    def check_account_exists(self, address):  # Added `self` to method signature
        try:
            server.accounts().account_id(address).call()
            return True
        except Exception:
            return False

    def redeem_coins(self, stellar_address, xlm_amount):
        """
        Helper function to redeem the Stellar coins and send them to the user's Stellar address.
        Returns the transaction response.
        """
        try:
            # Fetch XLM price
            xlm_price = self.fetch_price()  # Fixed method call
            xlm_amount = round(xlm_amount / xlm_price, 7) # Calculate XLM amount
            source_account = server.load_account(account_id=source_keypair.public_key) # Load source account
            base_fee = server.fetch_base_fee() # Fetch the dynamic base fee
            # Check if destination account exists
            # Fixed method call
            if not self.check_account_exists(stellar_address):
                # Create and fund the new account with 1 XLM
                create_account_transaction = (
                    TransactionBuilder(
                        source_account=source_account,
                        network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                        base_fee=base_fee
                    )
                    .append_create_account_op(destination=stellar_address, starting_balance="1")
                    .set_timeout(30)
                    .build()
                )
                create_account_transaction.sign(source_keypair)
                server.submit_transaction(create_account_transaction)
            # Create payment transaction
            payment_transaction = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                    base_fee=base_fee
                )
                .append_payment_op(destination=stellar_address, amount=str(xlm_amount), asset=Asset.native())
                .set_timeout(30)
                .build()
            )
            payment_transaction.sign(source_keypair)
            # Submit payment transaction
            response = server.submit_transaction(payment_transaction)
            return {"success": True, "transactionId": response["id"]}
        except Exception as e:
            print(f"Error processing redemption: {str(e)}")
            # Changed return to dictionary
            return {"success": False, "message": "Transaction failed"}

    def post(self):
        """
        Store the redemption value for a user.
        Expects 'Authorization' token in headers and 'to_redeem' in the request JSON payload.
        """
        try:
            header = request.headers
            auth_token = header.get('Authorization')
            if not auth_token:
                return jsonify({"message": "Authorization token is required."}), 401

            auth_token = auth_token.split(' ')[1]
            try:
                secret_key = os.getenv('SECRET_KEY')
                decoded_token = jwt.decode(
                    auth_token, secret_key, algorithms=["HS256"])
                user_name = decoded_token.get('user_name')
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token has expired."}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token."}), 401

            # Fetch the user by user_name
            user = User.objects(user_name=user_name).first()
            if not user:
                return jsonify({"error": "User not found"}), 404

            # Parse JSON from the request
            data = request.json
            to_redeem = data.get('to_redeem')

            # Validate input
            if not to_redeem:
                return jsonify({"error": "to_redeem is required"}), 400

            # Ensure 'to_redeem' is a valid positive number
            if not isinstance(to_redeem, (int, float)) or to_redeem <= 0:
                return jsonify({"error": "to_redeem must be a positive number"}), 400

            # Ensure 'to_redeem' is a multiple of 100
            if to_redeem % 100 != 0:
                return jsonify({"error": "to_redeem must be a multiple of 100"}), 400

            # Fetch the UserDashboard record
            user_dashboard = UserDashboard.objects(user=user).first()
            if not user_dashboard:
                return jsonify({"error": "UserDashboard record not found for the user"}), 404

            # Fetch points_balance
            points_balance = user_dashboard.points_balance

            # Validate 'to_redeem' against 'points_balance'
            if to_redeem > points_balance:
                return jsonify({
                    "error": f"to_redeem must not exceed points_balance ({points_balance})"
                }), 400

            # Calculate stellar_coin value
            stellar_coin = to_redeem / 100

            # Check if the UserStellar record already exists
            user_stellar = UserStellar.objects(user=user).first()
            if not user_stellar:
                user_stellar = UserStellar(
                    user=user,
                    user_name=user_name
                )

            # Process wallet details
            wallet_detail = Wallet.objects(user=user).first()
            if wallet_detail:
                # Validate public key
                if not wallet_detail.wallet_addr or len(wallet_detail.wallet_addr) != 56:
                    return jsonify({"error": "Invalid Stellar public key"}), 400

                # Call the redeem_coins function
                redeem_response = self.redeem_coins(
                    stellar_address=wallet_detail.wallet_addr,
                    xlm_amount=stellar_coin  # Corrected argument
                )
                if redeem_response["success"]:
                    transaction_id = redeem_response["transactionId"]

                    try:
                        # Ensure the 'Transaction' object is properly created and appended
                        new_transaction = Transaction(
                            transaction_id=transaction_id,  # The unique transaction ID
                            to_redeem=to_redeem             # The coins to redeem
                        )

                        # Check if the UserStellar document exists
                        user_stellar = UserStellar.objects(user=user).first()
                        if not user_stellar:
                            # If no UserStellar record exists, create a new one
                            user_stellar = UserStellar(
                                user=user,
                                user_name=user_name,
                                # Initialize with the first transaction
                                transactions=[new_transaction]
                            )
                        else:
                            # Append the new transaction to the existing transactions list
                            if user_stellar.transactions is None:
                                user_stellar.transactions = []  # Ensure the list is initialized
                            user_stellar.transactions.append(new_transaction)

                        # Save the updated UserStellar document
                        user_stellar.save()

                        # Update User's Point Balance
                        user_dashboard.points_balance -= to_redeem
                        user_dashboard.save()

                        # Response to the client
                        return jsonify({
                            "message": "Transaction recorded successfully",
                            "transactionId": transaction_id,
                            "user_name": user_name,
                            "to_redeem": to_redeem,
                            "points_balance": user_dashboard.points_balance
                        }), 200

                    except Exception as e:
                        return jsonify({"error": str(e)}), 500
                    
                else:
                    return jsonify({
                        "error": redeem_response["message"]
                    }), 500
            else:
                return jsonify({"error": "UserStellar record not found"}), 404
        except Exception as e:
            # Handle unexpected errors
            return jsonify({"error": str(e)}), 500

# Register the view
stellar_bp.add_url_rule(
    '/api/store_coin_redeem',
    view_func=CoinRedeemView.as_view('store_coin_redeem'),
    methods=['POST']
)