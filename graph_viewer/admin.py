from django.contrib import admin
from graph_viewer.models import Graph #, Node

class GraphAdmin(admin.ModelAdmin):
    pass
admin.site.register(Graph, GraphAdmin)

#class NodeAdmin(admin.ModelAdmin):
#    pass
#admin.site.register(Node, NodeAdmin)
