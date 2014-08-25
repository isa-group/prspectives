function MainCtrl($scope, $http, $log, $route) {

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

    $scope.route = $route;

    $scope.isActive = function(key, element) {
        return $scope.route && $scope.route.current.params.processId==key && $scope.route.current.scope.name==element;
    }

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

}