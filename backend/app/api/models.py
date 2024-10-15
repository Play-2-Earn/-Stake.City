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
