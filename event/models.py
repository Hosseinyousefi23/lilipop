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
