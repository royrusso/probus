from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/info/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_is_root(mocker):
    mocker.patch("os.geteuid", return_value=0)
    response = client.get("/info/is_root")
    assert response.status_code == 200
    assert response.json() == {"is_root": True}


def test_is_not_root(mocker):
    mocker.patch("os.geteuid", return_value=1)
    response = client.get("/info/is_root")
    assert response.status_code == 200
    assert response.json() == {"is_root": False}
