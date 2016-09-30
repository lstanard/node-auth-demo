module.exports = function (app) {
    return app
        .directive('toggleComplete', function (Todo) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.bind('click', function (event) {
                        event.preventDefault();

                        $scope = scope;

                        var index = _.indexOf($scope.todos, _.find($scope.todos, { _id: $scope.todo._id }));

                        var todo = Todo.update(
                            { todo_id: $scope.todo._id },
                            {
                                todo: $scope.todo.text,
                                completed: !$scope.todo.completed
                            },
                            function () {
                                $scope.todos[index] = todo;'
                                elem.parent().toggleClass('completed');
                            }
                        );
                    });
                }
            }
        });
};