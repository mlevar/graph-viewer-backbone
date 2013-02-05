from django.http import HttpResponsePermanentRedirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.generic import ListView, DetailView, UpdateView, DeleteView
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

# ******************************
#             CRUD
# ******************************

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

def validate_json(json):
    """
    The methods validates the compliance of the input json strings.
    """
    try:
        g = simplejson.loads(json)
        assert len(g.keys())==1
        assert g['nodes']
        assert type(g['nodes']==list)
        for src, dst in g['nodes']:
            assert type(src)==int or type(src)==str
            assert type(dst)==int or type(src)==dst
        return ""
    except:
        return "Error parsing json"

def basic_data(request): 
    data = {'username':request.user.username, 'is_admin':request.user.is_superuser, 'static_url':settings.STATIC_URL}
    mimetype = 'application/javascript'
    return HttpResponse(simplejson.dumps(data), mimetype)

class GraphForm(forms.Form):
    """
    GraphForm for validation and convenience.
    """
    name = forms.CharField(required=True, max_length=70)
    name.widget.attrs['placeholder']="Name"
    name.widget.attrs['required']=""
    nodes = forms.CharField(required=True, widget=forms.Textarea)
    nodes.widget.attrs['placeholder']="Json graph: {\"nodes\":[(source, destination),...]}"
    nodes.widget.attrs['required']=""

def validate_json(json):
    """
    The methods validates the compliance of the input json strings.
    """
    try:
        g = simplejson.loads(json)
        assert len(g.keys())==1
        assert g['nodes']
        assert type(g['nodes']==list)
        for src, dst in g['nodes']:
            assert type(src)==int or type(src)==str
            assert type(dst)==int or type(src)==dst
        return ""
    except:
        return "Error parsing json"

@login_required
def edit(request, id):
    """
    edit handles the updates of graphs through the GraphForm.
    """
    id = int(id)
    msg=""
    if request.method == 'POST': 
        form = GraphForm(request.POST) 
        msg = validate_json(request.POST['nodes'])
        if not msg and form.is_valid(): 
            g = Graph.get_by_id(id)
            g.name=form.cleaned_data['name']
            g.nodes=form.cleaned_data['nodes']           
            g.put()
            memcache.delete('stats')
            return HttpResponseRedirect('/graphs/') 
    else:
        g = Graph.get_by_id(id)
        form = GraphForm(initial={'name':g.name,'nodes':g.nodes}) 
    return render(request, 'detail.html', {
        'form': form, 'msg':msg,
    })

@login_required
def new(request):
    """
    new handles the creation of new graphs through the GraphForm.
    """
    msg=""
    if request.method == 'POST': 
        form = GraphForm(request.POST) 
        msg = validate_json(request.POST['nodes'])
        if not msg and form.is_valid(): 
            g = Graph()
            g.name=form.cleaned_data['name']
            g.nodes=form.cleaned_data['nodes']         
            
            u = User.get_by_key_name(users.get_current_user().nickname())
            if not u:
                u = User(key_name = users.get_current_user().nickname(),
                         nickname = users.get_current_user().nickname(),
                         email = users.get_current_user().email())
                u.put()
            g.author = u
            g.put()          
            memcache.delete('stats')
            return HttpResponseRedirect('/graphs/') 
    else:
        form = GraphForm() 
    return render(request, 'new.html', {
        'form': form, 'msg':msg,
    })

@login_required
def delete(request, id):
    """
    Handles graph deletion.
    """
    g = Graph.get_by_id(int(id))
    g.delete()
    return  HttpResponseRedirect('/graphs')

@login_required
def index(request):
    """
    Welcome site that stores the users data into the session.
    """
    return render_to_response('frame.html',  RequestContext(request, {}))

@login_required
def view_graph(request, id):
    """
    view_graph stores the selected graph into session for viewing.
    """
    request.session['graphid'] = id
    return  HttpResponseRedirect('/')


@login_required
def get_graph(request):
    """
    Asynchronous reply that tries to retrieve the graph from memcache, shows the selected graph
    or a random graph if none are selected.
    """
    data = {"links":[]}
    name = memcache.get("name")
    id = memcache.get("id")
    if 'graphid' not in request.session:
        nodes = memcache.get("nodes")
        if not name or not nodes:
            g = random.choice([g for g in Graph.all()])
            memcache.set("nodes",g.nodes)
            memcache.set("name", g.name)
            nodes = g.nodes
            name = g.name
    else:
        nodes = memcache.get("nodes")
        if not id or id != int(request.session['graphid']) or not nodes or not name:
            g = Graph.get_by_id(int(request.session['graphid']))
            memcache.set("nodes",g.nodes)
            memcache.set("name", g.name)
            memcache.set("id", g.key().id())
            nodes = g.nodes
            name = g.name

    nodes = simplejson.loads(nodes)
    data['graphname'] = name

    for src, dst in nodes['nodes']:
        data["links"].append({"source":src,"target":dst,"value":1})
    mimetype = 'application/javascript'
    return HttpResponse(simplejson.dumps(data), mimetype)


    
@login_required
def all_graphs(request):
    """
    Returns paginated list of graphs that can optionally be filtered to only show
    graphs created by the user.
    """
    stats = memcache.get('stats')

    if "filter" in request.session and request.session["filter"]:
        u = User.get_by_key_name(users.get_current_user().nickname())
        #graph_list = Graph.gql("WHERE author = :author", author=u)
        graph_list = db.Query(Graph).filter('author =', u).order('name').fetch(limit=1000)
    else:
        graph_list = Graph.all().order('name')

    paginator = Paginator(graph_list, 20) 
    page = request.GET.get('page')
    paginated = False if paginator.num_pages==1 else True
    try:
        graphs = paginator.page(page)
    except PageNotAnInteger:
        graphs = paginator.page(1)
    except EmptyPage:
        graphs = paginator.page(paginator.num_pages)

    return render(request, 'graphs.html', {
        'graphs': graphs, 'is_paginated':paginated, 'stats':stats
    })

def error_500(request):
    c = RequestContext(request, {'error':"500: Server Error"})
    return render_to_response('error.html',  c)

def error_403(request):
    c = RequestContext(request, {'error':"403: Forbidden"})
    return render_to_response('error.html',  c)

def error_404(request):
    c = RequestContext(request, {'error':"404: Request page not found."})
    return render_to_response('error.html',  c)