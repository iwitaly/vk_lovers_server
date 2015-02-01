from rest_framework import serializers
from push_notifications.models import APNSDevice

class APNSDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = APNSDevice
        fields = ('user', 'registration_id', 'device_id')

