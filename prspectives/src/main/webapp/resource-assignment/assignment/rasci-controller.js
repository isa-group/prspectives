/*
 * RASCICtrl - Controller for the RASCI matrix editor
 */

function RASCICtrl($scope, $log) {
    this.scope = $scope;
    this.log = $log;
    this.rasciRoles = {
      "responsible": "R",
      "accountable": "A",
      "support": "S",
      "consulted": "C",
      "informed": "I"
    };
    this.rasciCell = null;
}

RASCICtrl.prototype.loadCell = function(data) {
    if (!data.assignment[data.activity])
        data.assignment[data.activity] = [];

    var cell = {
        assign: data.assignment[data.activity],
        role: data.role,
        activity: data.activity
    };

    angular.forEach(this.rasciRoles, function(abbr, role) {
        cell[role] = {enabled: false, binding: ""};
    });

    angular.forEach(data.assignment[data.activity], function(boundRole) {
        if (boundRole.role == data.role) {
            cell[boundRole.type] = {enabled: true, binding: boundRole.bindingExpression};
        }
    });

    this.rasciCell = cell;
};

RASCICtrl.prototype.saveCell = function() {
    var cell = this.rasciCell;
    var assign = cell.assign;

    var i = assign.length;
    while(i--) {
        if (assign[i].role == cell.role) {
           assign.splice(i,1);
        }
    }

    angular.forEach(this.rasciRoles, function(abbr, rasciRole) {
        if (cell[rasciRole].enabled) {
            assign.push({type: rasciRole, role: cell.role, bindingExpression: cell[rasciRole].binding});
        }
    });

    this.rasciCell = null;
};

RASCICtrl.prototype.cancelDetails = function() {
    this.rasciCell = null;
};

RASCICtrl.prototype.showDetails = function() {
    return this.rasciCell;
};

RASCICtrl.prototype.depict = function(data) {
    var result = [];
    var rasciRoles = this.rasciRoles;

    angular.forEach(data.assignment[data.activity], function(boundRole) {
        if (boundRole.role == data.role) {
            result.push(rasciRoles[boundRole.type]);
        }
    });

    return result.join(" / ");
};

RASCICtrl.prototype.depictDetails = function(data) {
    var result = [];
    angular.forEach(data.assignment[data.activity], function(boundRole) {
        if (boundRole.role == data.role) {
            result.push(boundRole.type + ": " + boundRole.bindingExpression);
        }
    });

    return result.join("<br/>");
};
