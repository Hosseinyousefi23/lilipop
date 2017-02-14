from django.shortcuts import render
from django.utils.translation import activate, LANGUAGE_SESSION_KEY


def main_page(request):
    if not request.session[LANGUAGE_SESSION_KEY]:
        activate('en')
        request.session[LANGUAGE_SESSION_KEY] = 'en'
    if request.user.is_authenticated():
        name = '%s %s' % (request.user.first_name, request.user.last_name)
        return render(request, 'user_main_page.html', {'name': name})
    else:
        return render(request, 'main_page.html', {})