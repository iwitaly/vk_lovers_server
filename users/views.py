# coding=utf-8
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import User, Confession, CONFESSION_LIM_DATE, CONFESSION_LIM_SEX
from users.serializers import UserSerializer, ConfessionSerializer
from push_notifications.models import APNSDevice
from rest_framework import status
from external_api_manager.models import VKManager

k_Default_email = 'unknown@unknown.com'
k_Default_mobile = 'unknown'

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

def handlePostUser(data):
    users = User.objects.filter(vk_id=data['vk_id'])
    doesExists = users.exists()
    serializer = None

    if data['email'] == '':
        data['email'] = k_Default_email
    if data['mobile'] == '':
        data['mobile'] = k_Default_mobile
    if data['to_who_mobile'] == '':
        data['to_who_mobile'] = k_Default_mobile

    if doesExists:
        user = users[0]
        if data['mobile'] == k_Default_mobile:
            data['mobile'] = user.mobile
        if data['email'] == k_Default_email:
            data['email'] = user.email
        if data['to_who_mobile'] == k_Default_mobile:
            data['to_who_mobile'] = user.to_who_mobile

        serializer = UserSerializer(user, data=data)
    else: #POST
        serializer = UserSerializer(data=data)

    return serializer

@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = handlePostUser(data)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=status.HTTP_201_CREATED)

        return JSONResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def user_detail(request, vk_id):
    try:
        user = User.objects.get(pk=vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

#data = dictionary with confession
def sendToDevice(device, data):
    device.send_message("You've got mail", badge=1, sound='default', extra=data) # Alert message may only be sent as text.

def sendNotificationApple(data):
    first_vk_id = data['who_vk_id']
    second_vk_id = data['to_who_vk_id']
    first_device, second_device = None, None

    try:
         first_device = APNSDevice.objects.filter(user=first_vk_id)
         second_device = APNSDevice.objects.filter(user=second_vk_id)
    except APNSDevice.DoesNotExist:
        print 'Govno'

    if first_device and second_device:
        devices = first_device | second_device #merge queries
        sendToDevice(devices, data)
    elif first_device:
        sendToDevice(first_device, data)
    elif second_device:
        sendToDevice(second_device, data)
    else:
        return JSONResponse(data, status=status.HTTP_204_NO_CONTENT)

    return JSONResponse(data, status=status.HTTP_200_OK)

#data - parsed request
def handleConfession(data, should_increment):
    user_who_sent_confession = User.objects.get(pk=data['who_vk_id'])

    if should_increment:
        if data['type'] == 0:
            try:
                user_who_sent_confession.confession_count_date += 1
            except User.ValidationError:
                user_who_sent_confession.confession_count_date = CONFESSION_LIM_DATE
                return None
        else:
            try:
                user_who_sent_confession.confession_count_sex += 1
            except User.ValidationError:
                user_who_sent_confession.confession_count_sex = CONFESSION_LIM_SEX
                return None
        user_who_sent_confession.save()

    confs = Confession.objects.filter(who_vk_id=data['who_vk_id'], to_who_vk_id=data['to_who_vk_id'])
    doesExists = confs.exists()
    serializer = None

    reverse_confs = Confession.objects.filter(who_vk_id=data['to_who_vk_id'], to_who_vk_id=data['who_vk_id'])
    reverseDoesExists = reverse_confs.exists()

    #PUT
    if reverseDoesExists:
        reverse_current_confession = reverse_confs[0]
        sendNotificationApple(data)
        if ((reverse_current_confession.type == data['type']) or
                ((reverse_current_confession.type==1) and (data['type'] == 0))):
            VKManager.sendNotificationVKtoUser(data['to_who_vk_id'])

    if doesExists:
        confession = confs[0]
        if reverseDoesExists:
            confession.reverse_type = reverse_current_confession.type
            reverse_current_confession.reverse_type = data['type']
            reverse_current_confession.save()
        serializer = ConfessionSerializer(confession, data=data)
    else: #POST
        if reverseDoesExists:
            data['reverse_type'] = reverse_current_confession.type
            reverse_current_confession.reverse_type = data['type']
            reverse_current_confession.save()
        serializer = ConfessionSerializer(data=data)

    return serializer


@csrf_exempt
def who_confession_list(request, who_vk_id):
    try:
        who_user = User.objects.get(pk=who_vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        who_confessions = who_user.confession_set.all()
        serializer = ConfessionSerializer(who_confessions, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = handleConfession(data, should_increment=True)

        if not serializer:
            return JSONResponse({})

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=status.HTTP_201_CREATED)

        return JSONResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def who_confession_detail(request, who_vk_id, to_who_vk_id):
    try:
        confession = Confession.objects.get(who_vk_id=who_vk_id, to_who_vk_id=to_who_vk_id)
    except Confession.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = ConfessionSerializer(confession)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = ConfessionSerializer(confession, data=data, partial=True)
        handleConfession(data, should_increment=False)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        confession.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
def to_who_confession_list(request, who_vk_id):
    try:
        who_user = User.objects.get(vk_id=who_vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        to_who_confessions = who_user.get_list_of_to_who_confession()
        serializer = ConfessionSerializer(to_who_confessions, many=True)
        return JSONResponse(serializer.data)

@csrf_exempt
def post_all_confessions(request, vk_id):
    serializers_data_list = []
    if request.method == 'POST':
        data = JSONParser().parse(request)
        for req in data:
            serializer = handleConfession(req, should_increment=True)
            if serializer.is_valid():
                serializer.save()
                serializers_data_list.append(serializer.data)
            else:
                resp = {'status' : 400}
                return JSONResponse(resp, status=status.HTTP_400_BAD_REQUEST)

        #resp = {'status' : 201}
        return JSONResponse(serializers_data_list, status=status.HTTP_201_CREATED)

    elif request.method == 'DELETE':
        try:
            user = User.objects.get(pk=vk_id)
        except User.DoesNotExist:
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

        confessions = user.confession_set.all()
        for conf in confessions:
            conf.delete()

        resp = {'status' : 201}
        return JSONResponse(resp, status=status.HTTP_201_CREATED)

    return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def to_who_confession_number(request, vk_id):
    try:
        who_user = User.objects.get(vk_id=vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        number = who_user.get_number_of_to_who_confession()
        return JSONResponse({'count' : number})