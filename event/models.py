from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from geoposition.fields import GeopositionField


class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Facility(models.Model):
    name = models.CharField(max_length=100)


class SpaceTimePoint(models.Model):
    position = GeopositionField()
    time_spot = models.DateTimeField(default=timezone.now)


class Location(models.Model):
    position = GeopositionField()


class PlaceType(models.Model):
    # There are 3 types so far: Container gallery (container_gallery) , Mobile media unit (mobile_media_unit) ,
    # Embedded culture (embedded_culture)
    frontend_name = models.CharField(max_length=100)
    backend_name = models.CharField(max_length=100)

    def __str__(self):
        return self.backend_name


class Proposal(models.Model):
    place_type = models.ForeignKey(PlaceType)
    submission_time = models.DateTimeField(default=timezone.now)
    description = models.CharField(max_length=1000)
    subject = models.ForeignKey(Subject)
    owner = models.ForeignKey(User)
    extra_facilities = models.ManyToManyField(Facility)
    area_point_set = models.ManyToManyField(Location)  # Polygon points for MM units and single point for other


class Place(models.Model):
    type = models.ForeignKey(PlaceType)
    name = models.CharField(max_length=100, null=True, blank=True)
    locations = models.ManyToManyField(SpaceTimePoint)
    current_location = GeopositionField()

    def __str__(self):
        return self.name

    def location(self, time=timezone.now):
        pass


class File(models.Model):
    file_field = models.FileField(upload_to='files/%Y/%m/%d/')


class Text(models.Model):
    text_field = models.CharField(max_length=2000)


class Event(models.Model):
    unique_code = models.CharField(max_length=100)
    proposal = models.ForeignKey(Proposal)
    place = models.ForeignKey(Place)
    owner = models.ForeignKey(User)
    area_point_set = models.ManyToManyField(Location)
    # gps_location_data = models.ManyToManyField(SpaceTimePoint)
    files = models.ManyToManyField(File)
    texts = models.ManyToManyField(Text)
    # time start and end
    # hours per day

    def __str__(self):
        return 'event:' + self.unique_code