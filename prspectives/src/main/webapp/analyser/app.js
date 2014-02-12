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
 
	$scope.abbreviation = new Array();
	$scope.abbreviation["Potential Participants"] = "P.P.";
	$scope.abbreviation["Critical Activities"] = "C.A.";
	$scope.abbreviation["Potential Activities"] = "P.A.";
	$scope.abbreviation["Basic Consistency"] = "B.C.";
	$scope.abbreviation["Non Participants"] = "N.P.";
	$scope.abbreviation["Critical Participants"] = "C.P.";
	$scope.abbreviation["Indispensable Participants"] = "I.P.";
	$scope.nextPerformedActionId = 9;                       	
	$scope.performedActions = [
			          {id:1, name:"Potential Participants", param:"H", success:true, result:"Maria, Ana, Antonio"},
			          {id:2, name:"Critical Activities", param:"A,B,C,D,E,F", success:true, result:"A,B,C"},
			          {id:3, name:"Potential Participants", param:"H", success:true, result:"Maria, Ana, Antonio"},
			          {id:4, name:"Critical Activities", param:"A,B,C,D,E,F", success:true, result:"A,B,C"},
			          {id:5, name:"Indispensable Participants", param:"H", success:true, result:"Maria, Ana, Antonio"},
			          {id:6, name:"Critical Activities", param:"A,B,C,D,E,F", success:true, result:"A,B,C"},
			          {id:7, name:"Critical Participants", param:"H", success:true, result:"Maria, Ana, Antonio"},
			          {id:8, name:"Critical Activities", param:"A,B,C,D,E,F", success:true, result:"A,B,C"}
			          ];
	$scope.selectedOperation = "";
	$scope.selectedActivity = "";
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
		$scope.selectedOperation = newOp;
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
		return $scope.abbreviation[text];
	};
	
	$scope.showOneActivitySelector = function(){
		return $scope.selectedOperation == 'Potential Participants' || $scope.selectedOperation == 'Basic Consistency';
	};
	
	$scope.showOnePersonSelector = function(){
		return $scope.selectedOperation == 'Potential Activities';
	}; 
	
	$scope.showMultipleActivitySelector = function(){
		return !$scope.showOneActivitySelector() && !$scope.showOnePersonSelector();
	};
	
	
	$scope.createNewAnalysis = function(){
		var action = {id:$scope.nextPerformedActionId, name: $scope.selectedOperation, param:$scope.getParamString(), success:false, result:"waiting"};
		$scope.performedActions[$scope.performedActions.length] = action;
		$scope.nextPerformedActionId++;
		$scope.selectedOperation="";
		$scope.doAnalysis(action);
	};
	
	$scope.getParamString = function (){
		var res="";
		if($scope.showOneActivitySelector()){
			res = $scope.selectedActivity;
		}else if($scope.showOnePersonSelector()){
			res = "";
		}else if($scope.showMultipleActivitySelector()){
			var result = "";
			for(var x in $scope.activitySet){
				if($scope.activitySet[x]==true){
					if(result!=""){
						result+=";";
					}
					result+=x;
				}
			}
			res = result;
		}
		$scope.selectedActivity = "";
		$scope.activitySet = new Array();
		return res;
	};
	
	
	$scope.doAnalysis = function (action){
		$log.info("analysing...");
		   
		try{
			$log.info("getting user token...");
			var path = $scope.getContextPath();
			$http.get(path + "/service/user/token").success(function(token) {
				$log.info("user token obtained successfully...");
				var orgUrl = path + "/service/model/" + token + "/" + $scope.assignments.organizationalModel + "/json";
				var bpmnUrl = path + "/service/model/" + token + "/" + $scope.bpmnModel.modelId + "/xml";
				var operationPath = action.name.toLowerCase().replace(" ","_");
				var url = $scope.getAnalyserPath() + "/rest/analyser/" + operationPath + "/" + $scope.bpmnModel.modelId + "/" + action.param.replace(/;/g,"%3B") + "/RESPONSIBLE?bpmn=" + bpmnUrl + "&organization=" + orgUrl;
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
			});	
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
    	return window.location.origin + "/ral-web-analyser";
    };
    
};


