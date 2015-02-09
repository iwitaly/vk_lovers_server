# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20150204_1947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='to_who_mobile',
            field=models.CharField(max_length=20, blank=True),
            preserve_default=True,
        ),
    ]
