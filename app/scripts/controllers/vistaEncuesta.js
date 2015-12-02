'use strict';

  angular.module('proyectoSaludApp')
    .controller('VistaencuestaCtrl', function ($scope, $http, datosvistaEncuestaCanton, MyAPIServiceFactory, $window) {

        $http.get('/api/user/encuesta').success(function(awesomeThings) {
      $scope.listadoEncuesta = awesomeThings;
    });

        var urlObtenerParroquia = '/api/user/parroquiaFiltrado';
        var urlObtenerComunidad = '/api/user/comunidadFiltrado';

        $scope.visibleEncuesta = false;
        $scope.modeloCanton = '';
        $scope.modeloParroquia = '';
        $scope.modeloComunidad = '';
        $scope.numeroFamilia = {"str_descripcion":"", "numero":0, "int_id_usuario": $window.sessionStorage.userId};

        $scope.asignarRecursosEncuesta = function(){
          alert(JSON.stringify($scope.modeloCanton) + JSON.stringify($scope.modeloParroquia) + JSON.stringify($scope.modeloComunidad) + $scope.numeroFamilia);
          $scope.preguntas.push($scope.modeloCanton);
          $scope.preguntas.push($scope.modeloParroquia);
          $scope.preguntas.push($scope.modeloComunidad);
          $scope.preguntas.push($scope.numeroFamilia);
          $scope.visibleEncuesta = true;
        };

      datosvistaEncuestaCanton.get().success(function(datos){
        $scope.listadoCanton = datos;
        //PARA UBICAR EN PRIMERA POSICION EL SELECT CON LOS OPTIONS.
        //$scope.modeloCanton = $scope.listadoCanton[0].str_descripcion;
        console.log($scope.modeloCanton);
      }).error(function(err){
        console.log('Error en el servicio datosvistaEncuestaCanton!!! mensaje de log en controlador vistaEncuesta');
      });


      $scope.$watch('modeloCanton', function(newValue, oldValue) {
        MyAPIServiceFactory.obtener(urlObtenerParroquia, newValue)
        .success(function(datos){
          $scope.listadoParroquia = datos;
          //$scope.modeloParroquuia = $scope.listadoParroquia[0].str_descripcion;
        }).error(function(err){
          console.log('Error en el servicio datosvistaEncuestaParroquia!!! mensaje de log en controlador vistaEncuesta');
        });
      });

      $scope.$watch('modeloParroquia', function(newValue, oldValue) {
        MyAPIServiceFactory.obtener(urlObtenerComunidad, newValue)
            .success(function(datos){
                $scope.listadoComunidad = datos;
              //$scope.modeloParroquuia = $scope.listadoParroquia[0].str_descripcion;
            }).error(function(err){
              console.log('Error en el servicio datosvistaEncuestaParroquia!!! mensaje de log en controlador vistaEncuesta');
            });
      });

      //PARA LA RESPUESTA ACTUAL DE LAS RESPUESTAS RADIO BUTTON.
      $scope.trueFalse = function(node){
        $scope.respuesta.seleccion = node.respuesta;
        loopAsignarRespuesta(node);
      };

      var loopAsignarRespuesta = function(currentNode){
        //currentNode.respuesta = true;
        var i, j;
        //alert('entro en el loop'+ JSON.stringify(currentNode));
        for (i = 0; i < $scope.preguntas[2].length; i += 1) {
          console.log('Longitud de las preguntas ' +$scope.preguntas[2].length);
          if($scope.preguntas[2][i].int_id == currentNode.int_id_pregunta){

            for (j = 0; j < $scope.preguntas[2][i].nodes.length; j+= 1) {
              if($scope.preguntas[2][i].nodes[j].int_id != $scope.respuesta.seleccion){
                $scope.preguntas[2][i].nodes[j].respuesta = false;
              }
            }
          }
        }
      };
      $scope.respuesta = {
        'seleccion': ''
      };

      $scope.trueFalseFrecuencia = function (listadoFrecuencia, frecuenciaActual) {
        for(var i = listadoFrecuencia.length -1; i >= 0; i--){
          if(listadoFrecuencia[i].int_id != frecuenciaActual.respuesta){
            listadoFrecuencia[i].respuesta = false;
          }
        }

      };


      //PARA LA FECHA ACTUAL.
      $scope.fechaActual = {
       'fecha':  new Date()
      };


      $scope.tester = function (index) {
        console.log('En el tester viendo que mismo: '+ JSON.stringify(index));
        $scope.visible = true;
      };


      $scope.seleccionarEncuesta = function(encuesta)
      {
        alert('Encuesta seleccionada: '+ JSON.stringify(encuesta));
        $scope.todo(encuesta);
        $scope.visible = false;
      };

      $scope.visible = true;
      $scope.preguntas = [];
      $scope.longitud = 0;



      $scope.todo = function(encuesta) {
        $http({
          method: 'GET',
          url: '/api/user/vistaEncuesta/obtenertodo',
          params:{
            intId: encuesta.int_id
          }
        }).success(function(exito){
          $scope.preguntas.push(encuesta);
          $scope.preguntas.push($scope.fechaActual);
          $scope.preguntas.push(exito);
          $scope.visible = false;
          $scope.longitud = $scope.preguntas.length;
          console.log('Longitud: '+$scope.longitud);
        }).error(function(err){
        });
      };

        $scope.ingresarRespuesta = function () {
          $http({
            method: 'POST',
            url: '/api/user/vistaEncuesta/ingresar',
            data: $scope.preguntas
              })
              .success(function(dato){
                alert('ingreso de respuesta exitoso.');
              })
              .error(function(err){
                alert('Error en el ingreso de las respuestas desde el controlador vistaEncuesta en la funcion ingresarRespuesta');
              })
        };

//Funcion que remueve una opcion de respuesta una vez en el array de las preguntas ya ingresadas.
      $scope.remove = function(scope) {
        console.log(scope.remove());
      };
//Funcion que no se que mismo!!!
      $scope.toggle = function(scope) {
        scope.toggle();
      };
//Funcion de mover un registro ultimo al inicio de todos los registros.
      $scope.moveLastToTheBegginig = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
      };
//Funcion que ingresa un nuevo registro --No se le usa.
      $scope.newItem = function (scope) {
        var nodeData = scope.$modelValue;
        alert(JSON.stringify(nodeData));
        $scope.data.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });
      };
//Funcion que ingresa una nueva opcion de respuesta en la pregunta.
      $scope.newSubItem = function(scope) {
        var nodeData = scope.$modelValue;
        nodeData.nodes.push({
          //id: nodeData.id * 10 + nodeData.nodes.length,
          //title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          //nodes: [],
          id: nodeData.id.length+1,
          type: nodeData.nodes[0].type,
          int_id_padre: nodeData.id,
          flt_numero: "3",
          title: "respuesta 1.1",
          nodes: []
        });
        console.log(nodeData);
      };

      var getRootNodesScope = function() {
        return angular.element(document.getElementById("tree-root")).scope();
      };

      $scope.collapseAll = function() {
        var scope = getRootNodesScope();
        scope.collapseAll();
      };

      $scope.expandAll = function() {
        var scope = getRootNodesScope();
        scope.expandAll();
      };

    });
