/**
 * Created by darioh on 11/06/15.
 */

'use strict';
var data_pregunta = require('../../model/model_pregunta.js');
var data_respuesta = require('../../model/model_respuesta.js');
var data_variable = require('../../model/model_variable');
var data_encuesta = require('../../model/model_encuesta.js');

var i=0;
var row=[];
//array para padre.
var parents=[];
//array para hijo.
var childrens=[];
//Nombre de la variable
var childrenNombre = 'nodes';


//++++++++++++++LISTADO PRODUCTO++++++++++++++++++++++
exports.getlistado = function (req, res) {
    data_producto.connect();
    data_producto.db_get_listado(function (datos) {
        res.json(datos);
    });
};

exports.getlistadoVariablePorEncuesta = function(req, res) {
    data_variable.connect();
    data_variable.db_get_listado_variable_por_encuesta(req.body.int_id_encuesta, function (datos) {
        limpiaDatos();
        for(i=datos.length - 1; i>=0; i--){
            datos[i][childrenNombre]=[];
            row=datos[i];
            if(row.int_id_padre == null){
                JSON.stringify(parents.push(row));
            }
            else{
                JSON.stringify(childrens.push(row));
            }
        }
        for(var j=0; j<2; j++) {
            parents.forEach(function (parent) {
                loopChildrens(childrens, parent, j);
            });
        }
        res.json(json);
    });
};
var json=[];
// Recursividad para comprobar los children
var loopChildrens = function(rows, parent, bandera){
    if(rows.length === 0 && bandera === 0){json.push(parent);}
    if(rows.length > 0 && bandera === 0){
        rows.forEach(function (row) {
            if(row.int_id_padre == parent.int_id){
                parent.nodes.push(row);
                loopChildrens(rows, row,0);
            }
        });
    }
    //json.splice(0, json.length);
    if(rows.length>0 && bandera == 1) {
        json.push(parent);
    }
};

// Limpia los datos...
var limpiaDatos = function(){
    json.splice(0, json.length);
    //console.log("Longitud de json->"+json.length);
    parents.splice(0, parents.length);
    //console.log("Longitud de json->"+parents.length);
    childrens.splice(0, childrens.length);
    //console.log("Longitud de json->"+childrens.length);
};
var datos = 0;
//+++++++++++++++++++INSERTAR UN PRODUCTO++++++++++++++++++++++++
exports.insertarPregunta = function(req,res){
    data_pregunta.connect();
    data_respuesta.connect();
    data_encuesta.connect();
    //var id_preguntaDb = null;
     datos = req.body; //Esto causo error al convertirlo enJSON por el forEach 'NO LO TIENE'
    //var datosJson = datos;
    try {
        data_encuesta.db_activar_encuesta(datos[0].id_encuesta, function (exito) {
            i_loop =0;
            k_loop = 0;
            funcionLoopRespuesta(datos[i_loop]);
        });
        res.end();
    } catch (e) {
        res.end();
        console.log('Error en el route_en el catch en routes/route_pregunta'+e);
    }
};

var i_loop = 0;
var j_loop = 0;
var k_loop = 0;
var l_loop = 0;

var funcionLoopRespuesta = function (pregunta) {
    data_pregunta.db_insertar(pregunta, function(bandera){
        console.log("Bandera: "+bandera);
        data_pregunta.db_get_ultimo_id(function (dat) {
            //------------------------------------------------
            j_loop = 0;
            k_loop = 0;
            if(pregunta.type != 'canasta'){
                funcionLoopRespuestaSMHF(pregunta, dat[0].int_id);
            } else {
                funcionLoopRespuestaCanasta(pregunta, dat[0].int_id);
            }
            //------------------------------------------------
            i_loop++;
            if(i_loop < datos.length) {
                funcionLoopRespuesta(datos[i_loop]);
            } else{
                console.log(' i_loop Fuera de los limites');
                i_loop =0;
            }
        });
    });
};

var funcionLoopRespuestaSMHF = function (pregunta, idRespuesta) {
    if(j_loop  < pregunta.nodes.length){
        data_respuesta.db_insertar(pregunta.nodes[j_loop++], idRespuesta, function(bandera){
            if(bandera) {
                console.log('inserto en if de insercion de respuesta ' + bandera);
            }
        });
        funcionLoopRespuestaSMHF(pregunta, idRespuesta);
    }
};


var funcionLoopRespuestaCanasta = function (pregunta, idRespuesta) {
    if(k_loop  < pregunta.productos.length){
        if(k_loop === 0){
            l_loop = 0;
            funcionLoopRespuestaCanastaFrecuencia(pregunta.productos[k_loop], idRespuesta)
        }
        data_respuesta.db_insertar_canasta_producto(pregunta.productos[k_loop++], idRespuesta, function (bandera) {
            console.log('Se inserto los productos correctamente '+ bandera);
        });
        funcionLoopRespuestaCanasta(pregunta, idRespuesta);
    }
};

var funcionLoopRespuestaCanastaFrecuencia = function (producto, idRespuesta) {
    if(l_loop  < producto.frecuencia.length){
        data_respuesta.db_insertar_canasta_frecuencia(producto.frecuencia[l_loop++], idRespuesta, function (bandera) {
             console.log('Si ingreso las frecuencias. '+bandera);
        });
        funcionLoopRespuestaCanastaFrecuencia(producto, idRespuesta);
    }
};