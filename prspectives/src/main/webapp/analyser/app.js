window.alertProxy = window.alert;
window.alert = function(message){
	throw message;
};

angular.module('analyserApp', ['navbarModule','loginModule','ui.bootstrap'])
.filter('array', function() {
  return function(items) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
   return filtered;
  };
});

function AnalyserCtrl($scope, $http, $log) {
 
	$scope.operationInfo = new Array();
	$scope.operationInfo["Potential Participants"] = {abb:"P.P.", description:"Find people who are able to perform an activity."} ;
	$scope.operationInfo["Critical Activities"] = {abb:"C.A.", description:"Find the activities which are critical among the chosen activities."};
	$scope.operationInfo["Potential Activities"] = {abb:"P.A.", description:"Find the activities that can be performed by a person."};
	$scope.operationInfo["Basic Consistency"] = {abb:"B.C.", description:"Check if an activity is consistent."};
	$scope.operationInfo["Non Participants"] = {abb:"N.P.", description:"Find the persons who cannot perform any of the chosen activities."};
	$scope.operationInfo["Critical Participants"] = {abb:"C.P.", description:"Find the persons who perform critical activities."};
	$scope.operationInfo["Indispensable Participants"] = {abb:"I.P.", description:"Find the persons who are considered indispensable: The ones who perform mandatory critical activities."};
	$scope.nextPerformedActionId = 1;                       	
	$scope.performedActions = [];
	$scope.selected = {person: "", activity:"", operation:""};
	$scope.activitySet = new Array();
	window.scope = $scope;
	$scope.selectAll = function (){
		for(var x in $scope.activitySet){
			$scope.activitySet[x]=true;
		}
	};
	
	$scope.unselectAll = function (){
		for(var x in $scope.activitySet){
			$scope.activitySet[x]=false;
		}
	};
	
	$scope.showNewOperationModal = function (newOp){
		$scope.selected.operation = newOp;
		$("#newOpModal").modal("show");
	};
	
	$scope.removeAction = function(id){
		for(var i=0; i<$scope.performedActions.length; i++){
			if(id==$scope.performedActions[i].id){
				$scope.performedActions.splice(i,1);
				break;
			}
		}
	};
	
	$scope.calculateText = function(text, tabs){
		return $scope.operationInfo[text].abb;
	};
	
	$scope.showOneActivitySelector = function(){
		return $scope.selected.operation == 'Potential Participants' || $scope.selected.operation == 'Basic Consistency';
	};
	
	$scope.showOnePersonSelector = function(){
		return $scope.selected.operation == 'Potential Activities';
	}; 
	
	$scope.showMultipleActivitySelector = function(){
		return !$scope.showOneActivitySelector() && !$scope.showOnePersonSelector();
	};
	
	
	$scope.createNewAnalysis = function(){	
		var action = {id:$scope.nextPerformedActionId, name: $scope.selected.operation, param:$scope.getParamString(), success:false, result:"waiting"};
		$("#newOpModal").modal('hide');
		$scope.performedActions[$scope.performedActions.length] = action;
		$scope.nextPerformedActionId++;
		$scope.selected.operation="";
		$scope.doAnalysis(action);
	};
	
	$scope.getParamString = function (){
		var res="";
		if($scope.showOneActivitySelector()){
			res = $scope.selected.activity;
		}else if($scope.showOnePersonSelector()){
			res = $scope.selected.person;
		}else if($scope.showMultipleActivitySelector()){
			var result = "";
			for(var x in $scope.activitySet){
				if($scope.activitySet[x]==true){
					if(result!=""){
						result+=";";
					}
					result+=x;
					$scope.activitySet[x]=false;
				}
			}
			res = result;
		}
		$scope.selected.activity = "";
		$scope.selected.person = "";
		return res;
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
				var operationPath = action.name.toLowerCase().replace(/ /g,"_");
				var url = $scope.getAnalyserPath() + "/" + operationPath + "/" + bpmnId + "/" + action.param.replace(/;/g,"%3B") + "/RESPONSIBLE";
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
	
	//------------------------------------------ NOT USED
	
    $scope.depict = function(data) {
        var result = [];
        angular.forEach(data.assignment[data.activity], function(boundRole) {
            if (boundRole.role == data.role) {
                result.push($scope.rasciRoles[boundRole.type]);
            }
        });

        return result.join(" / ");
    };

    $scope.depictDetails = function(data) {
        var result = [];
        angular.forEach(data.assignment[data.activity], function(boundRole) {
            if (boundRole.role == data.role) {
                result.push(boundRole.type + ": " + boundRole.bindingExpression);
            }
        });

        return result.join("<br/>");
    };

    $scope.load = function(currentModel) {
        $scope.bpmnModel = new BPMNModel(currentModel.modelId, currentModel.url);
        $scope.bpmnModel.load().then(function () {
            $scope.$apply('bpmnModel');

            $http.get(currentModel.url+"/json").success(function(data) {
                if (! data.extensions) {
                    data.extensions = {};
                }
                if (! data.extensions.assignments) {
                    data.extensions.assignments = {};
                }
                $scope.raw = data;
                $scope.assignments = data.extensions.assignments;
                
                angular.forEach($scope.bpmnModel.processes, function(p, id) {
                	
                    if (! $scope.assignments[p.processName]){
                        $scope.assignments[p.processName] = {ralAssignment: {}, rasciAssignment: {}};
                    }
                });
            });
        });
    };

    $scope.$watch("assignments.organizationalModel", function(modelId, oldModelId) {
        if (modelId) {
            $scope.loadOrganization(modelId);
        }
    });

    $scope.loadOrganization = function(modelId) {
        $http.get($scope.navbar.models[modelId].url+"/json").success(function(data) {
            $scope.organization = data.model;
        });
    };

    $scope.$watch("navbar.currentModel", function(currentModel, oldModel) {
        $log.info("Current model: " + currentModel);
        if (currentModel)
            $scope.load(currentModel);
    });

    $scope.getContextPath = function(){
    	var path = window.location.origin;
    	path += window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    	return path;
    };
    
    $scope.getAnalyserPath = function(){
    	return  $scope.getContextPath() + "/analyser";
    };
    
};


