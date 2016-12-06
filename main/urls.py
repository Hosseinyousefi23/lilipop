from django.conf.urls import url

from main import views

app_name = 'main'
urlpatterns = [
    url(r'^$', views.main_page, name='main_page'),
    url(r'^about_us$', views.about_us, name='about_us'),
]