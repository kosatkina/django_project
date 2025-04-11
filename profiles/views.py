from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView

# Create your views here.

@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            instance = form.save()
            return JsonResponse({
                'bop': instance.bop,
                'avatar': instance.avatar.url,
                'user': instance.user.username
            })
    
    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'profiles/main.html', context)

class CustomLoginView(LoginView):
    template_name = 'posts/login.html'

    def get_success_url(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return '/admin/'  
        return '/'
