from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_read_default():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Minerva says": "Hello World"}


def test_health_check():
    response = client.get("/info/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


# def test_scan_list():
#     response = client.get("/scan/list/192.168.1.1")
#     assert response.status_code == 200
