from django.shortcuts import render

def index(request):
    return render(request, 'Server/vkapp.html')


def home(request):
    return render(request, 'Server/home.html')