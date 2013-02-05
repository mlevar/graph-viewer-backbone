from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.authentication import Authentication, ApiKeyAuthentication #, SessionAuthentication
from tastypie.authorization import DjangoAuthorization, ReadOnlyAuthorization, Authorization

from django.contrib.auth.models import User
from graph_viewer.models import Graph #, Node


class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        #authentication = Authentication() #SessionAuthentication()
        authorization = ReadOnlyAuthorization() #DjangoAuthorization()

        fields = ['username', 'last_login', 'is_superuser']

class GraphResource(ModelResource):
    author = fields.ToOneField(UserResource, 'author', full=True)

    class Meta:
        queryset = Graph.objects.all()
        resource_name = 'graph'
        #authentication = Authentication() #SessionAuthentication()
        authorization = Authorization() #DjangoAuthorization()

        fields = ['id_graph','name', 'date', 'author', 'nodes']

    def obj_create(self, bundle, request, **kwargs):
        print bundle
        bundle.data['author'] = {'pk': request.user.pk}
        return super(GraphResource, self).obj_create(bundle, request, **kwargs)

#class NodeResource(ModelResource):
#    graph = fields.ForeignKey(GraphResource, 'graph')

#    class Meta:
#        queryset = Node.objects.all()
#        resource_name = 'node'
#        authentication = ApiKeyAuthentication() #SessionAuthentication()
#        authorization = DjangoAuthorization()