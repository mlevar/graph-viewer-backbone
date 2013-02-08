// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/GraphModel',
  'collections/GraphCollection',
  'text!templates/graph_list.html',
  'text!templates/navbar/navbar-new.html',
  'text!templates/navbar/navbar-search.html'

], function ($, _, Backbone, GraphModel, GraphCollection, graphListTemplate, navbarNewTemplate, navbarSearchTemplate) {

    var ProjectListView = Backbone.View.extend({
        el: $("#content"),


        initialize: function (params) {
            this.viewedGraph = params.viewedGraph;
            _.bindAll(this, 'previous', 'next', 'render', 'deleteGraph', 'filter');
            this.collection = new GraphCollection();
            this.collection.bind('reset', this.render);
            this.collection.fetch();
        },
        events: {
            'click a.prev': 'previous',
            'click a.next': 'next',
            'click a.view': 'changeViewedGraph',
            'click a.delete': 'deleteGraph',
            'change #query': 'filter',
        },
        render: function () {
            $('.nav li').removeClass('active');
            $('.nav li a[href="/#/graphs/"]').parent().addClass('active');

            var compiledNavbarTemplate = _.template(navbarNewTemplate + navbarSearchTemplate, { search: (this.search != 'undefined') ? this.search : '' });
            $("#navbar-extend").html(compiledNavbarTemplate);

            var self = this;
            $("#query").change(function (ev) {
                self.filter(ev);
            });

            var data = {
                graphs: this.collection.models,
                _: _,
                pageInfo: this.collection.pageInfo()
            };

            var compiledTemplate = _.template(graphListTemplate, data);
            
         
            $("#content").html(compiledTemplate);
        },
        changeViewedGraph: function (ev) {
            var self = this;
            var id = ev.currentTarget.attributes.value.value;
            var graph = new GraphModel({ id: id });
            graph.fetch().complete(function () {
                self.viewedGraph.nodes = graph.attributes.nodes;
                self.viewedGraph.name = graph.attributes.name;
            });
        },
        deleteGraph: function (ev) {
            var id = ev.currentTarget.attributes.value.value;
            var graph = new GraphModel({ id: id });
            var self = this;
            graph.destroy().complete(function () {
                self.collection.resetPage();
            });
        },

        previous: function () {
            this.collection.previousPage();
            return false;
        },

        next: function () {
            this.collection.nextPage();
            return false;
        },

        filter: function (ev) {
            var search = ev.currentTarget.value;
            this.search = search;
            this.collection.filtrate({ 'name__contains': search });
            return false;
        }

    });
    return ProjectListView;
});
