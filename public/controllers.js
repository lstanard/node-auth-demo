module.exports = function (app) {
    return app
        .controller('mainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
            $scope.message = 'Welcome!';
        }])
        .controller('loginController', ['$scope', '$rootScope', '$location', 'Login', function ($scope, $rootScope, $location, Login) {
            $scope.message = 'Login';

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
            Logout.get().$promise.then(function() {
                $rootScope.user = '';
                $location.path('/');
            }, function (error) {
                console.log(error);
            });
        }])
        .controller('signupController', ['$scope', '$location', 'Signup', function ($scope, $location, Signup) {
            $scope.message = 'Signup';

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
            $scope.message = 'Your Profile';
            $scope.user = $rootScope.user;
        }])
        .controller('todoController', ['$scope', '$rootScope', 'Todo', function ($scope, $rootScope, Todo) {
            $scope.message = 'Your Todos';
            $scope.user = $rootScope.user;

            // Get all todos
            $scope.todos = Todo.query();

            // Save new todo
            $scope.submit = function () {
                $scope.errors = [];

                if (!$scope.todo) {
                    $scope.errors.push('You need to enter something to do!');
                }

                if ($scope.todo) {
                    var todo = Todo.save({}, {
                        todo: $scope.todo
                    }).$promise.then(function(result) {
                        $scope.todos.push(result);
                        $scope.todo = $scope.errors = '';
                    }, function (error) {
                        console.log(error);
                        $scope.error = 'Something went wrong';
                    });
                }
            };

            // Update/edit a todo
            $scope.update = function (todo) {
                if (todo) {
                    Todo.update(
                        // Find todo by id
                        { todo_id: todo._id },
                        // Properties to update
                        { todo: todo.text }
                    );
                }
            };

            // Delete todo
            $scope.delete = function (todo) {
                if (todo) {
                    var index = _.indexOf($scope.todos, _.find($scope.todos, { _id: todo._id }));

                    Todo.delete({
                        todo_id: todo._id
                    }, function () {
                        $scope.todos.splice(index, 1);
                    });
                }
            };
        }]);
};