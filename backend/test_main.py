from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
 
    
def test_read_default():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Net Pretzel says": "Hello World"}  

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}