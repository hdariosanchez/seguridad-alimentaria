'use strict';

angular.module('proyectoSaludApp')
  .controller('MainCtrl', function ($scope, $http, $localStorage) {

    var baseUrl ="http://lorempixel.com/1366/350";

    $scope.slider = [
      {
        title: "Naturaleza",
        image: baseUrl+"/nature/"
      },
      {
        title: "Buena Alimentacion",
        image: baseUrl+"/food/"
      },
      {
        title: "Deporte es vida",
        image: baseUrl+"/sports/"
      }
    ];

      $scope.logout = function(){
        delete $localStorage.token;
      };


  });
