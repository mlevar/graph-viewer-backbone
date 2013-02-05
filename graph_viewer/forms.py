from django import forms
from django.forms import ModelForm
from django.contrib.auth.models import User
from django.forms.fields import TextInput, PasswordInput

from graph_viewer.models import Graph


class UserForm(forms.ModelForm):
    def __init__(self, *args, **kwargs): 
        super(UserForm, self).__init__(*args, **kwargs)

        self.fields['username'].error_messages = {'required': "Please enter username"}
        self.fields['username'].max_length = 20
        self.fields['username'].min_length = 5

        self.fields['password'].error_messages = {'required': 'Please enter password'}
        self.fields['password'].max_length = 20
        self.fields['password'].min_length = 5


    class Meta:
        model = User
        fields = ('username', 'password')
        widgets = {
                   'username': TextInput(attrs={'placeholder': 'Username'}),
                   'password':  PasswordInput(attrs={'placeholder': 'Password'}),
                   }

class GraphForm(forms.ModelForm):
    def __init__(self, *args, **kwargs): 
        self.fields['name'].error_messages = {'required': "Please enter name of the graph"}
        self.fields['author'].error_messages = {'required': 'Please enter the author'}
        self.fields['nodes'].error_messages = {'required': 'Please enter nodes'}

    class Meta:
        model = Graph
        fields = ('name', 'author', 'nodes')
