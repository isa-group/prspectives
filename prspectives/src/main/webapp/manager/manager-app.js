angular.module('managerApp', ['navbarModule','loginModule','prspectives.modelHandler','ui.bootstrap']);

function ManagerCtrl($scope, $http, $log, loginService, $modal) {

    $scope.search = {}
    $scope.filterByType = [
        {label: 'Any type', value: ''},
        {label: 'BPMN 2.0', value: 'BPMN 2.0'},
        {label: 'Organization', value: 'Organization'}
    ];

    $scope.filterByOwner = [
        {label: 'Any', value: ''},
        {label: 'Me', value: true},
        {label: 'Others', value: false}
    ];

    $scope.applyFilter = function(attrib, v) {
        $scope.search[attrib] = v;
    }

    $scope.models = {list: []};
    $scope.$watchCollection('navbar.models', function(models) {
        $scope.models.list = [];
        angular.forEach(models, function(value, key) {
            $scope.models.list.push(value);
        })
    });



    $scope.isLogged = function() {
        return loginService.isLogged();
    }

    $scope.notEmpty = function(obj) {
        var notEmpty = false;
        for (key in obj) {
            notEmpty = true;
            break;
        }
        return notEmpty;
    }

    $scope.addModel = function (clone) {
        var modalInstance = $modal.open({
            templateUrl: "manager/modal-add.html",
            controller: "ModalAddCtrl",
            resolve: {
                cloneFrom: function() {
                    return clone;
                }
            }
        });

        modalInstance.result.then(function(newModelInfo) {
            $scope.navbar.models[newModelInfo.modelId] = newModelInfo;

            if (! clone && newModelInfo.links.editor) {
                var modalOpen = $modal.open({
                    templateUrl: "manager/modal-open.html",
                    controller: "ModalOpenCtrl",
                    resolve: {
                        model: function() {
                            return newModelInfo;
                        }
                    }
                })
            }
        });
    }

    $scope.deleteModel = function(model) {
        var modalInstance = $modal.open({
            templateUrl: "manager/modal-remove.html",
            controller: "ModalRemoveCtrl",
            resolve: {
                modelToRemove: function () {
                    return model;
                }
            }
        });

        modalInstance.result.then(function() {
            delete $scope.navbar.models[model.modelId];
        });
    }

    $scope.shareModel = function(model) {
        var modalInstance = $modal.open({
            templateUrl: "manager/modal-share.html",
            controller: "ModalShareCtrl",
            resolve: {
                model: function () {
                    return model;
                }
            }
        });
    }

    $scope.size = function(obj) {
        var size = 0;
        if (typeof obj === "object") {
         size = Object.keys(obj).length;
        }
        return size;
    }

}
