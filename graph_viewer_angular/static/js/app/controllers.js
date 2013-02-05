'use strict';

/* Controllers */

function FrameCtrl($scope, $location, $http, $resource) {
    $scope.currentUrl = $location.path();
    $scope.$on('updatePath', function(event, path){
        $scope.currentUrl = path;
    });
    $scope.menu = "";
    $scope.$on('updateMenu', function (event, val) {
        $scope.menu = val;
    });

    $http.get('/basic_data/').success(function (data, status, headers, config) {
        $scope.username = data.username;
        $scope.is_admin = data.is_admin;
        $scope.static_url = data.static_url;
    });
    
    $scope.graph = null;
    $scope.$on('updateGraph', function (event, g) {
        $scope.graph = g;
        $location.path('/');
    });
}
//var IndexCtrl = graphViewer.controller('IndexCtrl', ['$scope', '$location', function ($scope, $location) {
function IndexCtrl(Graph, $scope, $location, $http) {
    $location.path('/');
    $scope.$emit('updatePath', $location.path());
    $scope.$emit('updateMenu', 'index');

    if ($scope.graph === null) {
        $http({ method: 'GET', url: '/api/graph-viewer/graph/?limit=1&format=json'})
         .success(function (data, status, headers, config) {
             var graph = Object();
             graph.nodes = data.objects[0].nodes;
             graph.name = data.objects[0].name;
             $scope.$emit('updateGraph', graph);
             drawGraph($scope.graph);
         })     
    }else
        drawGraph($scope.graph);    
}
//IndexCtrl.$inject = ['$scope', '$location'];

//var GraphListCtrl = graphViewer.controller('GraphListCtrl', ['$scope', '$location', function ($scope, $location) {
function GraphListCtrl(Graph, $scope, $location, $http, $resource) {
    $location.path('/graphs/');
    $scope.$emit('updatePath', $location.path());
    $scope.$emit('updateMenu', 'graphs');

    $scope.$on('paginate', function (event, url) {
        $http({ method: 'GET', url: url })
          .success(function (data, status, headers, config) {
              console.log(data);
              $scope.graphNext = data.meta.next;
              $scope.graphPrevious = data.meta.previous;
              $scope.graphCurrentPage = (data.meta.offset / data.meta.limit)+1;
              $scope.graphNumberOfPages = Math.ceil(data.meta.total_count / data.meta.limit);
              $scope.graphs = data.objects;
          })
          .error(function (data, status, headers, config) {
              console.log("ERROR")
              //TODO!!!
         });
    });

    $scope.$on('deleteGraph', function (event, g) {
        $http({ method: 'DELETE', url: '/api/graph-viewer/graph/'+ g.id_graph +'/' })
         .success(function (data, status, headers, config) {
             console.log("done");
             $location.path('/graphs/');
         })
         .error(function (data, status, headers, config) {
             console.log("ERROR");
             //TODO!!!
         });
    });

    $scope.$emit('paginate', '/api/graph-viewer/graph/?full=True&format=json');  
}
//GraphListCtrl.$inject = ['$scope', '$location'];

function GraphNewCtrl(Graph, $scope, $location) {
    $scope.$emit('updatePath', '/graphs/');
    $scope.$emit('updateMenu', 'graphs');
    var graph = Graph.get();
    $scope.graph = graph;

    $scope.save = function (graph) {
        graph.$create();
        $location.path('/graphs/');
    };


}

function GraphDetailCtrl(Graph, $scope, $location, $routeParams) {
    $scope.$emit('updatePath', '/graphs/');
    $scope.$emit('updateMenu', 'graphs');

    var graph = Graph.get({ id: $routeParams.id });
    $scope.graph = graph;

    $scope.update = function (graph) {
        graph.$update();
        $location.path('/graphs/');
    };

}

