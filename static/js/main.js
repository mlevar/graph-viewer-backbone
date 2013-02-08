
// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
    paths: {
        jquery: 'lib/jquery.min',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone',
        templates: '../templates',
        d3js: 'lib/d3.v2.min',
        graph: 'graph',
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        d3js: {
            exports: 'D3js',
        },
        graph: {
            deps: ['d3js'],
            exports: 'Graph'
        }
    }
});

require([
  // Load our app module and pass it to our definition function
  'app',

], function (App) {

    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});
