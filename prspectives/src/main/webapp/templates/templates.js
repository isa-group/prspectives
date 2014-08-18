angular.module('templatesApp', ['ppinot.templates', 'loginModule', 'navbarModule', 'angularFileUpload', 'ui.bootstrap'])
    .directive('inlinesparkline', function() {
        return {
            restrict: 'C',
            scope: {values: '=', width: '@', height: '@'},
            link: function(scope, elem, attrs) {
                elem.sparkline(scope.values, {width: scope.width, height:scope.height, lineWidth: 3, spotRadius:3});
            }
        }
    });

function iteratePPIs(ppiSet, iterationFunction) {
    $(ppiSet).each(function() {
        $(this.ppis).each(function() {
            iterationFunction(this);
        });
    });

}

function assign(ppiSet, source, origin, transform) {
    iteratePPIs(ppiSet, function (ppi) {
        ppi[source] = [];
        $(ppi[origin]).each(function() {
            ppi[source].push(transform(this));
        });
    });
}


function loadArrays(ppiSet) {
    var loadTransform = function(value) {
        return {elem:value};
    };

    assign(ppiSet, "ngGoals", "goals", loadTransform);
    assign(ppiSet, "ngInformed", "informed", loadTransform);

}

function saveArrays(ppiSet) {
    var saveTransform = function(value) {
        return value.elem;
    };

    assign(ppiSet, "goals", "ngGoals", saveTransform);
    assign(ppiSet, "informed", "ngInformed", saveTransform);
    cleanScope(ppiSet);
}

function cleanScope(ppiSet) {
    iteratePPIs(ppiSet, function(ppi) {
        if (ppi.scope != null) {
            var scope = {kind: ppi.scope.kind};

            if (ppi.scope.kind == "LastInstancesFilter") {
                scope.numberOfInstances = ppi.scope.numberOfInstances;
            }
            else if (ppi.scope.kind == "SimpleTimeFilter") {
                scope.relative = ppi.scope.relative;
                scope.frequency = ppi.scope.frequency;
                scope.period = ppi.scope.period;
            }
            else {
                scope = null;
            }

            ppi.scope = scope;
        }
    });
}

function TemplatesCtrl($scope, $location, $http, $modal) {


    $scope.$watch("navbar.currentModel", function(currentModel, oldModel) {
        if (currentModel)
            $scope.load(currentModel);
    });

    $scope.load = function(modelInfo) {
        $scope.modelInfo = modelInfo;
        $scope.model = new BPMNModel(modelInfo);
        $scope.ppis = [];
        $scope.model.load().then(function () {
            $http.get(modelInfo.modelLinks.ppis).success(function(data) {
                $scope.ppis = data;
                loadArrays($scope.ppis);
            });
        });
    };

    $scope.remove = function(ppi) {
    	var index = $scope.ppis.indexOf(ppi);
    	$scope.ppis.splice(index, 1);
    };

    $scope.save = function() {
        saveArrays($scope.ppis);
        $http.put($scope.modelInfo.modelLinks.ppis, $scope.ppis);
    };

    $scope.loadLog = function() {
        var modalInstance = $modal.open({
            templateUrl: "templates/modal-upload-log.html",
            controller: "ModalUploadLogCtrl",
            resolve: {
                currentModel: function() {
                    return $scope.navbar.currentModel;
                }
            }
        });

        modalInstance.result.then(function(measures) {
            $scope.measures = measures;
        });
    }

    $scope.moreInfoLog = function(measures) {
        var modalInstance = $modal.open({
            templateUrl: "templates/modal-moreinfo-log.html",
            controller: "ModalMoreInfoLogCtrl",
            resolve: {
                measures: function() {
                    return measures;
                }
            }
        });
    }
};
