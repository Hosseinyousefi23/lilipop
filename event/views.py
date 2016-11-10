import datetime

from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils import timezone

from event.Forms import ReserveForm
from event.models import PlaceType, Event, Place, Facility, File, PlaceLocation


@login_required
def reserve(request):
    if request.method == 'POST':
        form = ReserveForm(request.POST)
        if form.is_valid():
            reserve_obj = form.save()
            reserve_obj.save()
            return render(request, 'user_message_reserved.html', {'num': 923344123})

    else:
        form = ReserveForm()
        return render(request, 'user_reserve.html', {'form': form, 'location_types': PlaceType.objects.all})


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


def my_events(request):
    return render(request, 'user_my_events.html', {})
