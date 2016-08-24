# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-24 07:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='image',
            field=models.ImageField(null=True, upload_to='files/%Y/%m/%d/'),
        ),
        migrations.AlterField(
            model_name='proposal',
            name='extra_facilities',
            field=models.ManyToManyField(blank=True, to='event.Facility'),
        ),
    ]
