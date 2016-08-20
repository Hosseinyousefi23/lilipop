# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-16 10:10
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import geoposition.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('unique_code', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='File',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_field', models.FileField(upload_to='video/%Y/%m/%d/')),
            ],
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', geoposition.fields.GeopositionField(max_length=42)),
            ],
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('number', models.IntegerField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='PlaceType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('frontend_name', models.CharField(max_length=100)),
                ('backend_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Proposal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('submission_time', models.DateTimeField(default=django.utils.timezone.now)),
                ('description', models.CharField(max_length=1000)),
                ('area_point_set', models.ManyToManyField(to='event.Location')),
                ('extra_facilities', models.ManyToManyField(to='event.Facility')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('place_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.PlaceType')),
            ],
        ),
        migrations.CreateModel(
            name='SpaceTimePoint',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', geoposition.fields.GeopositionField(max_length=42)),
                ('time_spot', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Text',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text_field', models.CharField(max_length=2000)),
            ],
        ),
        migrations.AddField(
            model_name='proposal',
            name='subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.Subject'),
        ),
        migrations.AddField(
            model_name='place',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.PlaceType'),
        ),
        migrations.AddField(
            model_name='event',
            name='area_point_set',
            field=models.ManyToManyField(to='event.Location'),
        ),
        migrations.AddField(
            model_name='event',
            name='files',
            field=models.ManyToManyField(to='event.File'),
        ),
        migrations.AddField(
            model_name='event',
            name='gps_location_data',
            field=models.ManyToManyField(to='event.SpaceTimePoint'),
        ),
        migrations.AddField(
            model_name='event',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='event',
            name='place',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.Place'),
        ),
        migrations.AddField(
            model_name='event',
            name='proposal',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.Proposal'),
        ),
        migrations.AddField(
            model_name='event',
            name='texts',
            field=models.ManyToManyField(to='event.Text'),
        ),
    ]
