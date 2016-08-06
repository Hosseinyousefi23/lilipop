from django.conf.urls import url

from user import views

app_name = 'user'
urlpatterns = [
    url(r'^signup$', views.signup, name='signup'),
    url(r'^login$', views.log_in, name='login'),
    url(r'^logout$', views.log_out, name='logout'),

]
