angular.module('DrawingApp.modules', []);
angular.module('DrawingApp.controllers', []);

angular
    .module('DrawingApp', [
        'ngResource',
        'ui.bootstrap',
        'DrawingApp.modules',
        'DrawingApp.controllers'
    ]);