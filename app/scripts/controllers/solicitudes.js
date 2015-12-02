'use strict';

angular.module('proyectoSaludApp')
  .controller('SolicitudesCtrl', function ($scope, $http, MyAPIServiceFactory) {

      //Template para visualizar los botones de editar y eliminar para cada registro de productos
      var removeTemplate =
          '<button type="button" class="btn btn-default btn-sm" data-nodrag="" data-toggle="modal" data-target="#encabezadoEncuestaModal" ng-click="seleccionarEncuesta(row.entity)"> ' +
          '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> </button>';

      //Este array contiene productos que han sido seleccionados con click en la fila de la tabla con ng-grid de productos en la vista
      $scope.seleccion = [];


      $http({                                 // (Contiene la funcion de update() para actualizar los datos de la vista)
        method: 'GET',
        url: '/api/user/admin/solicitudes/listado'
      }).success(function(data) {
        $scope.listadoUsuarios = data;
      }).error(function() {
        alert('Error al obtener listado de usuarios pendientes.');
      });


      //Este es un conjunto de parametros de comportamiento del ng-grid
      $scope.gridOptions = {
        data: 'listadoUsuarios',
        selectedItems: $scope.seleccion,
        enableRowSelection: true,
        enableCellSelection: false,
        showGroupPanel: false,
        showFooter: true,
        enableCellEdit: false,
        showSelectionCheckbox: true,
        enableColumnResize: true,
        enableColumnReordering: false,
        enableRowReordering: false,
        multiSelect: false,
        afterSelectionChange: function (theRow, evt) {
          console.log('id desde afterSelectionChange: '+theRow.entity.int_id);
            $scope.solicitud.int_id = theRow.entity.int_id;

        },

        columnDefs: [
          {field: 'int_id', displayName: 'ID', width: '2%', pinnable: 'false'},
          {field: 'int_id_rol', displayName: 'ROL', width: '10%'},
          {field: 'int_codigo', displayName: 'CODIGO', width: '7%'},
          {field: 'str_nick', displayName: 'NICK', width: '7%'},
          {field: 'str_contrasena', displayName: 'CONTRASEÑA', width: '7%'},
          {field: 'str_nombre', displayName: 'NOMBRE', width: '15%', visible: true},
          {field: 'str_apellido', displayName: 'APELLIDO', width: '15%', visible: true},
          {field: 'str_email', displayName: 'EMAIL', width: '20%', visible: true},
          {field: 'str_telefono', displayName: 'TELEFONO', width: '7%'},
          {field: 'str_sexo', displayName: 'SEXO', width: '10%', visible: true},
          {field: 'd_fecha_nacimiento', displayName: 'FECHA DE NACIMIENTO', width: '11%', visible: false},
          {field: 'str_estado', displayName: 'ESTADO', width: '7%'},
          {field: 'remove', displayName:'Acción', cellTemplate: removeTemplate, width: '4%'}
        ]};

        $scope.solicitud = {};
        $scope.actualizarSolicitud = function () {
            $http({                                 // (Contiene la funcion de update() para actualizar los datos de la vista)
                method: 'POST',
                url: '/api/user/admin/solicitudes/actualizar',
                data: $scope.solicitud
            }).success(function(data) {
                alert('Todo Ok.');
            }).error(function() {
                alert('Error al obtener listado de usuarios pendientes.');
            });
        }

  });
