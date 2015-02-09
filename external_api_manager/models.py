# coding=utf-8
import urllib2
import urllib
import json
from users.models import User

ID_OF_VK_APP = '4737414' # aka client_id
SECRET_KEY_OF_VK_APP = '5DQcPsFP2bMbSwbkTKNW' # aka client_secret
SMS_AERO_LOGIN = 'iwitaly@me.com'
SMS_AERO_PASS = 'Y8zbuf9gkagumpO49u3W'
SMS_AERO_FROM = 'INFORM'

class VKItemResponse:
    def __init__(self, title):
        self.title = title
        self.price = 1

class VKStatusChangeResponse:
    def __init__(self, order_id):
        self.order_id = order_id

class VKError:
    def __init__(self, error_code, error_msg, critical):
        self.error_code = error_code
        self.error_msg = error_msg
        self.critical = critical

class SMSManager:
    #return status of sent message
    @staticmethod
    def sendSmsUsingData(request):
        user = User.objects.get(vk_id=str(request['user_id']))

        number = user.to_who_mobile
        data = request['item']
        type = int(data[0])
        sex = int(data[-1])

        #TODO manage text

        text = 'Sent+from+vk+app'
        url = 'http://gate.smsaero.ru/send/?answer=json&user={}&password={}&to={}&text={}&from={}'.format(SMS_AERO_LOGIN, SMS_AERO_PASS, number, text, SMS_AERO_FROM)
        res = urllib2.urlopen(url)
        data = json.load(res)
        return data['result']

class VKManager:
    @staticmethod
    def sendNotificationVKtoUser(user_vk_id):
        url_to_get_access_token = 'https://oauth.vk.com/access_token?client_id=' + ID_OF_VK_APP + '&client_secret=' + SECRET_KEY_OF_VK_APP + '&v=5.27&grant_type=client_credentials'
        response = urllib2.urlopen(url_to_get_access_token)
        json_with_access_token = json.load(response)
        current_access_token = json_with_access_token['access_token']
        param = urllib.urlencode({'message': u'Вернись! Я все прощу!'.encode('utf-8')})
        url_to_send_notification = 'https://api.vk.com/method/secure.sendNotification?user_id=' + \
                                   user_vk_id + '&' + param + '&v=5.27&client_secret=' + \
                                   SECRET_KEY_OF_VK_APP + '&access_token=' + current_access_token
        response = urllib2.urlopen(url_to_send_notification)
        json_notification = json.load(response)

    @staticmethod
    def getItem(request):
        app_id = request['app_id']

        if str(app_id) != ID_OF_VK_APP:
            return None
        user = User.objects.get(vk_id=str(request['user_id']))
        print(user.to_who_mobile)
        return VKItemResponse(title='Отправить признание на номер {}'.format(user.to_who_mobile))

    @staticmethod
    def getStatusChange(request):
        app_id = request['app_id']

        if str(app_id) != ID_OF_VK_APP:
            return None

        smsStatus = SMSManager.sendSmsUsingData(request)

        if smsStatus == 'accepted':
           return VKStatusChangeResponse(order_id=request['order_id'])

        return VKError(error_code=1, error_msg='Error with sending sms', critical=0)
