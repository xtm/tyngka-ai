import os

from dotenv import load_dotenv

load_dotenv()

TYNGKA_ENV = os.getenv(
	"TYNGKA_ENV",
	"development"
)

TYNGKA_DATABASE = os.getenv(
	"TYNGKA_DATABASE",
	"data/tyngka.db"
)

LOG_LEVEL = os.getenv(
	"LOG_LEVEL",
	"INFO"
)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://127.0.0.1:5500"
).split(",")
