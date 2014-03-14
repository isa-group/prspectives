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

	
    window.scope = $scope;
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
                
                angular.forEach($scope.bpmnModel.processes, function(p, id) {
                	
                    if (! $scope.assignments[p.processName]){
                        $scope.assignments[p.processName] = {ralAssignment: {}, rasciAssignment: {}};
                    }else{
                    	$scope.findAllPerformers(p.processName);
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
    
    $scope.findAllPerformers = function(processName){
    	var activities = "";
    	var orgId = $scope.assignments.organizationalModel;
        angular.forEach($scope.assignments[processName].ralAssignment, function(ax, aid) {
        	if($scope.checkSyntax(aid,$scope.assignments[processName].ralAssignment[aid])){
        		if(activities!=""){
        			activities += ";";
        		}		
        		activities += aid;
        		document.getElementById("info-" + $scope.getIdFromName(aid)).innerHTML = "<img src=\"common/loading.gif\" />";
        		document.getElementById("info-" + $scope.getIdFromName(aid)).setAttribute("class", "infoResult");
        		document.getElementById("report-" + $scope.getIdFromName(aid)).setAttribute("style", "display:none;");
        	}      
                  
        });
        
        var bpmnId = $scope.bpmnModel.modelId;
        
		var assignJson = JSON.stringify($scope.assignments[processName].ralAssignment);
		var url = $scope.getAnalyserPath() + "/" + bpmnId + "/potential_participants?duty=RESPONSIBLE&activities=" + activities.replace(/;/g,"%3B") + "&organization=" + orgId  + "&assignment=" + assignJson.replace(/{/g,"%7B").replace(/}/g,"%7D");
		$http.get(url).success(function(data) {
			$log.info("analyser success:" + data);
			window.dataResultx = data;
			angular.forEach(data, function(x, act) {
				$scope.buildResult(act, data[act]);
				$scope.setOldAssignmentValue(processName, act, $scope.assignments[processName].ralAssignment[act]);
			});
			
        }).error(function(error){
        	$log.error(error);
        	document.getElementById("info-" + $scope.getIdFromName(activity)).innerHTML = "<span>Error performing the analysis.</span>"; 
        	document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert alert-error infoResult");
        });
        
    };
    
    $scope.findPerformers = function(activity, processName, organizationId){
    	
		var value = $scope.assignments[processName].ralAssignment[activity];
    	var oldValue = $scope.getOldAssignmentValue(processName, activity);
		if(value && value.trim()!=oldValue) {
			value=value.trim();
			document.getElementById("info-" + $scope.getIdFromName(activity)).innerHTML = "<img src=\"common/loading.gif\" />";
			document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "infoResult");
			document.getElementById("report-" + $scope.getIdFromName(activity)).setAttribute("style", "display:none;");
			if($scope.checkSyntax(activity, value)){
				$scope.analyseExpression(activity, processName, organizationId);
				// for those assignments: IS PERSON WHO DID ACTIVITY 'activity' update them
				angular.forEach($scope.assignments[processName].ralAssignment, function(ax, aid) {
		        	if(aid!=activity && $scope.getOldAssignmentValue(processName, aid)!="[auto.cascade]" && $scope.assignments[processName].ralAssignment[aid]=="IS PERSON WHO DID ACTIVITY " + activity){
		        		$scope.setOldAssignmentValue(processName, aid, "[auto.cascade]");
		        		$scope.findPerformers(aid, processName, organizationId);
		        	}      
				});
			
			}
			$scope.setOldAssignmentValue(processName, activity, value);
		} 
    };
    
    $scope.checkSyntax = function(activity, value){

    		var result = false;
			$log.info("checking syntax: " + value);
		    
			try{
				var lexer = new RALLexer(new org.antlr.runtime.ANTLRStringStream(value));
				var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
				var parser = new RALParser(tokens);
				parser.expression();
				result = true;
			}catch(error){
				$log.error(error);
				document.getElementById("info-" + $scope.getIdFromName(activity)).innerHTML = "Invalid Expression!";
				document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert alert-error infoResult");
			}
			return result;
			
    };
    
    $scope.analyseExpression = function(activity, processName, organizationId){
    	
			var bpmnId = $scope.bpmnModel.modelId;
			var assignJson = JSON.stringify($scope.assignments[processName].ralAssignment);
			var url = $scope.getAnalyserPath() + "/" + bpmnId + "/" + activity + "/potential_participants?duty=RESPONSIBLE&organization=" + organizationId  + "&assignment=" + assignJson.replace(/{/g,"%7B").replace(/}/g,"%7D");
			$http.get(url).success(function(data) {
				$log.info("analyser success:" + data);
				
				$scope.buildResult(activity, data);
				
				
	        }).error(function(error){
	        	$log.error(error);
	        	//window.AnaError = error;
	        	var msg = error.match( /<title>(.*)Exception:(.*)<\/title>/ )
	        	
	        	document.getElementById("info-" + $scope.getIdFromName(activity)).innerHTML = "<span>Error performing the analysis.</span><a id=\"link-"+$scope.getIdFromName(activity)+"\" onclick=\"runToggle('report-" + $scope.getIdFromName(activity) + "', 'link-"+$scope.getIdFromName(activity)+"');\"><i class=\"icon-plus-sign\"></i></a>"; 
	        	document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert alert-error infoResult");
	        	document.getElementById("report-" + $scope.getIdFromName(activity)).setAttribute("class", "bs-callout bs-callout-danger");
	        	document.getElementById("report-" + $scope.getIdFromName(activity)).innerHTML = "<div style=\"padding: 15px 20px;\"><h4>Error message:</h4><p>" + msg[msg.length-1]+"</p></div>";
	        });

    };
    
    $scope.buildResult = function(activity, data){
    	document.getElementById("info-" + $scope.getIdFromName(activity)).innerHTML = "<span>" + data.length + " potential performers found.</span><a id=\"link-"+$scope.getIdFromName(activity)+"\" onclick=\"runToggle('report-" + $scope.getIdFromName(activity) + "', 'link-"+$scope.getIdFromName(activity)+"');\"><i class=\"icon-plus-sign\"></i></a>"; 
		var text = "";
		for(var i=0; i<data.length; i++){
			if(text!=""){
				text+=", ";
			}
			text+=data[i];
		}
    	if(data.length==0){
			document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert alert-error infoResult");
			document.getElementById("report-" + $scope.getIdFromName(activity)).setAttribute("class", "bs-callout bs-callout-danger");
			text = "<div style=\"padding: 15px 20px;\"><h4>Consistency failure</h4><p>This assignment is not consistent. Please, modify the assignment expression.</p></div>";
		}else if(data.length==1){
			document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert infoResult");
			document.getElementById("report-" + $scope.getIdFromName(activity)).setAttribute("class", "bs-callout bs-callout-warning");
			text = "<div style=\"padding: 15px 20px;\"><h4>Critical Task</h4><p>This task is critical. Only one potential performer found: " + text + ". Having only one potential performer is not recommendable.</p></div>";
		}else{
			document.getElementById("info-" + $scope.getIdFromName(activity)).setAttribute("class", "alert alert-success infoResult");
			document.getElementById("report-" + $scope.getIdFromName(activity)).setAttribute("class", "bs-callout bs-callout-info");
			text = "<div style=\"padding: 15px 20px;\"><h4>Assignment checked</h4><p>Potential performers found: " + text + ".</p></div>";
		}
		
		document.getElementById("report-" + $scope.getIdFromName(activity)).innerHTML = text;
    };
    
    $scope.getContextPath = function(){
    	var path = window.location.origin;
    	path += window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    	return path;
    };
    
    $scope.getAnalyserPath = function(){
    	return  $scope.getContextPath() + "/analyser";
    };
    
    $scope.getIdFromName = function (name){
    	return name.toLowerCase().replace(/ /g,"_");
    };
};


