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