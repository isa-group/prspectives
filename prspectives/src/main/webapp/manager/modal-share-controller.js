var ModalShareCtrl = function ($scope, $modalInstance, Models, model) {

    $scope.title = model.name;
    $scope.shareName = {};

    if (! model.shared) {
        $scope.shareName.shared = [];
    } else {
        $scope.shareName.shared = model.shared.splice(0);
    }
    $scope.shareName.name = "";
    $scope.alerts = [];

    $scope.add = function() {
        $scope.shareName.shared.push($scope.shareName.name);
    }

    $scope.removeShare = function (index) {
        $scope.shareName.shared.splice(index, 1);
    }

    $scope.ok = function () {
        $scope.alerts = [];
        model.shared = $scope.shareName.shared;
        model.$save(null, function() {
            $modalInstance.close(model);
        },
        function() {
            $scope.alerts.push({type: 'danger', msg: 'There was a problem sharing the model'});
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};