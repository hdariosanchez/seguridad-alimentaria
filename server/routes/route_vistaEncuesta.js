/**
 * Created by darioh on 16/06/15.
 */
/**
 * Created by darioh on 23/03/15.
 */
'use strict';
var Q = require('q');
var data_vistaEncuesta = require('../../model/model_vistaEncuesta.js');
var data_encuesta_resuelta = require('../../model/model_encuesta_resuelta');
var data_familia = require('../../model/model_familia');

var i=0;
var row=[];
//array para padre.
var parents=[];
//array para hijo.
var childrens=[];
//Nombre de la variable
var childrenNombre = 'nodes';
var padreNombre = 'int_id_padre';
var nombreRespuesta = 'respuesta';
var respuestaOtros = 'respuestaOtros';

var datoEncuesta = null;

var arrayProducto = [];


exports.getlistadovistaEncuesta = function(req, res) {
    arrayProducto = [];
    data_vistaEncuesta.connect();
    data_vistaEncuesta.db_get_listadoPregunta(req,res,function (datos) {
        limpiaDatos();
        for(i=datos.length - 1; i>=0; i--){
            datos[i][padreNombre]= null;
            datos[i][nombreRespuesta]= '';
            datos[i][childrenNombre]=[];

            row=datos[i];
            if(datos[i].int_id_tipo_pregunta == '1'){
                datos[i].int_id_tipo_pregunta = 'text';
            }
             if(datos[i].int_id_tipo_pregunta == '6'){
             datos[i].int_id_tipo_pregunta = 'date';
             }
             if(datos[i].int_id_tipo_pregunta == '7'){
             datos[i].int_id_tipo_pregunta = 'time';
             }
             parents.push(row);
        }
        data_vistaEncuesta.db_get_listadoEscala(req, res,function (datos) {
            for(i=datos.length - 1; i>=0; i--){
                datos[i][padreNombre] = datos[i].int_id_pregunta;
                datos[i][nombreRespuesta]= false;
                datos[i][respuestaOtros]='';
                datos[i][childrenNombre]=[];

                if(datos[i].int_id_tipo_pregunta == '5'){
                    datos[i].int_id_tipo_pregunta = 'range';
                }
                row=datos[i];
                childrens.push(row);
            }

            data_vistaEncuesta.db_get_listadoTest(req, res, function (datos) {
                for(i=datos.length - 1; i>=0; i--){
                    datos[i][padreNombre] = datos[i].int_id_pregunta;
                    datos[i][nombreRespuesta]= false;
                    datos[i][respuestaOtros]='';
                    datos[i][childrenNombre]=[];

                    if(datos[i].int_id_tipo_pregunta == '4'){
                        datos[i].int_id_tipo_pregunta = 'checkbox';
                    }
                    if(datos[i].int_id_tipo_pregunta == '3'){
                        datos[i].int_id_tipo_pregunta = 'radio';
                    }

                    row=datos[i];
                    childrens.push(row);
                }
                data_vistaEncuesta.db_get_listado_canasta_producto(req, res, function (datos) {
                    for(i=datos.length - 1; i>=0; i--){
                        datos[i][padreNombre] = datos[i].int_id_pregunta;
                        datos[i][nombreRespuesta]= false;
                        datos[i][childrenNombre]=[];
                        if(datos[i].int_id_tipo_pregunta == '10'){
                            datos[i].int_id_tipo_pregunta = 'canasta';
                        }
                        //row=datos[i];
                        //childrens.push(row);
                    }
                    arrayProducto = datos;
                    data_vistaEncuesta.db_get_listado_canasta_frecuencia(req, res, function (datos) {
                        console.log('Viendo los datos de la frecuencia '+JSON.stringify(datos));
                        for(i=datos.length - 1; i>=0; i--){
                            datos[i][padreNombre] = datos[i].int_id_pregunta;
                            datos[i][nombreRespuesta] = false;
                            datos[i]["flt_costo"]= '';
                            datos[i]["flt_peso"]= "";
                            //datos[i][childrenNombre]=[];
                            if(datos[i].int_id_tipo_pregunta == '10'){
                                datos[i].int_id_tipo_pregunta = 'canasta';
                            }
                        }

                        for(i=arrayProducto.length - 1; i>=0; i--){
                            arrayProducto[i].nodes = datos;
                            childrens.push(arrayProducto[i]);
                        }

                        for(var j=0; j<2; j++) {
                            parents.forEach(function (parent) {
                                loopChildrens(childrens, parent, j);
                            });
                        }
                        res.json(json);
                    });
                });

            });
        });
    });
};


exports.insertar_pregunta_resuelta = function(req,res) {
    datoEncuesta = req.body[2];
    var nodesRespuesta = '';
    data_familia.connect();
    data_encuesta_resuelta.connect();
    data_vistaEncuesta.connect();
    try {
        data_familia.db_insertar(req.body, function (err, bander) {
            if (err) res.status(500).end();
            if(bander){
                data_encuesta_resuelta.db_insertar(req.body, function(err, bandera){
                    if (err) res.status(500).end();
                    data_encuesta_resuelta.db_get_ultimo_id(function(err, dato){
                        console.log('IDE DE LA ENCUESTA_RESUELTA ------->> '+JSON.stringify(dato));
                        if (err) res.status(500).end();
                        if(dato.length > 0){
                            i_loop =0;
                            funcionLoopRespuesta(datoEncuesta[i_loop], dato[0].int_id, req);
                        }
                    });
                });
            }
        });
        res.end();
    } catch (e) {
        //res.redirect('#/');
        console.log('Error en el route_en el catch en routes/route_pregunta'+e);
    }
};

var i_loop = 0;
var j_loop = 0;

var funcionLoopRespuesta = function (pregunta, idEncuestaResuelta, req) {
    data_vistaEncuesta.db_insertar_respuesta(pregunta, idEncuestaResuelta, req.body[1].fecha, function(err, dat){
        err ? console.log('Erro dentro de la funcion loop') : console.log('Todo bien dentro de la funcion loop');
        if(dat){
            data_vistaEncuesta.db_get_ultimo_id_respuesta(function (err, numero) {
                err ? console.log('Erro al traer db_get_ultimo_id_respuesta') : console.log('Obtuvo correctamente de db_get_ultimo_id_respuesta');
                console.log('ULTIMO ID DE LA RESPUESTA INGRESADA '+JSON.stringify(numero));
                //------------------------------------------------
                j_loop = 0;
                funcionLoopRespuestaSMHF(pregunta, numero[0].int_id);
                //------------------------------------------------
                i_loop++;
                if(i_loop < datoEncuesta.length) {
                    funcionLoopRespuesta(datoEncuesta[i_loop], idEncuestaResuelta, req);
                } else{
                    console.log(' i_loop Fuera de los limites');
                    i_loop =0;
                }
            })
        }
    });
};

var funcionLoopRespuestaSMHF = function (pregunta, idRespuesta) {
    if (pregunta.int_id_tipo_pregunta == '1' || pregunta.int_id_tipo_pregunta == 'text'){
        data_vistaEncuesta.db_insertar_respuesta_texto(pregunta, idRespuesta,function(bandera){
            console.log('inserto en if de insercion de respuesta SIMPLE '+bandera);
        })
    }
    if (pregunta.int_id_tipo_pregunta == '2' || pregunta.int_id_tipo_pregunta == 'parrafo'){
        console.log('------------------------------<<<<<<<<< '+idRespuesta);
    }
    if (pregunta.int_id_tipo_pregunta == '3' || pregunta.int_id_tipo_pregunta == 'radio'){
        if(j_loop  < pregunta.nodes.length){
            data_vistaEncuesta.db_insertar_respuesta_seleccion_simple(pregunta.nodes[j_loop++], idRespuesta,function(err, bandera){
                console.log('Valor de la bandera en el radio-----------> '+bandera);
                err ? console.log('Erro al insertar seleccion simple') : console.log('Insercion correctamente de selecction simple');
                if(bandera) {
                    console.log('inserto en if de insercion de respuesta SIMPLE ' + bandera);
                }
            })
            funcionLoopRespuestaSMHF(pregunta, idRespuesta);
        }
    }
    if (pregunta.int_id_tipo_pregunta == '4' || pregunta.int_id_tipo_pregunta == 'checkbox'){
        if(j_loop < pregunta.nodes.length){
            data_vistaEncuesta.db_insertar_respuesta_seleccion_multiple(pregunta.nodes[j_loop++], idRespuesta, function (err, bandera) {
                err ? console.log('Erro al insertar seleccion multiple') : console.log('Insercion correctamente de selecction multiple');
                if(bandera) {
                    console.log('inserto en if de insercion de respuesta MULTIPLE ' + bandera);
                }
            });
            funcionLoopRespuestaSMHF(pregunta, idRespuesta);
        }
    }
    if (pregunta.int_id_tipo_pregunta == '5' || pregunta.int_id_tipo_pregunta == 'escala'){
        data_vistaEncuesta.db_insertar_respuesta_escala(pregunta.nodes, idRespuesta,function(bandera){
            console.log('inserto en if de insercion de respuesta ESCALA '+bandera);
        })
    }
    if (pregunta.int_id_tipo_pregunta == '6' || pregunta.int_id_tipo_pregunta == 'date'){
        data_vistaEncuesta.db_insertar_respuesta_fecha(pregunta, idRespuesta,function(bandera){
            console.log('inserto en if de insercion de respuesta simple '+bandera);
        })
    }
    if (pregunta.int_id_tipo_pregunta == '7' || pregunta.int_id_tipo_pregunta == 'time'){
        data_vistaEncuesta.db_insertar_respuesta_hora(pregunta, idRespuesta,function(bandera){
            console.log('inserto en if de insercion de respuesta HORA '+bandera);
        })
    }
    if (pregunta.int_id_tipo_pregunta == '10' || pregunta.int_id_tipo_pregunta == 'canasta'){
        if(j_loop  < pregunta.nodes.length) {
            data_vistaEncuesta.db_insertar_respuesta_canasta(pregunta.nodes[j_loop++], idRespuesta, function (bandera) {
                if(bandera) {
                    console.log('Éxito: Inserto respuesta de pregunta de canasta en funcionLoopRespuestaSMHF' + bandera);
                }else{
                    console.log('Error: Fallo respuesta de pregunta de canasta en funcionLoopRespuestaSMHF' + bandera);
                }
            });
            funcionLoopRespuestaSMHF(pregunta, idRespuesta);
        }
    }
};



var json=[];
// Recursividad para comprobar los children
var loopChildrens = function(rows, parent, bandera){
    if(rows.length>0 && bandera ==0){
        rows.forEach(function (row) {
            if(row.int_id_padre == parent.int_id){
                parent.nodes.push(row);
                loopChildrens(rows, row,0);
            }
        });
    }
    if(rows.length>0 && bandera == 1) {
        json.push(parent);
    }
};


// Limpia los idRespuesta
var limpiaDatos = function(){
    json.splice(0, json.length);
    console.log("Longitud de json->"+json.length);

    parents.splice(0, parents.length);
    console.log("Longitud de json->"+parents.length);

    childrens.splice(0, childrens.length);
    console.log("Longitud de json->"+childrens.length);

};