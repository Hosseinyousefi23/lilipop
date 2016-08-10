from django.contrib import admin

from event.models import Subject, Reserve, LocationType, Place, Image, Event, SpaceTime, Video


admin.site.register(Subject)
admin.site.register(Reserve)
admin.site.register(LocationType)
admin.site.register(SpaceTime)
admin.site.register(Event)
admin.site.register(Image)
admin.site.register(Place)
admin.site.register(Video)

