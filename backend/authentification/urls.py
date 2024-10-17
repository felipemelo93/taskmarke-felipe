from django.urls import path
from .views import RegisterView, UserDetailView, ChangePasswordView,PasswordResetRequestView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth.views import PasswordResetCompleteView
from .views import PasswordResetCompleteView  # Vista para completar el cambio de contraseña
from .views import CurrentUserView, PasswordResetConfirmView, UserUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), 
    path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('current-user/', CurrentUserView.as_view(), name='current-user'),
    path('users/<int:pk>/update/',UserUpdateView.as_view(), name='user-update')
]

urlpatterns += [
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password-reset-complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]