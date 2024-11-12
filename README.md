# Net Pretzel

[![codecov](https://codecov.io/github/royrusso/net-pretzel/graph/badge.svg?token=B972KDOOOB)](https://codecov.io/github/royrusso/net-pretzel)
![Tests](https://img.shields.io/github/actions/workflow/status/royrusso/net-pretzel/pytests_codecov.yml?label=Tests)
![License](https://img.shields.io/github/license/royrusso/net-pretzel)

### This project is in early development!

A _FAST_ network scanner that identifies security vulnerabilities in your network and alerts you to new ones as they arise.

Features:

- Scan your network for open ports and services.
- Identify security vulnerabilities in your network.
- Display all CVEs and CVVSS scores for each device where vulnerabilities are found.
- Alert you to new vulnerabilities as they arise.
- Alert you to new devices on your network.
- Platform agnostic (Windows, MacOS, Linux).

## Development

![Last Commit](https://img.shields.io/github/last-commit/royrusso/net-pretzel)
![Commits per month](https://img.shields.io/github/commit-activity/m/royrusso/net-pretzel)
<a href="https://github.com/psf/black"><img alt="Code style: black" src="https://img.shields.io/badge/code%20style-black-000000.svg"></a>

### Requirements

- Python 3.13.+ (with pip)
- Nmap installed on your system

### Running the Backend

To install the backend dependencies, run the following command:

```bash
pip install -r backend/requirements.txt
```

**Scanning your network requires root access!** To get root access, run the following command:

```bash
sudo su
```

With root access, now you can run the backend:

```bash
cd backend
uvicorn main:app --reload
```

Alternatively, you can run the backend with the following command:

```bash
cd backend
python main.py
```

Once the API is running, you have access to it at [http://localhost:8000](http://localhost:8000), and the Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).

#### Testing the Backend

This project uses `pytest` for testing. To run the tests, run the following command:

```bash
pytest --cov
```

### Running the Frontend

To run the frontend, run the following commands:

```bash
cd frontend
npm install
npm start
```

Once the frontend is running, you can access to it at [http://localhost:8080](http://localhost:8080).

#### Developer Notes:

- This project makes use of [FastAPI](https://fastapi.tiangolo.com/) for the backend.
- This project uses [react-bootstrap](https://react-bootstrap.github.io/) for the frontend components.
