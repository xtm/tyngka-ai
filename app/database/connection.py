import os
import sqlite3


DATABASE_PATH = os.getenv(
    "TYNGKA_DATABASE",
    "data/tyngka.db"
)


def get_connection():
    return sqlite3.connect(DATABASE_PATH)
