import sqlite3

connection = sqlite3.connect("data/tyngka.db")

cursor = connection.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS calculations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	calculator_type TEXT NOT NULL,
	input_value TEXT NOT NULL,
	result TEXT NOT NULL
)
""")


connection.commit()
connection.close()

print("Database created successfully.")
