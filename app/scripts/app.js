'use strict';

var proyectoSaludApp = angular.module('proyectoSaludApp', [
  'ui.grid',
  'ui.grid.edit',
  'ui.grid.selection',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngGrid',
  'angularModalService',
  'ui.tree',
  'ngStorage',
  'gg.editableText',
  'ui.bootstrap'
])
  .config(function ($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
      $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
          access: {
              requiredLogin: false
          }
      })
      .when('/pregunta', {
        templateUrl: 'views/pregunta.html',
        controller: 'PreguntaCtrl',
          access: {
              requiredLogin: true
          }
      })
      .when('/vistaEncuesta', {
        templateUrl: 'views/vistaEncuesta.html',
        controller: 'VistaencuestaCtrl',
          access: {
              requiredLogin: true
          }
      })
      .when('/error404', {
        templateUrl: 'views/error404.html',
        controller: 'Error404Ctrl',
          access: {
              requiredLogin: false
          }
      })
      .when('/encuesta', {
        templateUrl: 'views/encuesta.html',
        controller: 'EncuestaCtrl',
          access: {
              requiredLogin: true
          }
      })
      .when('/variable', {
        templateUrl: 'views/variable.html',
        controller: 'VariableCtrl',
          access: {
              requiredLogin: true
          }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
          access: {
              requiredLogin: false
          }
      })
      .when('/registro', {
        templateUrl: 'views/registro.html',
        controller: 'RegistroCtrl',
          access: {
              requiredLogin: false
          }
      })
      .when('/editarEncuesta', {
        templateUrl: 'views/editarEncuesta.html',
        controller: 'EditarencuestaCtrl',
              access: {
                  requiredLogin: true
              }
      })
      .when('/encuestaInformacion', {
        templateUrl: 'views/encuestaInformacion.html',
        controller: 'EncuestainformacionCtrl',
              access: {
                  requiredLogin: true
              }
      })
      .when('/localidad', {
        templateUrl: 'views/localidad.html',
        controller: 'LocalidadCtrl',
              access: {
                  requiredLogin: true
              }
      })
      .when('/solicitudes', {
        templateUrl: 'views/solicitudes.html',
        controller: 'SolicitudesCtrl'
      })
      .when('/producto', {
        templateUrl: 'views/producto.html',
        controller: 'ProductoCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
    .run(function($rootScope, $window, $location, AuthenticationFactory) {
        // when the page refreshes, check if the user is already logged in
        AuthenticationFactory.check();

        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
                $location.path("/");
            } else {
                // check if user object exists else fetch it. This is incase of a page refresh
                if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
                if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
            }
        });

        $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
            $rootScope.showMenu = AuthenticationFactory.isLogged;
            $rootScope.role = AuthenticationFactory.userRole;
            // if the user is already logged in, take him to the home page
            if (AuthenticationFactory.isLogged == true && $location.path() == '/') {
                $location.path('/');
            }
        });
    });

//function AlertsCtrl(e){e.alerts=[{type:"success",msg:"Thanks for visiting! Feel free to create pull requests to improve the dashboard!"},{type:"danger",msg:"Found a bug? Create an issue with as many details as you can."}],e.addAlert=function(){e.alerts.push({msg:"Another alert!"})},e.closeAlert=function(t){e.alerts.splice(t,1)}}angular.module("proyectoSaludApp").controller("AlertsCtrl",["$scope",AlertsCtrl]);
function DashboardCtrl(t,e){var o=992;t.getWidth=function(){return window.innerWidth},t.$watch(t.getWidth,function(g,n){t.toggle=g>=o?angular.isDefined(e.get("toggle"))?e.get("toggle")?!0:!1:!0:!1}),t.toggleSidebar=function(){t.toggle=!t.toggle,e.put("toggle",t.toggle)},window.onresize=function(){t.$apply()}}angular.module("proyectoSaludApp").controller("DashboardCtrl",["$scope","$cookieStore",DashboardCtrl]);
function rdLoading(){var d={restrict:"AE",template:'<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'};return d}angular.module("proyectoSaludApp").directive("rdLoading",rdLoading);
function rdWidgetBody(){var d={requires:"^rdWidget",scope:{loading:"@?",classes:"@?"},transclude:!0,template:'<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',restrict:"E"};return d}angular.module("proyectoSaludApp").directive("rdWidgetBody",rdWidgetBody);
function rdWidgetFooter(){var e={requires:"^rdWidget",transclude:!0,template:'<div class="widget-footer" ng-transclude></div>',restrict:"E"};return e}angular.module("proyectoSaludApp").directive("rdWidgetFooter",rdWidgetFooter);
function rdWidgetTitle(){var i={requires:"^rdWidget",scope:{title:"@",icon:"@"},transclude:!0,template:'<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',restrict:"E"};return i}angular.module("proyectoSaludApp").directive("rdWidgetHeader",rdWidgetTitle);
function rdWidget(){var d={transclude:!0,template:'<div class="widget" ng-transclude></div>',restrict:"EA"};return d}angular.module("proyectoSaludApp").directive("rdWidget",rdWidget);
