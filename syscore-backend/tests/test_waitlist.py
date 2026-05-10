import pytest
from app import create_app
from app.extensions import db

class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SECRET_KEY = 'test-key'
    JWT_SECRET_KEY = 'test-jwt-key'
    FRONTEND_URL = 'http://localhost:5173'
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

def test_join_success(client):
    rv = client.post('/api/v1/waitlist/join', json={
        "email": "user@example.com"
    })
    assert rv.status_code == 201
    assert rv.get_json()["success"] is True

def test_join_duplicate_email(client):
    client.post('/api/v1/waitlist/join', json={"email": "user@example.com"})
    rv = client.post('/api/v1/waitlist/join', json={"email": "user@example.com"})
    assert rv.status_code == 200
    assert rv.get_json()["already"] is True

def test_count_returns_integer(client):
    client.post('/api/v1/waitlist/join', json={"email": "user1@example.com"})
    client.post('/api/v1/waitlist/join', json={"email": "user2@example.com"})
    rv = client.get('/api/v1/waitlist/count')
    assert rv.status_code == 200
    assert rv.get_json()["count"] == 2
