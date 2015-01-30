from django.conf.urls import patterns, include, url
from django.contrib import admin
from Server import views

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('users.urls')),
    url(r'^vkapp/', views.index, name='vkapp'),
    url(r'^', include('push_notifications.urls')),
)
