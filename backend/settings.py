import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)

API_HOST_IP = os.environ.get("API_HOST_IP")
API_HOST_PORT = os.environ.get("API_HOST_PORT")

SCAN_BATCH_SIZE = os.environ.get("SCAN_BATCH_SIZE")
SCAN_BATCH_SUBPROC_TIMEOUT = os.environ.get("SCAN_BATCH_SUBPROC_TIMEOUT")
SCAN_HOST_TIMEOUT = os.environ.get("SCAN_HOST_TIMEOUT")

SCAN_MIN_RATE = os.environ.get("SCAN_MIN_RATE")
SCAN_TEMPLATE = os.environ.get("SCAN_TEMPLATE")
