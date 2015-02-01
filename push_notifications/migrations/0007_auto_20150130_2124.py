# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('push_notifications', '0006_apnsdevice_vk_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='apnsdevice',
            old_name='vk_id',
            new_name='device_owner',
        ),
    ]
