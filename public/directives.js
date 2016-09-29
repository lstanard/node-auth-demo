module.exports = function (app) {
    return app
        .directive('toggleClass', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('click', function () {
                        console.log(element);
                    });
                }
            }
        });
};