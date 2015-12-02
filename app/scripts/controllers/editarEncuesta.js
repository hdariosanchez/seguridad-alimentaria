'use strict';

angular.module('proyectoSaludApp')
  .controller('EditarencuestaCtrl', function ($scope, $http, MyAPIServiceFactory) {

      var urlEncuesta = '/api/user/admin/encuesta';
      var urlEncuestaVariables = '/api/user/admin/encuestaVariables';
      var urlEncuestaVariableEliminar = '/api/user/admin/encuestaVariables/eliminar';
      var urlEncuestaVariableAgregar = '/api/user/admin/encuestaVariables/agregar';
      var listadoencuestavariable = null;
      $scope.visible = true;
      var nodesPadre = []; //Llena los id's de las variables seleccionada mediante recursividad a profundidad en la funcion SubItem()
      var checked = false;
      var contadorRecursivoPadre = 0;
      var idsVariableEliminar = [];
      var idsVariableAgregar = [];

    $scope.mostrarTabla = function () {
      $scope.visible = true;
    };

      MyAPIServiceFactory.getGenerico(urlEncuesta)
          .success(function(encuestas){
            $scope.listadoEncuesta = encuestas;
            $scope.encuestaEditar.dt_fecha_modificacion = new Date();
          })
          .error(function () {
            alert('Error: al traer las encuestas');
          });


      $scope.encuestaEdicion = function (encuesta) {
        $scope.encuestaEditar = encuesta;
        $scope.visible = false;
        MyAPIServiceFactory.get().success(function(todos) { // Servicio que trae sin filtrar las variables.
          $scope.data = todos;

          MyAPIServiceFactory.obtener(urlEncuestaVariables, {'int_id_encuesta': encuesta.int_id})
              .success(function (data) {
                listadoencuestavariable = data;
                iniciaLoopIdVariablesNo();
                iniciaLoopIdVariables();
              })
              .error(function (err) {
                alert('Error al traer las variables de la encuesta actual')
              });

        }).error(function(error) {
          alert('Failed to load TODOs');
        });
      };

    //Este es un objeto con campos necesarios para recoger los datos a ser editados y se modificaran a medida que los editen.
        //(Se utilizara en la funcion edicion!)
      $scope.encuestaEditar = {};

        $scope.encuestaNueva = {
            "fechaCreacion": null,
            "fechaModificacion": null
        };

//--------------------------------------------------------------------------------
      var loopRecursividadSiChecked = function (currentNode) {
        for (var j = 0; j < listadoencuestavariable.length; j++) {
          if (currentNode.id == listadoencuestavariable[j].int_id_variable) {
            currentNode.respuesta = true;
          }
        }
        for (var i = 0; i < currentNode.nodes.length; i++) {
          loopRecursividadSiChecked(currentNode.nodes[i]);
        }
      };

      var iniciaLoopIdVariables = function () {
        for (var i = $scope.data.length - 1; i >= 0; i--) {
          loopRecursividadSiChecked($scope.data[i]);
        }
      };

//--------------------------------------------------------------------------------
//
// --------------------------------------------------------------------------------
      var loopRecursividadNoChecked = function (currentNode) {
            currentNode.respuesta = false;
        for (var i = 0; i < currentNode.nodes.length; i++) {
          loopRecursividadNoChecked(currentNode.nodes[i]);
        }
      };

      var iniciaLoopIdVariablesNo = function () {
        for (var i = $scope.data.length - 1; i >= 0; i--) {
          loopRecursividadNoChecked($scope.data[i]);
        }
      };

//--------------------------------------------------------------------------------
    $scope.editar = function(encuestaEditar){ //Funcion que prepara las cabeceras con los parametros del producto editado y luego las envia a editar
      $http({                                  // (Contiene la funcion de update() para actualizar los datos de la vista)
        method:'POST',
        url: '/api/user/admin/encuesta/editar',
        params: encuestaEditar
      }).success(function(data){
        alert('Se edito correctamente '+JSON.stringify(data));
      }).error(function(){
        alert("Error al editar encuesta");
      });
    };

    $scope.editarDefinitivo = function(){ //Funcion que prepara las cabeceras con los parametros del producto editado y luego las envia a editar

      $http({                                  // (Contiene la funcion de update() para actualizar los datos de la vista)
        method:'POST',
        url: '/api/user/admin/encuesta/editarDefinitivo',
        params: {int_id: $scope.encuestaEditar.int_id}
      }).success(function(data){
        alert('Se edito correctamente '+data);
      }).error(function(){
        alert("Error al editar encuesta");
      });

    };

    $scope.visualizarModal = function () {
      $('#editarDefinitivoModal').modal('toggle');
      $('#editarDefinitivoModal').modal('show');
    };

    //--------------------Recursividad para ingresar padres e hijos en las variables seleccionadas.----------------------------
    var loopRecursivoPadre = function(currentNode){ // Funcion recursiva que toma todos los id's de la variable selecciona y viene el currentNode desde la funcion newSubItem
      var i, currentChild;
      if (nodesPadre[nodesPadre.length-1].int_id_padre == currentNode.id) {
        currentNode.respuesta = checked;
        nodesPadre.push(
            {
              "id":currentNode.id,
              "int_id_padre":currentNode.int_id_padre,
              "flt_numero":currentNode.flt_numero,
              "title":currentNode.title,
              "str_estado":currentNode.str_estado,
              "nodes": []
            }
        );
        iniciaLoopPadre();
      } else {
        for (i = 0; i < currentNode.nodes.length; i += 1) {
          currentChild = currentNode.nodes[i];
          loopRecursivoPadre(currentChild);
        }
      }
    };

    var iniciaLoopPadre = function () {
      for (var i = $scope.data.length - 1; i >= 0; i--) {
        loopRecursivoPadre($scope.data[i]);
      }
    };

    var loopRecursividadSiExiste = function (currentNode) {
      for (var i = 0; i < currentNode.nodes.length; i++) {
        currentNode.nodes[i].respuesta ? idsVariableEliminar.push(currentNode.nodes[i].id) : idsVariableAgregar.push(currentNode.nodes[i].id);
        currentNode.nodes[i].respuesta = checked;
        loopRecursividadSiExiste(currentNode.nodes[i]);
      }
    };
//---------------------------------------------------------------------------------------------
    $scope.newSubItem = function(scope) {
      contadorRecursivoPadre = 0;
      nodesPadre = [];
      var nodeData = scope.$modelValue;
      if(nodeData.respuesta) {
        idsVariableAgregar = [];
        idsVariableAgregar.push(nodeData.id);
        console.log('POR TRUE');
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
          console.log('Ids de variables AGREGAR SIN NODES HIJOS > 0 -->> '+idsVariableAgregar);
          if(nodeData.nodes.length > 0){
            loopRecursividadSiExiste(nodeData);
            console.log('Ids de variables AGREGAR CON NODES HIJOS > 0 -->> '+idsVariableAgregar);
          }
        } else{
          loopRecursividadSiExiste(nodeData);
        }
        MyAPIServiceFactory.obtener(urlEncuestaVariableAgregar, {'int_id_encuesta': $scope.encuestaEditar.int_id, 'variables': idsVariableAgregar})
            .success(function () {
              alert('Se modifico correctamente!');
            })
            .error(function () {
              alert('Error al eliminar las variables.!')
            });
      }
      else {
        console.log('POR FALSE');
        idsVariableEliminar = []; idsVariableEliminar.push(nodeData.id);
        checked = false;
        if(nodeData.nodes.length > 0){loopRecursividadSiExiste(nodeData);}
        console.log('Ids de variables a elimininar '+idsVariableEliminar);
        MyAPIServiceFactory.obtener(urlEncuestaVariableEliminar, {'int_id_encuesta': $scope.encuestaEditar.int_id, 'variables': idsVariableEliminar})
            .success(function () {
              alert('Se modifico correctamente!');
            })
            .error(function () {
              alert('Error al eliminar las variables.!')
            });
      }
    };
    });
