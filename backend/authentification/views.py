from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer,PasswordResetRequestSerializer,SetNewPasswordSerializer, UserUpdateSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.views import PasswordResetView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.template.loader import render_to_string
from django.urls import reverse
from .tokens import custom_token_generator  # Token personalizado
from django.utils.http import urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.tokens import default_token_generator
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes=[AllowAny]
    authentication_classes = []
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class PasswordResetRequestView(APIView):
    permission_classes=[AllowAny]
    authentication_classes = []
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            correo = serializer.validated_data['correo']
            user = User.objects.get(correo=correo)

            # Generar el token de restablecimiento de contraseña
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = custom_token_generator.make_token(user)

            # Crear el enlace de restablecimiento de contraseña
            #reset_link = reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
            reset_url = f"http://localhost:3000/password-reset-confirm/{uid}/{token}/"

            # Enviar el correo electrónico
            subject = 'Recuperación de contraseña'
            message = render_to_string('password_reset_correo.html', {
                'user': user,
                'reset_url': reset_url,
            })

            contenido_html = strip_tags(message)

            correo = EmailMultiAlternatives(subject, contenido_html, 'noreply@myapp.com', [correo])

            correo.attach_alternative(message, "text/html")
            correo.send()

            return Response({"message": "Correo de recuperación de contraseña enviado."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetView(PasswordResetView):
    pass

class ChangePasswordView(generics.UpdateAPIView):
 

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Comprobar la contraseña antigua
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": "Incorrecta"}, status=status.HTTP_400_BAD_REQUEST)

            # Cambiar la contraseña
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "Contraseña actualizada con éxito"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetCompleteView(APIView):
   
    permission_classes=[AllowAny]
    authentication_classes = []
    def get(self, request):
        return Response({"message": "Tu contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)

    
class PasswordResetConfirmView(APIView):
    permission_classes=[AllowAny]
    authentication_classes = []
    def post(self, request, uidb64, token):
        try:
            # Decodificar el UID del usuario
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Enlace inválido."}, status=status.HTTP_400_BAD_REQUEST)


        # Verificar si el token es válido
        if not default_token_generator.check_token(user, token):
            return Response({"error": "El enlace para restablecer la contraseña es inválido o ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el token es válido, permitir al usuario cambiar la contraseña
        serializer = SetNewPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response({"message": "La contraseña ha sido restablecida con éxito."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)