# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0008_auto_20150130_2137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apnsdevice',
            name='user',
            field=models.ForeignKey(to='users.User'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='gcmdevice',
            name='user',
            field=models.ForeignKey(to='users.User'),
            preserve_default=True,
        ),
    ]
