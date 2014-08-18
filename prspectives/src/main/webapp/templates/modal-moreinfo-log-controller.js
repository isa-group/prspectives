function ModalMoreInfoLogCtrl($scope, $modalInstance, measures) {
    $scope.info = {measures: measures};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

}
