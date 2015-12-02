'use strict';

angular.module('proyectoSaludApp')
  .controller('EncuestaCtrl', function($scope, $http, MyAPIServiceFactory) {

//Declaración de Variables
    var id_encuesta = undefined;
    var idsVariablesChecked = [];
    $scope.encuestaNueva = {
        "fechaCreacion": null,
        "fechaModificacion": null
    };
    $scope.encuestaNueva.fechaCreacion = $scope.encuestaNueva.fechaModificacion = new Date();
    var nodesPadre = []; //Llena los id's de las variables seleccionada mediante recursividad a profundidad en la funcion SubItem()
    var checked = false;
    var contadorRecursivoPadre = 0;
//---------------------------------------------------------------------------------------------------------
    $http.get('/api/user/admin/encuesta').success(function(awesomeThings) {
      $scope.listadoEncuesta = awesomeThings;
    });

    MyAPIServiceFactory.get().success(function(todos) { // Servicio que trae sin filtrar las variables.
        $scope.listadoVariables = todos;
        }).error(function(error) {
            console.log('Error: Al obtener variables sin filtrar' + error);
        });


    $scope.guardar = function (){ //Funcion
        iniciaLoopIdVariables();
        $scope.encuestaNueva.variables = idsVariablesChecked;
        $http({                                 // (Contiene la funcion de update() para actualizar los datos de la vista)
        method: 'POST',
        url: '/api/user/admin/encuesta/guardar',
        params: $scope.encuestaNueva
      }).success(function(data) {
            id_encuesta = data.encuesta.int_id;
            $scope.update();
            idsVariablesChecked = [];
            $('#guardarDefinitivoModal').modal('toggle');
            $('#guardarDefinitivoModal').modal('show');
      }).error(function(error) {
        alert(JSON.stringify(error));
      });

    };

    var loopRecursividadSiChecked = function (nodoActual) {
        if (nodoActual.respuesta) {
            console.log('viendo la recursividas--->: '+JSON.stringify(nodoActual));
            idsVariablesChecked.push(nodoActual.id);
        }
        for (var i = 0; i < nodoActual.nodes.length; i++) {
            loopRecursividadSiChecked(nodoActual.nodes[i]);
        }
    };

    var iniciaLoopIdVariables = function () {
        for (var i = $scope.listadoVariables.length - 1; i >= 0; i--) {
            loopRecursividadSiChecked($scope.listadoVariables[i]);
        };
    };


    $scope.guardarDefinitivo = function(){ //Funcion que prepara las cabeceras con los parametros del producto editado y luego las envia a editar
        $http({                                  // (Contiene la funcion de update() para actualizar los datos de la vista)
            method:'POST',
            url: '/api/user/admin/encuesta/editarDefinitivo',
            params: {int_id: id_encuesta}
        }).success(function(data){
            alert('Se guardó de manera definitiva '+data);
        }).error(function(){
            alert("No se guardó");
        });
    };

  //Funcion que prepara las cabeceras con los parametros del producto a ser eliminado y luego las envia a eliminar de forma logica
  $scope.eliminar = function(_id){
    $http({
      method: 'POST',
      url: '/api/user/admin/encuesta/eliminar',
      params: {
        id:_id
      }
    }).
        success(function(data) {
        	$scope.update();
        }).
        error(function() {

        });
  };
//---------------------------------------------------------------------------------------------------------
    //Funcion para traer los datos actualizados
    $scope.update = function(){
      $http.get('/api/user/admin/encuesta').success(function(awesomeThings) {
        $scope.listadoEncuesta = awesomeThings;
      });
    };

    $scope.tester2 = function(variable){ //Funcion para testear los datos posibles enviados desde la vista
      alert('SI' + JSON.stringify(variable));
    };
//--------------------Recursividad para ingresar padres e hijos en las variables seleccionadas.----------------------------
    var loopRecursivoPadre = function(nodoActual){ // Funcion recursiva que toma todos los id's de la variable selecciona y viene el nodoActual desde la funcion newSubItem
      var i, currentChild;
        if (nodesPadre[nodesPadre.length-1].int_id_padre == nodoActual.id) {
            nodoActual.respuesta = checked;
            nodesPadre.push(
                {
                    "id":nodoActual.id,
                    "int_id_padre":nodoActual.int_id_padre,
                    "flt_numero":nodoActual.flt_numero,
                    "title":nodoActual.title,
                    "str_estado":nodoActual.str_estado,
                    "nodes": []
                }
            );
            //nodesPadre[nodesPadre.length-1].nodes.push(nodesPadre[contadorRecursivoPadre++]);
            iniciaLoopPadre();
        } else {
            for (i = 0; i < nodoActual.nodes.length; i += 1) {
                currentChild = nodoActual.nodes[i];
                loopRecursivoPadre(currentChild);
            }
        }
    };

    var iniciaLoopPadre = function () {
      for (var i = $scope.listadoVariables.length - 1; i >= 0; i--) {
        loopRecursivoPadre($scope.listadoVariables[i]);
      }
    };

    var loopRecursividadSiExiste = function (nodoActual) {
        for (var i = 0; i < nodoActual.nodes.length; i++) {
            nodoActual.nodes[i].respuesta = checked;
            loopRecursividadSiExiste(nodoActual.nodes[i]);
        }
    };
//---------------------------------------------------------------------------------------------
  $scope.newSubItem = function(scope) {
    contadorRecursivoPadre = 0;
    nodesPadre = [];
    var nodeData = scope.$modelValue;
      if(nodeData.respuesta) {
          checked = true;
          if (nodeData.int_id_padre != null) {
              nodesPadre.push(
                  {
                      "id":nodeData.id,
                      "int_id_padre":nodeData.int_id_padre,
                      "flt_numero":nodeData.flt_numero,
                      "title":nodeData.title,
                      "str_estado":nodeData.str_estado,
                      "nodes": []
                  }
              );
              iniciaLoopPadre();
              if(nodeData.nodes.length > 0){loopRecursividadSiExiste(nodeData);}
          }else{
              loopRecursividadSiExiste(nodeData);
          }
        }
      else {
          checked = false;
          if(nodeData.nodes.length > 0){loopRecursividadSiExiste(nodeData);}
      }


  };

  $scope.remove = function(scope) {
      var nodeData = scope.$modelValue;
      console.log(nodeData);
      scope.remove();
  };
//---------------------------------------------------------------------------------------------------------
  });