import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get("/")
    assert response.status_code == 200

def test_random_dog(client):
    response = client.get("/random-dog")
    assert response.status_code == 200
    data = response.get_json()
    assert "message" in data
    assert "status" in data
    assert data["status"] == "success"
