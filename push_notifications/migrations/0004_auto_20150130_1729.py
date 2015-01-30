# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0003_auto_20150130_1727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apnsdevice',
            name='vk_id',
            field=models.ForeignKey(default=1, to='users.User'),
            preserve_default=False,
        ),
    ]
