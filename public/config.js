module.exports = function (app) {
    return app
        // configure routes
        .config(function($routeProvider, $locationProvider) {
            $routeProvider
                // route for the home page
                .when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'mainController'
                })
                // route for the login page
                .when('/login', {
                    templateUrl: 'templates/login.html',
                    controller: 'loginController'
                })
                // route for the logout
                .when('/logout', {
                    templateUrl: 'templates/logout.html',
                    controller: 'logoutController',
                })
                // route for the signup page
                .when('/signup', {
                    templateUrl: 'templates/signup.html',
                    controller: 'signupController'
                })
                // route for profile page
                .when('/profile', {
                    templateUrl: 'templates/profile.html',
                    controller: 'profileController',
                    resolve: {
                        'auth': function(Authentication) {
                            return Authentication.authenticate();
                        }
                    }
                })
                .when('/todos', {
                    templateUrl: 'templates/todos.html',
                    controller: 'todoController',
                    resolve: {
                        'auth': function(Authentication) {
                            return Authentication.authenticate();
                        }
                    }
                })
                .otherwise({
                    redirectTo: '/'
                });

            // use the HTML5 History API
            $locationProvider.html5Mode(true);
        })
        .run(function($rootScope, $location) {
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                if (rejection === 'Not authenticated') {
                    $location.path('/');
                }
            });
        });
};
