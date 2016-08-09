from django.contrib import admin

from event.models import Subject, Reserve, LocationType


admin.site.register(Subject)
admin.site.register(Reserve)
admin.site.register(LocationType)
