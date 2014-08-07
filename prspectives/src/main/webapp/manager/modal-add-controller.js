var ModalAddCtrl = function ($scope, $modalInstance, Models, cloneFrom) {

    if (! cloneFrom) {
        $scope.windowTitle = "Add new model";
        $scope.info = {
            name: "",
            type: "",
            description: ""
        };
    } else {
        $scope.windowTitle = "Clone from " + cloneFrom.name;
        $scope.info = {
            name: "Clone of " + cloneFrom.name,
            type: cloneFrom.type,
            description: cloneFrom.description,
            cloneFrom: cloneFrom.modelId
        }
    }

    $scope.alerts = [];

    $scope.ok = function () {
        $scope.alerts = [];
        var modelInfo = new Models($scope.info);
        modelInfo.$save(null, function() {
            $modalInstance.close(modelInfo);
        },
        function() {
            $scope.alerts.push({type: 'danger', msg: 'There was a problem creating the model'});
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};