from mongoengine import Document, StringField, FloatField, IntField, BooleanField,DateTimeField, ReferenceField,connect,DictField, ListField
from datetime import datetime
from dotenv import load_dotenv
import os
# Load environment
load_dotenv(dotenv_path=".env")

MONGODB_HOST = os.getenv("MONGO_URI")

# Connect to MongoDB on localhost
connect(
    db='stake_city',
    host=MONGODB_HOST,
)

# User Model
class User(Document):
    user_name = StringField(required=True, unique=True)  # Unique user identifier
    mobile = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(unique=True)  # Ensure password is required
    full_name = StringField(required=True)
    age = IntField(required=True)
    gender = StringField()
    terms_accepted = BooleanField(default=False)
    verified_email = BooleanField(default=False)

class Login(Document):
    user_name = ReferenceField(User, required=True)  # Reference to the User model (Foreign key)
    ip_address = StringField(required=True)  # IP address of the user
    browser_name = StringField(required=True)  # Browser name
    device_type = StringField(required=True)  # Device type (e.g., mobile, desktop)
    device_name = StringField(required=True)  # Device name (e.g., iPhone, Pixel)
    brand = StringField(required=True)  # Brand of the device (e.g., Apple, Google)
    model = StringField(required=True)  # Model of the device (e.g., iPhone 12)
    city = StringField(required=True)  # City based on IP address
    region = StringField(required=True)  # Region (state/province) based on IP
    country = StringField(required=True)  # Country based on IP
    login_timestamp = DateTimeField(default=datetime.utcnow)
    last_passwords = StringField()  # Timestamp of login

# Password Reset Model
class PasswordReset(Document):
    user_name = ReferenceField(User, required=True)
    old_password = StringField(required=True)
    new_password = StringField(required=True)
    reset_timestamp = DateTimeField(default=datetime.utcnow)


# Model to store previous passwords
class PreviousPasswords(Document):
    email = StringField(required=True)  # Store email directly
    old_password = StringField(required=True)
    reset_timestamp = DateTimeField(default=datetime.utcnow)

# Question Model
class Question(Document):
    user = ReferenceField(User, required=True)
    user_name = StringField(required=True)
    question_id = StringField()
    question_title = StringField(required=True)
    question_text = StringField(required=True)
    stake_amount = FloatField(required=True)
    coordinates = DictField()
    location_name = StringField()
    timestamp = DateTimeField(default=datetime.utcnow)
    visible_until = DateTimeField(required=True)
    has_been_extended = BooleanField(default=False)
    verbal_address = StringField()  # New field added
    released = BooleanField(default=False)
class QuestionExtension(Document):
    question = ReferenceField(Question, required=True)
    extended_by_days = IntField(required=True)
    extension_date = DateTimeField(default=datetime.utcnow)

class Answer(Document):
    question_id = ReferenceField('Question', required=True) 
    asker_user_id = ReferenceField('User', required=True, reverse_delete_rule=2)  
    answer_giver_user_id = ReferenceField('User', required=True, reverse_delete_rule=2)
    answer = StringField(required=True)
    likes = ListField(StringField(), default=[])
    liked_by = ListField(StringField(), default=[])  # List of usernames who liked the answer
    liked_by_asker = BooleanField(default=False)  # Flag to indicate if the asker liked this answer
    reports = IntField(default=0)  # Count of reports against this answer
    reported_by = ListField(ReferenceField('User'), default=[])  # List of users who reported this answer
    has_liked_3 = BooleanField(default=False)  # Flag to track if the asker has liked 3 answers
    timestamp = DateTimeField(default=datetime.utcnow)  # Timestamp for the answer creation time

class History(Document):
    user_name = StringField(required=True)  # User name of the question asker
    question = StringField(required=True)    # The question text
    stake_amount = FloatField(required=True)  # Amount staked for the question
    active_duration = StringField(required=True)  # Duration in days, hours, minutes, and seconds
    timestamp = DateTimeField(default=datetime.utcnow)  # Timestamp for when the history record was created

class UserDashboard(Document):
    user = ReferenceField(User, required=True, unique=True)  # Reference to the User model
    user_name = StringField(required=True, unique=True)  # Unique user identifier
    full_name = StringField(required=True)  # User's full name
    email = StringField(required=True)  # User's email address
    mobile = StringField(required=True)  # User's mobile number
    multiplier = FloatField(required=True, default=1.0)  # Reputation-based voting score; starting at 1.0
    level = IntField(required=True, default=1)  # Level progression, starts at 1
    asker_badge_name = StringField(default="")  # Badge name for questions asked
    responder_badge_name = StringField(default="")  # Badge name for answers given
    last_updated = DateTimeField(default=datetime.utcnow)  # Track last update timestamp
    total_staked = FloatField(default=0.0)  # Total amount staked by the user
    total_received = FloatField(default=0.0)  # Total amount received by the user
    total_likes = IntField(default=0)  # Total likes received on answers given
    is_active = BooleanField(default=True)  # Indicates if the user dashboard is active

    def calculate_total_stake(self):
        # Fetch all questions by this user and sum the stake amounts
        total_stake = sum(q.stake_amount for q in Question.objects(user=self.user))
        return total_stake

    def calculate_total_received(self):
        # Fetch all payments where this user was the responder and sum the payment amounts
        total_received = sum(p.payment_amount for p in Payment.objects(responder_user_name=self.user_name))
        return total_received

    def update_last_updated(self):
        # Update the last_updated timestamp
        self.last_updated = datetime.utcnow()
        self.save()
    
for dashboard in UserDashboard.objects:
    if not hasattr(dashboard, 'is_active'):
        dashboard.is_active = True  # or whatever default value you choose
        dashboard.save()
class ExtensionQuestion(Document):
    question = ReferenceField(Question, required=True)  # Reference to the Question model
    extension_date = DateTimeField(required=True)  # The new extended visibility date
    has_been_extended = BooleanField(default=False)  # Indicates if the question has been extended

class Payment(Document):
    user = ReferenceField(User, required=True)  # The user who is making the payment
    payment_amount = FloatField(required=True)  # The amount to be paid
    timestamp = DateTimeField(default=datetime.utcnow)  # When the payment was made
    question_id = ReferenceField(Question, required=True)  # Reference to the related question
    responder_user_name = StringField(required=True)  # The username of the responder receiving the payment

    meta = {
        'indexes': [
            {'fields': ['user', 'question_id', 'responder_user_name']}  # Ensure a unique user-question-responder pair if needed
        ]
    }

class Admin(Document):
    admin_username = StringField(required=True, unique=True)  # Unique identifier for admin
    email = StringField(required=True, unique=True)  # Admin email, should be unique
    password = StringField(required=True)  # Password for admin login
    full_name = StringField(required=True)  # Admin's full name
    created_at = DateTimeField(default=datetime.utcnow)  # Timestamp for when the admin was created
    is_active = BooleanField(default=True)  # Status of the admin (active/inactive)

    def __str__(self):
        return f"Admin({self.admin_username}, {self.full_name})"
    
class SelectedAnswer(Document):
    user_name = StringField(required=True)  # The responder's username whose answer is selected
    answer = ReferenceField(Answer, required=True)  # Reference to the selected answer document
    question_id = ReferenceField(Question, required=True)  # Reference to the related question
    timestamp = DateTimeField(default=datetime.utcnow)  # Time when the answer was selected

    meta = {
        'indexes': [
            {'fields': ['user_name', 'answer'], 'unique': True}  # Ensures a user can select a specific answer only once
        ]
    }