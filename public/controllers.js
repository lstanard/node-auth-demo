module.exports = function (app) {
    return app
        .controller('mainController', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
            $scope.message = 'Node Authentication';
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
                            $rootScope.user = result.user.local;
                            $location.path('/profile');
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

                if ($scope.email && $scope.password) {
                    var data = {
                        email: $scope.email,
                        password: $scope.password
                    };
                    $scope.user = Signup.save({}, data).$promise.then(function () {
                        $location.path('/profile');
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
        .controller('listsController', ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.message = 'Your Lists';
            $scope.user = $rootScope.user;
        }]);
};