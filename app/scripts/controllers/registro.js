'use strict';

angular.module('proyectoSaludApp')
  .controller('RegistroCtrl', function ($scope, MyAPIServiceFactory) {

        var urlUsuarioGuardar = '/api/registro';

      $scope.usuario = {
          "str_nick":"",
          "str_contrasena":"",
          "str_nombre":"",
          "str_apellido":"",
          "str_email":"",
          "str_telefono":"",
          "str_sexo":"",
          "d_fecha_nacimiento":"",
          "str_estado":"PENDIENTE"
      };

    $scope.registrar = function () {
        MyAPIServiceFactory.obtener(urlUsuarioGuardar, $scope.usuario)
            .success(function (exito) {
                confirm('Ingreso de usuario correcto '+JSON.stringify(exito))
            })
            .error(function (err) {
                alert('Error en el ingreso del nuevo usuario '+err);
            });
    };

    $scope.incorrectaContrasena = function(){
        if($scope.usuario.str_contrasena === $scope.usuario.str_confirmar){
            return false;
        } else{
            return true;
        }
    };

        $scope.correctaContrasena = function(){
            if($scope.usuario.str_contrasena === $scope.usuario.str_confirmar){
                return true;
            } else{
                return false;
            }
        };
  });
