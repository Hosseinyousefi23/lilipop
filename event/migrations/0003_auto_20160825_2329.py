# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-25 18:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_auto_20160824_1212'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='title',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterUniqueTogether(
            name='schedule',
            unique_together=set([('day', 'event')]),
        ),
    ]