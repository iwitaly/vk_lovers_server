# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20150129_1658'),
        ('push_notifications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='apnsdevice',
            name='vk_id',
            field=models.ForeignKey(default=1, to='users.User'),
            preserve_default=False,
        ),
    ]
