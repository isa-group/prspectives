var MODELHANDLER_MODELS_URL = "service/models/";
var MODELHANDLER_MODEL_URL = "service/model/";

angular.module('prspectives.modelHandler', ['ngResource'])
  .factory('Models', ['$resource', function($resource) {
    var baseUrl = typeof ORYX == "undefined" ? MODELHANDLER_MODELS_URL : ORYX.CONFIG.MODEL_LIST_URL;

    return $resource(baseUrl + ':id',
        {id: '@modelId'},
        {updateShares: {method: 'PUT', url: baseUrl + ':id/share'}}
    );
  }]);
