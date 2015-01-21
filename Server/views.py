from django.shortcuts import render

def index(request):
    return render(request, 'vkapp/index.html')