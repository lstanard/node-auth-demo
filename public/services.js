module.exports = function (app) {
    return app

        .factory('listFactory', function ($rootScope, $location, List, Todo) {
            var userLists = undefined;
            var activeListResource = undefined;

            return {
                setActiveList: function (list) {
                    // 1) Set active list by query param
                    // 2) Set active list by list resource passed in, change URL to reflect new active list
                    // 3) First list

                    var search = $location.search();

                    if (typeof list === 'undefined' && search.list_id) {
                        var listResource = _.find(userLists, { _id: search.list_id });
                        if (listResource) {
                            activeListResource = listResource;
                        }
                    } else if (typeof list !== 'undefined') {
                        activeListResource = list;
                        $location.search('list_id', activeListResource._id);
                    } else {
                        if (!userLists) {
                            this.getLists().then(function(lists) {
                                activeListResource = lists[0];
                            });
                        } else if (userLists.length > 0) {
                            activeListResource = userLists[0];
                        }
                    }
                },
                getActiveList: function () {
                    return new Promise(function(resolve, reject) {
                        if (typeof activeListResource !== 'undefined') {
                            resolve(activeListResource);
                        } else {
                            reject('No active list found');
                        }
                    });
                },
                addList: function(data) {
                    return new Promise(function(resolve, reject) {
                        if (data.value.name) {
                            List.save({}, {
                                name: data.value.name,
                                description: data.value.description
                            }).$promise.then(function(result) {
                                userLists.push(result);
                                resolve(userLists);
                            }, function(error) {
                                reject(error);
                            });
                        } else {
                            reject('Must provide a list name.');
                        }
                    });
                },
                removeList: function (list) {
                    var index = _.indexOf(userLists, _.find(userLists, { _id: list._id }));
                    return new Promise(function(resolve, reject) {
                        if (typeof list !== 'undefined') {
                            List.delete({
                                list_id: list._id
                            }, function () {
                                userLists.splice(index, 1);
                                resolve(userLists);
                            });
                        } else {
                            reject('List is undefined');
                        }
                    });
                },
                updateList: function (list) {
                    return new Promise(function(resolve, reject) {
                        if (typeof list !== 'undefined') {
                            // TODO: add logic for updating lists
                        } else {
                            reject('List is undefined');
                        }
                    });
                },
                getLists: function () {
                    return new Promise(function(resolve, reject) {
                        if (!userLists) {
                            List.query().$promise
                                .then(function(lists) {
                                    if (lists.length > 0) {
                                        lists.forEach(function(list) {
                                            list.todos = Todo.query({ list_id: list._id });
                                        });
                                        userLists = lists;
                                        resolve(lists);
                                    } else {
                                        reject('No lists found');
                                    }
                                }, function (error) {
                                    reject(error);
                                });
                        } else {
                            resolve(userLists);
                        }
                    });
                }
            }
        });
};
