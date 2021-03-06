#!/usr/bin/python
# -*- coding: utf-8 -*-
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from geoposition.fields import GeopositionField


class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Facility(models.Model):
    english_name = models.CharField(max_length=100, default='no name')
    persian_name = models.CharField(max_length=100, default='no name')

    def __str__(self):
        return self.english_name


class PlaceType(models.Model):
    # There are 3 types so far: Container gallery (container_gallery) , Mobile media unit (mobile_media_unit) ,
    # Smart furniture (smart_furniture)
    frontend_name = models.CharField(max_length=100)
    backend_name = models.CharField(max_length=100)

    def __str__(self):
        return self.backend_name


class Place(models.Model):
    type = models.ForeignKey(PlaceType)
    name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name

    def location(self, time=timezone.now):
        data = SpaceTimePoint.objects.filter(place=self, time_spot__lte=time).order_by('-time_spot').values()[0]
        return str(data['position'])

    def location_set(self, from_time, to_time):
        data = SpaceTimePoint.objects.filter(place=self, time_spot__gte=from_time, time_spot__lte=to_time).order_by(
            'time_spot')
        return data


class SpaceTimePoint(models.Model):
    position = GeopositionField()
    time_spot = models.DateTimeField(default=timezone.now)
    place = models.ForeignKey(Place)


class Proposal(models.Model):
    place_type = models.ForeignKey(PlaceType)
    submission_time = models.DateTimeField(default=timezone.now, null=True, blank=True)
    save_time = models.DateTimeField(default=timezone.now)
    last_change_time = models.DateTimeField(default=timezone.now)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    jalali_start_date_txt = models.CharField(max_length=100)
    jalali_end_date_txt = models.CharField(max_length=100)
    schedule_txt = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    subject = models.ForeignKey(Subject, null=True, blank=True)
    title = models.CharField(max_length=100)
    owner = models.ForeignKey(User)
    extra_facilities = models.ManyToManyField(Facility, blank=True, related_name='proposal')
    status = models.CharField(choices=(
        ('not submitted', 'not submitted'),
        ('pending approval', 'pending approval'),
        ('submitted', 'submitted')
    ), max_length=100)
    status_fa = models.CharField(choices=(
        ('ثبت نشده', 'ثبت نشده'),
        ('در انتظار تایید', 'در انتظار تایید'),
        ('ثبت شده', 'ثبت شده')
    ), max_length=100)


class ProposalLocation(models.Model):
    position = GeopositionField()
    proposal = models.ForeignKey(Proposal, related_name='area_point_set')


class Event(models.Model):
    unique_code = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    proposal = models.ForeignKey(Proposal)
    place = models.ForeignKey(Place)
    owner = models.ForeignKey(User)
    startDateTime = models.DateTimeField()
    endDateTime = models.DateTimeField()
    description = models.CharField(max_length=500, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)
    schedule_text = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to='files/%Y/%m/%d/', null=True)

    def __str__(self):
        return 'event:' + self.unique_code


class Schedule(models.Model):
    day = models.CharField(choices=(
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
    ), max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    event = models.ForeignKey(Event)

    class Meta:
        unique_together = (("day", "event"),)


class File(models.Model):
    file_field = models.FileField(upload_to='files/%Y/%m/%d/')
    type = models.CharField(max_length=100, choices=(('image', 'image'), ('video', 'video')), default='image')
    poster = models.ImageField(upload_to='files/%Y/%m/%d/', null=True, blank=True)
    event = models.ForeignKey(Event, related_name='files')


class Text(models.Model):
    text_field = models.CharField(max_length=2000)
    event = models.ForeignKey(Event, related_name='texts')


class PlaceLocation(models.Model):
    location = GeopositionField()
    place = models.ForeignKey(Place, null=True, related_name='area_point_set')


class AboutUs(models.Model):
    picture = models.ImageField(upload_to='files/aboutus')
    english_text = models.CharField(max_length=10000)
    persian_text = models.CharField(max_length=10000)