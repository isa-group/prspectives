function BPMNModel(modelInfo) {
    this.modelId = modelInfo.modelId;
    this.url = modelInfo.modelLinks.process;
    this.modelInfo = modelInfo;
    this.processes = {};
}

jQuery.extend(BPMNModel.prototype, {
	load: function() {
		var that = this;
		return $.ajax({
			type: "GET",
			url: that.url,
			dataType: "json",
			success: function(data) {
			    $(data).each(function() {
			        var process = new Process(that.modelInfo);
			        process.load(this);
                    that.processes[this.id] = process;
			    });
			}
		});
	}
});

function Process(modelInfo) {
    this.modelInfo = modelInfo;
    this.modelId = modelInfo.modelId;
    this.modelUrl = modelInfo.modelLinks.process;
    this.processId = "";
	this.processName = "";
	this.processNames = [];
	this.processStates = ["Start", "Cancel","End"];
	this.activities = [];
	this.activityNames = [];
	this.activityNameId = {};
	this.activityIdName = {};
	this.activityStates = ["Start", "Cancel","End"];
	this.eventNames = [];
	this.dataObjectNames= [];
	this.dataObjectPropertyNames = [];
	this.dataObjectState= [];

	this.id = {};
}

jQuery.extend(Process.prototype, {
	load: function(data) {
	    this.processId = data.id;
	    this.processName = data.name;
	    this.processNames = [data.name];
        this.loadActivities(data.activities);
        this.loadEvents(data.events);
        this.loadDataObjects(data.dataObjects);
	},

	loadActivities: function(data) {
	    var that = this;
        $(data).each(function (index) {
            if (this.name == "") {
                this.name = this.id;
            }
            that.activities.push(this.id);
            that.activityNames.push(this.name);
            that.activityIdName[this.id] = this.name;
            that.activityNameId[this.name] = this.id;
            that.id[this.id] = {name: this.name, type: "activity"};
        });
	},

	loadEvents: function(data) {
		var that = this;
        $(data).each(function (index) {
            if (this.name == "") {
                this.name = this.id;
            }
            that.eventNames.push(this.name);
            that.id[this.id] = {name: this.name, type: "event"};
        });
	},

	loadDataObjects: function(data) {
		var that = this;
        $(data).each(function (index) {
            if (this.name == "") {
                this.name = this.id;
            }
            that.dataObjectNames.push(this.name);
            that.id[this.id] = {name: this.name, type: "data object"};
        });
	},

	isActivity: function(id) {
		var result = false;

		if (typeof this.activityIdName[id] != "undefined")
			result = true;

		return result;
	}
});
