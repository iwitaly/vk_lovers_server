# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20150129_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='confession_lim',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(10)]),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='user',
            name='to_who_mobile',
            field=models.CharField(default=b'', max_length=20),
            preserve_default=True,
        ),
    ]
