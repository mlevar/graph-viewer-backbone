define([
  'jquery',
  'underscore',
  'backbone',
  'models/GraphModel'
], function ($, _, Backbone, GraphModel) {
    var GraphCollection = Backbone.Collection.extend({
        model: GraphModel,
        baseUrl: '/api/graph-viewer/graph/',

        initialize: function () {
            _.bindAll(this, 'parse', 'url', 'pageInfo', 'nextPage', 'previousPage', 'filtrate', 'sort_by');
            typeof (options) != 'undefined' || (options = {});
            typeof (this.limit) != 'undefined' || (this.limit = 10);
            typeof (this.offset) != 'undefined' || (this.offset = 0);
            typeof (this.filter_options) != 'undefined' || (this.filter_options = {});
            typeof (this.sort_field) != 'undefined' || (this.sort_field = 'name');
        },
        fetch: function (options) {
            typeof (options) != 'undefined' || (options = {});
            //this.trigger("fetching");
            var self = this;
            var success = options.success;
            options.success = function (resp) {
                //self.trigger("fetched");
                if (success) { success(self, resp); }
            };
            return Backbone.Collection.prototype.fetch.call(this, options);
        },
        parse: function (resp) {
            this.offset = resp.meta.offset;
            this.limit = resp.meta.limit;
            this.total = resp.meta.total_count;
            return resp.objects;
        },
        url: function () {
            urlparams = { offset: this.offset, limit: this.limit };
            urlparams = $.extend(urlparams, this.filter_options);
            if (this.sort_field) {
                urlparams = $.extend(urlparams, { sort_by: this.sort_field });
            }
            return this.baseUrl + '?' + $.param(urlparams);
        },
        pageInfo: function () {
            var info = {
                total: this.total,
                offset: this.offset,
                limit: this.limit,
                pages: Math.ceil(this.total / this.limit),
                prev: false,
                next: false
            };

            var max = Math.min(info.total, info.offset + info.limit);

            if (info.total == info.pages * info.limit) {
                max = info.total;
            }

            info.range = [(info.offset + 1), max];

            if (info.offset > 0) {
                info.prev = (info.offset - info.limit) || 1;
            }

            if (info.offset + info.limit < info.total) {
                info.next = info.offset + info.limit;
            }
            return info;
        },
        resetPage: function () {
            return this.fetch();
        },
        nextPage: function () {
            if (!this.pageInfo().next) {
                return false;
            }
            this.offset = this.offset + this.limit;
            return this.fetch();
        },
        previousPage: function () {
            if (!this.pageInfo().prev) {
                return false;
            }
            this.offset = (this.offset - this.limit) || 0;
            return this.fetch();
        },
        filtrate: function (options) {
            this.filter_options = options || {};
            this.offset = 0;
            return this.fetch();
        },
        sort_by: function (field) {
            this.sort_field = field;
            this.offset = 0;
            return this.fetch();
        }

    });
    return GraphCollection;
});