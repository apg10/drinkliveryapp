from rest_framework.status import HTTP_200_OK
from rest_framework.test import APITestCase


class HealthTest(APITestCase):
    def test_health_returns_200(self):
        response = self.client.get('/api/health/')
        assert response.status_code == HTTP_200_OK

    def test_health_status_is_ok(self):
        response = self.client.get('/api/health/')
        assert response.json()['status'] == 'ok'

    def test_health_service_is_drinklivery_backend(self):
        response = self.client.get('/api/health/')
        assert response.json()['service'] == 'drinklivery-backend'
