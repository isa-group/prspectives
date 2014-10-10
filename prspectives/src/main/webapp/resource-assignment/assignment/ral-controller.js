/*
 * RALCtrl - Controller for the RAL editor
 */

function RALCtrl($scope, $http, $log) {
    this.scope = $scope;
    this.http = $http;
    this.log = $log;
    this.oldAssignments = new Array();
    this.analysis = {};

    var self = this;

    $scope.$watch("process", function(process) {
        if (process)  {
            self.process = process;
            self.orgId = self.scope.assignments.organizationalModel;
            self.assignments = self.scope.assignments[process.processName].ralAssignment;
            self.analyser = new Analyser(process, self.http, self.log);

            self.findAllPerformers(process);
        }
    });


}

RALCtrl.prototype.getOldAssignmentValue = function(processName,activity){
    var result = "";
    if(this.oldAssignments[processName] && this.oldAssignments[processName].ralAssignment[activity]){
         result = this.oldAssignments[processName].ralAssignment[activity];
    }
    return result;
};

RALCtrl.prototype.setOldAssignmentValue = function(processName,activity, value){
    if(this.oldAssignments[processName]==null){
        this.oldAssignments[processName] = {ralAssignment: new Array()};
    }
    this.oldAssignments[processName].ralAssignment[activity] = value;
};

RALCtrl.prototype.findAllPerformers = function(process){
    var self = this;
    var processName = process.processName;
    var activitiesToAnalyse = [];

    angular.forEach(self.assignments, function(ax, aid) {
        self.analysis[aid] = new AnalysisInfo();
        if(self.checkSyntax(aid, self.assignments[aid])){
            activitiesToAnalyse.push(aid);
            self.analysis[aid].setLoading();
        }
    });

    this.analyser.potentialParticipants(activitiesToAnalyse, self.orgId, self.assignments).success(function(data) {
        self.log.info("analyser success:" + data);
        angular.forEach(data, function(x, act) {
            self.buildResult(act, data[act]);
            self.setOldAssignmentValue(processName, act, self.assignments[act]);
        });

    }).error(function(error){
        self.log.error(error);
    });


};

RALCtrl.prototype.findPerformers = function(activity, processName, organizationId){
    var self = this;
    var value = this.assignments[activity];
    var oldValue = this.getOldAssignmentValue(processName, activity);

    if(value && value.trim() != oldValue) {
        value = value.trim();

        this.analysis[activity] = new AnalysisInfo();
        this.analysis[activity].setLoading();

        if(this.checkSyntax(activity, value)){
            this.analyseExpression(activity, processName, organizationId);
            this.updateDependentExpressions(activity, processName, organizationId);
        }
        this.setOldAssignmentValue(processName, activity, value);
    }
};

RALCtrl.prototype.updateDependentExpressions = function(activity, processName, organizationId) {
    var self = this;

    angular.forEach(this.assignments, function(ax, aid) {
        if(aid!=activity &&
           self.getOldAssignmentValue(processName, aid)!="[auto.cascade]" &&
           self.assignments[aid]=="IS PERSON WHO DID ACTIVITY " + activity) {
                self.setOldAssignmentValue(processName, aid, "[auto.cascade]");
                self.findPerformers(aid, processName, organizationId);
        }
    });
}

RALCtrl.prototype.checkSyntax = function(activity, value){
    var result = false;
    this.log.info("checking syntax: " + value);

    try{
        var lexer = new RALLexer(new org.antlr.runtime.ANTLRStringStream(value));
        var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
        var parser = new RALParser(tokens);
        parser.expression();
        result = true;
    }catch(error){
        this.log.error(error);
        this.analysis[activity].setError("Invalid Expression!");
    }
    return result;
};

RALCtrl.prototype.runToggle = function (activity) {
    this.analysis[activity].toggleReport();
}

RALCtrl.prototype.analyseExpression = function(activity, processName, organizationId){
    var self = this;
    var log = this.log;

    this.analyser.potentialParticipants([activity], organizationId, this.assignments)
        .success(function(data) {
            log.info("analyser success:" + data);
            self.buildResult(activity, data[activity]);
        })
        .error(function(error, code){
            var body = "";
            log.error(error);
            if (code == 500) {
                var msg = error.match( /<title>(.*)Exception:(.*)<\/title>/ );
                body = msg[msg.length-1];
            } else if (code == 404) {
                body = "Operation not available";
            }
            self.analysis[activity].setError("Error performing the analysis.", {title: "Error message", body: body});
        });

};

RALCtrl.prototype.buildResult = function(activity, data){
    var info = data.length + " potential performers found.";

    var text = "";
    for(var i=0; i<data.length; i++){
        if(text!=""){
            text+=", ";
        }
        text+=data[i];
    }

    if(data.length==0){
        this.analysis[activity].setError(info, {title: "Consistency failure", body: "This assignment is not consistent. Please, modify the assignment expression."});
    }else if(data.length==1){
        this.analysis[activity].setWarning(info, {title: "Critical task", body: "This task is critical. Only one potential performer found: " + text + ". Having only one potential performer is not recommended."});
    }else{
        this.analysis[activity].setSuccess(info, {title: "Assignment checked", body: "Potential performers found: " + text + "."});
    }
};

RALCtrl.prototype.getContextPath = function(){
    var path = window.location.origin;
    path += window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
    return path;
};

RALCtrl.prototype.getAnalyserPath = function(){
    return  this.getContextPath() + "/analyser";
};

RALCtrl.prototype.getIdFromName = function (name){
    return name.toLowerCase().replace(/ /g,"_");
};


// Analyser class -----------------------------------

function Analyser(process, $http, $log) {
    this.http = $http;
    this.log = $log;
    this.process = process;
    this.analyserPath = process.modelInfo.modelLinks.resources + "/" + process.processId;
}

Analyser.prototype.potentialParticipants = function(activitiesToAnalyse, orgId, assignments) {
    var url = this.analyserPath + "/potential_participants";
    return this.http.post(url, {
        organization: orgId,
        assignment: assignments,
        activities: activitiesToAnalyse
    });
}

// AnalysisInfo class   ------------------------------

function AnalysisInfo() {
    this.reset();
    this.reportToggle = false;
}

AnalysisInfo.prototype.reset = function() {
    this.isLoading = false;
    this.error = false;
    this.warning = false;
    this.success = false;
    this.info = null;
    this.report = null;
}

AnalysisInfo.prototype.isError = function() {
    return this.error;
}

AnalysisInfo.prototype.showReport = function() {
    return this.report && this.reportToggle;
}

AnalysisInfo.prototype.toggleReport = function() {
    this.reportToggle = ! this.reportToggle;
}

AnalysisInfo.prototype.setLoading = function() {
    this.reset();
    this.isLoading = true;
}

AnalysisInfo.prototype.setError = function(info, report) {
    this.reset();
    this.error = true;
    this.info = info;
    this.report = report;
}

AnalysisInfo.prototype.setWarning = function(info, report) {
    this.reset();
    this.warning = true;
    this.info = info;
    this.report = report;
}

AnalysisInfo.prototype.setSuccess = function(info, report) {
    this.reset();
    this.success = true;
    this.info = info;
    this.report = report;
}
