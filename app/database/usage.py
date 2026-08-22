from datetime import datetime, timezone

from app.database.connection import get_connection


def record_api_usage(endpoint: str, connection=None):
    should_close = False

    if connection is None:
        connection = get_connection()
        should_close = True

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO api_usage (endpoint, created_at)
        VALUES (?, ?)
        """,
        (
            endpoint,
            datetime.now(timezone.utc).isoformat()
        )
    )

    connection.commit()

    if should_close:
        connection.close()
