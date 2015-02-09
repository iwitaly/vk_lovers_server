__author__ = 'iwitaly'
from django.conf.urls import patterns, url
from external_api_manager import views

urlpatterns = patterns('',
    url(r'^payments/$', views.handle_payment),
    url(r'^mobileinput/$', views.mobile_input_view),
)
