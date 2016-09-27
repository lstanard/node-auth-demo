module.exports = function (app) {
    return app

        // API resources
        .factory('Todo', function ($resource) {
            return $resource('/api/todos/');
        })

        // User services
        .factory('Login', function ($resource) {
            return $resource('/login');
        })
        .factory('Logout', function ($resource) {
            return $resource('/logout');
        })
        .factory('Signup', function ($resource) {
            return $resource('/signup');
        })
        .factory('User', function ($resource) {
            return $resource('/user', {}, {
                'query': {
                    method: 'GET',
                    isArray: false
                }
            });
        })
        .factory('Authentication', function ($q, $rootScope, User) {
            return {
                authenticate: function () {
                    if ($rootScope.user) {
                        return $q.resolve($rootScope.user);
                    } else {
                        var user = User.query();
                        return user.$promise.then(function(data) {
                            $rootScope.user = data.local;
                            return true;
                        }, function(error) {
                            return $q.reject('Not authenticated');
                        });
                    }
                }
            }
        });
};
