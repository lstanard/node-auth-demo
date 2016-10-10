module.exports = function (app) {
    return app
        .factory('activeListFactory', function () {
            return {
                current: 0,
                setActive: function (list) {
                    if (typeof list !== 'undefined') {
                        this.current = list;
                    } else {
                        console.log('Cannot set active list: ' + list);
                    }
                }
            }
        });
};