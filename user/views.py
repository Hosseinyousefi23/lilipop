from django.contrib.auth import logout, authenticate, login

from django.http.response import HttpResponseRedirect, HttpResponse
from django.shortcuts import render
from django.urls.base import reverse

from user.Forms import *


def signup(request):
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(form.cleaned_data['username'], form.cleaned_data['email'],
                                            form.cleaned_data['password'])
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.save()
            login(request, user)
            return HttpResponseRedirect(reverse('main:main_page'))
    else:
        form = UserForm()
        return render(request, 'signup_page.html', {'form': form})


def log_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse('main:main_page'))
            else:
                return HttpResponse('<h2>Username or password is not valid.<h2>')

    else:
        form = LoginForm()
        return render(request, 'login_page.html', {'form': form})


def log_out(request):
    if request.user.is_authenticated():
        logout(request)
    return render(request, 'main_page.html', {})
