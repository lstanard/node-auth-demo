module.exports = function (app) {
    return app

        .controller('mainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
            $scope.message = 'Welcome!';
            $scope.pageClass = 'page-home';
        }])

        .controller('listController', ['$scope', '$rootScope', 'Todo', 'listFactory', 'ngDialog', function ($scope, $rootScope, Todo, listFactory, ngDialog) {
            // Set current user
            $scope.user = $rootScope.user;
            
            // Get user lists
            listFactory.getLists().then(function(lists) {
                $scope.lists = lists;
                listFactory.setActiveList($scope.lists[0]);
            }, function (error) {
                console.log(error);
            });

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
                    listFactory.addList(data).then(function(lists) {
                        $scope.lists = lists;
                    }, function (error) {
                        console.log(error);
                    });
                });
            };

            // Delete list
            $scope.delete = function(list) {
                listFactory.removeList(list).then(function(lists) {
                    $scope.lists = lists;
                }, function (error) {
                    console.log(error);
                })
            };



            // TODO: Refactor into factory
            // Save new todo
            $scope.createTodo = function () {
                $scope.errors = [];

                if (!$scope.todo) {
                    $scope.errors.push('You need to enter something to do!');
                }

                if ($scope.todo) {
                    listFactory.getActiveList().then(function(list) {
                        Todo.save({}, {
                            todo: $scope.todo,
                            list_id: list._id
                        }).$promise.then(function(result) {
                            list.todos.push(result);
                            $scope.todo = $scope.errors = '';
                        }, function (error) {
                            console.log(error);
                            $scope.error = 'Something went wrong';
                        });
                    }, function(error) {
                        console.log(error);
                    });

                }
            };
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
