# coding=utf-8
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import User, Confession
from users.serializers import UserSerializer, ConfessionSerializer
import urllib2
import urllib
import json
from push_notifications.models import APNSDevice

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

def sendNotifTest():
    device = APNSDevice(registration_id='c1f1f735a674b397ef0d1bd239e05688d95db03aec95d4d790b60ab2e5fda50a',
                        device_id='F9DFCABD-53E5-4AB7-BCB0-471F05C6FDF9')
    device.send_message("You've got mail", badge=1, sound='default') # Alert message may only be sent as text.
    #device.send_message(None, badge=5) # No alerts but with badge.
    #device.send_message(None, badge=1, extra={"foo": "bar"}) # Silent message with badge and added custom data.

@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        #sendNotifTest()

        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)

        if data['email'] == '':
            data['email'] = k_Default_email
        if data['mobile'] == '':
            data['mobile'] = k_Default_mobile

        doesExists = User.objects.filter(vk_id=data['vk_id'], mobile=data['mobile'], email=data['email']).exists()

        print serializer.is_valid(), doesExists

        if doesExists:
            return JSONResponse(serializer.data, status=201)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)

        return JSONResponse(serializer.errors, status=400)

@csrf_exempt
def user_detail(request, vk_id):
    try:
        user = User.objects.get(pk=vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=204)

def sendNotificationVK(user_vk_id):
    #MESSAGE_TEXT = raw_input('Вернись! Я все прощу!')
    #MESSAGE_TEXT = u'Вернись! Я все прощу!'
    ID_OF_VK_APP = '4737414' # aka client_id
    SECRET_KEY_OF_VK_APP = '5DQcPsFP2bMbSwbkTKNW' # aka client_secret
    url_to_get_access_token = 'https://oauth.vk.com/access_token?client_id=' + ID_OF_VK_APP + '&client_secret=' + SECRET_KEY_OF_VK_APP + '&v=5.27&grant_type=client_credentials'
    response = urllib2.urlopen(url_to_get_access_token)
    json_with_access_token = json.load(response)
    current_access_token = json_with_access_token['access_token']
    #print(current_access_token)
    #params = urllib.quote(MESSAGE_TEXT.decode('utf-8').encode('cp1251'))
    param = urllib.urlencode({'message': u'Вернись! Я все прощу!'.encode('utf-8')})
    #params = urllib.urlencode({'text': MESSAGE_TEXT})
    print (param)
    url_to_send_notification = 'https://api.vk.com/method/secure.sendNotification?user_id=' + \
                               user_vk_id + '&' + param + '&v=5.27&client_secret=' + \
                               SECRET_KEY_OF_VK_APP + '&access_token=' + current_access_token
    '''
    url_to_send_notification = 'https://api.vk.com/method/secure.sendNotification?user_id=' + \
                               user_vk_id + '&message=' + 'Text' + '&v=5.27&client_secret=' + \
                               SECRET_KEY_OF_VK_APP + '&access_token=' + current_access_token
    '''
    print(url_to_send_notification)
    response = urllib2.urlopen(url_to_send_notification)
    json_notification = json.load(response)
    print(json_notification)


#data - parsed request
def handleDataFromPostRequest(data):
    confs = Confession.objects.filter(who_vk_id=data['who_vk_id'], to_who_vk_id=data['to_who_vk_id'])
    doesExists = confs.exists()
    serializer = None

    reverse_confs = Confession.objects.filter(who_vk_id=data['to_who_vk_id'], to_who_vk_id=data['who_vk_id'])
    reverseDoesExists = reverse_confs.exists()

    #PUT
    if reverseDoesExists:
        reverse_current_confession = reverse_confs[0]
        sendNotificationVK(data['to_who_vk_id'])

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
        return HttpResponse(status=404)

    if request.method == 'GET':
        who_confessions = who_user.confession_set.all()
        serializer = ConfessionSerializer(who_confessions, many=True)
        return JSONResponse(serializer.data)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = handleDataFromPostRequest(data)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)

        return JSONResponse(serializer.errors, status=400)

@csrf_exempt
def who_confession_detail(request, who_vk_id, to_who_vk_id):
    try:
        confession = Confession.objects.get(who_vk_id=who_vk_id, to_who_vk_id=to_who_vk_id)
    except Confession.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        serializer = ConfessionSerializer(confession)
        return JSONResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = ConfessionSerializer(confession, data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data)
        return JSONResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        confession.delete()
        return HttpResponse(status=204)

@csrf_exempt
def to_who_confession_list(request, who_vk_id):
    try:
        who_user = User.objects.get(vk_id=who_vk_id)
    except User.DoesNotExist:
        return HttpResponse(status=404)

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
            serializer = handleDataFromPostRequest(req)
            if serializer.is_valid():
                serializer.save()
                serializers_data_list.append(serializer.data)
            else:
                resp = {'status' : 400}
                return JSONResponse(resp, status=400)

        #resp = {'status' : 201}
        return JSONResponse(serializers_data_list, status=201)

    elif request.method == 'DELETE':
        try:
            user = User.objects.get(pk=vk_id)
        except User.DoesNotExist:
            return HttpResponse(status=404)

        confessions = user.confession_set.all()
        for conf in confessions:
            conf.delete()

        resp = {'status' : 201}
        return JSONResponse(resp, status=201)

    return HttpResponse(status=400)