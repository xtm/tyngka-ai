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
