'use strict';

angular.module('proyectoSaludApp')
  .controller('EncuestainformacionCtrl', function ($scope, $http, compartirDatos, $window) {
      $http.get('/api/user/admin/encuesta/inactivo').success(function(awesomeThings) {
        $scope.listadoEncuesta = awesomeThings;
      });

      $scope.encuestaSeleccion = function (encuesta) {
        compartirDatos.get(encuesta);
      };

      $scope.tester = function () {
        alert(JSON.stringify(JSON.parse($window.localStorage.getItem('encuestaInactiva'))));
      }
  });

