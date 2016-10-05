module.exports = function (app) {
    return app
        .directive('todoOptions', function (Todo) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.delete = function (todo) {
                        var index = _.indexOf(scope.todos, _.find(scope.todos, { _id: todo._id }));

                        Todo.delete({
                            todo_id: todo._id
                        }, function () {
                            console.log(scope);
                            scope.todos.splice(index, 1);
                        });
                    }
                }
            }
        })
        .directive('toggleComplete', function (Todo) {
            return {
                link: function (scope, elem, attrs) {
                    scope.toggleComplete = function (todo) {
                        Todo.update(
                            { todo_id: todo._id },
                            {
                                todo: todo.text,
                                completed: todo.completed
                            }
                        );
                    }
                }
            }
        });
};