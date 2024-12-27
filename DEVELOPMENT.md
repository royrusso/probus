# Local Development

![Last Commit](https://img.shields.io/github/last-commit/royrusso/minerva)
![Commits per month](https://img.shields.io/github/commit-activity/m/royrusso/minerva)
<a href="https://github.com/psf/black"><img alt="Code style: black" src="https://img.shields.io/badge/code%20style-black-000000.svg"></a>

This project is a monorepo that contains both the backend and frontend code for Minerva. The backend is built with FastAPI, and the frontend is built with React.

## Technologies Used

[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![FastAPI](https://img.shields.io/badge/FastAPI-009485.svg?logo=fastapi&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=fff)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![Nmap](https://img.shields.io/badge/Nmap-7.80-4B8BBE.svg)](#)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff)](#)
[![Pytest](https://img.shields.io/badge/Pytest-0A9EDC?logo=python&logoColor=fff)](#)

## Table of Contents

- [Requirements](#requirements)
- [Running the Backend](#running-the-backend)
  - [Testing the Backend](#testing-the-backend)
- [Running the Frontend](#running-the-frontend)

## Requirements

- Python 3.13.+ (with pip)
- Nmap installed on your system

## Running the Backend

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
fastapi dev main.py
```

Alternatively, you can run the backend with the following command:

```bash
cd backend
uvicorn main:app --reload
```

For production, you can run the backend with the following command:

```bash
cd backend
fastapi run
```

Once the API is running, you have access to it at [http://localhost:8000](http://localhost:8000), and the Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).

### Testing the Backend

This project uses `pytest` for testing. To run the tests, run the following command:

```bash
sudo pytest --cov -vv
```

To generate a coverage report, run the following command:

```bash
sudo pytest --cov --cov-report=html
```

## Running the Frontend

To run the frontend, run the following commands:

```bash
cd frontend
npm install
npm start
```

Once the frontend is running, you can access to it at [http://localhost:8080](http://localhost:8080).
