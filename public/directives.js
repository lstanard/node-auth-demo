module.exports = function (app) {
    return app

        // List directives
        .directive('listActivate', function ($rootScope, activeListFactory) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.find('a').on('click', function(event) {
                        event.preventDefault();
                        elem.parent().children().removeClass('active');
                        elem.addClass('active');
                        activeListFactory.setActive(scope.list._id);
                    });
                }
            };
        })

        // Todo directives
        .directive('todoEdit', function ($rootScope, Todo) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    var prev = elem.find('input')[0].value;

                    scope.update = function (todo) {
                        Todo.update(
                            // Find todo by id
                            { list_id: $rootScope.activeListId, todo_id: todo._id },
                            // Properties to update
                            { todo: todo.text }
                        );
                    }
                }
            }
        })
        .directive('todoOptions', function ($rootScope, Todo) {
            return {
                scope: false,
                link: function (scope, elem, attrs) {
                    scope.delete = function (todo) {
                        var listIndex = _.indexOf($rootScope.lists, _.find($rootScope.lists, { _id: $rootScope.activeListId }));
                        console.log(listIndex);
                        var index = _.indexOf($rootScope.lists[listIndex].todos, _.find($rootScope.lists[listIndex].todos, { _id: todo._id }));
                        console.log(index);

                        Todo.delete({
                            list_id: $rootScope.activeListId,
                            todo_id: todo._id
                        }, function () {
                            // TODO: Fix - it's removing from the wrong list on the front-end
                            $rootScope.lists[listIndex].todos.splice(index, 1);
                        });
                    }
                }
            }
        })
        .directive('toggleComplete', function ($rootScope, Todo) {
            return {
                link: function (scope, elem, attrs) {
                    scope.toggleComplete = function (todo) {
                        Todo.update(
                            { list_id: $rootScope.activeListId, todo_id: todo._id },
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