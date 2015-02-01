# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0007_auto_20150130_2124'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='apnsdevice',
            name='device_owner',
        ),
        migrations.AlterField(
            model_name='apnsdevice',
            name='user',
            field=models.ForeignKey(blank=True, to='users.User', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='gcmdevice',
            name='user',
            field=models.ForeignKey(blank=True, to='users.User', null=True),
            preserve_default=True,
        ),
    ]
