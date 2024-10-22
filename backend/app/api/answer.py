from flask import Blueprint, request, jsonify
from mongoengine import *
from datetime import datetime
from ..api.models import User, Question, Answer
import jwt
import os
# Create a Blueprint for profile
answer_bp = Blueprint('answer', __name__)


# Post an answer to a question
@answer_bp.route('/api/post_answer', methods=['POST'])
def post_answer():
    # Verify the token
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

    # Fetch the user by user_id
    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"message": "User not found."}), 404
    answer_data = request.json
    asker_user_id = answer_data.get('asker_user_id')
    question_id = answer_data.get('question_id')
    answer_text = answer_data.get('answer')
    print(question_id, "qid")

    try:
        # Check if question exists
        question = Question.objects(id=question_id).first()
        print(question.id)
        if not question:
            return jsonify({"message": "Question not found."}), 404

        # Check if users exist
        asker_user = User.objects(user_name=asker_user_id).first()
        answer_giver_user = User.objects(user_name=user.user_name).first()
        print(asker_user_id, user.user_name)
        if not asker_user or not answer_giver_user:
            return jsonify({"message": "User not found."}), 404

        # Create and save the answer
        answer = Answer(
            question_id=question,
            asker_user_id=asker_user,
            answer_giver_user_id=answer_giver_user,
            answer=answer_text
        )
        answer.save()

        # Return all answers related to this question_id
        answers = Answer.objects(question_id=question_id)
        answers_data = []
        for answer in answers:
            answers_data.append({
                "answer_id": str(answer.id),
                "message": answer.answer,
                "asker_user_id": str(answer.asker_user_id.user_name),
                "sender": str(answer.answer_giver_user_id.full_name),
                "likes": answer.likes,
            })
        return jsonify({
            "message": "Answers fetched successfully!",
            "answers": answers_data
        }), 200
        
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Like an answer
@answer_bp.route('/api/like_answer/<answer_id>', methods=['POST'])
def like_answer(answer_id):
   
        # Find the answer by ID
        user_name = request.json.get('user_name')
        answer = Answer.objects(id=answer_id).first()
        if not answer:
            return jsonify({"message": "Answer not found."}), 404

        # Increment likes
        if user_name not in answer.likes:
            answer.likes.append(user_name)
        answer.save()

        return jsonify({"message": "Answer liked successfully!"}), 200
   

# Dislike an answer
@answer_bp.route('/api/dislike_answer/<answer_id>', methods=['POST'])
def dislike_answer(answer_id):
    try:
        # Find the answer by ID
        answer = Answer.objects(id=answer_id).first()
        if not answer:
            return jsonify({"message": "Answer not found."}), 404

        # Increment dislikes
        answer.dislikes += 1
        answer.save()

        return jsonify({"message": "Answer disliked successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Get all answers for a given question_id
@answer_bp.route('/api/get_answers', methods=['GET'])
def get_answers():
    # Verify the token
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

    # Fetch the user by user_name to ensure they are valid
    user = User.objects(user_name=user_name).first()
    if not user:
        return jsonify({"message": "User not found."}), 404

    # Get question_id from query parameters
    question_id = request.args.get('question_id')
    if not question_id:
        return jsonify({"message": "Question ID is required."}), 400

    try:
        # Check if the question exists
        question = Question.objects(id=question_id).first()
        if not question:
            return jsonify({"message": "Question not found."}), 404

        # Retrieve all answers related to the question_id
        answers = Answer.objects(question_id=question_id)
        answers_data = []
        for answer in answers:
            answers_data.append({
                "answer_id": str(answer.id),
                "message": answer.answer,
                "asker_user_id": answer.asker_user_id.user_name,
                "sender": answer.answer_giver_user_id.full_name,
                "likes": answer.likes,
            })

        return jsonify({
            "message": "Answers fetched successfully!",
            "answers": answers_data
        }), 200

    except Exception as e:
        print("ERROR: ", str(e))
        return jsonify({"message": str(e)}), 500
# Report an answer
@answer_bp.route('/api/report_answer/<answer_id>', methods=['POST'])
def report_answer(answer_id):
    try:
        # Find the answer by ID
        answer = Answer.objects(id=answer_id).first()
        if not answer:
            return jsonify({"message": "Answer not found."}), 404

        # Increment reports
        answer.reports += 1
        answer.save()

        return jsonify({"message": "Answer reported successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Delete an answer
@answer_bp.route('/api/delete_answer', methods=['DELETE'])
def delete_answer():
    answer_data = request.json
    answer_id = answer_data.get('answer_id')

    if not answer_id:
        return jsonify({"message": "Answer ID is required."}), 400

    try:
        # Find and delete the answer by ID
        answer = Answer.objects(id=answer_id).first()
        if not answer:
            return jsonify({"message": "Answer not found."}), 404

        answer.delete()
        return jsonify({"message": "Answer deleted successfully."}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
