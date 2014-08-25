function SelectOperationCtrl($scope, $log) {
    this.person = "";
    this.activity = "";
    this.operation = "";
    this.activitySet = new Array();

    this.operationInfo = [
        {   name: "Potential Participants",
            abb:"P.P.",
            description:"Find people who are able to perform an activity.",
            inputType: "oneActivity"
        },
        { name: "Critical Activities", abb:"C.A.", description:"Find the activities which are critical among the chosen activities.", inputType: "multipleActivity"},
        {name: "Potential Activities",abb:"P.A.", description:"Find the activities that can be performed by a person.", inputType: "onePerson"},
        {name: "Basic Consistency",abb:"B.C.", description:"Check if an activity is consistent.", inputType: "oneActivity"},
        {name: "Non Participants",abb:"N.P.", description:"Find the persons who cannot perform any of the chosen activities.", inputType: "multipleActivity"},
        {name: "Critical Participants",abb:"C.P.", description:"Find the persons who perform critical activities.", inputType: "multipleActivity"},
        {name: "Indispensable Participants",abb:"I.P.", description:"Find the persons who are considered indispensable: The ones who perform mandatory critical activities.", inputType: "multipleActivity"}
    ];
}

SelectOperationCtrl.prototype = {

    selectAll: function () {
        var self = this;
		for(var x in self.activitySet){
			self.activitySet[x]=true;
		}
	},

	unselectAll: function () {
	    var self = this;
		for(var x in self.activitySet){
			self.activitySet[x]=false;
		}
	},

	getParamString: function () {
	    var self = this;
		var res="";

		if(self.operation.inputType=='oneActivity'){
			res = self.activity;
		}else if(self.operation.inputType=='onePerson'){
			res = self.person;
		}else if(self.operation.inputType=='multipleActivity'){
			var result = "";
			for(var x in self.activitySet){
				if(self.activitySet[x]==true){
					if(result!=""){
						result+=";";
					}
					result+=x;
					self.activitySet[x]=false;
				}
			}
			res = result;
		}

		self.activity = "";
		self.person = "";

		return res;
	}

}
