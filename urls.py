from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.defaults import handler403, handler404, handler500
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from graph_viewer.api import UserResource, GraphResource #, NodeResource

from tastypie.api import Api

graph_api = Api(api_name='graph-viewer')
graph_api.register(UserResource())
graph_api.register(GraphResource())
#graph_api.register(NodeResource())

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'graph_viewer.views.index'),
    url(r'^logout/$', 'graph_viewer.views.logout_view'),
    url(r'^login/$', 'graph_viewer.views.login_view'),
    url(r'^api/', include(graph_api.urls)),
    url(r'^basic_data/$', 'graph_viewer.views.basic_data'),

    url(r'^admin/', include(admin.site.urls)),

    #url(r'^graphs/$', 'graph_viewer.views.all_graphs'),
    #url(r'^graphs/del/(?P<id>\d+)/$', 'graph_viewer.views.delete'),
    #url(r'^graphs/new/$','graph_viewer.views.new'),
    #url(r'^graphs/view/(?P<id>\d+)/$','graph_viewer.views.view_graph'),
    #url(r'^graphs/(?P<id>\d+)/$','graph_viewer.views.edit'),
    #url(r'^graphs/filter/$','graph_viewer.views.filter'),
    #url(r'^graphs/calculate/$','graph_viewer.views.calculate'),


    # ajax handler
    #url(r'^getgraph/$', 'graph_viewer.views.get_graph'),

    # static handler
    url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),

)

# custom error handlers
if not settings.DEBUG:
    handler500 = 'graph_viewer.views.error_500'
    handler403 = 'graph_viewer.views.error_403'
    handler404 = 'graph_viewer.views.error_404'

urlpatterns += staticfiles_urlpatterns()