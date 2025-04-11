from django.urls import path
from django.contrib.auth.views import LogoutView
from profiles.views import CustomLoginView
from .views import my_profile_view

app_name = 'profiles'

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('my/', my_profile_view, name='my-profile'),
]