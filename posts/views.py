from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

def post_list_and_create(request):
    form = PostForm(request.POST or None)
    # qs = Post.objects.all()

    # Create a new post object and save to database
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            isinstance = form.save(commit=False)
            isinstance.author = author
            isinstance.save()
    
    context = {
        'form': form,
    }
    
    return render(request, 'posts/main.html', context)

def load_post_data_view(request, num_posts):
    
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        # Define the number of posts to display
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        # Get post objects by looping trough the query set
        qs = Post.objects.all()
        data = []
        for obj in qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'count': obj.like_count,
                'author': obj.author.user.username
            }
            data.append(item)
        return JsonResponse({'data': data[lower:upper], 'size': size})

def like_unlike_post(request):
    # Deprecated function .is_ajax() changed
    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
       
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
             # If user already liked this post
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})


def hello_world_view(request):
    return JsonResponse({'text': 'hello world!!!'})