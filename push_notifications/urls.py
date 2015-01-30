from django.conf.urls import url
from push_notifications import views

urlpatterns = [
    url(r'^device/$', views.device_list),
]
