function AssignmentCtrl($scope, $http, $log, $routeParams) {

    $scope.name='assignment';

    $scope.$watchCollection("bpmnModel.processes", function(processes) {
        if (processes) {
            if (typeof $routeParams.processId === "undefined") {
                for (var id in processes) {
                    var process = processes[id];
                    if (process.activityNames && process.activityNames.length != 0) {
                        $scope.process = process;
                        break;
                    }
                }
            } else {
                $scope.process = processes[$routeParams.processId];
            }
        }
    });


    $scope.saveStatus = false;

    $scope.save = function () {
        $log.info("Saving model...");
        $log.info($scope.raw);
        $scope.saveStatus = true;
        $http.put($scope.navbar.currentModel.modelLinks.model, $scope.raw).success(function (data){
            $scope.saveStatus = false;
        });
    };

};
