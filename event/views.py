from django.shortcuts import render

from event.Forms import ReserveForm


def reserve(request):
    if request.method == 'POST':
        form = ReserveForm(request.POST)
        if form.is_valid():
            reserve_obj = form.save()
            reserve_obj.save()
            if request.user.is_authenticated():
                return render(request, 'user_message_reserved.html', {'num': 923344123})
            else:
                return render(request, 'message_reserved.html', {'num': 923344123})

    else:
        form = ReserveForm()
        if request.user.is_authenticated():
            return render(request, 'user_reserve.html', {'form': form})
        else:
            return render(request, 'reserve.html', {'form': form})