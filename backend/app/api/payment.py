from flask import Blueprint, request, jsonify
from mongoengine import connect
from ..api.models import User, UserDashboard, Payment, Answer, Question, SelectedAnswer
from datetime import datetime

# Create a new Blueprint for payments
payment_bp = Blueprint('payments', __name__)

# Connect to MongoDB on localhost
connect('stake_dbs', host='localhost', port=27017)

@payment_bp.route('/api/distribute_payments', methods=['POST'])
def distribute_payments():
    data = request.json
    user_name = data.get('user_name')
    question_id = data.get('question_id')
    total_stake_amount = data.get('total_stake_amount')

    if not user_name or not question_id or total_stake_amount is None:
        return jsonify({"error": "User name, question ID, and total stake amount are required."}), 400

    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    question = Question.objects(id=question_id).first()
    if not question:
        return jsonify({"error": "Question not found."}), 404

    selected_answers = SelectedAnswer.objects(question_id=question_id)
    if not selected_answers:
        return jsonify({"error": "No selected answers found for this question."}), 404

    selected_responder_usernames = [selected_answer.user_name for selected_answer in selected_answers]
    responders = UserDashboard.objects(user_name__in=selected_responder_usernames)

    total_multiplier = sum(responder.multiplier for responder in responders)

    # Ensure that each responder has a UserDashboard, create one if not
    for responder in responders:
        dashboard = UserDashboard.objects(user_name=responder.user_name).first()
        if not dashboard:
            dashboard = UserDashboard(
                user=responder.user,
                user_name=responder.user_name,
                full_name=responder.full_name,
                email=responder.email,
                mobile=responder.mobile,
                total_received=0.0  # Initialize with 0 if new
            )
            dashboard.save()

    payments = []
    for responder in responders:
        if total_multiplier > 0:
            payment_amount = (responder.multiplier / total_multiplier) * total_stake_amount
        else:
            payment_amount = 0

        payment_amount_rounded = round(payment_amount, 2)

        # Save Payment object
        payment = Payment(
            user=user,
            payment_amount=payment_amount_rounded,
            question_id=question,
            responder_user_name=responder.user_name
        )
        payment.save()

        # Update UserDashboard
        dashboard = UserDashboard.objects(user_name=responder.user_name).first()
        if dashboard:
            print(f"Before update total_received for {dashboard.user_name}: {dashboard.total_received}")
            dashboard.total_received += payment_amount_rounded
            try:
                dashboard.save()  # Attempt to save the dashboard
                dashboard.update_last_updated()  # Update last updated timestamp
                print(f"Updated total_received for {dashboard.user_name}: {dashboard.total_received}")
            except Exception as e:
                print(f"Error saving dashboard for {dashboard.user_name}: {e}")
        else:
            print(f"Dashboard not found for responder: {responder.user_name}")

        payments.append({
            "user_name": responder.user_name,
            "payment": payment_amount_rounded
        })

    return jsonify({"payments": payments}), 200
