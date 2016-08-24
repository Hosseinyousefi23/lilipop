from django.contrib import admin

from event.models import Subject, Proposal, PlaceType, Place, Text, Event, Facility, File, SpaceTimePoint, \
    EventLocation, ProposalLocation, Schedule

admin.site.register(Subject)
admin.site.register(Proposal)
admin.site.register(PlaceType)
admin.site.register(SpaceTimePoint)
admin.site.register(Event)
admin.site.register(File)
admin.site.register(Place)
admin.site.register(Text)
admin.site.register(Facility)
admin.site.register(EventLocation)
admin.site.register(ProposalLocation)
admin.site.register(Schedule)
