from app.database.connection import get_connection
from app.database.usage import record_api_usage


def test_record_api_usage():

    record_api_usage("/api/v1/sip")

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT endpoint FROM api_usage ORDER BY id DESC LIMIT 1"
    )

    row = cursor.fetchone()

    connection.close()

    assert row[0] == "/api/v1/sip"
