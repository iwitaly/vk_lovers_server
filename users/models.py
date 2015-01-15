from django.db import models

class User(models.Model):
    vk_id = models.CharField(max_length=50)
    mobile = models.CharField(max_length=20)

    def __str__(self):
        return self.vk_id + '+' + self.mobile

class Confession(models.Model):
    who_id = models.ForeignKey(User)
    to_who_id = models.CharField(max_length=50)
    type = models.IntegerField(default=-1)

