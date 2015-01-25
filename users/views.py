from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import User, Confession
from users.serializers import UserSerializer, ConfessionSerializer
import urllib2
import simplejson

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

@csrf_exempt
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
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

def sendNotification (user_vk_id):
    ID_OF_VK_APP = '4737414' # aka client_id
    SECRET_KEY_OF_VK_APP = '5DQcPsFP2bMbSwbkTKNW' # aka client_secret
    print(user_vk_id)
    print (type(user_vk_id))
    url_to_get_access_token = 'https://oauth.vk.com/access_token?client_id=' + ID_OF_VK_APP + '&client_secret=' + SECRET_KEY_OF_VK_APP + '&v=5.27&grant_type=client_credentials'
    print (url_to_get_access_token)
    response = urllib2.urlopen(url_to_get_access_token)
    print(response.info())
    json_with_access_token = response.read()
    print ('Info ends')
    print (json_with_access_token)
    dict_with_access_token = simplejson.load(json_with_access_token)
    print (dict_with_access_token)
    current_access_token = dict_with_access_token['access_token']
    print (current_access_token)
    url_to_send_notification = 'https://api.vk.com/method/secure.sendNotification?user_id=' + user_vk_id + '&message=' + 'Test notification' + '&v=5.27&access_token=' + current_access_token
    response = urllib2.urlopen(url_to_send_notification)

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
        confs = Confession.objects.filter(who_vk_id=data['who_vk_id'], to_who_vk_id=data['to_who_vk_id'])
        doesExists = confs.exists()
        serializer = None

        reverse_confs = Confession.objects.filter(who_vk_id=data['to_who_vk_id'], to_who_vk_id=data['who_vk_id'])
        reverseDoesExists = reverse_confs.exists()

        if doesExists:
            confession = confs[0]
            if reverseDoesExists:
                confession.is_completed = 1
                reverse_Current_Confession = reverse_confs[0]
                reverse_Current_Confession.is_completed = 1
                reverse_Current_Confession.save()
                sendNotification(data['to_who_vk_id'])
            serializer = ConfessionSerializer(confession, data=data)
        else:
            if reverseDoesExists:
                data['is_completed'] = 1
                reverse_Current_Confession = reverse_confs[0]
                reverse_Current_Confession.is_completed = 1
                reverse_Current_Confession.save()
                sendNotification(data['to_who_vk_id'])
            serializer = ConfessionSerializer(data=data)


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
    if request.method == 'POST':
        data = JSONParser().parse(request)
        for req in data:
            confs = Confession.objects.filter(who_vk_id=req['who_vk_id'], to_who_vk_id=req['to_who_vk_id'])
            doesExists = confs.exists()

            if doesExists:
                confession = confs[0]
                serializer = ConfessionSerializer(confession ,data=req)
            else:
                serializer = ConfessionSerializer(data=req)

            if serializer.is_valid():
                serializer.save()
            else:
                resp = {'status' : 400}
                return JSONResponse(resp, status=400)

        resp = {'status' : 201}
        return JSONResponse(resp, status=201)

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