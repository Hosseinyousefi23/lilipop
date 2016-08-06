from django.conf.urls import url

from event import views


app_name = 'event'
urlpatterns = [
    url(r'^reserve$', views.reserve, name='reserve'),
]