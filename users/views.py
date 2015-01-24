from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from users.models import User, Confession
from users.serializers import UserSerializer, ConfessionSerializer
from rest_framework import serializers

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
            serializer = ConfessionSerializer(confession ,data=data)
        else:
            serializer = ConfessionSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JSONResponse({'reverse_confession_exist_flag': reverseDoesExists}, status=201)

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