module.exports = function (app) {
    return app
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