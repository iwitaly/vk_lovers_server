# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20150115_1802'),
    ]

    operations = [
        migrations.RenameField(
            model_name='confession',
            old_name='to_who_vk_id',
            new_name='to_who_vk_id',
        ),
        migrations.RenameField(
            model_name='confession',
            old_name='who_vk_id',
            new_name='who_vk_id',
        ),
    ]
