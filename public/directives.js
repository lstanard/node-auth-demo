module.exports = function (app) {
    return app

        // List directives
        .directive('listActivate', function (listFactory) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    // TODO: clean this up
                    listFactory.getActiveList().then(function(list) {
                        if (scope.list._id === list._id) {
                            elem.parent().children().removeClass('active');
                            elem.addClass('active');
                        }
                    });

                    elem.find('a').on('click', function(event) {
                        event.preventDefault();
                        elem.parent().children().removeClass('active');
                        elem.addClass('active');
                        listFactory.setActiveList(scope.list);
                    });
                }
            };
        })

        // Todo directives
        .directive('todoEdit', function (Todo, listFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var prev = elem.find('input')[0].value;

                    scope.update = function (todo) {
                        listFactory.getActiveList().then(function(list) {
                            Todo.update(
                                // Find todo by id
                                { list_id: list._id, todo_id: todo._id },
                                // Properties to update
                                { todo: todo.text }
                            );
                        });
                    }
                }
            }
        })
        .directive('todoOptions', function (Todo, listFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.delete = function (todo) {
                        Todo.delete({
                            list_id: scope.$parent.list._id,
                            todo_id: todo._id
                        }, function () {
                            scope.$parent.list.todos.splice(scope.$parent.list.todos.indexOf(todo), 1);
                        });
                    }
                }
            }
        })
        .directive('toggleComplete', function (Todo, listFactory) {
            return {
                link: function (scope, elem, attrs) {
                    scope.toggleComplete = function (todo) {
                        listFactory.getActiveList().then(function(list) {
                            Todo.update(
                                { list_id: list._id, todo_id: todo._id },
                                {
                                    todo: todo.text,
                                    completed: todo.completed
                                }
                            );
                        });
                    }
                }
            }
        });
};