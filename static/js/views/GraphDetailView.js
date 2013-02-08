// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/GraphModel',
    'text!templates/graph_detail.html',
    'text!templates/navbar/navbar-new.html',

], function ($, _, Backbone, GraphModel, graphDetailTemplate, navbarNewTemplate) {
    var GraphDetailView = Backbone.View.extend({
        el: $("#content"),

        events: {
            "submit": "submit",
            "change #id_name": 'changedName',
            "change #id_nodes": 'changedNodes',
        },

        initialize: function (params) {
            this.graph = new GraphModel({ id: params.id });
            var self = this;
            this.graph.fetch().complete(function () {
                self.render();
            });
        },

        render: function () {
            $('.nav li').removeClass('active');
            $('.nav li a[href="/#/graphs/"]').parent().addClass('active');

            var compiledNavbarTemplate = _.template(navbarNewTemplate);
            $("#navbar-extend").html(compiledNavbarTemplate);

            var compiledTemplate = _.template(graphDetailTemplate, { 'graph': this.graph });

            $("#content").html(compiledTemplate);
        },

        submit: function (event) {
            event.preventDefault();
            this.graph.save(this.graph.attributes, {
                success: function () {
                    window.location.hash = '/graphs/';
                },
                error: function () {
                    //TODO error handling
                }
            });
        },
        changedName: function (ev) {
            this.graph.attributes.name = ev.currentTarget.value;
        },
        changedNodes: function (ev) {
            this.graph.attributes.nodes = ev.currentTarget.value;
        },
    });
    return GraphDetailView;
});
