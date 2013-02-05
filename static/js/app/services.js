'use strict';

/* Services */

angular.module('graphViewer.services', ['ngResource'])
    .value('version', '0.1')
    .factory('Graph', ['$resource', '$http',
        function ($resource, $http) {
            return $resource('/api/graph-viewer/graph/:id/', { id: '@id_graph'}, {
                'create': { method: 'POST'}, // the fix was adding back the trailing slash in the library
                'update': { method: 'PUT' },
                'getOne': { method: 'GET', params: { limit: 1, format: 'json' } },
            });
        }
    ])
    //.factory('Graph', function ($http) {
    //    var Graph = function (data) {
    //        angular.extend(this, data);
    //    }

    //    Graph.get = function (id) {
    //        return $http.get('/api/graph-viewer/graph/' + id + '/?format=json').then(function (response) {
    //            return new Graph(response.data);
    //        });
    //    };

    //    Graph.prototype.create = function () {
    //        var graph = this;
    //        return $http.post('/api/graph-viewer/graph/', graph).then(function (response) {
    //            console.log(response);
    //            graph.id_graph = response.data.id_graph;
    //            return graph;
    //        });
    //    }

    //    Graph.prototype.update = function (graph) {
    //        return $http.put('/api/graph-viewer/graph/' + graph.id_graph + '/', graph).then(function (response) {
    //            console.log(response);
    //            return graph;
    //        });
    //    }


    //    return Graph;
    //});

