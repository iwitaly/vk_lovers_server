# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0002_apnsdevice_vk_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apnsdevice',
            name='vk_id',
            field=models.ForeignKey(blank=True, to='users.User', null=True),
            preserve_default=True,
        ),
    ]
