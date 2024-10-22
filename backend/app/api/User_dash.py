from flask import Blueprint, jsonify, request
from mongoengine import DoesNotExist
from ..api.models import User, UserDashboard, Question, Answer,Payment,History,SelectedAnswer
from datetime import datetime
from flask_cors import CORS, cross_origin
import jwt
import os
# Create a Blueprint for the user dashboard
dashboard_bp = Blueprint('dashboard', __name__)
# Badge Names for Answerers/Responders
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

# Badge Names for Staking Users
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
@dashboard_bp.route('/api/user_dashboard', methods=['OPTIONS','GET'])
def get_user_dashboard():
    if request.method == 'OPTIONS':
        return '', 200
    #authorize
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
        print(f"User {dashboard.user_name}'s reputation has increased to level {dashboard.level}.")
    
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
        "reputation_badge": dashboard.asker_badge_name,
        "player_badge": dashboard.responder_badge_name,
        "multiplier": round(dashboard.multiplier, 1),  # Round to 1 decimal place
        "stake_amount": total_stake,
        "total_staked": dashboard.total_staked,
        "total_received": total_received,
        "total_questions_asked": total_questions_asked,
        "total_answers_provided": total_answers_provided,
        "last_updated": dashboard.last_updated.strftime('%Y-%m-%d %H:%M:%S')
    }

    return jsonify(response), 200

def get_responder_badge_name(user):
    # Fetch all answers provided by the user
    answers = Answer.objects(answer_user_name=user)

    # Calculate total likes received on the user's answers
    total_likes = sum(answer.likes for answer in answers)

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
        11: (2.0, 80500), # Level 11: Multiplier = 2.0, Staked Amount = 10500
        12: (2.1, 100000), # Level 12: Multiplier = 2.1, Staked Amount = 12000
        13: (2.2, 113500), # Level 13: Multiplier = 2.2, Staked Amount = 13500
        14: (2.3, 125000), # Level 14: Multiplier = 2.3, Staked Amount = 15000
        15: (2.4, 146500), # Level 15: Multiplier = 2.4, Staked Amount = 16500
        16: (2.5, 168000), # Level 16: Multiplier = 2.5, Staked Amount = 18000
        17: (2.6, 179500), # Level 17: Multiplier = 2.6, Staked Amount = 19500
        18: (2.7, 221000), # Level 18: Multiplier = 2.7, Staked Amount = 21000
        19: (2.8, 242500), # Level 19: Multiplier = 2.8, Staked Amount = 22500
        20: (2.9, 24000), # Level 20: Multiplier = 2.9, Staked Amount = 24000
        21: (3.0, 266000), # Level 21: Multiplier = 3.0, Staked Amount = 26000
        22: (3.1, 288000), # Level 22: Multiplier = 3.1, Staked Amount = 28000
        23: (3.2, 320000), # Level 23: Multiplier = 3.2, Staked Amount = 30000
        24: (3.3, 342000), # Level 24: Multiplier = 3.3, Staked Amount = 32000
        25: (3.4, 364000)  # Level 25: Multiplier = 3.4, Staked Amount = 34000
    }

    current_level = dashboard.level
    stake_amount = dashboard.total_staked

    # Check if the user qualifies for a level increase
    for level, (multiplier, threshold) in LEVEL_THRESHOLDS.items():
        if stake_amount >= threshold and current_level < level:
            dashboard.level = level  # Update to the new level
            dashboard.asker_badge_name = STAKING_BADGES[level - 1]  # Change badge based on level
            dashboard.multiplier = round(multiplier, 1)  # Set the new multiplier and round to 1 decimal place
            break

    # Save the dashboard to update changes
    dashboard.save()

    return current_level < dashboard.level  # Return whether the reputation increased

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
                          f"{(active_time.seconds // 60) % 60} minutes, {active_time.seconds % 60} seconds"

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
        "answer_text": answer.answer_text,  # Assuming you have this field
        "likes": answer.likes,
        "liked_by": answer.liked_by,
        "answer_user_name": str(answer.responder_user_name),  # Corrected spelling here
        "timestamp": answer.timestamp.strftime('%Y-%m-%d %H:%M:%S')  # Format the timestamp
    } for answer in liked_answers]

    return jsonify({
        "total_liked_answers": len(liked_answers),
        "liked_answers": response
    }), 200

@dashboard_bp.route('/api/select_answers', methods=['POST'])
def select_answers():
    data = request.json
    selected_responder_usernames = data.get('selected_responder_usernames')  # List of selected responder usernames
    question_id = data.get('question_id')  # ID of the question for which answers are selected
    print(f"Selected Responder Usernames: {selected_responder_usernames}")
    if not selected_responder_usernames or not question_id:
        return jsonify({"error": "Selected responder usernames and question ID are required."}), 400

    # Limit the number of selected answers to 3
    if len(selected_responder_usernames) > 3:
        return jsonify({"error": "You can only select up to 3 responders."}), 400
    user_ids = User.objects(user_name__in=selected_responder_usernames).only('id')
    user_ids_set = {user.id for user in user_ids}

    # Find answers for the question and from the selected users
    selected_answers = Answer.objects.filter(
        answer_giver_user_id__in=user_ids_set,
        question_id=question_id
    )

    # Debugging statement: log the selected answers
    print(f"Selected Answers Query: {selected_answers}")

    # Check which responders did not provide answers
    found_responder_set = {answer.answer_giver_user_id.user_name for answer in selected_answers}
    missing_responders = set(selected_responder_usernames) - found_responder_set
    
    if missing_responders:
        return jsonify({"error": f"The following responders did not provide answers: {', '.join(missing_responders)}."}), 404

    # Store selected answers in the SelectedAnswer collection
    for responder_username in selected_responder_usernames:
        print(f"Processing responder: {responder_username}")
        # Find the corresponding answer for the responder
        user = User.objects(user_name=responder_username).first()

        # Use the user object to filter the answers
        selected_answer = selected_answers.filter(answer_giver_user_id=user).first()
        # Check if this answer is already selected
        if SelectedAnswer.objects(answer=selected_answer).first():
            return jsonify({"error": f"Answer from responder '{responder_username}' is already selected."}), 400

        

        print(f"Selected Answer being saved for: {responder_username}")
        # Save the selected answer
        selected_answer = SelectedAnswer(
            user_name=responder_username,  # Store the responder's username
            answer=selected_answer,                  # The answer object being selected
            question_id=question_id         # The question ID related to the answer
        )

        
        selected_answer.save()
        
        # Update the question model to indicate that it has been released
        question = Question.objects(id=question_id).first()
        question.released = True
        question.save()
    try:
        distribute_payments_helper(question_id, selected_answer.question_id.stake_amount)
    except Exception as e: 
        print(str(e))
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": "Answers selected successfully!"}), 200

#payment
def distribute_payments_helper(question_id, total_stake_amount):

    print(f"Question ID: {question_id}")
    print(f"Total stake amount: {total_stake_amount}")

    if not question_id or total_stake_amount is None:
        print("400 error: User name, question ID, and total stake amount are required.")
        return 400, {"error": "User name, question ID, and total stake amount are required."}

    question = Question.objects(id=question_id).first()
    print(f"Question: {question}")
    if not question:
        print("404 error: Question not found.")
        return 404, {"error": "Question not found."}

    selected_answers = SelectedAnswer.objects(question_id=question_id)
    print(f"Selected answers: {selected_answers}")
    if not selected_answers:
        print("404 error: No selected answers found for this question.")
        return 404, {"error": "No selected answers found for this question."}

    selected_responder_usernames = [selected_answer.user_name for selected_answer in selected_answers]
    print(f"Selected responder usernames: {selected_responder_usernames}")

    responders = []
    for user_name in selected_responder_usernames:
        print(f"Processing user: {user_name}")
        dash = UserDashboard.objects(user_name=user_name).first()
        if not dash:
            print(f"Creating dashboard for user: {user_name}")
            dash = UserDashboard(
            user_name=user.user_name,
            level=1,
            asker_badge_name=STAKING_BADGES[0],
            responder_badge_name=ANSWERER_BADGES[0],
            multiplier=1.0,
            last_updated=datetime.utcnow(),
            total_staked=0.0,
            total_received=0.0,
            total_likes=0  # Ensure this is initialized
            )
            dash.save()
        print(f"Dashboard for {user_name}: {dash}")
        responders.append(dash)

    total_multiplier = sum(responder.multiplier for responder in responders)

    payments = []
    print(f"cleaned for payment Responders: {responders}")
    for responder in responders:
        if total_multiplier > 0:
            payment_amount = (responder.multiplier / total_multiplier) * total_stake_amount
        else:
            payment_amount = 0

        payment_amount_rounded = round(payment_amount, 2)

        # Save Payment object
        payment = Payment(
            user=question.user,
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

    return 200, {"payments": payments}


#adonaydem
@dashboard_bp.route('/api/user_history/answered', methods=['GET'])
def get_answered_history():
    if request.method == 'OPTIONS':
        return '', 200
    #authorize
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

    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    print(user.user_name)
    # Fetch selected answers by the user
    selected_answers = SelectedAnswer.objects(user_name=user.user_name).select_related()

    answered_history = []

    for selected in selected_answers:
        answer = selected.answer
        question = selected.question_id
        print(question.id, selected.user_name)
        # Retrieve the payment for the selected answer
        payment = Payment.objects(
            question_id=question,
            responder_user_name=selected.user_name
        ).first()

        

        # Calculate active duration since the answer was selected
        active_time = datetime.utcnow() - selected.timestamp
        active_duration = f"{active_time.days} days, {active_time.seconds // 3600} hours, " \
                          f"{(active_time.seconds // 60) % 60} minutes, {active_time.seconds % 60} seconds"

        answered_entry = {
            "user_name": user.user_name,
            "task": question.question_text,
            "date": selected.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            "tokensEarned": payment.payment_amount if payment else 0,  # Amount from the payment document
            "active_duration": active_duration
        }

        answered_history.append(answered_entry)
    print(answered_history)
    return jsonify(answered_history), 200

#adonaydem
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

    # Fetch all released questions asked by the user
    released_questions = Question.objects(user=user, released=True)

    released_tasks = []

    for question in released_questions:
        # Find the winner (answer selected for this question)
        selected_answer = SelectedAnswer.objects(question_id=question.id)
        
        if not selected_answer:
            continue  # Skip if no selected answer found
        
        for answer in selected_answer:
            # Fetch the payment for the selected answer
            payment = Payment.objects(
                question_id=question.id,
                responder_user_name=answer.user_name
            ).first()

            # Calculate the timeframe (duration from question's timestamp to its release)
            timeframe_duration = datetime.utcnow() - question.timestamp
            timeframe = f"{timeframe_duration.days} days, {timeframe_duration.seconds // 3600} hours"

            # Create a released task entry
            released_task_entry = {
                "task": question.question_text,
                "wonBy": answer.user_name,
                "timeframe": timeframe,
                "date": question.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                "stakingReward": payment.payment_amount if payment else 0  # Amount from the payment document
            }

            released_tasks.append(released_task_entry)

    return jsonify(released_tasks), 200
#adonaydem
@dashboard_bp.route('/questions/active', methods=['GET'])
def get_active_questions():
    try:
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

        include_answers = request.args.get('include_answers')

        def format_time_left(visible_until):
            delta = visible_until - datetime.utcnow()
            hours, remainder = divmod(delta.seconds, 3600)
            minutes, _ = divmod(remainder, 60)
            return f"{hours} hours, {minutes} minutes"

        questions = Question.objects(user_name=user_name, released=False)

        if include_answers:
            questions_list = [{
                "username": question.user_name,
                "stake": question.question_title,
                "stakeDetails": question.question_text,
                "staking_reward": str(question.stake_amount),
                "time_left": format_time_left(question.visible_until),
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
                "question_id": str(question.id),
            } for question in questions]
        
        return jsonify(questions_list), 200
    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 400

