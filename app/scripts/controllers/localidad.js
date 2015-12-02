'use strict';

angular.module('proyectoSaludApp')
  .controller('LocalidadCtrl', function ($scope, $http, MyAPIServiceFactory, datosvistaEncuestaCanton) {

      var urlGuardarCanton = '/api/user/admin/canton/guardar';
      var urlGuardarParroquia = '/api/user/admin/parroquia/guardar';
      var urlGuardarComunidad = '/api/user/admin/comunidad/guardar';

        var urlObtenerParroquia = '/api/user/parroquiaFiltrado';
        var urlObtenerComunidad = '/api/user/comunidadFiltrado';


      $scope.canton = {
        'int_id_canton':'',
        'str_descripcion':''
      };

      $scope.parroquia = {
        'int_id_canton':'',
        'int_id_parroquia':'',
        'str_descripcion':''
      };

      $scope.comunidad = {
        'int_id_canton':'',
        'int_id_parroquia':'',
        'int_id_comunidad':'',
        'str_descripcion':''
      };

        $scope.validarComboBox = function(combo){
            if(combo.value == null || combo.value == ""){
                return true;
            } else{
                return false;
            }
        };

      $scope.guardarCanton = function () {

        MyAPIServiceFactory.obtener(urlGuardarCanton, $scope.canton)
            .success(function (exito) {
                datosvistaEncuestaCanton.get().success(function(datos){
                    $scope.listadoCanton = datos;
                }).error(function(err){
                    console.log('Error en el servicio datosvistaEncuestaCanton!!! mensaje de log en controlador vistaEncuesta');
                });
              alert('Exito al ingresar el cantón '+ JSON.stringify(exito));
            })
            .error(function (err) {
              alert('Error al ingresar el canton '+JSON.stringify(err))
            });
      };

      $scope.guardarParroquia = function () {

        MyAPIServiceFactory.obtener(urlGuardarParroquia, $scope.parroquia)
            .success(function (exito) {
              alert('Exito al ingresar el parroquia '+ JSON.stringify(exito));
            })
            .error(function (err) {
              alert('Error al ingresar el parroquia '+JSON.stringify(err))
            });
      };

      $scope.guardarComunidad = function () {

        MyAPIServiceFactory.obtener(urlGuardarComunidad, $scope.comunidad)
            .success(function (exito) {
              alert('Exito al ingresar el comunidad '+ JSON.stringify(exito));
            })
            .error(function (err) {
              alert('Error al ingresar el comunidad '+ JSON.stringify(err));
            });
      };


        datosvistaEncuestaCanton.get().success(function(datos){
            $scope.listadoCanton = datos;
        }).error(function(err){
            console.log('Error: localidad / Servicio datosvistaEncuestaCanton');
        });

        $scope.$watch('modeloCantonSimple', function(newValue, oldValue) {
            $scope.parroquia.int_id_canton = newValue.int_id;
        });

        $scope.$watch('modeloCanton', function(newValue, oldValue) {
            $scope.comunidad.int_id_canton = newValue.int_id;
            MyAPIServiceFactory.obtener(urlObtenerParroquia, newValue)
                .success(function(datos){
                    $scope.listadoParroquia = datos;
                }).error(function(err){
                    console.log('Error en el servicio datosvistaEncuestaParroquia!!! mensaje de log en controlador vistaEncuesta');
                });
        });

        $scope.$watch('modeloParroquia', function(newValue, oldValue) {
            $scope.comunidad.int_id_parroquia = newValue.int_id;
            MyAPIServiceFactory.obtener(urlObtenerComunidad, newValue)
                .success(function(datos){
                    $scope.listadoComunidad = datos;
                }).error(function(err){
                    console.log('Error en el servicio datosvistaEncuestaParroquia!!! mensaje de log en controlador vistaEncuesta');
                });
        });


    });
