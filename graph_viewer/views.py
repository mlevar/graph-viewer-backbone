from django.http import HttpResponsePermanentRedirect
from django.template import RequestContext
from django.http import HttpResponse
from django.shortcuts import render_to_response, HttpResponseRedirect, render
from django.core import serializers
from django.utils import simplejson
from django import forms
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.conf import settings

from forms import UserForm

import datetime
import random
random.seed(42)

def logout_view(request):
    logout(request)
    return  HttpResponseRedirect('/login/')

def login_view(request):
    msg = ""
    type = 0
    username = ""
    password = ""
    if request.method == 'POST': 
        username = request.POST['username'] if 'username' in request.POST else ""
        password = request.POST['password'] if 'password' in request.POST else ""
    
        if not username or not password:
            msg = "Please enter a username and a password"
            type = 1
        else:
            user = authenticate(username=request.POST['username'], password=request.POST['password'])

            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect(request.GET['next'] if 'next' in request.GET else '/') 
                else:
                    msg = "Your account was disabled"
            else:
                    msg = "The username and password do not match"    
                      
    c = RequestContext(request, {
        'msg':msg, 'type':type, 'username':username, 'password':password
    })
    return render_to_response('login.html', c)


@login_required
def basic_data(request): 
    data = {'username':request.user.username, 'is_admin':request.user.is_superuser, 'static_url':settings.STATIC_URL}
    mimetype = 'application/javascript'
    return HttpResponse(simplejson.dumps(data), mimetype)

@login_required
def index(request):
    return render_to_response('frame.html',  RequestContext(request, {}))

def error_500(request):
    c = RequestContext(request, {'error':"500: Server Error"})
    return render_to_response('error.html',  c)

def error_403(request):
    c = RequestContext(request, {'error':"403: Forbidden"})
    return render_to_response('error.html',  c)

def error_404(request):
    c = RequestContext(request, {'error':"404: Request page not found."})
    return render_to_response('error.html',  c)