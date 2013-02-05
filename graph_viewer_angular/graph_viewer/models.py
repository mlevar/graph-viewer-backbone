from django.db import models as m
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify

class Graph(m.Model):
    id_graph = m.AutoField(primary_key=True)
    name = m.CharField(max_length=20)
    date = m.DateField(auto_now_add=True)
    author = m.ForeignKey(User)
    nodes = m.TextField()

    def __unicode__(self):
        return self.name

#class Node(m.Model):
#    if_node = m.AutoField(primary_key=True)
#    source = m.IntegerField()
#    destination = m.IntegerField()
#    graph = m.ForeignKey(Graph)

#    def __unicode__(self):
#        return "src:%d  dst:%d" % (self.source, self.destination)

