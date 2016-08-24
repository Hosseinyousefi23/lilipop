from django.conf.urls import url

from event import views


app_name = 'event'
urlpatterns = [
    url(r'^reserve$', views.reserve, name='reserve'),
    url(r'^location_types$', views.location_types, name='location_types'),
    url(r'^data$', views.send_data, name='data'),
    url(r'my_events', views.my_events, name='my_events'),
]