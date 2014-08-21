window.alertProxy = window.alert;
window.alert = function(message){
	throw message;
};

angular.module('prspectives.ral', ['navbarModule','loginModule','ui.bootstrap'])
.filter('toArray', function() {
  return function(items) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
   return filtered;
  };
});




function AssignmentCtrl($scope, $http, $log) {

    $scope.saveStatus = false;

    $scope.$watch("navbar.currentModel", function(currentModel, oldModel) {
        $log.info("Current model: " + currentModel);
        if (currentModel)
            $scope.load(currentModel);
    });

    $scope.$watch("assignments.organizationalModel", function(modelId, oldModelId) {
        if (modelId) {
            $scope.loadOrganization(modelId);
        }
    });


    $scope.load = function(currentModel) {
        $http.get(currentModel.modelLinks.model).success(function(data) {
            if (! data.extensions) {
                data.extensions = {};
            }
            if (! data.extensions.assignments) {
                data.extensions.assignments = {};
            }
            $scope.raw = data;
            $scope.assignments = data.extensions.assignments;

            $scope.bpmnModel = new BPMNModel(currentModel);
            $scope.bpmnModel.load().then(function () {
                $scope.$apply('bpmnModel');
                angular.forEach($scope.bpmnModel.processes, function(p, id) {
                    if (! $scope.assignments[p.processName]){
                        $scope.assignments[p.processName] = {ralAssignment: {}, rasciAssignment: {}};
                    }
                });
            });
        });
    };

    $scope.loadOrganization = function(modelId) {
        $http.get($scope.navbar.models[modelId].modelLinks.model).success(function(data) {
            $scope.organization = data.model;
        });
    };

    $scope.save = function () {
        $log.info("Saving model...");
        $log.info($scope.raw);
        $scope.saveStatus = true;
        $http.put($scope.navbar.currentModel.modelLinks.model, $scope.raw).success(function (data){
            $scope.saveStatus = false;
        });
    };
    
};


