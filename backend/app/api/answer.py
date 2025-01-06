from flask import Blueprint, request, jsonify, make_response
from mongoengine import *
from datetime import datetime
from ..api.models import User, Question, Answer , Reports
import jwt
import os
from werkzeug.utils import secure_filename
from gridfs import GridFS
from pymongo import MongoClient
from bson import ObjectId


# Create a Blueprint for profile
answer_bp = Blueprint('answer', __name__)

MONGODB_HOST = os.getenv("MONGO_URI")
client = MongoClient(MONGODB_HOST)
db = client['stake_city']
fs = GridFS(db)  # Initialize GridFS

@answer_bp.route('/api/post_answer', methods=['POST'])
def post_answer():
    try:
        # Verify token
        auth_token = request.headers.get('Authorization')
        if not auth_token:
            return jsonify({"message": "Authorization token is required."}), 401

        secret_key = os.getenv('SECRET_KEY')
        try:
            auth_token = auth_token.split(' ')[1]
            decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
            user_name = decoded_token.get('user_name')
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token."}), 401

        # Fetch the user
        user = User.objects(user_name=user_name).first()
        if not user:
            return jsonify({"message": "User not found."}), 404

        # Parse form data
        answer_text = request.form.get('answer_text')
        question_id = request.form.get('question_id')

        if not answer_text and not question_id:
            return jsonify({"message": "Missing required fields."}), 400

        # Check if question exists
        question = Question.objects(id=ObjectId(question_id)).first()
        if not question:
            return jsonify({"message": "Question not found."}), 404

        # Handle file uploads
        uploaded_files = request.files.getlist('uploadedFiles')
        file_ids = []
        for file in uploaded_files:
            filename = secure_filename(file.filename)
            content_type = file.content_type
            file_id = fs.put(file, filename=filename, content_type=content_type)
            file_ids.append(str(file_id))

        # Save the answer
        answer = Answer(
            question_asker_user_name=question.user_name , # Store the user name of the asker
            answer_giver_user_id=user,
            responder_user_name=user.user_name,
            answer_text=answer_text,
            question_id=question,
            uploaded_files=file_ids,
        )
        answer.save()

        # Link the answer to the question
        question.associated_answers.append(answer)
        question.save()

        # Fetch all answers for this question
        answers = Answer.objects(question_id=question.id)
        answers_data = [{
            "answer_id": str(a.id),
            "message": a.answer_text,
            "uploaded_files": a.uploaded_files,
        } for a in answers]

        return jsonify({
            "message": "Answers fetched successfully!",
            "answers": answers_data
        }), 200

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

@answer_bp.route('/api/reports', methods=['POST'])
def create_report():
    """
    API endpoint to create a report against a question or an answer.
    """
    try:
        # Retrieve the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({"status": "error", "message": "Authorization token is required."}), 401

        # Extract and decode the token
        try:
            auth_token = auth_header.split(" ")[1]  # Assumes "Bearer <token>" format
            secret_key = os.getenv('SECRET_KEY')
            decoded_token = jwt.decode(auth_token, secret_key, algorithms=["HS256"])
            user_name = decoded_token.get('user_name')
        except jwt.ExpiredSignatureError:
            return jsonify({"status": "error", "message": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"status": "error", "message": "Invalid token."}), 401

        # Validate that the user_name exists in the token
        if not user_name:
            return jsonify({"status": "error", "message": "User name not found in token."}), 401

        # Fetch the user by user_name
        user = User.objects(user_name=user_name).first()
        if not user:
            return jsonify({"status": "error", "message": "User not found."}), 404

        user_id = str(user.id)  # Save the user ID for report creation

        # Parse the request body
        data = request.json
        target_id = data.get('target_id')
        target_type = data.get('target_type')  # Should be "Question" or "Answer"
        report_reason = data.get('report_reason')

        # Validate input fields
        if not target_id or not target_type or not report_reason:
            return jsonify({"status": "error", "message": "Missing required fields."}), 400
        if report_reason not in Reports.REASON_CHOICES:
            return jsonify({"status": "error", "message": "Invalid report reason."}), 400

        # Determine the target collection
        if target_type.lower() == "question":
            target = Question.objects(id=target_id).first()
            target.reports += 1
            target.reported_by.append(user)
            target.save()
        elif target_type.lower() == "answer":
            target = Answer.objects(id=target_id).first()
            target.reports += 1
            target.reported_by.append(user)
            target.save()
        else:
            return jsonify({"status": "error", "message": "Invalid target type."}), 400

        if not target:
            return jsonify({"status": "error", "message": f"{target_type.capitalize()} not found."}), 404

        # Create the report
        report = Reports(
            user=user,
            target=target,
            report_reason=report_reason,
            content=(
                f"User '{user.user_name}' reported the {target_type.lower()} with ID "
                f"{str(target.id)} for '{report_reason}'."
            ),
            target_type=target_type.lower()
        )
        report.save()

        return jsonify({
            "reports" : target.reports,
            "status": "success",
            "message": "Report created successfully.",
            "data": {
                "report_id": str(report.id),
                "reporter_id": str(user.id),
                "reporter": user.user_name,
                "target_id": str(target.id),
                "target_type": target_type,
                "report_reason": report_reason,
                "content": report.content
            }
        }), 201

    except Exception as e:
        return jsonify({"status": "error", "message": f"An unexpected error occurred: {str(e)}"}), 500


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
    print(request.headers)  # Debugging: Log headers
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
            # Ensure uploaded_files contains valid file IDs and generate URLs with filenames
            file_urls = []
            for file_id in answer.uploaded_files:
                try:
                    # Check if the file exists in the database
                    file = fs.get(ObjectId(file_id))  # Assuming GridFS is used for file storage
                    file_url = f"/api/get_file/{file_id}"
                    file_name = file.filename  # Get the filename
                    file_urls.append({
                        "url": file_url,
                        "filename": file_name
                    })
                except Exception as e:
                    print(f"Error retrieving file with ID {file_id}: {e}")
                    # Optionally, add a fallback URL or skip the file
                    file_urls.append({
                        "url": f"Invalid file ID: {file_id}",
                        "filename": "Unknown File"
                    })

            answers_data.append({
                "answer_id": str(answer.id),
                "message": answer.answer_text,
                "sender": answer.answer_giver_user_id.full_name,
                "likes": answer.likes,
                "uploaded_files": file_urls,
            })

        return jsonify({
            "message": "Answers fetched successfully!",
            "answers": answers_data
        }), 200

    except Exception as e:
        print("ERROR: ", str(e))
        return jsonify({"message": str(e)}), 500

@answer_bp.route('/api/get_file/<file_id>', methods=['GET'])
def get_file(file_id):
    try:
        file = fs.get(ObjectId(file_id))  # Assuming you are using GridFS for file storage
        response = make_response(file.read())
        response.headers['Content-Type'] = file.content_type
        response.headers['Content-Disposition'] = f'inline; filename={file.filename}'
        return response
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500


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
