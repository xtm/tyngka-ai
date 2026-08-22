from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
	response = client.get("/")

	assert response.status_code ==200
	assert response.json()["status"] == "running"

def test_sip_api():
	response = client.post(
	"/api/v1/sip",
	json={
		"monthly_investment": 50000,
		"annual_return": 12,
		"years": 20
	}
	)

	assert response.status_code == 200

	data = response.json()

	assert data["total_investment"] == 12000000

	assert data["estimated_returns"] > 0
	assert data["future_value"] > data["total_investment"]


def test_cagr_api():
    response = client.post(
        "/api/v1/cagr",
        json={
            "beginning_value": 100000,
            "ending_value": 200000,
            "years": 10
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert round(data["cagr"], 4) == 7.1773

def test_sip_api_when_usage_database_fails(monkeypatch):

    def broken_usage(*args, **kwargs):
        raise RuntimeError("Database unavailable")

    monkeypatch.setattr(
        "app.routes.calculators.record_api_usage",
        broken_usage
    )

    response = client.post(
        "/api/v1/sip",
        json={
            "monthly_investment": 50000,
            "annual_return": 12,
            "years": 20
        }
    )

    assert response.status_code == 200
