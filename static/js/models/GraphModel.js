

define([
  'underscore',
  'backbone',
], function (_, Backbone) {
    var GraphModel = Backbone.Model.extend({
        urlRoot: '/api/graph-viewer/graph/',
        defaults: {
            name: '',
            nodes: '{"nodes":[]}'
        },


        validate: function (attributes) {
            console.log("validating model");
            try {
                var json = JSON.parse(attributes.nodes);
                if (!(json.nodes instanceof Array))
                    return "Error parsing JSON";
            }
            catch (e) {
                return "Error parsing JSON";
            }
        },
    });

    return GraphModel;
});