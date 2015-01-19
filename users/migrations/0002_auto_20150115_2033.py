# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='confession',
            name='who_vk_id',
            field=models.ForeignKey(to_field='vk_id', to='users.User'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='user',
            name='vk_id',
            field=models.CharField(max_length=50, unique=True),
            preserve_default=True,
        ),
    ]
