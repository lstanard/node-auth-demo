module.exports = function (app) {
    return app

        // List directives
        .directive('listActivate', function ($rootScope, listFactory) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
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
        .directive('todoEdit', function ($rootScope, Todo, listFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var prev = elem.find('input')[0].value;
                    var activeListResource = listFactory.getActiveList();

                    scope.update = function (todo) {
                        activeListResource.then(function(list) {
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
        .directive('todoOptions', function ($rootScope, Todo, listFactory) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var activeListResource = listFactory.getActiveList();

                    scope.delete = function (todo) {
                        activeListResource.then(function(list) {
                            var index = _.indexOf(list.todos, _.find(list.todos, { _id: todo._id }));

                            Todo.delete({
                                list_id: list._id,
                                todo_id: todo._id
                            }, function () {
                                list.todos.splice(index, 1);
                            });
                        });
                    }
                }
            }
        })
        .directive('toggleComplete', function ($rootScope, Todo, listFactory) {
            return {
                link: function (scope, elem, attrs) {
                    var activeListResource = listFactory.getActiveList();

                    scope.toggleComplete = function (todo) {
                        activeListResource.then(function(list) {
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