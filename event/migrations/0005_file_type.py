# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-07 11:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0004_auto_20160825_2333'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='type',
            field=models.CharField(choices=[('image', 'image'), ('video', 'video')], default='image', max_length=100),
            preserve_default=False,
        ),
    ]