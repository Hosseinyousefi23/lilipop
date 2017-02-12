from django.conf.urls import url

from userman import views

app_name = 'userman'
urlpatterns = [
    url(r'^signup$', views.signup, name='signup'),
    url(r'^login$', views.log_in, name='login'),
    url(r'^logout$', views.log_out, name='logout'),
    url(r'^check$', views.check_user, name='check'),

]
