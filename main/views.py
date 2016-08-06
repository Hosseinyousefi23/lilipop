from django.shortcuts import render


def main_page(request):
    if request.user.is_authenticated():
        name = '%s %s' % (request.user.first_name, request.user.last_name)
        return render(request, 'user_main_page.html', {'name': name})
    else:
        return render(request, 'main_page.html', {})


def about_us(request):
    if request.user.is_authenticated():
        return render(request, 'user_about_us.html', {})
    else:
        return render(request, 'about_us.html', {})