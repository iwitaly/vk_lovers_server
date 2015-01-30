from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from push_notifications.serializers import APNSDeviceSerializer
from users.views import JSONResponse

@csrf_exempt
def device_list(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = APNSDeviceSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)

        return JSONResponse(serializer.errors, status=400)

