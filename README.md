# Net Pretzel

A simple, fast app that maps your network graph and identifies security vulnerabilities.

## Development

### Requirements

- Python 3.13.+ (with pip)

### Installation

To install the backend dependencies, run the following command:

```bash
pip install -r backend/requirements.txt
```

### Running the Backend

**Scanning your network requires root access!** To get root access, run the following command:

```bash
sudo su
```

With root access, now you can run the backend:

```bash
cd backend
uvicorn main:app --reload
```

_If using VSCode, you can run the API backend by running the debugger under `Python Debugger: FastAPI`._

Once the API is running, you have access to it at [http://localhost:8000](http://localhost:8000), and the Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs).

### Project Structure

```bash
|-- backend/
│   ├── api/              # API Endpoints
│   │── scan/              # NMap scanner
│   │── main.py            # FastAPI entrypoint
├── frontend/               # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json        # Frontend dependencies
│
├── .gitignore
└── README.md
```
