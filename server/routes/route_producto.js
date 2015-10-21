'use strict';
var data_producto = require('../../model/model_producto.js');
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

exports.getlistadoProductoArbol = function (req, res) {
  data_producto.connect();
  data_producto.db_get_listado(function (datos) {
    limpiaDatos();
    for(i=datos.length - 1; i>=0; i--){
      datos[i][childrenNombre]=[];
      datos[i]['flt_costo']=false;
      datos[i]['respuesta']=false;
      datos[i]['flt_peso']=false;
      row=datos[i];
      if(row.int_id_padre == null){
        JSON.stringify(parents.push(row));
      }
      else{
        row['frecuencia'] = [];
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

  if(rows.length>0 && bandera ==0){
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
  console.log("Longitud de json->"+json.length);

  parents.splice(0, parents.length);
  console.log("Longitud de json->"+parents.length);

  childrens.splice(0, childrens.length);
  console.log("Longitud de json->"+childrens.length);
};



/*
//++++++++++++++EDITA UN PRODUCTO++++++++++++++++++++++
exports.editarProducto = function(req, res){
  console.log("LLegue a la Funcion EDITAR DE CONTROLLERPRODUCTO");
  data_producto.connect();
  var desc_prod = req.query._descripcion;
  var id_grupo;
  try{
    console.log("DENTRO DEL TRY DE CONTROLLER EN EDITAR");
    console.log(req.query);
    data_producto.db_actualizar(req.query, function(bandera){
      console.log('Bandera: '+bandera);
      res.end();
    });
  }catch(e){
    console.log("En el catch del editar grupo del server.. fallo!!!");
    console.log(e);

    console.log("Número de grupo = "+id_grupo+" , descripcion "+desc_prod);
  }
};
*/
//+++++++++++++++++++INSERTAR UN PRODUCTO++++++++++++++++++++++++
exports.insertarProducto = function(req,res){
  data_producto.connect();
  console.log(req.query);
  try{
    data_producto.db_insertar(req.query,function(bandera){
      console.log("Bandera: "+bandera);
      res.end();
    });
  }catch(e){
    res.redirect('/');
    console.log(e);
  }
};


exports.eliminar = function(req,res) {
    data_producto.connect();
    console.log(req.query.variable.length);
    try {
        if(req.query.bandera == 0)
        {
            for (i = 0; i < req.query.variable.length; i++) {
                console.log('--------------------------------->'+req.query.variable[i]);
                data_producto.db_eliminar(req.query.variable[i],function(bandera){
                    console.log("Bandera 0: "+bandera);
                });
            }
        }else{
            data_producto.db_eliminar(req.query.variable,function(bandera){
                console.log("Bandera 1: "+bandera);
            });
        }
        res.end();
    } catch (e) {
        res.redirect('/api/#/');
        console.log(e);
        //console.log("Número de variable = " + id_variable + " , descripcion " + desc_prod);
    }
    res.end();
};