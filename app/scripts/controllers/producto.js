'use strict';

angular.module('proyectoSaludApp')
  .controller('ProductoCtrl', function ($scope, $http) {

      $http.get('/api/user/admin/producto/arbol').success(function(awesomeThings) {
        $scope.data = awesomeThings;
      });

      //-----------------------------------------------------------
      //Funcion que prepara las cabeceras con los parametros del producto nuevo y luego las envia a guardar
      // (Contiene la funcion de update() para actualizar los datos de la vista)
      $scope.guardar = function (variableNueva){
        $http({
          method: 'POST',
          url: '/api/user/admin/producto/guardar',
          params:
          {
            _id_padre: 'NULL',
            _descripcion: variableNueva.descripcion
          }
        }).success(function(data) {
          //aqui un mensaje
          $scope.update();
        }).error(function() {
          //aqui un mensaje
        });
      };

//-----------------------------------------------------------
      $scope.update = function(){
        $http.get('/api/user/admin/producto/arbol').success(function(awesomeThings) {
          $scope.data = awesomeThings;
        });
      };
//Funcion Guardar Subgrupo : Declaracion de un objeto nuevoSubGrupo para recoger y predisponer del id padre y title en el modal.
      $scope.guardarSubVariable = function(nuevaSubVariable){

        $http({
          method: 'POST',
          url: '/api/user/admin/producto/guardar',
          params:
          {
            _id_padre: nuevaSubVariable.id_padre,
            _descripcion: nuevaSubVariable.descripcion
          }
        }).success(function(data) {
          //aqui un mensaje
          $scope.update();
        }).error(function() {
          //aqui un mensaje
        });
      };


      $scope.eliminar = function (){
        if(idVariableEliminarSola == null){
          $http({
            method: 'POST',
            url: '/api/user/admin/producto/eliminar',
            params:
            {
              variable: idVariableEliminar,
              bandera: 0
            }
          }).success(function(data) {
            $scope.update();
          }).error(function() {

          });
        }
        else{
          $http({
            method: 'POST',
            url: '/api/user/admin/producto/eliminar',
            params:
            {
              variable: idVariableEliminarSola,
              bandera: 1
            }
          }).success(function(data) {
            $scope.update();
          }).error(function() {
          });
          idVariableEliminarSola = null;
        }

      };


      $scope.nuevaSubVariable = {
        id_padre: '',
        descripcionPadre: ''
      };

      $scope.variableEliminar = {};

      $scope.newSubItem = function(scope) {
        //alert(JSON.stringify(scope.$modelValue));
        var nodeData = scope.$modelValue;
        $scope.nuevaSubVariable.id_padre=nodeData.int_id;
        $scope.nuevaSubVariable.descripcionPadre=nodeData.str_descripcion;
        //console.log($scope.nuevaSubVariable);
      };
//--------------------------------------------------------------------------------
      $scope.confirmacion = null;

      $scope.remove = function(scope) {
        var nodeData = scope.$modelValue;
        console.log(nodeData);
        scope.remove();
      };

      var idVariableEliminar = [];
      var idVariableEliminarSola;

      $scope.remove2 = function(scope) {
        alert(JSON.stringify(scope.$modelValue));
        $scope.nombreVariable = scope.$modelValue.str_descripcion;
        idVariableEliminarSola = null;
        idVariableEliminar.splice(0, idVariableEliminar.length);
        var nodeData = scope.$modelValue;
        $scope.variableEliminar = nodeData;
        idVariableEliminar.push($scope.variableEliminar.int_id);
        if(nodeData.nodes.length == 0)
        {
          idVariableEliminarSola = $scope.variableEliminar.int_id;
        }
        else{
          loopEliminar($scope.variableEliminar);
        }
      };


      var loopEliminar = function(productoActual){
        var i,
            hijoActual;
        for (i = 0; i < productoActual.nodes.length; i += 1) {
          hijoActual = productoActual.nodes[i];
          idVariableEliminar.push(hijoActual.int_id);
          // Search in the current child
          loopEliminar(hijoActual);
        }
      };

      $scope.tester = function(){
        console.log(idVariableEliminar);
      };

//--------------------------------------------------------------------------------
      $scope.toggle = function(scope) {
        scope.toggle();
      };

      $scope.moveLastToTheBegginig = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
      };
      /*
       $scope.newItem = function (scope) {
       var nodeData = scope.$modelValue;
       alert(JSON.stringify(nodeData));
       $scope.data.push({
       id: nodeData.id * 10 + nodeData.nodes.length,
       title: nodeData.title + '.' + (nodeData.nodes.length + 1),
       nodes: []
       });
       };
       */

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
