# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20150204_2205'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='confession_lim',
        ),
        migrations.AddField(
            model_name='user',
            name='confession_count_date',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(3)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='user',
            name='confession_count_sex',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(7)]),
            preserve_default=True,
        ),
    ]
