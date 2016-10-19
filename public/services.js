module.exports = function (app) {
    return app

        // Todo services

        .factory('todoFactory', function (listFactory, Todo) {
            return {
                addTodo: function (data) {
                    return new Promise(function(resolve, reject) {                    
                        listFactory.getActiveList().then(function(list) {
                            if (list) {
                                Todo.save({}, {
                                    todo: data,
                                    list_id: list._id
                                }).$promise.then(function(result) {
                                    list.todos.push(result);
                                    resolve(result);
                                }, function (error) {
                                    reject(error);
                                });
                            }
                        }, function(error) {
                            reject(error);
                        });
                    });
                }
            }
        })

        // List services

        .factory('listFactory', function ($location, List, Todo) {
            var userLists = undefined;
            var activeListResource = undefined;

            return {
                setActiveList: function (list) {
                    var search = $location.search();
                    var listResource = undefined;

                    if (search.list_id)
                        listResource = _.find(userLists, { _id: search.list_id });

                    if (typeof list === 'undefined' && typeof listResource !== 'undefined') {
                        activeListResource = listResource;
                    } else if (typeof list !== 'undefined') {
                        activeListResource = list;
                        $location.search('list_id', activeListResource._id);
                    } else {
                        if (!userLists) {
                            this.getLists().then(function(lists) {
                                activeListResource = lists[0];
                                $location.search('');
                            });
                        } else if (userLists.length > 0) {
                            activeListResource = userLists[0];
                            $location.search('');
                        }
                    }
                },
                getActiveList: function () {
                    return new Promise(function(resolve, reject) {
                        if (typeof activeListResource === 'undefined') {
                            this.setActiveList();
                        } else if (typeof activeListResource !== 'undefined') {
                            resolve(activeListResource);
                        } else {
                            throw new Error('activeListResource is undefined');
                        }
                    });
                },
                addList: function (data) {
                    var self = this;

                    return new Promise(function(resolve, reject) {
                        if (data.value.name) {
                            List.save({}, {
                                name: data.value.name,
                                description: data.value.description
                            }).$promise.then(function(result) {
                                userLists.push(result);
                                self.setActiveList(result);
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
                    var self = this;
                    var index = _.indexOf(userLists, _.find(userLists, { _id: list._id }));

                    return new Promise(function(resolve, reject) {
                        if (typeof list !== 'undefined') {
                            List.delete({
                                list_id: list._id
                            }, function () {
                                self.getActiveList().then(function(activeList) {
                                    if (activeList._id === list._id) {
                                        self.setActiveList();
                                    }
                                });
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
