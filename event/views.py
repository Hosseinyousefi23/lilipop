from django.contrib.auth.decorators import login_required
from django.http.response import HttpResponse
from django.shortcuts import render

from event.Forms import ReserveForm
from event.models import LocationType, Event


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
        return render(request, 'user_reserve.html', {'form': form, 'location_types': LocationType.objects.all})


def location_types(request):
    types = LocationType.objects.all()
    response = ''
    for the_type in types:
        response += the_type.frontend_name + ':' + the_type.backend_name + ','
    if response[len(response) - 1] == ',':
        response = response[0:len(response) - 1]
    return HttpResponse(response)


def send_event_data(request):
    data = ''
    events = Event.objects.all()
    for event in events:
        data += event.code() + '$$$'
    if len(events) > 0:
        data = data[0:len(data) - 3]
    return HttpResponse(data)