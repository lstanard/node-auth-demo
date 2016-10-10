module.exports = function (app) {
    return app

        // List directives

        // Todo directives
        .directive('todoEdit', function (Todo, activeListFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var prev = elem.find('input')[0].value;

                    scope.update = function (todo) {
                        Todo.update(
                            // Find todo by id
                            { list_id: activeListFactory.current._id, todo_id: todo._id },
                            // Properties to update
                            { todo: todo.text }
                        );
                    }
                }
            }
        })
        .directive('todoOptions', function (Todo, activeListFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.delete = function (todo) {
                        var index = _.indexOf(activeListFactory.current.todos, _.find(activeListFactory.current.todos, { _id: todo._id }));

                        Todo.delete({
                            list_id: activeListFactory.current._id,
                            todo_id: todo._id
                        }, function () {
                            activeListFactory.current.todos.splice(index, 1);
                        });
                    }
                }
            }
        })
        .directive('toggleComplete', function (Todo, activeListFactory) {
            return {
                link: function (scope, elem, attrs) {
                    scope.toggleComplete = function (todo) {
                        Todo.update(
                            { list_id: activeListFactory.current._id, todo_id: todo._id },
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