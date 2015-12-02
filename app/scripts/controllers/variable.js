'use strict';

angular.module('proyectoSaludApp')
  .controller('VariableCtrl', function ($scope, $http, MyAPIServiceFactory) {

      var urlEditarVariable = '/api/user/admin/variable/editar';
      $scope.variableEditar = {};

    $http.get('/api/user/admin/variable').success(function(awesomeThings) {
      $scope.data = awesomeThings;
    });

      //-----------------------------------------------------------
      //Funcion que prepara las cabeceras con los parametros del producto nuevo y luego las envia a guardar
      // (Contiene la funcion de update() para actualizar los datos de la vista)
      $scope.guardar = function (variableNueva){
        $http({
          method: 'POST',
          url: '/api/user/admin/variable/guardar',
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
        $http.get('/api/user/admin/variable').success(function(awesomeThings) {
          $scope.data = awesomeThings;
        });
      };
//Funcion Guardar Subgrupo : Declaracion de un objeto nuevoSubGrupo para recoger y predisponer del id padre y title en el modal.
      $scope.guardarSubVariable = function(nuevaSubVariable){

        $http({
          method: 'POST',
          url: '/api/user/admin/variable/guardar',
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
            url: '/api/user/admin/variable/eliminar',
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
            url: '/api/user/admin/variable/eliminar',
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
        var nodeData = scope.$modelValue;
        $scope.nuevaSubVariable.id_padre=nodeData.id;
        $scope.nuevaSubVariable.descripcionPadre=nodeData.title;
        console.log($scope.nuevaSubVariable);
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
        $scope.nombreVariable = scope.$modelValue.title;
        idVariableEliminarSola = null;
        idVariableEliminar.splice(0, idVariableEliminar.length);
        var nodeData = scope.$modelValue;
        $scope.variableEliminar = nodeData;
        idVariableEliminar.push($scope.variableEliminar.id);
        if(nodeData.nodes.length == 0)
        {
          idVariableEliminarSola = $scope.variableEliminar.id;
        }
        else{
          loopEliminar($scope.variableEliminar);
        }
      };


      var loopEliminar = function(currentNode){
        var i,
            currentChild;
          for (i = 0; i < currentNode.nodes.length; i += 1) {
            currentChild = currentNode.nodes[i];
            idVariableEliminar.push(currentChild.id);
            loopEliminar(currentChild);
          }
      };

      $scope.editarVariableSeleccion = function (variable) {
        $scope.variableEditar.int_id = (variable.$modelValue).id;
        $scope.variableEditar.str_descripcion = (variable.$modelValue).title;
      };


      $scope.editarVarible = function () {
        MyAPIServiceFactory.obtener(urlEditarVariable, $scope.variableEditar)
            .success(function (dato) {
              alert('Se edito correctamente');
              $scope.update();
            })
            .error(function (dato) {
              alert('Error: al editar variable');
            });
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