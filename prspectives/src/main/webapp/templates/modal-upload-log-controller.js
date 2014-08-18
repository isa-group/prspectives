function ModalUploadLogCtrl($scope, $modalInstance, $upload, currentModel) {
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

	$scope.onFileSelect = function($files) {
		//$files: an array of files selected, each file has name, size, and type.
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			var post_url = currentModel.modelLinks.ppis + '/calculate';
			$scope.progress = 0;
			$scope.upload = $upload.upload({
				url: post_url,
				data: file,
				file: file,
				type: "POST",
				dataType: "xml",
				contentType: "multipart/form-data",
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
				$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
			}).success(function(data, status, headers, config) {
				// file is uploaded successfully
				var medidas = angular.fromJson(data);
                for (var i=0; i<medidas.length; i++){
                    var values = [];
                    for (var j=0; j<medidas[i].length; j++){
                        values.push(medidas[i][j].value);
                    }
                    medidas[i].values = values;
                }

				$modalInstance.close(medidas);
			}).error(function(xhr, status, error) {
                $scope.alerts.push({type: 'danger', msg: 'There was a problem processing the log file'});
				console.log(status);
			});
			//.then(success, error, progress);
		};
		// $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers.
	};
};