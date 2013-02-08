// Filename: views/projects/list
define([
    'jquery',
    'underscore',
    'backbone',
    'd3js',
    'graph',
    'collections/GraphCollection',
    'text!templates/index.html',
    'text!templates/navbar/navbar-graph.html'
], function ($, _, Backbone, D3js, Graph, GraphCollection, indexTemplate, navbarGraphTemplate) {
    var IndexView = Backbone.View.extend({
        el: $("#content"),

        initialize: function (params) {
            this.viewedGraph = params.viewedGraph;
            if (this.viewedGraph.nodes == null) {
                var self = this;
                this.collection = new GraphCollection();
                this.collection.fetch().complete(function () {
                    self.render();
                });
            } else {
                this.render();
            }
        },

        render: function () {

            $('.nav li').removeClass('active');
            $('.nav li a[href="/#/"]').parent().addClass('active');

            var compiledNavbarTemplate = _.template(navbarGraphTemplate);
            $("#navbar-extend").html(compiledNavbarTemplate);

            var compiledTemplate = _.template(indexTemplate);
            $("#content").html(compiledTemplate);

            if (this.viewedGraph.nodes == null) {

                var graph = this.collection.models[_.random(0, this.collection.length - 1)];
                console.log(graph);
                this.viewedGraph.nodes = graph.attributes.nodes;
                this.viewedGraph.name = graph.attributes.name;
            }
            d3Graph(this.viewedGraph);
        }
    });
    return IndexView;
});