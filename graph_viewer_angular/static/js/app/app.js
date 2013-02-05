'use strict';


// Declare app level module which depends on filters, and services
var graphViewer = angular.module('graphViewer', ['graphViewer.filters', 'graphViewer.services', 'graphViewer.directives', 'ngResource'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/graphs/', {templateUrl: 'static/partials/graph_list.html', controller: GraphListCtrl});
    $routeProvider.when('/graphs/new', { templateUrl: 'static/partials/graph_new.html', controller: GraphNewCtrl });
    $routeProvider.when('/graphs/:id', { templateUrl: 'static/partials/graph_detail.html', controller: GraphDetailCtrl });
    $routeProvider.otherwise({redirectTo: '/', templateUrl: 'static/partials/index.html', controller: IndexCtrl});
}])
graphViewer.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[');
    $interpolateProvider.endSymbol(']}');
});