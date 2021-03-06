from django.conf.urls import url

from event import views


app_name = 'event'
urlpatterns = [
    url(r'^reserve$', views.reserve, name='reserve'),
    url(r'^location_types$', views.location_types, name='location_types'),
    url(r'^data$', views.send_data, name='data'),
    url(r'^changelang$', views.change_lang, name='changelang'),
    url(r'^delete$', views.delete_proposal, name='delete_proposal'),
    url(r'^submit$', views.submit_proposal, name='submit_proposal'),

]