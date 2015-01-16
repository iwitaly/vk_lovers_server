from django.conf.urls import url
from users import views

urlpatterns = [
    url(r'^users/$', views.user_list),
    url(r'^users/(?P<vk_id>[A-Za-z0-9]+)/$', views.user_detail),
    url(r'^users/(?P<who_id>[A-Za-z0-9]+)/who_confessions/$', views.who_confession_list),
    url(r'^users/(?P<who_id>[A-Za-z0-9]+)/who_confessions/(?P<to_who_id>[A-Za-z0-9]+)$', views.who_confession_detail),
    url(r'^users/(?P<who_id>[A-Za-z0-9]+)/to_who_confessions/$', views.to_who_confession_list),
]
