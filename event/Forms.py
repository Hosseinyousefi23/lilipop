from django import forms

from event.models import Proposal


class ReserveForm(forms.ModelForm):
    class Meta:
        model = Proposal
        fields = '__all__'