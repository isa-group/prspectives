window.alertProxy = window.alert;
window.alert = function(message){
	throw message;
};

angular.module('ralApp', ['navbarModule','loginModule','ui.bootstrap'])
.filter('array', function() {
  return function(items) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
   return filtered;
  };
});

function AssignmentCtrl($scope, $http, $log) {

    $scope.rasciRoles = {
        "responsible": "R",
        "accountable": "A",
        "support": "S",
        "consulted": "C",
        "informed": "I"
    };

	
    
    $scope.rasciCell = null;

    $scope.loadCell = function(data) {
        if (!data.assignment[data.activity])
            data.assignment[data.activity] = [];

        var cell = {assign: data.assignment[data.activity], role: data.role, activity: data.activity};

        angular.forEach($scope.rasciRoles, function(abbr, role) {
            cell[role] = {enabled: false, binding: ""};
        });

        angular.forEach(data.assignment[data.activity], function(boundRole) {
            if (boundRole.role == data.role) {
                cell[boundRole.type] = {enabled: true, binding: boundRole.bindingExpression};
            }
        });

        $scope.rasciCell = cell;
    };

    $scope.saveCell = function(cell) {
        var assign = cell.assign;

        var i = assign.length;
        while(i--) {
            if (assign[i].role == cell.role) {
               assign.splice(i,1);
            }
        }

        angular.forEach($scope.rasciRoles, function(abbr, rasciRole) {
            if (cell[rasciRole].enabled) {
                assign.push({type: rasciRole, role: cell.role, bindingExpression: cell[rasciRole].binding});
            }
        });

        $scope.rasciCell = null;
    };

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
                var timeMillis = 10;
                angular.forEach($scope.bpmnModel.processes, function(p, id) {
                	
                    if (! $scope.assignments[p.processName]){
                        $scope.assignments[p.processName] = {ralAssignment: {}, rasciAssignment: {}};
                    }else{
                    	angular.forEach($scope.assignments[p.processName].ralAssignment, function(ax, aid) {
	                    	window.setTimeout(function() {
	                    		  $scope.checkSyntax(aid,p.processName,$scope.assignments.organizationalModel);
	                    		  timeMillis += 100;
	                    	}, timeMillis);
                    	});
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


    $scope.save = function () {
        $log.info("Saving model...");
        $log.info($scope.raw);
        $http.put($scope.navbar.currentModel.url+"/json", $scope.raw);
    };
    
    $scope.getOldAssignmentValue = function(processName,activity){
    	var result = "";
    	if($scope.oldAssignments && $scope.oldAssignments[processName] && $scope.oldAssignments[processName].ralAssignment[activity]){
    		 result = $scope.oldAssignments[processName].ralAssignment[activity];
    	}
    	return result;
    };
    
    $scope.setOldAssignmentValue = function(processName,activity, value){
    	if($scope.oldAssignments==null){
    		$scope.oldAssignments = new Array();
    	}
    	if($scope.oldAssignments[processName]==null){
    		$scope.oldAssignments[processName] = {ralAssignment: new Array()};
    	}
    	$scope.oldAssignments[processName].ralAssignment[activity] = value;
    };
    
    $scope.checkSyntax = function(activity, processName, organizationId){

    	var value = $scope.assignments[processName].ralAssignment[activity];
    	var oldValue = $scope.getOldAssignmentValue(processName, activity);
		  if(value && value.trim()!=oldValue) {
			  value=value.trim();
			  $scope.setOldAssignmentValue(processName, activity, value);
			$log.info("checking syntax: " + value);
		    document.getElementById("info-" + activity).innerHTML = "<img src=\"common/loading.gif\" />";
			document.getElementById("info-" + activity).setAttribute("class", "infoResult");
			try{
				var lexer = new RALLexer(new org.antlr.runtime.ANTLRStringStream(value));
				var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
				var parser = new RALParser(tokens);
				parser.expression();
				$log.info("getting user token...");
				var path = $scope.getContextPath();
				$http.get(path + "/service/user/token").success(function(token) {
					$log.info("user token obtained successfully...");
		            
					var orgUrl = path + "/service/model/" + token + "/" + organizationId + "/json";
					var bpmnUrl = path + "/service/model/" + token + "/" + $scope.bpmnModel.modelId + "/xml";
					var url = $scope.getAnalyserPath() + "/rest/analyser/check_participants_for_expression/" + $scope.bpmnModel.modelId + "/" + activity + "/RESPONSIBLE?bpmn=" + bpmnUrl + "&organization=" + orgUrl + "&expression=" + value;
					$http.get(url).success(function(data) {
						$log.info("analyser success:" + data);
						document.getElementById("info-" + activity).innerHTML = "<span>" + data.length + " potential performers found.</span><a id=\"link-"+activity+"\" onclick=\"runToggle('report-" + activity + "', 'link-"+activity+"');\"><i class=\"icon-plus-sign\"></i></a>"; 
						var text = "";
						for(var i=0; i<data.length; i++){
							if(text!=""){
								text+=", ";
							}
							text+=data[i];
						}
						
						
						if(data.length==0){
							document.getElementById("info-" + activity).setAttribute("class", "alert alert-error infoResult");
							document.getElementById("report-" + activity).setAttribute("class", "bs-callout bs-callout-danger");
							text = "<div style=\"padding: 15px 20px;\"><h4>Consistency failure</h4><p>This assignment is not consistent. Please, modify the assignment expression.</p></div>";
						}else if(data.length==1){
							document.getElementById("info-" + activity).setAttribute("class", "alert infoResult");
							document.getElementById("report-" + activity).setAttribute("class", "bs-callout bs-callout-warning");
							text = "<div style=\"padding: 15px 20px;\"><h4>Critical Task</h4><p>This task is critical. Only one potential performer found: " + text + ". Having only one potential performer is not recommendable.</p></div>";
						}else{
							document.getElementById("info-" + activity).setAttribute("class", "alert alert-success infoResult");
							document.getElementById("report-" + activity).setAttribute("class", "bs-callout bs-callout-info");
							text = "<div style=\"padding: 15px 20px;\"><h4>Assignment checked</h4><p>Potential performers found: " + text + ".</p></div>";
						}
						
						document.getElementById("report-" + activity).innerHTML = text;
			        }).error(function(error){
			        	$log.error(error);
			        	document.getElementById("info-" + activity).innerHTML = "<span>Error performing the analysis.</span>"; 
			        	document.getElementById("info-" + activity).setAttribute("class", "alert alert-error infoResult");
			        });
		        });
				
			}catch(error){
				$log.error(error);
				document.getElementById("info-" + activity).innerHTML = "Invalid Expression!";
				document.getElementById("info-" + activity).setAttribute("class", "alert alert-error infoResult");
			}
			
			 
		  }
    };
    
    $scope.getContextPath = function(){
    	var path = window.location.origin;
    	path += window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    	return path;
    };
    
    $scope.getAnalyserPath = function(){
    	return window.location.origin + "/ral-web-analyser";
    };
    
};


