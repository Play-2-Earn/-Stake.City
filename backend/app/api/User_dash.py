from time import sleep
from bson import ObjectId
from flask import Blueprint, Response, json, jsonify, request
from mongoengine import DoesNotExist
import pytz
from ..api.models import User, UserDashboard, Wallet, Question, QuestionStatus, Answer, Payment, History, SelectedAnswer
from datetime import datetime
from flask_cors import cross_origin
from datetime import datetime, timezone
import jwt
import os

# Create a Blueprint for the user dashboard
dashboard_bp = Blueprint('dashboard', __name__)
# Badge Names for Answerers/Responders (BADGES / PLAYER BADGE)
ANSWERER_BADGES = [
    "City Sleuth",
    "Urban Whisperer",
    "Concrete Conqueror",
    "Metro Maverick",
    "Skyline Sage",
    "Street Smart",
    "City Navigator",
    "District Dazzler",
    "Town Titan",
    "Block Boss",
    "Urban Detective",
    "Metro Guru",
    "Highway Hero",
    "Pavement Philosopher",
    "Cornerstone Champ",
    "Urban Pathbreaker",
    "Bridge Builder",
    "Traffic Tactician",
    "City Sentinel",
    "Asphalt Analyst",
    "Urban Oracle",
    "Skyway Specialist",
    "Boulevard Baron",
    "Street Specialist",
    "City Pulse Finder",
    "Urban Virtuoso",
    "Grit Guardian",
    "Alley Ace",
    "City Codecracker",
    "Route Rocketeer",
    "Crosswalk Captain",
    "Urban Vanguard",
    "Concrete Custodian",
    "City Circuitry",
    "Grid General",
    "City Scoutmaster",
    "Metropolis Maestro",
    "Skyway Strategist",
    "Avenue Ace",
    "Urban Navigator Extraordinaire"
]

# Badge Names for Staking Users (LEVEL / REPUTATION BADGE)
STAKING_BADGES = [
    "Crypto Seed Sower",
    "Token Tycoon",
    "Stake Shark",
    "Profit Pioneer",
    "Blockchain Baron",
    "Crypto Czar",
    "Stake Sultan",
    "Ethereum Emperor",
    "Digital Dealmaker",
    "Wealth Weaver",
    "Liquidity Legend",
    "Blockchain Baller",
    "Crypto Chieftain",
    "DeFi Dynamo",
    "Wealth Whisperer",
    "Crypto Commander",
    "Yield Yogi",
    "Chain Champion",
    "Staking Strategist",
    "Satoshi Sage"
]


@cross_origin(origin='*')
@dashboard_bp.route('/api/user_dashboard', methods=['OPTIONS', 'GET'])
def get_user_dashboard():
    if request.method == 'OPTIONS':
        return '', 200
    # authorize
    header = request.headers
    auth_token = header.get('Authorization')
    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401

    auth_token = auth_token.split(' ')[1]
    # Verify the token
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

    # Try to fetch the user dashboard
    dashboard = UserDashboard.objects(user=user).first()

    # If the dashboard doesn't exist, create it
    if not dashboard:
        dashboard = UserDashboard(
            user=user,
            user_name=user.user_name,
            full_name=user.full_name,
            mobile=user.mobile,
            email=user.email,
            level=1,
            asker_badge_name=STAKING_BADGES[0],
            responder_badge_name=ANSWERER_BADGES[0],
            multiplier=1.0,
            last_updated=datetime.utcnow(),
            total_staked=0.0,
            total_received=0.0,
            total_likes=0  # Ensure this is initialized
        )
        dashboard.save()

    # Calculate total stake amount from questions asked
    total_stake = dashboard.calculate_total_stake()
    dashboard.total_staked = total_stake

    # Calculate total received amount from questions asked
    total_received = dashboard.calculate_total_received()
    dashboard.total_received = total_received

    # Fetch the number of questions asked and answers provided
    total_questions_asked = Question.objects(user=user).count()
    total_answers_provided = Answer.objects(answer_giver_user_id=user).count()

    # Update reputation score and assign badges accordingly
    reputation_increased = update_reputation_and_badge(dashboard)    

    # Log a message or take an action based on the reputation increase
    if reputation_increased:
        print(f"User {dashboard.user_name}'s reputation has increased to level {
              dashboard.level}.")
    
    # Update player badge name based on likes received
    dashboard.responder_badge_name = get_responder_badge_name(user)

    # Save updated information
    dashboard.last_updated = datetime.utcnow()  # Update last updated timestamp
    dashboard.save()  # Ensure the dashboard saves after updates

    # Prepare the response
    response = {
        "user_name": dashboard.user_name,
        "full_name": dashboard.full_name,
        "email": dashboard.email,
        "mobile": dashboard.mobile,
        "level": dashboard.level,
        "reputation_badge": dashboard.asker_badge_name,  # Staking Badge
        "player_badge": dashboard.responder_badge_name,  # Answer Badge
        "multiplier": round(dashboard.multiplier, 1), # Round to 1 decimal place
        "stake_amount": total_stake,
        "total_staked": dashboard.total_staked,
        "total_received": total_received,
        "total_questions_asked": total_questions_asked,
        "total_answers_provided": total_answers_provided,
        "last_updated": dashboard.last_updated.strftime('%Y-%m-%d %H:%M:%S'),
        "points_balance": dashboard.points_balance,
    }

    return jsonify(response), 200

def get_responder_badge_name(user):
    # Fetch all answers provided by the user
    answers = Answer.objects(answer_user_name=user)

    # Calculate total likes received on the user's answers
    total_likes = sum(len(answer.likes) for answer in answers)
    
    # Determine badge level based on total likes
    if total_likes < 5:
        badge_level = 0  # Level 1 badge
    elif total_likes < 10:
        badge_level = 1  # Level 2 badge
    elif total_likes < 15:
        badge_level = 2  # Level 3 badge
    elif total_likes < 20:
        badge_level = 3  # Level 4 badge
    elif total_likes < 25:
        badge_level = 4  # Level 5 badge
    elif total_likes < 30:
        badge_level = 5  # Level 6 badge
    elif total_likes < 35:
        badge_level = 6  # Level 7 badge
    elif total_likes < 40:
        badge_level = 7  # Level 8 badge
    elif total_likes < 45:
        badge_level = 8  # Level 9 badge
    elif total_likes < 50:
        badge_level = 9  # Level 10 badge
    elif total_likes < 60:
        badge_level = 10  # Level 11 badge
    elif total_likes < 70:
        badge_level = 11  # Level 12 badge
    elif total_likes < 80:
        badge_level = 12  # Level 13 badge
    elif total_likes < 90:
        badge_level = 13  # Level 14 badge
    elif total_likes < 100:
        badge_level = 14  # Level 15 badge
    elif total_likes < 115:
        badge_level = 15  # Level 16 badge
    elif total_likes < 130:
        badge_level = 16  # Level 17 badge
    elif total_likes < 145:
        badge_level = 17  # Level 18 badge
    elif total_likes < 160:
        badge_level = 18  # Level 19 badge
    elif total_likes < 175:
        badge_level = 19  # Level 20 badge
    elif total_likes < 195:
        badge_level = 20  # Level 21 badge
    elif total_likes < 215:
        badge_level = 21  # Level 22 badge
    elif total_likes < 235:
        badge_level = 22  # Level 23 badge
    elif total_likes < 255:
        badge_level = 23  # Level 24 badge
    elif total_likes < 275:
        badge_level = 24  # Level 25 badge
    elif total_likes < 300:
        badge_level = 25  # Level 26 badge
    elif total_likes < 325:
        badge_level = 26  # Level 27 badge
    elif total_likes < 350:
        badge_level = 27  # Level 28 badge
    elif total_likes < 375:
        badge_level = 28  # Level 29 badge
    elif total_likes < 400:
        badge_level = 29  # Level 30 badge
    elif total_likes < 425:
        badge_level = 30  # Level 31 badge
    elif total_likes < 450:
        badge_level = 31  # Level 32 badge
    elif total_likes < 475:
        badge_level = 32  # Level 33 badge
    elif total_likes < 500:
        badge_level = 33  # Level 34 badge
    elif total_likes < 525:
        badge_level = 34  # Level 35 badge
    elif total_likes < 550:
        badge_level = 35  # Level 36 badge
    elif total_likes < 575:
        badge_level = 36  # Level 37 badge
    elif total_likes < 600:
        badge_level = 37  # Level 38 badge
    elif total_likes < 625:
        badge_level = 38  # Level 39 badge
    elif total_likes < 650:
        badge_level = 39  # Level 40 badge
    elif total_likes < 675:
        badge_level = 40  # Level 41 badge
    elif total_likes < 700:
        badge_level = 41  # Level 42 badge
    elif total_likes < 725:
        badge_level = 42  # Level 43 badge
    elif total_likes < 750:
        badge_level = 43  # Level 44 badge
    elif total_likes < 775:
        badge_level = 44  # Level 45 badge
    elif total_likes < 800:
        badge_level = 45  # Level 46 badge
    elif total_likes < 825:
        badge_level = 46  # Level 47 badge
    elif total_likes < 850:
        badge_level = 47  # Level 48 badge
    elif total_likes < 875:
        badge_level = 48  # Level 49 badge
    elif total_likes < 900:
        badge_level = 49  # Level 50 badge
    else:
        badge_level = 49  # Cap at Level 50 badge (last badge)

    return ANSWERER_BADGES[badge_level]  # Return the badge name based on level

def update_reputation_and_badge(dashboard):
    # Define thresholds for levels with their respective multipliers and required staked amounts
    LEVEL_THRESHOLDS = {
        1: (1.0, 0),      # Level 1: Multiplier = 1.0, Staked Amount = 0
        2: (1.1, 1000),   # Level 2: Multiplier = 1.1, Staked Amount = 1000
        3: (1.2, 4000),   # Level 3: Multiplier = 1.2, Staked Amount = 2000
        4: (1.3, 8000),   # Level 4: Multiplier = 1.3, Staked Amount = 3000
        5: (1.4, 10000),   # Level 5: Multiplier = 1.4, Staked Amount = 4000
        6: (1.5, 15000),   # Level 6: Multiplier = 1.5, Staked Amount = 5000
        7: (1.6, 20000),   # Level 7: Multiplier = 1.6, Staked Amount = 6000
        8: (1.7, 30000),   # Level 8: Multiplier = 1.7, Staked Amount = 7000
        9: (1.8, 45000),   # Level 9: Multiplier = 1.8, Staked Amount = 8000
        10: (1.9, 60000),  # Level 10: Multiplier = 1.9, Staked Amount = 9000
        11: (2.0, 80500),  # Level 11: Multiplier = 2.0, Staked Amount = 10500
        12: (2.1, 100000),  # Level 12: Multiplier = 2.1, Staked Amount = 12000
        13: (2.2, 113500),  # Level 13: Multiplier = 2.2, Staked Amount = 13500
        14: (2.3, 125000),  # Level 14: Multiplier = 2.3, Staked Amount = 15000
        15: (2.4, 146500),  # Level 15: Multiplier = 2.4, Staked Amount = 16500
        16: (2.5, 168000),  # Level 16: Multiplier = 2.5, Staked Amount = 18000
        17: (2.6, 179500),  # Level 17: Multiplier = 2.6, Staked Amount = 19500
        18: (2.7, 221000),  # Level 18: Multiplier = 2.7, Staked Amount = 21000
        19: (2.8, 242500),  # Level 19: Multiplier = 2.8, Staked Amount = 22500
        20: (2.9, 24000),  # Level 20: Multiplier = 2.9, Staked Amount = 24000
        21: (3.0, 266000),  # Level 21: Multiplier = 3.0, Staked Amount = 26000
        22: (3.1, 288000),  # Level 22: Multiplier = 3.1, Staked Amount = 28000
        23: (3.2, 320000),  # Level 23: Multiplier = 3.2, Staked Amount = 30000
        24: (3.3, 342000),  # Level 24: Multiplier = 3.3, Staked Amount = 32000
        25: (3.4, 364000)  # Level 25: Multiplier = 3.4, Staked Amount = 34000
    }

    current_level = dashboard.level
    stake_amount = dashboard.total_staked

    # Check if the user qualifies for a level increase
    for level, (multiplier, threshold) in LEVEL_THRESHOLDS.items():
        if stake_amount >= threshold and current_level < level:
            dashboard.level = level  # Update to the new level
            # Change badge based on level
            dashboard.asker_badge_name = STAKING_BADGES[level - 1]
            # Set the new multiplier and round to 1 decimal place
            dashboard.multiplier = round(multiplier, 1)
            break

    # Save the dashboard to update changes
    dashboard.save()

    # Return whether the reputation increased
    return current_level < dashboard.level

@dashboard_bp.route('/api/user_history/<user_name>', methods=['GET'])
def get_user_history(user_name):
    # Fetch the user by user_name
    user = User.objects(user_name=user_name).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Fetch all questions asked by the user
    questions = Question.objects(user=user)

    # Prepare the response directly from the questions
    response = []
    for question in questions:
        active_time = datetime.utcnow() - question.timestamp
        active_duration = f"{active_time.days} days, {active_time.seconds // 3600} hours, " \
            f"{(active_time.seconds // 60) %
                60} minutes, {active_time.seconds % 60} seconds"

        response.append({
            "user_name": question.user_name,
            "question": question.question_text,
            "stake_amount": question.stake_amount,
            "active_duration": active_duration,
            "timestamp": question.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })

    return jsonify(response), 200

@dashboard_bp.route('/api/user_liked_answers/<user_name>/<question_id>', methods=['GET'])
def get_user_liked_answers(user_name, question_id):
    # Fetch the user by user_name
    user = User.objects(user_name=user_name).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Find the question by ID
    question = Question.objects(id=question_id).first()

    if not question:
        return jsonify({"error": "Question not found"}), 404

    # Fetch all answers related to the question
    answers = Answer.objects(question_id=question_id)

    # Filter answers liked by the user
    liked_answers = [answer for answer in answers if user_name in answer.liked_by]

    # Prepare the response with the list of liked answers
    response = [{
        "answer_id": str(answer.id),
        "answer_text": answer.answer_text, # Assuming you have this field
        "likes": answer.likes,
        "liked_by": answer.liked_by,
        "answer_user_name": str(answer.responder_user_name),# Corrected spelling here
        "timestamp": answer.timestamp.strftime('%Y-%m-%d %H:%M:%S') # Format the timestamp
    } for answer in liked_answers]

    return jsonify({
        "total_liked_answers": len(liked_answers),
        "liked_answers": response
    }), 200

# API - Tasker Select Responder's Answers
@dashboard_bp.route('/api/select_answers', methods=['POST'])
def select_answers():
    # Get User Name from JWT Token
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

    # Get Responders List & Quesition ID
    data = request.json
    # List of selected responder usernames
    selected_responder_usernames = data.get('selected_responder_usernames')
    # ID of the question for which answers are selected
    question_id = data.get('question_id')

    if not selected_responder_usernames or not question_id:
        return jsonify({"error": "Selected responder usernames and question ID are required."}), 400

    # Limit the number of selected answers to 3
    if len(selected_responder_usernames) > 3:
        return jsonify({"error": "You can only select up to 3 responders."}), 400

    # Find answers that correspond to the selected responder usernames
    selected_answers = Answer.objects(
        responder_user_name__in=selected_responder_usernames, question_id=question_id)

    # Debugging statement: log the selected answers
    print(f"Selected Answers Query: {selected_answers}")

    # Create a set of usernames for quick lookup
    selected_responder_set = set(selected_responder_usernames)

    # Create a set of found responder usernames based on selected answers
    found_responder_set = {
        answer.responder_user_name for answer in selected_answers}

    # Identify which responders did not provide answers
    missing_responders = selected_responder_set - found_responder_set

    if missing_responders:
        return jsonify({"error": f"The following responders did not provide answers: {', '.join(missing_responders)}."}), 404

    # Store selected answers in the SelectedAnswer collection
    for responder_username in selected_responder_usernames:
        # Find the corresponding answer for the responder
        answer = selected_answers.filter(
            responder_user_name=responder_username).first()

        # Check if this answer is already selected
        if SelectedAnswer.objects(answer=answer).first():
            return jsonify({"error": f"Answer from responder '{responder_username}' is already selected."}), 400

        # Save the selected answer
        selected_answer = SelectedAnswer(
            user_name=responder_username,  # Store the responder's username
            answer=answer,                  # The answer object being selected
            question_id=question_id         # The question ID related to the answer
        )
        selected_answer.save()

    # Distribute payments to all 3 responder
    try:
        distribute_payments(user_name, question_id)
    except Exception as e:
        return jsonify({"error:" f"Payment distribution failed: {str(e)}"}), 500

    return jsonify({"message": "Answers selected and payments distributed successfully!"}), 200

# Helper Function - Tasker Distribute STC to Responders
def distribute_payments(user_name, question_id):
    if not user_name or not question_id:
        return jsonify({"error": "User name and question ID are required."}), 400

    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    question = Question.objects(id=question_id).first()
    if not question:
        return jsonify({"error": "Question not found."}), 404

    # Fetch the stake_coin from the question
    total_stake_coin = question.stake_amount
    if total_stake_coin is None or total_stake_coin <= 0:
        return jsonify({"error": "Invalid stake_coin for the question."}), 400

    selected_answers = SelectedAnswer.objects(question_id=question_id)
    if not selected_answers:
        return jsonify({"error": "No selected answers found for this question."}), 404

    selected_responder_usernames = [
        selected_answer.user_name for selected_answer in selected_answers]
    responders = UserDashboard.objects(
        user_name__in=selected_responder_usernames)

    total_multiplier = sum(responder.multiplier for responder in responders)

    # Ensure that each responder has a UserDashboard, create one if not
    for responder in responders:
        dashboard = UserDashboard.objects(
            user_name=responder.user_name).first()
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

    # Calculate reward points and distribute them to each responder
    payments = []
    for responder in responders:
        if total_multiplier > 0:
            # Calculate reward points
            reward_points = (responder.multiplier / total_multiplier) * total_stake_coin
            # Convert to reward points
            reward_points = round(reward_points * 100)
        else:
            reward_points = 0

        # Save Payment object with reward points
        payment = Payment(
            user=user,
            reward_points=reward_points,  # Store reward points as payment amount
            question_id=question,
            responder_user_name=responder.user_name,
            release_stake=total_stake_coin  # Store total_stake_coin as release_stake
        )
        payment.save()

        # Update responder's UserDashboard with reward points
        dashboard = UserDashboard.objects(
            user_name=responder.user_name).first()
        if dashboard:
            dashboard.total_received += reward_points
            dashboard.points_balance += reward_points
            try:
                dashboard.save()  # Attempt to save the dashboard
                dashboard.update_last_updated()  # Update last updated timestamp
            except Exception as e:
                print(f"Error saving dashboard for {dashboard.user_name}: {e}")

        payments.append({
            "user_name": responder.user_name,
            "reward_points": reward_points  # Include reward points in the response
        })

    # Update Locked Amount from (Asker/Tasker)'s Wallet
    wallet = Wallet.objects(user=user).first()
    wallet.locked_amount -= total_stake_coin
    wallet.save()

    # Update Question status to released
    question.status = QuestionStatus.RELEASED.value
    question.released = True
    question.save()

    return jsonify({"payments": payments, "release_stake": total_stake_coin}), 200


# API - User's Completed Tasks (got rewarded)
@dashboard_bp.route('/api/user_history/answered', methods=['GET'])
def get_answered_history():
    if request.method == 'OPTIONS':
        return '', 200
    # authorize
    header = request.headers
    auth_token = header.get('Authorization')
    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401

    auth_token = auth_token.split(' ')[1]
    # Verify the token
    try:
        secret_key = os.getenv('SECRET_KEY')
        decoded_token = jwt.decode(
            auth_token, secret_key, algorithms=["HS256"])

        user_name = decoded_token.get('user_name')
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token."}), 401

    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    # Fetch selected answers by the user
    selected_answers = SelectedAnswer.objects(
        user_name=user.user_name).select_related()

    answered_history = []

    for selected in selected_answers:
        answer = selected.answer
        question = selected.question_id
        # Retrieve the payment for the selected answer
        payment = Payment.objects(
            question_id=question,
            responder_user_name=selected.user_name
        ).first()

        # Calculate active duration since the answer was selected
        active_time = datetime.utcnow() - selected.timestamp
        active_duration = f"{active_time.days} days, {active_time.seconds // 3600} hours, " \
            f"{(active_time.seconds // 60) %
                60} minutes, {active_time.seconds % 60} seconds"

        answered_entry = {
            "user_name": user.user_name,
            "task": question.question_text,
            "taskTitle": question.question_title,
            "date": selected.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "tokensEarned": payment.payment_amount if payment else 0, # Amount from the payment document
            "active_duration": active_duration,
            "rewardPoints": payment.reward_points,
        }

        answered_history.append(answered_entry)
    return jsonify(answered_history), 200

# API - User's Released Tasks (rewarded someone)
@dashboard_bp.route('/api/user_history/released_tasks', methods=['GET'])
def get_released_tasks():
    header = request.headers
    auth_token = header.get('Authorization')
    if not auth_token:
        return jsonify({"message": "Authorization token is required."}), 401

    auth_token = auth_token.split(' ')[1]
    # Verify the token
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

    # Fetch all released questions asked by the user
    released_questions = Question.objects(user=user, status=QuestionStatus.RELEASED.value)

    released_tasks = []

    for question in released_questions:
        # Find the winner (answer selected for this question)
        selected_answer = SelectedAnswer.objects(question_id=question.id)

        if not selected_answer:
            continue  # Skip if no selected answer found
        
        winners = []

        for answer in selected_answer:
            # Fetch the payment for the selected answer
            payment = Payment.objects(
                question_id=question.id,
                responder_user_name=answer.user_name
            ).first()

            winners.append(answer.user_name)

        # Calculate the timeframe (duration from question's timestamp to its release)
        timeframe_duration = datetime.utcnow() - question.timestamp
        timeframe = f"{timeframe_duration.days} days, {timeframe_duration.seconds // 3600} hours"

        # Create a released task entry
        released_task_entry = {
            "task": question.question_text,
            "taskTitle": question.question_title,
            "stakeAmount": question.stake_amount,
            "winners": winners,
            "timeframe": timeframe,
            "date": question.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "rewardPoints": payment.reward_points,
        }

        released_tasks.append(released_task_entry)

    return jsonify(released_tasks), 200

# API - Tasker's Active Tasks
@dashboard_bp.route('/questions/active', methods=['GET'])
def get_active_questions():
    try:
        header = request.headers
        auth_token = header.get('Authorization')
        if not auth_token:
            print("Token required")
            return jsonify({"message": "Authorization token is required."}), 401
        auth_token = auth_token.split(' ')[1]
        # Verify the token
        try:
            secret_key = os.getenv('SECRET_KEY')
            decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
            user_name = decoded_token.get('user_name')
        except jwt.ExpiredSignatureError:
            print("Token expire")
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            print("Token invalid")
            return jsonify({"message": "Invalid token."}), 401

        # Fetch user object
        user = User.objects(user_name=user_name).first()
        if not user:
            return jsonify({"error": "User not found."}), 404

        # Retrieve the query parameter to decide if answers should be included in the response
        include_answers = request.args.get('include_answers')

        # Helper function to calculate the time left for a task to expire
        def format_time_left(visible_until):
            """
            Calculate the time left as a countdown from 90 days.
            """
            now = datetime.now(timezone.utc)  # Ensure `now` is timezone-aware
            
            # If visible_until is a string, convert it to a datetime object and make it timezone-aware
            if isinstance(visible_until, str):
                visible_until = datetime.fromisoformat(visible_until.replace("Z", "+00:00")).replace(tzinfo=timezone.utc)
            elif isinstance(visible_until, datetime) and visible_until.tzinfo is None:
                # If visible_until is naive, assume it's in UTC and make it timezone-aware
                visible_until = datetime.fromtimestamp(visible_until.timestamp(), tz=timezone.utc)

            # Calculate the time difference
            delta = visible_until - now

            # Task ahs expired but have more than 3 responders
            if delta.total_seconds() <= 0:
                return "Expired, Pending Release"

            # Active tasks
            days = delta.days
            hours, remainder = divmod(delta.seconds, 3600)
            minutes, _ = divmod(remainder, 60)

            if days > 0:
                return f"{days} days, {hours} hours, {minutes} minutes"
            else:
                return f"{hours} hours, {minutes} minutes" 

        # Function that generates events to be sent over the SSE stream every 60s
        def generateEvent():
            while True:
                questions = Question.objects(
                    user_name=user_name,
                    status__in=[QuestionStatus.ACTIVE.value, QuestionStatus.EXPIRED_PENDING_RELEASE.value]
                )

                if include_answers:
                    questions_list = [{
                        "username": question.user_name,
                        "stake": question.question_title,
                        "stakeDetails": question.question_text,
                        "staking_reward": str(question.stake_amount),
                        "time_left": format_time_left(question.visible_until),
                        "expire_time": question.visible_until,
                        "answers": [
                            {
                                "response": answer.answer,
                                "username": answer.answer_giver_user_id.user_name
                            } for answer in Answer.objects(question_id=question.id)
                        ],
                        "question_id": str(question.id)
                    } for question in questions]
                else:
                    questions_list = [{
                        "username": question.user_name,
                        "stake": question.question_title,
                        "stakeDetails": question.question_text,
                        "staking_reward": str(question.stake_amount),
                        "time_left": format_time_left(question.visible_until),
                        "expire_time": question.visible_until,
                        "question_id": str(question.id),
                    } for question in questions]

                # Send the list of questions as a JSON event
                yield f"data: {json.dumps(questions_list)}\n\n"

                # Wait for 60 seconds before sending the next update
                sleep(60)

        # Return response as an event stream
        return Response(generateEvent(), content_type="text/event-stream")
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400

# Helper function - Update Expired Task (locked stake > usable balance)
def check_expired_tasks(user):
    # Fetch wallet object
    wallet = Wallet.objects(user=user).first()
    if not wallet:
        wallet = Wallet(
            user=user,
            user_name=user.user_name,
            wallet_addr='',
            balance=0.0,
            locked_amount=0.0,
        )
        wallet.save()

    # Fetch dashboard object
    dashboard = UserDashboard.objects(user=user).first()
    if not dashboard:
        dashboard = UserDashboard(
            user=user,
            user_name=user.user_name,
            full_name=user.full_name,
            mobile=user.mobile,
            email=user.email,
            level=1,
            asker_badge_name=STAKING_BADGES[0],
            responder_badge_name=ANSWERER_BADGES[0],
            multiplier=1.0,
            last_updated=datetime.utcnow(),
            total_staked=0.0,
            total_received=0.0,
            total_likes=0  # Ensure this is initialized
        )
        dashboard.save()

    # Fetch questions object
    questions = Question.objects(user=user)
    expired_stake_details = []

    for question in questions:
        if not question.visible_until or question.status != QuestionStatus.ACTIVE.value:
            continue

        # Parse and normalize `visible_until`
        visible_until = question.visible_until
        if isinstance(visible_until, str):
            visible_until = datetime.fromisoformat(visible_until.replace("Z", "+00:00")).astimezone(pytz.utc)
        elif isinstance(visible_until, datetime) and visible_until.tzinfo is None:
            visible_until = pytz.utc.localize(visible_until)

        now = datetime.utcnow().replace(tzinfo=pytz.utc)
        time_left = visible_until - now
        
        # Question has expired
        if time_left.total_seconds() < 0:
            days_exceeded = abs(time_left.days)

            # Determine the number of users associated with this question
            associated_users_count = len(question.associated_answers) if hasattr(question, 'associated_answers') else 1

            # Skip transfer logic for questions exceeding 90 days with >= 3 users
            if days_exceeded < 90 and associated_users_count >= 3:
                # Update Question status to expired but pending release STC
                question.status = QuestionStatus.EXPIRED_PENDING_RELEASE.value

                expired_stake_details.append({
                    "question_id": str(question.id),
                    "stake_deducted": 0,
                    "amount_transferred_to_balance": 0,
                    "days_exceeded": days_exceeded,
                    "associated_users_count": associated_users_count,
                    "message": "Stake not transferred. 90 days exceeded, and there are 3 or more associated users."
                })
            else:
                stake_amount = question.stake_amount or 0
                locked_amount = wallet.locked_amount or 0

                if locked_amount >= stake_amount > 0:
                    # Deduct the stake_amount from locked_amount
                    wallet.locked_amount -= stake_amount

                    # Transfer the remaining locked_amount to balance
                    wallet.balance += stake_amount

                    # Save the updated wallet details
                    wallet.save()

                    # Update Question status to expired
                    question.status = QuestionStatus.EXPIRED.value

                    expired_stake_details.append({
                        "question_id": str(question.id),
                        "stake_deducted": stake_amount,
                        "amount_transferred_to_balance": stake_amount,
                        "days_exceeded": days_exceeded,
                        "associated_users_count": associated_users_count
                    })
            question.save()

# Helper Function - Job schedule to update expired tasks
def check_and_transfer_stakes():
    print(f"Running check_expired_tasks at {datetime.now()}...")

    users = User.objects()
    for user in users:
        try:
            # Check if user has an 'id' attribute, if not, skip the user
            if not hasattr(user, 'id'):
                print(f"Skipping invalid user: {user}")
                continue

            check_expired_tasks(user)

        except Exception as e:
            print(f"Error processing user {user.id if hasattr(user, 'id') else 'unknown'}: {str(e)}")

    print("Completed checking expired tasks.")



# Update user dashboard data
@dashboard_bp.route("/api/update_dashboard", methods=['PATCH'])
def update_dashboard_data():
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

    # Fetch user's dashboard data
    dashboard = UserDashboard.objects(user=user).first()

    # Get data to be updated
    update_data = request.json

    if 'pointsBalance' in update_data:
        try:
            points_balance = int(update_data.get('pointsBalance'))
            dashboard.points_balance += points_balance
        except ValueError:
            return jsonify({"error": "Invalid points balance value"}), 400
    

    # Save updated dashboard data
    dashboard.save()

    # Response
    return jsonify("Success Update Dashboard"), 200