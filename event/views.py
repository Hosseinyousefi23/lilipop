from django.contrib.auth.decorators import login_required
from django.core import serializers
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import render

from event.Forms import ReserveForm
from event.models import PlaceType, Event, Place


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


def send_event_data(request):
    return JsonResponse({'events': serializers.serialize('json', Event.objects.all()),
                         'places': serializers.serialize('json', Place.objects.all()),
                         'place_types': serializers.serialize('json', PlaceType.objects.all())})


def my_events(request):
    return render(request, 'user_my_events.html', {})