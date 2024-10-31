from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

   
def test_read_default():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Net Pretzel says": "Hello World"}  