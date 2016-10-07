module.exports = function (app) {
    return app
        .directive('addList', function (List) {
            return {
                restrict: 'A', // attribute
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.createList = function () {
                        scope.errors = [];

                        if (!scope.list.name) {
                            scope.errors.push('Please give the list a name');
                        }

                        if (scope.list.name) {
                            List.save({}, {
                                name: scope.list.name,
                                description: scope.list.description
                            }).$promise.then(function(result) {
                                scope.lists.push(result);
                                scope.closeModal();
                                scope.list = '';
                                scope.$apply();
                            }, function (error) {
                                console.log(error);
                                scope.error = 'Something went wrong';
                            });
                        }
                    }
                }
            }
        })
        .directive('todoEdit', function (Todo) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var prev = elem.find('input')[0].value;

                    scope.update = function (todo) {
                        Todo.update(
                            // Find todo by id
                            { todo_id: todo._id },
                            // Properties to update
                            { todo: todo.text }
                        );
                    }
                }
            }
        })
        .directive('todoOptions', function (Todo) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.delete = function (todo) {
                        var index = _.indexOf(scope.todos, _.find(scope.todos, { _id: todo._id }));

                        Todo.delete({
                            todo_id: todo._id
                        }, function () {
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