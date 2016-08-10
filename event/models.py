from django.contrib.auth.models import User
from django.db import models
from django.db.models import *
from django.utils import timezone


class Subject(Model):
    name = CharField(max_length=100)

    def __str__(self):
        return self.name


class Reserve(Model):
    address = CharField(max_length=100)
    time = DateTimeField(default=timezone.now)
    subject = ForeignKey(Subject)
    reserver_name = CharField(max_length=100)
    reserver_email = EmailField()
    reserver_phone = CharField(max_length=20)


class LocationType(Model):
    # There are 3 types so far: Container gallery (container_gallery) , Mobile media unit (mobile_media_unit) ,
    # Embedded culture (embedded_culture)
    frontend_name = CharField(max_length=100)
    backend_name = CharField(max_length=100)

    def __str__(self):
        return self.backend_name


class Place(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    lat = models.FloatField(max_length=100)
    lng = models.FloatField(max_length=100)

    def code(self):
        return str(self.id) + '!!!' + self.name + '!!!' + str(self.lat) + '!!!' + str(self.lng)


class Event(models.Model):
    location_type = models.ForeignKey(LocationType)
    owner = models.ForeignKey(User)
    current_place = models.ForeignKey(Place, null=True)

    def code(self):
        data = str(self.id) + '###' + self.location_type.backend_name + '###' + self.current_place.code()
        for space_time in SpaceTime.objects.filter(event=self).order_by('start_date_time'):
            data += '###' + space_time.code()
        return data


class SpaceTime(models.Model):
    place = models.ForeignKey(Place)
    start_date_time = models.DateTimeField(null=True)
    end_date_time = models.DateTimeField(null=True)
    event = models.ForeignKey(Event, null=True)

    def code(self):
        return self.place.code() + '@@@' + str(self.start_date_time) + '@@@' + str(
            self.end_date_time)


class Image(models.Model):
    image_field = models.ImageField(upload_to='image/%Y/%m/%d/')
    space_time = models.ForeignKey(SpaceTime, null=True)


class Video(models.Model):
    video_field = models.FileField(upload_to='video/%Y/%m/%d/')
    space_time = models.ForeignKey(SpaceTime, null=True)


class Text(models.Model):
    text_field = models.CharField(max_length=2000)
    space_time = models.ForeignKey(SpaceTime, null=True)
