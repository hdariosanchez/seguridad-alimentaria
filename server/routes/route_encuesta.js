'use strict';
var data_encuesta = require('../../model/model_encuesta.js');
var data_encuesta_variable = require('../../model/model_encuesta_variable');

//++++++++++++++LISTADO PRODUCTO++++++++++++++++++++++
exports.getlistado = function (req, res) {
  data_encuesta.connect();
  data_encuesta.db_get_listado(function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de encuestas PENDIENTES."
      });
    }
  });
};

exports.getlistadoInactivo = function (req, res) {
  data_encuesta.connect();
  data_encuesta.db_get_listado_inactivo(function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de encuestas INACTIVAS."
      });
    }
  });
};

exports.getlistaActivo = function (req, res) {
  data_encuesta.connect();
  data_encuesta.db_get_listado_activo(function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de encuestas ACTIVAS."
      });
    }
  });
};



exports.getlistadoEncuestaVariable = function (req, res) {
  data_encuesta_variable.connect();
  data_encuesta_variable.db_get_listadoEncuestaVariable(req, function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de variables de la encuesta seleccionada"
      });
    }
  });
};


exports.editarEncuesta = function(req, res){
  data_encuesta.connect();
  data_encuesta.db_actualizar(req.query, function(bandera){
    bandera ?
        res.status(200).json({
          "status": 200,
          "message": "Éxito: Editando encuesta."
        }) :
        res.status(500).json({
          "status": 500,
          "message": "Error: Editando encuesta."
        });
  });
};

exports.eliminarEncuetaVariables = function(req, res){
  data_encuesta_variable.connect();
  try{
    var verificador = true;
    for(var i= req.body.variables.length - 1; i>=0; i--){
      data_encuesta_variable.db_eliminar(req.body.int_id_encuesta, req.body.variables[i], function(bandera){
        if (!bandera) verificador = false;
      });
    }
    verificador ?
        res.status(200).json({
          "status": 200,
          "message": "Éxito: Eliminando las variables de la encuesta."
        }) :
        res.status(500).json({
          "status": 500,
          "message": "Error: Eliminando las variables de la encuesta."
        });
  }catch(e){
    res.status(500).json({
      "status": 500,
      "message": "Catch: Excepción al eliminar las variables de la encuesta."
    });
  }
};

exports.actualizarDefinitivo = function(req, res){
  data_encuesta.connect();
  try{
    data_encuesta.db_actualizar_inactivo(req.query, function(bandera){
      bandera ?
          res.status(200).json({
            "status": 200,
            "message": "Éxito: Actualizando el estado de encuesta a INACTIVO."
          }) :
          res.status(500).json({
            "status": 500,
            "message": "Error: Actualizando el estado de encuesta a INACTIVO."
          });
    });
  }catch(e){
    res.status(500).json({
      "status": 500,
      "message": "Catch: Excepción al actualizar el estado de encuesta a INACTIVO."
    });
  }
};


exports.insertarEncuesta = function(req,res){
  data_encuesta.connect();
  data_encuesta_variable.connect();
  console.log(req.query);
  var id_encuesta = "";
  try{
    data_encuesta.db_insertar(req.query, function(bandera){
      if(bandera){
        var verificador = true;
        data_encuesta.db_get_ultimo_elemento(function (data) {
          id_encuesta = data[0];
          if (req.query.variables === undefined){
            req.query.variables = [1];
          }
          for(var i= req.query.variables.length - 1; i>=0; i--){
            data_encuesta_variable.db_insertar(data[0].int_id, req.query.variables[i], function (bandera) {
              if (!bandera) verificador = false;
            })
          }
          verificador ?
              res.status(200).json({
                "Estado":200,
                "Mensaje":"Éxito: Ingresando la encuesta nueva con variables. (editar Encuesta)",
                "encuesta":id_encuesta
              }) :
              res.status(500).json({
                "status": 500,
                "message": "Error: Ingresando la encuesta nueva con variables. (editar Encuesta)"
              });
        })
      } else {
        res.status(500).json({
          "status": 500,
          "message": "Error: Ingresando la encuesta nueva. (editar Encuesta)"
        });
      }
    });
  } catch(e){
    res.status(500).json({
      "Estado":500,
      "Mensaje":"Error: Excepción al ingresar la encuesta nueva. (editar Encuesta)"
    })
  }
};


exports.guardarDefinitivo = function(req, res){
  data_encuesta.connect();
  data_encuesta_variable.connect();
  try{
    data_encuesta.db_guardar_inactivo(req.query,function(bandera){
      if(bandera){
        var verificador = true;
        data_encuesta.db_get_ultimo_elemento(function (data) {
          for(var i= req.query.variables.length - 1; i>=0; i--){
            data_encuesta_variable.db_insertar(data[0].int_id, req.query.variables[i], function (bandera) {
              if (!bandera) verificador = false;
            })
          }
          verificador ?
              res.status(200).json({
                "Estado":200,
                "Mensaje":"Éxito: Ingresando la encuesta nueva con variables. (nueva Encuesta)"
              }) :
              res.status(500).json({
                "status": 500,
                "message": "Error: Ingresando la encuesta nueva con variables. (nueva Encuesta)"
              });
        })
      } else {
        res.status(500).json({
          "status": 500,
          "message": "Error: Ingresando la encuesta nueva. (nueva Encuesta)"
        });
      }
    });
  }catch(e){
    res.status(500).json({
      "Estado":500,
      "Mensaje":"Error: Excepción al ingresar la encuesta nueva. (nueva Encuesta)"
    })
  }
};


exports.agregarEncuestaVariables = function(req,res){
  data_encuesta_variable.connect();
  try{
      var verificador = true;
      for(var i= req.body.variables.length - 1; i>=0; i--){
        data_encuesta_variable.db_insertar(req.body.int_id_encuesta, req.body.variables[i], function (bandera) {
          if (!bandera) verificador = false;
        })
      }
      verificador ?
        res.status(200).json({
          "Estado":200,
          "Mensaje":"Éxito: Agregando las variables de la encuesta."
        }) :
        res.status(500).json({
          "status": 500,
          "message": "Error: Agregando las variables de la encuesta."
        });
  }catch(e){
    res.status(500).json({
      "Estado":500,
      "Mensaje":"Error: Excepción al agregar las variables de la encuesta."
    })
  }
};
