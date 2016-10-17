module.exports = function (app) {
    return app

        .factory('listFactory', function ($rootScope, $location, List, Todo) {
            var userLists = undefined;

            return {
                addList: function(data) {
                    if (data.value.name) {
                        List.save({}, {
                            name: data.value.name,
                            description: data.value.description
                        }).$promise.then(function(result) {
                            console.log(result);
                            userLists.push(result);
                            return result;
                        }, function (error) {
                            console.log(error);
                        });
                    }
                },
                getLists: function () {
                    if (!userLists) {
                        List.query().$promise.then(function(lists) {
                            userLists = lists;
                        });
                        return List.query();
                    } else {
                        return userLists;
                    }
                }
            }

            // return {
            //     activeListIndex: 0,
            //     setActiveList: function (listId) {
            //         var search = $location.search();

            //         // If user currently has lists
            //         if (this.userLists.length > 0) {
            //             if (typeof listId === 'undefined' && search.list_id) {
            //                 var index = _.indexOf(this.userLists, _.find(this.userLists, { _id: search.list_id }));
            //                 this.activeListIndex = index;
            //             }
            //         }
            //     },
            //     getUserLists: function () {
            //         var self = this;
            //         // Get all lists for current user
            //         if (userLists.length === 0) {
            //             List.query(function (lists) {
            //                 if (lists.length > 0) {
            //                     lists.forEach(function(list) {
            //                         list.todos = Todo.query(
            //                             { list_id: list._id }
            //                         );
            //                     });
            //                     self.userLists = lists;
            //                     console.log('Get lists for the first time');
            //                     console.log(self.userLists);
            //                     return self.userLists;
            //                 }
            //             });
            //         } else {
            //             console.log('Return lists already retrieved');
            //             console.log(this.userLists);
            //             return this.userLists;
            //         }
            //     }
            // }
        })

        .factory('activeListFactory', function ($rootScope, $location) {
            return {
                activeList: 0,
                setActive: function (listId) {
                    var search = $location.search();

                    // assume first that listId and search.list_id are null
                    //      - no active lists = either there are no lists, or an active list hasn't been set yet
                    if (typeof listId === 'undefined' && !search.list_id) {
                        console.log('No active list');
                    } else if (typeof listId === 'undefined' && search.list_id) {
                        // this.activeList =
                    }


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
        .factory('userListFactory', function ($rootScope, List, Todo, activeListFactory, listFactory) {
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

            factory.updateList = function () {
                // add update list
            };

            return factory;
        });
};
