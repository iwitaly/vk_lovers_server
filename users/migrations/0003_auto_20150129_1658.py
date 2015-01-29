# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20150125_1304'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='confession',
            name='is_completed',
        ),
        migrations.AddField(
            model_name='confession',
            name='reverse_type',
            field=models.IntegerField(default=-1, validators=[django.core.validators.MinValueValidator(-1), django.core.validators.MaxValueValidator(1)]),
            preserve_default=True,
        ),
    ]
