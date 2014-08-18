var ModalRemoveCtrl = function ($scope, $modalInstance, Models, modelToRemove) {

    $scope.model = modelToRemove;

    if (modelToRemove.owner) {
        $scope.shareHint = modelToRemove.shared.length == 0 ? "" : "It will also be removed to all the users that share this model.";
    } else {
        $scope.shareHint = "The original model will not be removed.";
    }

    $scope.alerts = [];

    $scope.ok = function () {
        $scope.alerts = [];
        modelToRemove.$remove(null, function() {
            $modalInstance.close(modelToRemove);
        },
        function() {
            $scope.alerts.push({type: 'danger', msg: 'There was a problem removing the model'});
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};