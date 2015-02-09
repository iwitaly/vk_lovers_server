from users.views import JSONResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from external_api_manager.models import VKManager, VKError, VKStatusChangeResponse, VKItemResponse
from django.http import HttpResponse
import datetime
from django.shortcuts import render_to_response
from users.views import JSONParser

@csrf_exempt
def handle_payment(request):
    if request.method == 'POST':
        data = request.POST
        notification_type = data['notification_type']

        if notification_type == 'get_item_test':
            respondItem = VKManager.getItem(data)
            if respondItem:
                return JSONResponse(data={'response' : respondItem.__dict__}, status=status.HTTP_202_ACCEPTED)

        if notification_type == 'order_status_change_test':
            statusRespond = VKManager.getStatusChange(data)
            if statusRespond:
                if isinstance(statusRespond, VKStatusChangeResponse):
                    return JSONResponse(data={'response' : statusRespond.__dict__}, status=status.HTTP_202_ACCEPTED)
                else:
                    return JSONResponse(data={'error' : statusRespond.__dict__}, status=status.HTTP_204_NO_CONTENT)

        return JSONResponse(data={}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def mobile_input_view(request):
    if request.method == 'GET':
        data = request.GET
        return render_to_response('external_api_manager/input.html', {'data' : data})