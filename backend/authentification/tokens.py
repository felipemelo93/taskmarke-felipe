from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
from django.utils import timezone

class CustomPasswordResetTokenGenerator(PasswordResetTokenGenerator):
    def _check_token(self, user, token, timestamp):
        # Permitir que el token sea válido por más de 24 horas
        return super()._check_token(user, token, timestamp) and timezone.now() <= timestamp + timedelta(days=3)

custom_token_generator = CustomPasswordResetTokenGenerator()
