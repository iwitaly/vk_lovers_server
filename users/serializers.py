from rest_framework import serializers
from users.models import User, Confession

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('vk_id', 'mobile')

class ConfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Confession
        fields = ('who_id', 'to_who_id', 'type')

