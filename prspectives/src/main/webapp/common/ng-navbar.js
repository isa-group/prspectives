angular.module('navbarModule', ['loginModule', 'prspectives.modelHandler', 'ui.bootstrap'])
  .directive('topbar', ['$rootScope', '$location', '$http', '$window', 'Models', function($rootScope, $location, $http, $window, Models){
    return {
      restrict: 'EC',
      replace: true,
      scope: {title: '@', navbar: '=context'},
      template: '    <div class="navbar navbar-fixed-top">'+
                         '<div class="navbar-inner">       '+
                     '        <div class="container">        '+
                     '            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">'+
                     '                <span class="icon-bar"></span>                                                                '+
                     '                <span class="icon-bar"></span>                                                                  '+
                     '                <span class="icon-bar"></span>                                                                    '+
                     '            </button>                     '+
                     '            <span class="brand">PRspectives</span>'+
                     '            <div class="nav-collapse collapse">        '+
                     '                <ul class="nav">                         '+
                     '                    <li><a ng-href="{{indexUrl}}">Models</a></li>'+
                     '                    <li ng-show="navbar.currentModel"><a><b class="icon-chevron-right"></b></a></li>'+
                     '                    <li ng-show="navbar.currentModel" class="dropdown">                             '+
                     '                        <a href="" class="dropdown-toggle">                   '+
                     '                            {{navbar.currentModel.name}} <b class="caret"></b>'+
                     '                        </a>                                                  '+
                     '                        <ul class="dropdown-menu">                            '+
                     '                            <li ng-repeat="m in navbar.models">               '+
                     '                                <a ng-href="{{m.links.editor}}">{{m.name}}</a>   '+
                     '                            </li>                                             '+
                     '                        </ul>                                                 '+
                     '                    </li>                                                     '+
                     '                    <li ng-show="navbar.currentModel"><a><b class="icon-chevron-right"></b></a></li>        '+
                     '                    <li ng-show="navbar.currentModel" class="dropdown">                                     '+
                     '                        <a href="" class="dropdown-toggle">                           '+
                     '                            {{title}} <b class="caret"></b>                   '+
                     '                        </a>                                                  '+
                     '                        <ul class="dropdown-menu">                            '+
                     '                            <li ng-repeat="(name, url) in navbar.currentModel.links">'+
                     '                                <a ng-href="{{url}}">{{name}}</a>             '+
                     '                            </li>                                              '+
                     '                        </ul>                                                  '+
                     '                    </li>                                                      '+
                     '                </ul>                                                          '+
                     '                                                                               '+
                     '                <ul class="nav pull-right">                                    '+
                     '                    <li><a href="" ng-click="openAbout()">About</a></li>                        '+
                     '                    <li class="divider-vertical"></li>                         '+
                     '                    <li class="login" title="Log in">                          '+
                     '                        <a class="btn btn-primary btn-block" href="socialauth.do?id=googleplus" id="sign-in-google">Sign In with Google</a>'+
                     '                        <a class="btn btn-primary btn-block" href="socialauth.do?id=facebook" id="sign-in-facebook">Sign In with Facebook</a>'+
                     '                    </li>'+
                     '                </ul>    '+
                     '            </div>       '+
                     '        </div>           '+
                     '    </div>               '+
                     '</div>',
      controller: function ($scope, $modal) {
        var baseUrl;
        $scope.navbar = {currentModel: null};

        if (typeof ORYX === "undefined") {
            baseUrl = "";

            // Loads the current model
            $scope.$watch(function() {return $location.path();}, function(path) {
                var modelId = path.substr(1);
                $scope.navbar.currentModelId = modelId;
                updateModel();
            });
        } else {
            baseUrl = "../";

            // Loads the current model using the same mechanism as Oryx code (main.js line 61)
            $scope.navbar.currentModelId = $window.location.search.substring(4);
            updateModel();
        }

        $scope.indexUrl = baseUrl + "index.html";

        // Loads the list of models

        Models.query(function(data) {
            $scope.navbar.models = {};
            angular.forEach(data, function(info) {
                $scope.navbar.models[info.modelId] = info;
            });
            //$scope.navbar.models = data;
            updateModel();
        })

        $scope.openAbout = function () {
            var modalInstance = $modal.open({
              templateUrl: baseUrl + 'common/ng-navbar-about.html',
              controller: AboutInstanceCtrl
            });
        }

        var AboutInstanceCtrl = function($scope, $modalInstance) {
            $scope.ok = function () {
                $modalInstance.close();
            }
        }

        function updateModel() {
            if ($scope.navbar.modelsMap && $scope.navbar.currentModelId) {
                $scope.navbar.currentModel = $scope.navbar.models[$scope.navbar.currentModelId];
            }
        }
      }
    }
  }]);