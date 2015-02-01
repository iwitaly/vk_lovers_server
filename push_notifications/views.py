from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from push_notifications.serializers import APNSDeviceSerializer
from users.views import JSONResponse
from push_notifications.models import APNSDevice
from users.models import User

@csrf_exempt
def device_list(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        devices = APNSDevice.objects.filter(registration_id=data['registration_id'])
        doesExists = devices.exists()

        if doesExists:
            return JSONResponse(data, status=302)

        try:
            user = User.objects.get(pk=data['user'])
        except User.DoesNotExist:
            return JSONResponse(data, status=400)

        try:
            device = user.apnsdevice_set.create(registration_id=data['registration_id'])
        except user.IntegrityError:
            return JSONResponse({'shit : bad save'}, status=400)

        return JSONResponse(data, status=201)