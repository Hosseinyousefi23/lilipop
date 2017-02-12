from django.contrib.auth import logout, authenticate, login
from django.http.response import HttpResponseRedirect, HttpResponse
from django.urls.base import reverse

from userman.Forms import *


def signup(request):
    user = User.objects.create_user(request.POST['username'], request.POST['email'],
                                    request.POST['password'])
    user.first_name = request.POST['first_name']
    user.last_name = request.POST['last_name']
    user.save()
    login(request, user)
    return HttpResponseRedirect(reverse('main:main_page'))


def log_in(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    login(request, user)
    return HttpResponseRedirect(reverse('main:main_page'))


def check_user(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        return HttpResponse('ok')
    else:
        return HttpResponse('invalid')


def log_out(request):
    if request.user.is_authenticated():
        logout(request)
    return HttpResponseRedirect(reverse('main:main_page'))
