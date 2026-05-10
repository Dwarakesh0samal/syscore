import pytest
from app import create_app
from app.extensions import db
from app.models.user import User

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SECRET_KEY = 'test-key'
    JWT_SECRET_KEY = 'test-jwt-key'
    STRIPE_SECRET_KEY = 'test'
    STRIPE_WEBHOOK_SECRET = 'test'
    FRONTEND_URL = 'http://localhost:5173'
    SENDGRID_API_KEY = None
    RATELIMIT_ENABLED = False

@pytest.fixture
def client():
    app = create_app(TestConfig)
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_register_success(client):
    rv = client.post('/api/v1/auth/register', json={
        "email": "test@test.com",
        "username": "testuser",
        "password": "Test1234!"
    })
    assert rv.status_code == 201
    assert "access_token" in rv.get_json()

def test_register_duplicate_email(client):
    client.post('/api/v1/auth/register', json={
        "email": "test@test.com",
        "username": "testuser1",
        "password": "password"
    })
    rv = client.post('/api/v1/auth/register', json={
        "email": "test@test.com",
        "username": "testuser2",
        "password": "password"
    })
    assert rv.status_code == 400
    assert rv.get_json()["code"] == "EMAIL_EXISTS"

def test_register_duplicate_username(client):
    client.post('/api/v1/auth/register', json={
        "email": "test1@test.com",
        "username": "testuser",
        "password": "password"
    })
    rv = client.post('/api/v1/auth/register', json={
        "email": "test2@test.com",
        "username": "testuser",
        "password": "password"
    })
    assert rv.status_code == 400
    assert rv.get_json()["code"] == "USERNAME_EXISTS"

def test_login_success(client):
    client.post('/api/v1/auth/register', json={
        "email": "test@test.com",
        "username": "testuser",
        "password": "Test1234!"
    })
    rv = client.post('/api/v1/auth/login', json={
        "email": "test@test.com",
        "password": "Test1234!"
    })
    assert rv.status_code == 200
    assert "access_token" in rv.get_json()

def test_login_wrong_password(client):
    client.post('/api/v1/auth/register', json={
        "email": "test@test.com",
        "username": "testuser",
        "password": "Test1234!"
    })
    rv = client.post('/api/v1/auth/login', json={
        "email": "test@test.com",
        "password": "wrong"
    })
    assert rv.status_code == 401

def test_me_requires_jwt(client):
    rv = client.get('/api/v1/auth/me')
    assert rv.status_code == 401
