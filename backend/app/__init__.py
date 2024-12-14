from flask import Flask
from flask_mail import Mail
from flask_cors import CORS
from dotenv import load_dotenv
from mongoengine import connect
import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
import logging

load_dotenv(dotenv_path=".env")

def create_app():
    app = Flask(__name__)

    # === CONNECT TO MONGO-DB === #
    MONGODB_HOST = os.getenv("MONGO_URI")
    connect(
        db='stake_city',
        host=MONGODB_HOST,
    )

    # === FLASK APP CONFIGURATIONS === #
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = 'testingben12@gmail.com'
    app.config['MAIL_PASSWORD'] = 'qxxa yqbu boeq dojd'
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.secret_key = os.getenv('SECRET_KEY')
    mail = Mail(app)

    CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "allow_headers": ["Authorization", "Content-Type"],
        }
    })


    # === REGISTER BLUEPRINTS === #
    from .api.Register import register_bp
    from .api.login import login_bp
    from .api.Reset import reset_password_bp
    from .api.question import question_bp
    from .api.answer import answer_bp
    from .api.User_dash import dashboard_bp
    from .api.User_dash import check_and_transfer_stakes
    from .api.Payment import payment_bp
    from .api.LeaderBoard import user_bp
    from .api.Wallet import wallet_bp
    from .api.Stellar import stellar_bp

    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(reset_password_bp)
    app.register_blueprint(question_bp)
    app.register_blueprint(answer_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(wallet_bp)
    app.register_blueprint(stellar_bp)


    # === JOB SCHEDULER === #
    scheduler = BackgroundScheduler(timezone='UTC')

    # Run the task every 60 seconds
    scheduler.add_job(check_and_transfer_stakes, 'interval', seconds=60, id='check_expired_tasks_job')

    if not scheduler.running:
        scheduler.start()

    # Shut down the scheduler when exiting the app
    from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR

    def job_listener(event):
        if event.exception:
            logging.error(f'Job {event.job_id} failed.')
        else:
            logging.info(f'Job {event.job_id} completed successfully.')

    scheduler.add_listener(job_listener, EVENT_JOB_EXECUTED | EVENT_JOB_ERROR)

    # Ensure the scheduler shuts down when the app exits
    import atexit
    atexit.register(lambda: scheduler.shutdown())


    return app
