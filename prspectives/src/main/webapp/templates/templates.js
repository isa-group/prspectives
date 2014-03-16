angular.module('templatesApp', ['ppinotTemplates', 'loginModule', 'navbarModule', 'angularFileUpload']);

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

function TemplatesCtrl($scope, $location, $http) {


    $scope.$watch("navbar.currentModel", function(currentModel, oldModel) {
        if (currentModel)
            $scope.load(currentModel.modelId);
    });

    $scope.load = function(modelId) {
        $scope.currentModel = modelId;
        var url = "service/model/"+modelId;
        $scope.model = new BPMNModel(modelId, url);
        $scope.ppis = [];
        $scope.model.load().then(function () {
            $http.get($scope.model.url+"/ppis").success(function(data) {
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
        $http.put($scope.model.url+"/ppis", $scope.ppis);
    };
};

function MyCtrl($scope, $upload) {
  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      //var post_url = '/bpmn-editor/service/model/RFC/ppis/calculate';
      var id = $scope.$$prevSibling.navbar.currentModelId;
      var post_url = '/bpmn-editor/service/model/'+id+'/ppis/calculate';
      $scope.upload = $upload.upload({
		url: post_url,
		data: file,
		file: file,
		type: "POST",
		dataType: "xml",
		contentType: "application/xml",
        // method: "post",
        // headers: {'headerKey': 'headerValue'},
        // withCredentials: true,
        // data: {myObj: $scope.myModelObj},
        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
        //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
        //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
    	  $('#uploadDialog').modal('hide');
    	  console.log(data);
    	  console.log(status);
    	  console.log(headers);
    	  console.log(config);
      }).error(function(xhr, status, error) {
    	  console.log(status);
      });
      //.then(success, error, progress); 
    }
    // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers. 
  };
};