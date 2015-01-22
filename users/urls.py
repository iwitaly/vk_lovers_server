from django.conf.urls import url
from users import views

urlpatterns = [
    url(r'^users/$', views.user_list),
    url(r'^users/(?P<vk_id>[0-9]+)/$', views.user_detail),
    url(r'^users/(?P<who_vk_id>[0-9]+)/who_confession/$', views.who_confession_list),
    url(r'^users/(?P<who_vk_id>[0-9]+)/who_confession/(?P<to_who_vk_id>[0-9]+)/$', views.who_confession_detail),
    url(r'^users/(?P<who_vk_id>[0-9]+)/to_who_confession/$', views.to_who_confession_list),
    url(r'^users/who_confession/(?P<vk_id>[0-9]+)/$', views.post_all_confessions)
]
