FROM python:3.13-slim

WORKDIR /backend

# Install gcc and other necessary tools
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Install nmap
RUN apt-get update && \
    apt-get install -y nmap && \
    apt-get clean    

# Install ping
RUN apt-get update && \
    apt-get install -y iputils-ping && \
    apt-get clean

COPY backend/requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY /backend/. ./backend

EXPOSE 8000

# Run as root for nmap calls.
USER root

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
