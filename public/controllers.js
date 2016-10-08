module.exports = function (app) {
    return app

        .controller('listController', ['$scope', '$rootScope', 'List', 'ngDialog', function ($scope, $rootScope, List, ngDialog) {
            $scope.user = $rootScope.user;

            // Get all lists for current user
            $scope.lists = List.query(function () {
                $rootScope.activeList = $scope.lists[0];
            });

            $scope.delete = function (list) {
                var index = _.indexOf($scope.lists, _.find($scope.todoslist, { _id: list._id }));

                List.delete({
                    list_id: list._id
                }, function () {
                    $scope.lists.splice(index, 1);
                });
            };

            $scope.openModal = function () {
                ngDialog.open({
                    template: 'templates/partials/new-list.html',
                    className: 'ngdialog-theme-default'
                });
            };

            $scope.closeModal = function () {
                ngDialog.closeAll();
            };
        }])
        .controller('todoController', ['$scope', '$rootScope', 'Todo', function ($scope, $rootScope, Todo) {
            $scope.user = $rootScope.user;
            $scope.pageClass = 'page-todos';

            // Get all todos
            if ($rootScope.activeList) {
                $scope.todos = Todo.query({
                    list_id: $rootScope.activeList._id
                });
            } else {
                console.log('No list currently active');
            }

            // Save new todo
            $scope.submit = function () {
                $scope.errors = [];

                if (!$scope.todo) {
                    $scope.errors.push('You need to enter something to do!');
                }

                if ($rootScope.activeList && $scope.todo) {
                    var todo = Todo.save({}, {
                        todo: $scope.todo,
                        list_id: $rootScope.activeList._id
                    }).$promise.then(function(result) {
                        $scope.todos.push(result);
                        $scope.todo = $scope.errors = '';
                    }, function (error) {
                        console.log(error);
                        $scope.error = 'Something went wrong';
                    });
                }
            };
        }])

        // User controllers
        .controller('mainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
            $scope.message = 'Welcome!';
            $scope.pageClass = 'page-home';
        }])
        .controller('loginController', ['$scope', '$rootScope', '$location', 'Login', function ($scope, $rootScope, $location, Login) {
            $scope.pageClass = 'page-login';

            $scope.submit = function() {
                $scope.errors = [];

                if (!$scope.email) {
                    $scope.errors.push('Please enter a valid email.');
                }

                if (!$scope.password) {
                    $scope.errors.push('Please enter a password.');
                }

                if ($scope.email && $scope.password) {
                    var data = {
                        email: $scope.email,
                        password: $scope.password
                    };
                    $scope.user = Login.save({}, data).$promise.then(function (result) {
                        if (result) {
                            $rootScope.user = result.user;
                            $location.path('/todos');
                        } else {
                            $scope.error = 'Login failed.'
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            };
        }])
        .controller('logoutController', ['$scope', '$rootScope', '$location', 'Logout', function ($scope, $rootScope, $location, Logout) {
            $scope.pageClass = 'page-logout';

            Logout.get().$promise.then(function() {
                $rootScope.user = '';
                $location.path('/');
            }, function (error) {
                console.log(error);
            });
        }])
        .controller('signupController', ['$scope', '$location', 'Signup', function ($scope, $location, Signup) {
            $scope.pageClass = 'page-signup';

            $scope.submit = function () {
                $scope.errors = [];

                if (!$scope.email) {
                    $scope.errors.push('Please enter a valid email.');
                }

                if (!$scope.password) {
                    $scope.errors.push('Please enter a password.');
                }

                if (!$scope.firstName) {
                    $scope.errors.push('Please enter your first name.');
                }

                if (!$scope.lastName) {
                    $scope.errors.push('Please enter your last name.');
                }

                if ($scope.email && $scope.password && $scope.firstName && $scope.lastName) {
                    // Create new user
                    $scope.user = Signup.save({}, {
                        email: $scope.email,
                        password: $scope.password,
                        firstName: $scope.firstName,
                        lastName: $scope.lastName
                    }).$promise.then(function () {
                        $location.path('/todos');
                    }, function (error) {
                        $scope.error = 'Signup failed';
                    });
                }
            };
        }])
        .controller('profileController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.user = $rootScope.user;
            $scope.pageClass = 'page-profile';
        }]);
};