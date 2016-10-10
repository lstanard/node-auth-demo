module.exports = function (app) {
    return app

        .controller('listController', ['$scope', '$rootScope', 'List', 'Todo', 'activeListFactory', 'ngDialog', function ($scope, $rootScope, List, Todo, activeListFactory, ngDialog) {
            $scope.user = $rootScope.user;

            // Get all lists for current user
            $scope.lists = List.query(function () {
                activeListFactory.setActive($scope.lists[0]);

                // Get todos for each list
                $scope.lists.forEach(function(list) {
                    list.todos = Todo.query(
                        { list_id: list._id }
                    );
                });
            });

            $scope.delete = function (list) {
                var index = _.indexOf($scope.lists, _.find($scope.todoslist, { _id: list._id }));

                List.delete({
                    list_id: list._id
                }, function () {
                    $scope.lists.splice(index, 1);
                });
            };

            // New list dialog/form
            $scope.openModal = function () {
                var dialog = ngDialog.open({
                    template: 'templates/partials/new-list.html',
                    className: 'ngdialog-theme-default',
                    controller: function ($scope) {
                        $scope.createList = function () {
                            dialog.close($scope.list);
                        }
                    }
                });
                dialog.closePromise.then(function(data) {
                    List.save({}, {
                        name: data.value.name,
                        description: data.value.description
                    }).$promise.then(function(result) {
                        $scope.lists.push(result);
                    }, function (error) {
                        console.log(error);
                    });
                });
            };

            // Save new todo
            $scope.createTodo = function () {
                $scope.errors = [];

                if (!$scope.todo) {
                    $scope.errors.push('You need to enter something to do!');
                }

                if (activeListFactory.current && $scope.todo) {
                    var todo = Todo.save({}, {
                        todo: $scope.todo,
                        list_id: activeListFactory.current._id
                    }).$promise.then(function(result) {
                        activeListFactory.current.todos.push(result);
                        $scope.todo = $scope.errors = '';
                    }, function (error) {
                        console.log(error);
                        $scope.error = 'Something went wrong';
                    });
                }
            };
        }])
        .controller('mainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
            $scope.message = 'Welcome!';
            $scope.pageClass = 'page-home';
        }])

        // User controllers
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
                            $location.path('/lists');
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
                        $location.path('/profile');
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