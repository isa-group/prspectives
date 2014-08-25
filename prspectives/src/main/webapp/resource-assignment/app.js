window.alertProxy = window.alert;
window.alert = function(message){
	throw message;
};

angular.module('prspectives.ral', ['navbarModule','loginModule','ui.bootstrap','ngRoute'])
.filter('toArray', function() {
  return function(items) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
   return filtered;
  };
})

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/:modelId/:processId/assignment', {
            templateUrl: 'resource-assignment/assignment/assignment.html',
            controller: 'AssignmentCtrl'
        })
        .when('/:modelId/:processId/analysis', {
            templateUrl: 'resource-assignment/analyser/analyser.html',
            controller: 'AnalyserCtrl'
        })
        .when('/:modelId/assignment', {
            templateUrl: 'resource-assignment/assignment/assignment.html',
            controller: 'AssignmentCtrl'
        })
        .when('/:modelId', {
            redirectTo: function(params) {
                return '/'+params.modelId+'/assignment';
            }
        })
        ;
})
;






