from django.db import models

class User(models.Model):
    vk_id = models.CharField(max_length=50, unique=True)
    mobile = models.CharField(max_length=20)
    def get_list_of_to_who_confessions (self):
        return Confession.objects.filter(to_who_id=self.vk_id)
    def __str__(self):
        return self.vk_id + '+' + self.mobile

class Confession(models.Model):
    who_id = models.ForeignKey(User, to_field='vk_id')
    to_who_id = models.CharField(max_length=50)
    type = models.IntegerField(default=-1)

