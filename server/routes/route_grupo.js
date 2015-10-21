/**
 * Created by darioh on 23/03/15.
 */
'use strict';
var data_grupo = require('../../model/model_grupo.js');
var i=0;
var row=[];
//array para padre.
var parents=[];
//array para hijo.
var childrens=[];
//Nombre de la variable
var childrenNombre = 'nodes';

exports.getlistado = function(req, res, next) {
  data_grupo.connect();
  data_grupo.db_get_listado(function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de grupos."
      });
    }
  });
};

exports.getlistadoGrupo = function(req, res, next) {
  data_grupo.connect();
  data_grupo.db_get_listado(function (datos) {

    limpiaDatos();

    for(i=datos.length - 1; i>=0; i--){
      datos[i][childrenNombre]=[];
      row=datos[i];
      if(row.int_id_padre == null){
        JSON.stringify(parents.push(row));
        //console.log("IF-->"+row.str_descripcion);
      }
      else{
        JSON.stringify(childrens.push(row));
        //console.log("ELSE-->" +row.str_descripcion);
      }
    }
    //var bandera=0;
    for(var j=0; j<2; j++) {
      parents.forEach(function (parent) {
        loopChildrens(childrens, parent, j);
      });
    }
    res.status(200).json(json);
  });
};

var json=[];

// Recursividad para comprobar los children
var loopChildrens = function(rows, parent, bandera){
  if(rows.length > 0 && bandera == 0){
    rows.forEach(function (row) {
      if(row.int_id_padre == parent.id){
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

//+++++++++++++++++++INSERTAR UN SubGRUPO++++++++++++++++++++++++
exports.insertarGrupo = function(req,res){
  data_grupo.connect();
  console.log(req.query);
  try{
    data_grupo.db_insertar(req.query,function(bandera){
      bandera ?
          res.status(200).json({
            "status": 200,
            "message": "Éxito: Insertando grupo."
          }) :
          res.status(500).json({
            "status": 500,
            "message": "Error: Insertando grupo."
          });
    });
  }catch(e){
    res.status(500).json({
      "status": 500,
      "message": "Error: Excepción al ingresar grupo."
    });
  }
};