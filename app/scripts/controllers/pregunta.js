'use strict';

angular.module('proyectoSaludApp')
    .controller('PreguntaCtrl', function ($scope, $http, MyAPIServiceFactory, datosEncuestaPregunta, $window) {

        var urlEncuestaVariable = '/api/user/admin/pregunta/encuesta/variable';
        var urlProductoArbol = '/api/user/admin/producto/arbol';
        var urlFrecuencia = '/api/user/admin/frecuencia';
        var urlGuardarMatriz = '/api/user/admin/matriz/guardar';
        var nodesPadre = []; //Llena los id's de las variables seleccionada mediante recursividad a profundidad en la funcion SubItem()
        var checked = false;
        var contadorRecursivoPadre = 0;
        var productosSeleccionados = [];
        var frecuenciasSeleccionadas = [];
        $scope.listadoColumnas = [];
        $scope.listadoFila = [];
        //$scope.listadoPregunta = JSON.parse($window.localStorage.getItem('preguntasEncuesta')) || [];
        $scope.listadoPregunta = [];

        $scope.visiblePregunta = false;
        $scope.visiblePreguntaFormada = false;
        $scope.visibleAnuncio = false;
        $scope.preguntaEdicion = [];
        $scope.preguntaEdicionConScope = '';
        var preguntaEdicion = '';
        var bandera = 0;  // Bandera relacionada con el añadir nueva opcion de respuesta al pregunta test y casilla.
        $scope.encuesta = JSON.parse($window.localStorage.getItem('encuestaInactiva'));

        MyAPIServiceFactory.obtener(urlEncuestaVariable, {'int_id_encuesta':$scope.encuesta.int_id})
            .success(function (dato) {
                $scope.listadoVariable = dato;
            })
            .error(function (err) {
                alert('Error al traer los datos de las variables en la encuestaInformacion en primera instancia.!');
            });

        $scope.$watch('respuesta.tipoRespuesta', function(tipoPregunta) { //Estar escuchando el cambio en el select de tipo pregunta..
            if(tipoPregunta.type == 'canasta'){
                MyAPIServiceFactory.getGenerico(urlProductoArbol)
                    .success(function (productos) {
                        $scope.arbolProducto = productos;
                    })
                    .error(function () {
                        alert('Error al traer los datos de producto como arbol!!');
                    });
                MyAPIServiceFactory.getGenerico(urlFrecuencia)
                    .success(function (frecuencias) {
                        for(var i=frecuencias.length-1; i>=0;i--){
                            frecuencias[i].respuesta = false;
                        }
                        $scope.listadoFrecuencia = frecuencias;

                    })
                    .error(function () {
                        alert('Error al traer los frecuenciass de Frecuencia!!');
                    });
            }else{
                numEscala = 1;
                numId = 1;
                $scope.arrayListaRespuesta.splice(0, $scope.arrayListaRespuesta.length); //Elimina todos las opciones de respuestas de la pregunta vigente para la nueva pregunta en cuestion.
                $scope.pregunta.codigoPregunta = null;
                $scope.pregunta.ayudaPregunta = null;
                $scope.respuesta.correcta = null;
                $scope.arrayListaRespuesta.push(
                    {
                        int_id_padre: contador,
                        str_descripcion: "",
                        str_desc_fin: "",
                        "int_id_tipo_pregunta": $scope.respuesta.tipoRespuesta.type,
                        numEscala:numEscala++,
                        numId:numId++,
                        valor: false,
                        int_id_variable: $scope.variableSeleccionada,
                        nodes: []
                    })
            }
        });

      $scope.respuesta = {
        tipoRespuesta: ""
      };
      $scope.respuesta.correcta = "";


                                                                    //Objeto de tipos posibles de respuestas.
                                                                          $scope.objTipoPregunta = [
                                                                            {
                                                                              value:1,
                                                                              "type": "checkbox",
                                                                              descripcion: "Selección Múltiple"
                                                                            },
                                                                            {
                                                                              value:2,
                                                                              "type": "radio",
                                                                              descripcion: "Selección Simple"
                                                                            },
                                                                            {
                                                                              value:3,
                                                                              "type": "text",
                                                                              descripcion: "Texto"
                                                                            },
                                                                            {
                                                                              value:4,
                                                                              "type": "range",
                                                                              descripcion: "Escala"
                                                                            },
                                                                          {
                                                                              value:5,
                                                                              "type": "date",
                                                                              descripcion: "Fecha"
                                                                          },
                                                                          {
                                                                              value:6,
                                                                              "type": "time",
                                                                              descripcion: "Hora"
                                                                          },
                                                                          {
                                                                              value:7,
                                                                              "type": "canasta",
                                                                              descripcion: "Canasta"
                                                                          },
                                                                          {
                                                                              value:8,
                                                                              "type": "matriz",
                                                                              descripcion: "Matriz"
                                                                          },
                                                                          {
                                                                              value:9,
                                                                              "type": "tabla",
                                                                              descripcion: "Tabla"
                                                                          }
                                                                          ];

//Objeto tipo respuesta
      $scope.pregunta = {

      };

//Variable para poder mostrar o esconder el div contenedor donde se ingresa la posible respuesta -
// (Se le quitaria porque no tiene ningun objeto por ahora)
      $scope.formVisibility=true;
      $scope.variableSeleccionada = 0;
      $scope.variableSeleccion = {
          'str_nombre': ''
      };
                                                              //Funcion para testear los datos que obtenemos de la vista.
                                                                    $scope.asignarVariable = function(scope){
                                                                      $scope.variableSeleccion.str_nombre = scope.str_descripcion;
                                                                      $scope.variableSeleccionada = scope.int_id;
                                                                      $scope.arrayListaRespuesta[0].int_id_variable = scope.int_id;
                                                                      $scope.visiblePregunta = true;
                                                                      $scope.visibleAnuncio = true;
                                                                    };
                                                              //variable global contadora para obtener el id de la preguntar y poder referenciar de manera correcta a las respuestas.
                                                                                var contador = 1;
                                                                                var numEscala = 1;
                                                                                var numId = 1;
                                                                                var numIdPregunta = 1;

//Objeto [] para insertar las opciones respuesta
      $scope.arrayListaRespuesta = [
        {
          int_id_padre: contador,
          str_descripcion: "",
          str_desc_fin: "",
          "int_id_tipo_pregunta": $scope.respuesta.tipoRespuesta.type,
          numEscala:numEscala++,
          numId:numId++,
          valor: false,
          int_id_variable: $scope.variableSeleccionada,
            otros: false,
            cuales: '',
          nodes: []
        }
      ];
//Objeto que me permite visualizar las opciones de respuesta renderizadas en la vista antes de ingresar por completo en el array de preguntas aviles.
      //Esto se puede simplificar para no hacerle tanta vuelta pero por el momento esta bien no hace daño tampoco.
      //$scope.arrayListaRespuesta = arrayRespuesta;
        $scope.validate=function validateContent(value){
            var numTabular = parseInt(value);
            for(var i=$scope.arrayListaRespuesta.length - 1; i>=0; i--){
                if(numTabular == $scope.arrayListaRespuesta[i].numEscala){
                    alert('Tabular no permitido!');
                    return false;
                }
            }
            return value;
        };
//-----------------------------------------------------------
//Funcion que agrega todas las opciones posibles de respuesta en el arrayRespuesta para luego ingresarlo en el array de preguntas.
      $scope.addOpcionRespuesta = function(respuestaNueva){
        $scope.arrayListaRespuesta.push(
            {
              int_id_padre: contador,
              str_descripcion: respuestaNueva.descripcionRespuesta,
              str_desc_fin: "",
              "int_id_tipo_pregunta": respuestaNueva.tipoRespuesta.type,
              numEscala:numEscala++,
              numId:numId++,
              valor: false,
              int_id_variable: $scope.variableSeleccionada,
                otros: false,
                cuales: '',
              nodes: []
            }
        );
      };

        $scope.eliminarRespuesta = function(scope){
            for(var i=0; i<$scope.arrayListaRespuesta.length; i++){
                if(bandera == 1){
                    $scope.arrayListaRespuesta[i].numId = $scope.arrayListaRespuesta[i].numId - 1;
                }

                if($scope.arrayListaRespuesta[i].numId == scope.numId && bandera == 0) {
                    $scope.arrayListaRespuesta.splice(i,1);
                    i-=1;
                    bandera=1;
                }
            }
            bandera=0;
        };

    $scope.preguntaNueva = [];
        //Funcion que agrega la pregunta con sus respuestas.
        $scope.guardarPregunta = function(preguntaNueva){
            if($scope.respuesta.tipoRespuesta.type === "canasta"){
                productosSeleccionados = [];
                frecuenciasSeleccionadas.splice(0, frecuenciasSeleccionadas.length);
                for(var i= 0; $scope.listadoFrecuencia.length > i; i++){
                    if($scope.listadoFrecuencia[i].respuesta)
                        frecuenciasSeleccionadas.push(angular.copy($scope.listadoFrecuencia[i]));
                }
                angular.forEach($scope.arbolProducto, function (grupo) {
                    for(var i = 0; grupo.nodes.length > i; i++ ){
                        if(grupo.nodes[i].respuesta){
                            var frecuencias = angular.copy(grupo.nodes[i]);
                            frecuencias.nodes = frecuenciasSeleccionadas;
                            productosSeleccionados.push(angular.copy(frecuencias));
                        }
                    }
                    //alert('Frecuencia seleccionafas '+JSON.stringify(frecuenciasSeleccionadas));
                });
                $scope.listadoPregunta.push(
                    {
                        int_id_encuesta: $scope.encuesta.int_id,
                        id_pregunta: contador,
                        int_obligatoria: preguntaNueva.obligatoriedadPregunta,
                        str_ayuda: preguntaNueva.ayudaPregunta,
                        int_id_variable: $scope.variableSeleccionada,
                        "int_id_tipo_pregunta": $scope.respuesta.tipoRespuesta.type,
                        int_id_padre: null,
                        numId: numIdPregunta++,
                        str_enunciado: preguntaNueva.descripcionPregunta,
                        codigo: preguntaNueva.codigoPregunta,
                        nodes:productosSeleccionados
                    }
                );

            } else {
                $scope.listadoPregunta.push(
                    {
                        int_id_encuesta: $scope.encuesta.int_id,
                        id_pregunta: contador,
                        int_obligatoria: preguntaNueva.obligatoriedadPregunta,
                        str_ayuda: preguntaNueva.ayudaPregunta,
                        int_id_variable: $scope.variableSeleccionada,
                        "int_id_tipo_pregunta": $scope.respuesta.tipoRespuesta.type,
                        int_id_padre: null,
                        numId: numIdPregunta++,
                        str_enunciado: preguntaNueva.descripcionPregunta,
                        codigo: preguntaNueva.codigoPregunta,
                        nodes: []

                    }
                );
                preguntaNueva.descripcionPregunta = null;
                $scope.arrayListaRespuesta.forEach(function (respuesta) { //forEach que ingresa opcion de pregunta por odp porque no permitia asi no mas
                    respuesta.type = $scope.respuesta.tipoRespuesta.type;
                    if (respuesta.numEscala == $scope.respuesta.correcta) {
                        respuesta.valor = true;
                    }
                    respuesta['codigo'] = preguntaNueva.codigoPregunta;

                    if (respuesta.type == 'range') {
                        respuesta.numEscala = $scope.rango.maximo;
                        respuesta.numId = $scope.rango.minimo;
                    }
                    $scope.listadoPregunta[$scope.listadoPregunta.length - 1].nodes.push(respuesta);
                });
            }
                contador++; //aunmenta en 1 el contador para preparar la siguiente pregunta.
                numEscala = 1;
                numId = 1;
                $scope.arrayListaRespuesta.splice(0, $scope.arrayListaRespuesta.length); //Elimina todos las opciones de respuestas de la pregunta vigente para la nueva pregunta en cuestion.
                $scope.pregunta.codigoPregunta = null;
                $scope.pregunta.ayudaPregunta = null;
                $scope.respuesta.correcta = null;
                $scope.arrayListaRespuesta.push(
                    {
                        int_id_padre: contador,
                        str_descripcion: "",
                        str_desc_fin: "",
                        "int_id_tipo_pregunta": $scope.respuesta.tipoRespuesta.type,
                        numEscala: numEscala++,
                        numId: numId++,
                        valor: false,
                        int_id_variable: $scope.variableSeleccionada,
                        otros: false,
                        cuales: '',
                        nodes: []
                    }
                );
                $scope.visiblePreguntaFormada = true;
            //$window.localStorage.setItem('preguntasEncuesta', JSON.stringify($scope.listadoPregunta));
            $scope.preguntaNueva.push($scope.listadoPregunta[$scope.listadoPregunta.length-1]);

            $http({
                method: 'POST',
                url: '/api/user/admin/pregunta/guardar',
                data: $scope.preguntaNueva
            }).success(function(data) {
                alert('Succeful en $scope.guardar en script/pregunta.js');
            }).error(function() {
                alert('Error en $scope.guardar en script/pregunta.js');
            });
            $scope.preguntaNueva = [];
        };

    $scope.agregarOtros = function (dato) {
        !dato.otros ? dato.otros = true : dato.otros = false;
    };

    $scope.editarPregunta = function (pregunta) {
        $scope.preguntaEdicionConScope = pregunta;
        $scope.preguntaEdicion.splice(0, $scope.preguntaEdicion.length);
        preguntaEdicion = angular.copy(pregunta);
        $scope.preguntaEdicion.push(preguntaEdicion);
    };

    $scope.asignarEdicion = function () {
        $scope.preguntaEdicionConScope.str_enunciado = preguntaEdicion.str_enunciado;
        for(var i = preguntaEdicion.nodes.length-1; i >=0; i--){
            $scope.preguntaEdicionConScope.nodes[i].str_descripcion = preguntaEdicion.nodes[i].str_descripcion;
            $scope.preguntaEdicionConScope.nodes[i].otros ? $scope.preguntaEdicionConScope.nodes[i].cuales = preguntaEdicion.nodes[i].cuales : console
                .log('Ningun Cambio');
        }
    };


//Funcion que remueve una opcion de respuesta una vez en el array de las preguntas ya ingresadas.
  $scope.eliminarElemento = function(preguntaEliminar) {
      $http({
          method: 'POST',
          url: '/api/user/admin/pregunta/eliminar',
          params: {'int_id': preguntaEliminar.int_id}
      }).success(function(exito){
          alert('LLEGO CON EXITO');
          //$scope.listadoPregunta = preguntas;
      }).error(function(err){
          alert('Error: Al obtener las preguntas de la encuesta actual.'+err);
      });
  };
        //--------------------------------------------------------------------------------------

            $http({
                method: 'GET',
                url: '/api/user/admin/herramienta/pregunta',
                params: {'intId': $scope.encuesta.int_id}
            }).success(function(preguntas){
                $scope.listadoPregunta = preguntas;
                //alert(JSON.stringify($scope.listadoPregunta));
            }).error(function(err){
                alert('Error: Al obtener las preguntas de la encuesta actual.'+err);
            });


        //----------------------------------------------------------------------------------------

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


        //--------------------Recursividad para ingresar padres e hijos en las variables seleccionadas.----------------------------
        var loopRecursivoPadre = function(objetoActual) { // Funcion recursiva que toma todos los id's de la variable selecciona y viene el objetoActual desde la funcion newSubItem
            var i, hijoActual;
            if (nodesPadre[nodesPadre.length-1].int_id_padre == objetoActual.int_id) {
                objetoActual.respuesta = checked;
                nodesPadre.push(
                    {
                        "int_id":objetoActual.int_id,
                        "int_id_padre":objetoActual.int_id_padre,
                        "flt_numero":objetoActual.flt_numero,
                        "str_descripcion":objetoActual.str_descripcion,
                        "str_estado":objetoActual.str_estado,
                        "nodes":[],
                        "flt_costo":false,
                        "respuesta":false,
                        "flt_peso":false
                    }
                );
                //nodesPadre[nodesPadre.length-1].nodes.push(nodesPadre[contadorRecursivoPadre++]);
                iniciaLoopPadre();
            } else {
                for (i = 0; i < objetoActual.nodes.length; i += 1) {
                    hijoActual = objetoActual.nodes[i];
                    loopRecursivoPadre(hijoActual);
                }
            }
        };

        var iniciaLoopPadre = function () {
            for (var i = $scope.arbolProducto.length - 1; i >= 0; i--) {
                loopRecursivoPadre($scope.arbolProducto[i]);
            }
        };

        var loopRecursividadSiExiste = function (objetoActual) {
            for (var i = 0; i < objetoActual.nodes.length; i++) {
                objetoActual.nodes[i].respuesta = checked;
                loopRecursividadSiExiste(objetoActual.nodes[i]);
            }
        };
        
        
        
//---------------------------------------------------------------------------------------------
        $scope.seleccionCheckBox = function(scope) {
            contadorRecursivoPadre = 0;
            nodesPadre = [];
            var productoActual = scope.$modelValue;
            if(productoActual.respuesta) {
                checked = true;
                if (productoActual.int_id_padre != null) {
                    nodesPadre.push(
                        {
                            "int_id":productoActual.int_id,
                            "int_id_padre":productoActual.int_id_padre,
                            "flt_numero":productoActual.flt_numero,
                            "str_descripcion":productoActual.str_descripcion,
                            "str_estado":productoActual.str_estado,
                            "nodes":[],
                            "flt_costo":false,
                            "respuesta":false,
                            "flt_peso":false
                        }
                    );
                    iniciaLoopPadre();
                    if(productoActual.nodes.length > 0){loopRecursividadSiExiste(productoActual);}
                }else{
                    loopRecursividadSiExiste(productoActual);
                }
            }
            else {
                checked = false;
                if(productoActual.nodes.length > 0){loopRecursividadSiExiste(productoActual);}
            }
        };


        var contadorColumna = 1;
        $scope.agregarColumna = function(columna){
            $scope.listadoColumnas.push(
                {
                    'int_id': contadorColumna++,
                    'str_descripcion': columna.str_descripcionColumna,
                    'tabular': [{'int_id':1, 'str_descripcion':''}]
                }
            );
        };

        $scope.eliminarColumna = function(scope){
            for(var i=0; i<$scope.listadoColumnas.length; i++){
                if(bandera == 1){
                    $scope.listadoColumnas[i].int_id = $scope.listadoColumnas[i].int_id - 1;
                }
                if($scope.listadoColumnas[i].int_id == scope.int_id && bandera == 0) {
                    $scope.listadoColumnas.splice(i,1);
                    i-=1;
                    bandera=1;
                }
            }
            bandera=0;

        };

        var contadorFila = 1;
        $scope.agregarFila = function(fila){
            $scope.listadoFila.push(
                {
                    'int_id': contadorFila++,
                    'str_descripcion': fila.str_descripcionFila
                }
            );
//            alert(JSON.stringify($scope.listadoFila));
        };

        $scope.eliminarFila = function(scope) {
            for(var i=0; i<$scope.listadoFila.length; i++){
                if(bandera == 1){
                    $scope.listadoFila[i].int_id = $scope.listadoFila[i].int_id - 1;
                }
                if($scope.listadoFila[i].int_id == scope.int_id && bandera == 0) {
                    $scope.listadoFila.splice(i,1);
                    i-=1;
                    bandera=1;
                }
            }
            bandera=0;
        };

        $scope.agregarTabular = function(columna, tabu) {
            for(var i=0; i<columna.tabular.length; i++) {
                if(bandera == 1){
                    columna.tabular[i].int_id = columna.tabular[i].int_id + 1;
                }
                if(columna.tabular[i].int_id == tabu.int_id && bandera == 0) {
                    columna.tabular.splice(i+1,0,
                        {
                            "int_id": tabu.int_id+1,
                            'str_descripcion':''
                        }
                    );
                    i+=1;
                    bandera=1;
                }
            }
            bandera=0;
        };

        $scope.eliminarTabular = function(columna, tabu) {
            if(columna.tabular.length>1){
                for(var i=0; i<columna.tabular.length; i++){
                    if(bandera == 1) {
                        columna.tabular[i].int_id = columna.tabular[i].int_id - 1;
                    }

                    if(columna.tabular[i].int_id == tabu.int_id && bandera == 0) {
                        columna.tabular.splice(i,1);
                        i-=1;
                        bandera=1;
                    }
                }
                bandera=0;
            };
        }

        $scope.guardarMatriz = function (pregunta) {
            $scope.preguntaMatriz =
                {
                    'int_id_encuesta': $scope.encuesta.int_id,
                    'int_obligatoria': pregunta.obligatoriedadPregunta,
                    'str_ayuda': pregunta.ayudaPregunta,
                    'int_id_variable': $scope.variableSeleccionada,
                    'int_id_tipo_pregunta': $scope.respuesta.tipoRespuesta.type,
                    'str_enunciado': pregunta.descripcionPregunta,
                    'codigo': pregunta.codigoPregunta,
                    'columna': $scope.listadoColumnas,
                    'numId': numIdPregunta++,
                    'fila': $scope.listadoFila
                };
            console.log(JSON.stringify($scope.preguntaMatriz));
        };
/*
        MyAPIServiceFactory.obtener(urlGuardarMatriz, $scope.preguntaMatriz)
            .success(function (msg) {
                alert('ingreso Correctamente '+JSON.stringify(msg));
            })
            .error(function (err) {
                alert(JSON.stringify(err));
            });
            */
/*
        {"int_id_encuesta":"15","int_obligatoria":true,"str_ayuda":"FAÑLSKDJF","int_id_variable":"8",
            "int_id_tipo_pregunta":"matriz","str_enunciado":"kjflka","codigo":"JAKJ",
            "columna":[{"int_id":1,"str_descripcion":"FAÑL",
            "tabular":[{"int_id":1,"str_descripcion":"DSAF","$$hashKey":"object:207"},
                {"int_id":2,"str_descripcion":"AFDS","$$hashKey":"object:229"}],"$$hashKey":"object:205"},
            {"int_id":2,"str_descripcion":"KJFAJDF","tabular":[{"int_id":1,"str_descripcion":"FAD","$$hashKey":"object:215"}],
                "$$hashKey":"object:213"},{"int_id":3,"str_descripcion":"FSJÑ","tabular":[{"int_id":1,"str_descripcion":"AFDAFS",
                "$$hashKey":"object:223"}],"$$hashKey":"object:221"}],"fila":[{"int_id":1,"str_descripcion":"FADF","$$hashKey":"object:235"},
            {"int_id":2,"str_descripcion":"DFJK","$$hashKey":"object:237"},{"int_id":3,"str_descripcion":"DDSJFAÑ","$$hashKey":"object:239"},
            {"int_id":4,"str_descripcion":"KJFD","$$hashKey":"object:241"}]}
  */
    });