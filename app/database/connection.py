import sqlite3

from app.config import TYNGKA_DATABASE

def get_connection():
	return sqlite3.connect(TYNGKA_DATABASE)
