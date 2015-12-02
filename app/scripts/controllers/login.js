'use strict';

angular.module('proyectoSaludApp')
  .controller('LoginCtrl', function ($scope, $http, $window, $location, UserAuthFactory, AuthenticationFactory) {

      $scope.user = {
        username: '',
        password: ''
      };
      $scope.nick = $window.sessionStorage.user;
      $scope.rol = $window.sessionStorage.userRole;
      $scope.actualizar = $window.sessionStorage.actualizar;
      $scope.login = function() {
        var username = $scope.user.username,
            password = $scope.user.password;

        if (username !== undefined && password !== undefined) {
          UserAuthFactory.login(username, password).success(function(data) {

            AuthenticationFactory.isLogged = true;
            AuthenticationFactory.user = data.user.str_nick;
            AuthenticationFactory.userRole = data.user.rol;
            $window.sessionStorage.token = data.token;
            $window.sessionStorage.user = data.user.str_nick;// to fetch the user details on refresh
            $window.sessionStorage.userRole = data.user.rol; // to fetch the user details on refresh
            $window.sessionStorage.userName = data.user.usuario;
            $window.sessionStorage.userId = data.user.int_id;
            $window.sessionStorage.actualizar = true;
            $window.location.replace("/");
          }).error(function(status) {
            alert('No se a podido acceder, es posible que las credenciales sean incorrectas o exista algún problema externo.');
          });
        } else {
          alert('Error: Credenciales Inválidas');
        }
      };
      $scope.logout = function(){
          UserAuthFactory.logout();
          $window.location.replace("/");
      }

  });
