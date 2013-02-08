define([
  'jquery',
  'underscore',
  'backbone',
  'views/IndexView',
  'views/GraphDetailView',
  'views/GraphNewView',
  'views/GraphListView'
], function ($, _, Backbone, IndexView, GraphDetailView, GraphNewView, GraphListView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'graphs/': 'graphList',
            'graphs/new/': 'graphNew',
            'graphs/:id/': 'graphDetail',

            // Default
            '*anything': 'index'
        }
    });

    var initialize = function () {

        var app_router = new AppRouter;
        var viewedGraph = {nodes:null, name:null};

        app_router.on('route:graphNew', function () {

            console.log("routing new");
            var graphNewView = new GraphNewView();
            graphNewView.render();
        });
        app_router.on('route:graphDetail', function (id) {

            console.log("routing detail", id);
            var graphDetailView = new GraphDetailView({id:id});
        });

        app_router.on('route:graphList', function () {

            console.log("routing list");

            var graphListView = new GraphListView({ viewedGraph: viewedGraph });
            graphListView.render();

        });

        app_router.on('route:index', function (anything) {

            console.log("routing index");
            var indexView = new IndexView({ viewedGraph: viewedGraph });
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});
