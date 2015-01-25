from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class User(models.Model):
    vk_id = models.CharField(max_length=50, unique=True, primary_key=True)
    email = models.EmailField(max_length=50)
    mobile = models.CharField(max_length=20)

    def get_list_of_to_who_confession(self):
        return Confession.objects.filter(to_who_vk_id=self.vk_id)

    def __str__(self):
        return self.vk_id + '+' + self.mobile + '+' + self.email

class Confession(models.Model):
    who_vk_id = models.ForeignKey(User, to_field='vk_id')
    to_who_vk_id = models.CharField(max_length=50)
    type = models.IntegerField(default=-1, validators=[MinValueValidator(-1), MaxValueValidator(1)])
    is_completed = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(1)])

    def is_unique(self):
        confessions = Confession.objects.filter(who_vk_id=self.who_vk_id, to_who_vk_id=self.to_who_vk_id, type=self.type)
        return len(confessions) == 0
