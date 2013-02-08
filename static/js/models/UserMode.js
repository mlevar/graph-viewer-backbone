var UserModel = Backbone.Model.extend({
    urlRoot: '/api/graph-viewer/user/',
    defaults: {
        username: '',
        lastlogin: '',
        is_superuser: false,
    },
});

