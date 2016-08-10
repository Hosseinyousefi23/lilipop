# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-10 11:31
from __future__ import unicode_literals

from django.db import migrations
import geoposition.fields


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='place',
            name='lat',
        ),
        migrations.RemoveField(
            model_name='place',
            name='lng',
        ),
        migrations.AddField(
            model_name='place',
            name='position',
            field=geoposition.fields.GeopositionField(max_length=42, null=True),
        ),
    ]