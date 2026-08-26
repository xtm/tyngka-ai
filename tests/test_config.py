from app.config import TYNGKA_ENV, TYNGKA_DATABASE

def test_configuration():
	assert TYNGKA_ENV == "development"
	assert TYNGKA_DATABASE == "data/tyngka.db"
