from _decimal import Decimal
import datetime

from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.http.response import HttpResponse, JsonResponse, HttpResponseRedirect
from django.urls.base import reverse
from django.utils import timezone
from django.utils.translation import activate, LANGUAGE_SESSION_KEY
from geoposition import Geoposition

from event.models import PlaceType, Event, Place, Facility, File, PlaceLocation, Proposal, ProposalLocation


@login_required
def reserve(request):
    place_type_str = request.POST['place_type']
    place_type = PlaceType.objects.get(backend_name=place_type_str)
    description = request.POST['description']
    title = request.POST['title']
    owner = request.user
    proposal = Proposal(place_type=place_type, description=description, title=title, owner=owner)
    proposal.save()

    locations_str = request.POST['locations']
    locations_array = locations_str.split(';')
    for loc in locations_array:
        latlng = loc.split(',')
        lat = Decimal(latlng[0])
        lng = Decimal(latlng[1])
        pos = Geoposition(lat, lng)
        location = ProposalLocation(position=pos, proposal=proposal)
        location.save()

    facilities_str = request.POST['facilities']
    facilities_array = facilities_str.split(',')
    for fac in facilities_array:
        facility_item = Facility.objects.get(name=fac)
        proposal.extra_facilities.add(facility_item)
    return HttpResponse('ok')


def location_types(request):
    types = PlaceType.objects.all()
    response = ''
    for the_type in types:
        response += the_type.frontend_name + ':' + the_type.backend_name + ','
    if response[len(response) - 1] == ',':
        response = response[0:len(response) - 1]
    return HttpResponse(response)


def send_data(request):
    if request.GET['request'] == 'places':
        if 'place_type' in request.GET:
            place_type = request.GET['place_type']
            places = Place.objects.filter(type__backend_name=place_type)
            return JsonResponse({
                'places': serializers.serialize('json', places)
            })
        else:
            places = Place.objects.all()
            return JsonResponse({
                'places': serializers.serialize('json', places)
            })
    elif request.GET['request'] == 'location':
        place_id = int(request.GET['place'])
        place = Place.objects.get(id=place_id)
        if 'time' in request.GET:
            time_milliseconds = int(request.GET['time'])
            time_obj = datetime.datetime.fromtimestamp(time_milliseconds / 1000.0)
            location = place.location(time_obj)
            return JsonResponse(
                {'location': str(location), 'place_type': place.type.backend_name, 'place_id': place_id})
        else:
            location = place.location(timezone.now())
            return JsonResponse(
                {'location': str(location), 'place_type': place.type.backend_name, 'place_id': place_id})
    elif request.GET['request'] == 'location_set':
        place_id = int(request.GET['place'])
        place = Place.objects.get(pk=place_id)
        from_time_milliseconds = int(request.GET['from'])
        to_time_milliseconds = int(request.GET['to'])
        from_time = datetime.datetime.fromtimestamp(from_time_milliseconds / 1000.0)
        to_time = datetime.datetime.fromtimestamp(to_time_milliseconds / 1000.0)
        return JsonResponse({
            'location_set': serializers.serialize('json', place.location_set(from_time, to_time))
        })
    elif request.GET['request'] == 'current_events':
        selected_time_milliseconds = int(request.GET['time'])
        selected_time = datetime.datetime.fromtimestamp(selected_time_milliseconds / 1000.0)
        place_id = int(request.GET['place'])
        place = Place.objects.get(pk=place_id)
        events = Event.objects.filter(place=place, startDateTime__lte=selected_time, endDateTime__gte=selected_time)
        return JsonResponse({'events': serializers.serialize('json', events), 'place_id': place_id})

    elif request.GET['request'] == 'events':
        place_id = int(request.GET['place'])
        place = Place.objects.get(id=place_id)
        events = Event.objects.filter(place=place)
        return JsonResponse({
            'events': serializers.serialize('json', events)
        })
    elif request.GET['request'] == 'facility':
        return JsonResponse({
            'facilities': serializers.serialize('json', Facility.objects.all())
        })
    elif request.GET['request'] == 'files':
        event_id = int(request.GET['event'])
        event = Event.objects.get(pk=event_id)
        return JsonResponse({
            'files': serializers.serialize('json', File.objects.filter(event=event))
        })
    elif request.GET['request'] == 'zone':
        place_id = int(request.GET['place'])
        place = Place.objects.get(pk=place_id)
        return JsonResponse({'zone': serializers.serialize('json', PlaceLocation.objects.filter(place=place))})
    elif request.GET['request'] == 'lang':
        return HttpResponse(request.LANGUAGE_CODE)


def change_lang(request):
    lang = request.GET['lang']
    activate(lang)
    request.session[LANGUAGE_SESSION_KEY] = lang
    return HttpResponseRedirect(reverse('main:main_page'))