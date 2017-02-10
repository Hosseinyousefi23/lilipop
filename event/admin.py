from django.contrib import admin

from event.models import Subject, Proposal, PlaceType, Place, Text, Event, Facility, File, SpaceTimePoint, \
    PlaceLocation, ProposalLocation, Schedule, AboutUs


class EventAdmin(admin.ModelAdmin):
    pass


admin.site.register(Subject)
admin.site.register(Proposal)
admin.site.register(PlaceType)
admin.site.register(SpaceTimePoint)
admin.site.register(Event, EventAdmin)
admin.site.register(File)
admin.site.register(Place)
admin.site.register(Text)
admin.site.register(Facility)
admin.site.register(PlaceLocation)
admin.site.register(ProposalLocation)
admin.site.register(Schedule)
admin.site.register(AboutUs)
