from tastypie.resources import ModelResource, ALL
from tastypie import fields
from tastypie.authentication import Authentication, ApiKeyAuthentication
from tastypie.authorization import DjangoAuthorization, ReadOnlyAuthorization, Authorization
from tastypie.validation import FormValidation
from tastypie.models import ApiKey

from django.contrib.auth.models import User
from django.utils import simplejson
from django import forms

from graph_viewer.models import Graph #, Node

def validate_json(json):
    """
    The methods validates the compliance of the input json strings.
    Returns True when invalid.
    """
    try:
        g = simplejson.loads(json)
        assert len(g.keys())==1
        assert g['nodes']
        assert type(g['nodes']==list)
        for src, dst in g['nodes']:
            assert type(src)==int or type(src)==str
            assert type(dst)==int or type(src)==dst
        return False
    except:
        return True

class GraphForm(forms.ModelForm):
    def __init__(self, *args, **kwargs): 
        self.fields['name'].error_messages = {'required': "Please enter name of the graph"}
        self.fields['author'].error_messages = {'required': 'Please enter the author'}
        self.fields['nodes'].error_messages = {'required': 'Please enter nodes'}

    class Meta:
        model = Graph
        #fields = ('name', 'author', 'nodes')

    def clean(self):
        cleaned_data = super(GraphForm, self).clean()
        nodes = cleaned_data.get("nodes")

        if validate_json(nodes):
            raise forms.ValidationError("Submmitted nodes were not valid")

        return cleaned_data

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        authentication = Authentication()
        authorization = ReadOnlyAuthorization()
        include_resource_uri = False
        detail_allowed_methods = ["get"]

        fields = ['username', 'last_login', 'is_superuser']
"""
    Redundant once a stable release of tastypie with sessionauthentication is realeased
    def obj_get(self, request=None, **kwargs):
        bundle = super(UserResource, self).obj_get(request, **kwargs)
        api_key = ApiKey.objects.get_or_create(user=request.user)
        print api_key[0].key
        return bundle
"""

class GraphResource(ModelResource):
    author = fields.ToOneField(UserResource, 'author', full=True)

    class Meta:
        queryset = Graph.objects.all()
        resource_name = 'graph'
        #authentication = ApiKeyAuthentication()
        authorization = Authorization() # DjangoAuthorization()
        #validation = FormValidation(form_class=GraphForm)

        fields = ['id_graph','name', 'date', 'author', 'nodes']
        ordering = ['name', 'date', 'author']
        filtering = {
                     'name':ALL,
                     'date':ALL,
                     }

    def obj_create(self, bundle, request, **kwargs):
        bundle.data['author'] = {'pk': request.user.pk}
        return super(GraphResource, self).obj_create(bundle, request, **kwargs)

#class NodeResource(ModelResource):
#    graph = fields.ForeignKey(GraphResource, 'graph')

#    class Meta:
#        queryset = Node.objects.all()
#        resource_name = 'node'
#        authentication = ApiKeyAuthentication() #SessionAuthentication()
#        authorization = DjangoAuthorization()