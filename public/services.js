module.exports = function (app) {
    return app

        .factory('activeListFactory', function ($rootScope, $location) {
            return {
                setActive: function (listId) {
                    var search = $location.search();

                    // assume first that listId and search.list_id are null
                    //      - no active lists = either there are no lists, or an active list hasn't been set yet

                    // no listid being passed in, list_id is in the url
                    if (typeof listId === 'undefined' && search.list_id) {
                        console.log('condition 1');
                        $rootScope.activeListId = search.list_id;
                    }
                    // list_id is in the url, but we want to change it from a click
                    else if (search.list_id && (listId !== search.list_id)) {
                        console.log('condition 2');
                        $rootScope.activeListId = listId;
                        $location.search('list_id', listId);
                    }
                    // fallback = no active list id, no listid being passed in, no list_id in the url -> make first list active
                    else if ($rootScope.activeListId == 0 && typeof listId === 'undefined' && !search.list_id && $rootScope.lists) {
                        console.log('condition 3');
                        $rootScope.activeListId = $rootScope.lists[0];
                    } else {
                        console.log('Cannot set active list');
                    }

                    // if (search.list_id && typeof listId === 'undefined') {
                    //     console.log('load list from url');
                    //     $rootScope.activeListId = search.list_id;
                    // } else if (typeof listId !== 'undefined' && listId) {
                    //     $rootScope.activeListId = listId;
                    //     $location.path('/lists').search({ 'list_id': listId });
                    // } else {
                    //     console.log('Cannot set active list');
                    // }
                }
            }
        })
        .factory('userListFactory', function ($rootScope, List, Todo, activeListFactory) {
            var factory = {};

            factory.getLists = function () {
                var self = factory;

                if (_.isEmpty($rootScope.lists)) {
                    List.query(function (lists) {
                        if (lists.length > 0) {
                            lists.forEach(function(list) {
                                list.todos = Todo.query(
                                    { list_id: list._id }
                                );
                            });

                            $rootScope.lists = lists;
                        } else {
                            return;
                        }
                    });
                }
            };

            factory.removeList = function (list) {
                var index = _.indexOf($rootScope.lists, _.find($rootScope.lists, { _id: list._id }));
                if (typeof list !== 'undefined') {                
                    List.delete({
                        list_id: list._id
                    }, function () {
                        $rootScope.lists.splice(index, 1);
                    });
                }
            };

            factory.addList = function (data) {
                if (data.value.name) {                
                    List.save({}, {
                        name: data.value.name,
                        description: data.value.description
                    }).$promise.then(function(result) {
                        $rootScope.lists.push(result);
                    }, function (error) {
                        console.log(error);
                    });
                }
            };

            factory.updateList = function () {
                // add update list
            };

            return factory;
        });
};
