# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20150115_2033'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AlterField(
            model_name='confession',
            name='who_id',
            field=models.ForeignKey(to='users.User'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='user',
            name='vk_id',
            field=models.CharField(max_length=50, serialize=False, primary_key=True, unique=True),
            preserve_default=True,
        ),
    ]
