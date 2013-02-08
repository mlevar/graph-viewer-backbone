// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/GraphModel',
    'text!templates/graph_new.html',
    'text!templates/navbar/navbar-new.html',

], function ($, _, Backbone, GraphModel, graphNewTemplate, navbarNewTemplate) {
    var GraphNewView = Backbone.View.extend({
        el: $("#content"),

        events: {
            "submit": "submit",
            "change #id_name": 'changedName',
            "change #id_nodes": 'changedNodes',
        },

        initialize: function () {
            
            this.graph = new GraphModel();
            console.log(this);
        },

        render: function () {
            $('.nav li').removeClass('active');
            $('.nav li a[href="/#/graphs/"]').parent().addClass('active');

            var compiledNavbarTemplate = _.template(navbarNewTemplate);
            $("#navbar-extend").html(compiledNavbarTemplate);

            var compiledTemplate = _.template(graphNewTemplate, { 'graph': this.graph });

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
    return GraphNewView;
});
