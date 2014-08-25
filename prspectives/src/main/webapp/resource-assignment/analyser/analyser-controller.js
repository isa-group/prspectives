/*
 * AnalyserCtrl - Controller for the analyser
 */

function AnalyserCtrl($scope, $http, $log, $routeParams) {

    $scope.name = 'analysis';

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

	$scope.performedActions = [];

	$scope.removeAction = function(id){
	    $scope.performedActions.splice(id, 1);
	};

	$scope.createNewAnalysis = function(operation, paramString){
		var action = {
		    active: true,
		    operation: operation,
		    param: paramString,
		    success: false,
		    result: "waiting"
		};
		
		$scope.performedActions.push(action);
		$scope.doAnalysis(action);
	};
	

	
	$scope.doAnalysis = function (action){
		$log.info("analysing...");
		   
		try{
			//$log.info("getting user token...");
			var path = $scope.getContextPath();
			//$http.get(path + "/service/user/token").success(function(token) {
				//$log.info("user token obtained successfully...");
				//var orgUrl = path + "/service/model/" + token + "/" + $scope.assignments.organizationalModel + "/json";
				//var bpmnUrl = path + "/service/model/" + token + "/" + $scope.bpmnModel.modelId + "/xml";
				var orgId = $scope.assignments.organizationalModel;
				var bpmnId = $scope.bpmnModel.modelId;
				var operationPath = action.operation.name.toLowerCase().replace(/ /g,"_");
				
				var url;
				if(action.param.indexOf(";")==-1){
					url = $scope.getAnalyserPath() + "/" + bpmnId + "/" + action.param + "/" + operationPath + "?duty=RESPONSIBLE";
				}else{
					url = $scope.getAnalyserPath() + "/" + bpmnId + "/" + operationPath + "?duty=RESPONSIBLE&activities=" + action.param.replace(/;/g,"%3B");
				}
				
				
				$http.get(url).success(function(data) {
					$log.info("analyser success:" + data);
					action.success = true;
					
					if(data instanceof Array){
						var text = "";
						for(var i=0; i<data.length; i++){
							if(text!=""){
								text+=", ";
							}
							text+=data[i];
						};
						action.result = text;
					}else{
						action.result = data;
					}
					
				}).error(function(error){
		        	$log.error(error);
		        	action.result="Error performing the analysis.";
		        });
			//});	
		}catch(error){
				$log.error(error);
				action.result="Error performing the analysis.";
		};
	};

    $scope.getContextPath = function(){
    	var path = window.location.origin;
    	path += window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    	return path;
    };
    
    $scope.getAnalyserPath = function(){
    	return  $scope.getContextPath() + "/analyser";
    };
    
};


