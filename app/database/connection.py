import sqlite3

from app.config import TYNGKA_DATABASE


def get_connection():
    return sqlite3.connect(TYNGKA_DATABASE)


def initialize_database():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS calculations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            calculator_type TEXT NOT NULL,
            input_value TEXT NOT NULL,
            result TEXT NOT NULL
        )
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS api_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            endpoint TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()
