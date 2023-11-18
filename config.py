import os
import secrets

basedir = os.path.abspath(os.path.dirname(__file__))


class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = None
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, './db_directory')
    SECURITY_PASSWORD_SALT = secrets.token_urlsafe()
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(SQLITE_DB_DIR, 'appdb.sqlite3')
    SECRET_KEY = secrets.token_urlsafe()
    JWT_SECRET_KEY = secrets.token_urlsafe()
    DEBUG = True
    CELERY_BROKER_URL = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/2"