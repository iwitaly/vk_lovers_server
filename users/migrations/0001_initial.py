# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Confession',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('to_who_vk_id', models.CharField(max_length=50)),
                ('type', models.IntegerField(default=-1)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('vk_id', models.CharField(max_length=50, unique=True, serialize=False, primary_key=True)),
                ('email', models.EmailField(max_length=50)),
                ('mobile', models.CharField(max_length=20)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='confession',
            name='who_vk_id',
            field=models.ForeignKey(to='users.User'),
            preserve_default=True,
        ),
    ]
