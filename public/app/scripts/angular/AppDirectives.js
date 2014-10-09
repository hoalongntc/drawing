angular
    .module('DrawingApp.modules')
    .directive('uiFileUpload', [function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, ele, attrs, ngModel) {
                if (!ngModel) {
                    throw new Error('ngModel is required!')
                }
                ngModel.$render = function () {
                };

                ele.bootstrapFileInput();
                ele.bind("change", function (e) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(e.target.files)
                    });
                });
            }
        }
    }])
    .directive('confirmField', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                confirmField: '='
            },
            link: function($scope, element, attrs, ngModel) {
                if(!ngModel) {
                    throw new Error("Ng-model is required");
                }

                ngModel.$render = function() { };
                element.bind('blur keyup change', function() {
                    $scope.$apply(read);
                });
                function read() {
                    var val = element.val();
                    if(typeof($scope.confirmField) == 'undefined' || $scope.confirmField == null || val === $scope.confirmField) {
                        ngModel.$setValidity('confirm', true);
                    } else {
                        ngModel.$setValidity('confirm', false);
                    }
                    ngModel.$setViewValue(val);
                }
                read();

                $scope.$watch('confirmField', function() {
                    read();
                });
            }
        };
    }]);