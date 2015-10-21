'use strict';
var data_frecuencia = require('../../model/model_frecuencia.js');

/* obtiene el listado de todos los elementos de la tabla "frecuencia" en un objeto JSON */
exports.getlistado = function (req, res) {
  data_frecuencia.connect();
  data_frecuencia.db_get_listado(function (datos) {
    if (datos){
      res.status(200).json(datos);
    } else {
      res.status(500).json({
        "Estado":500,
        "Mensaje":"Error: Obteniendo listado de frecuencias."
      });
    }
  });
};

/* inserta un nuevo elemento en la tabla "frecuencia" */
exports.insertar = function(req,res){
  data_frecuencia.connect();   
  var descripcion = req.query._frecuenciaDescripcion;
  var coeficiente = req.query._frecuenciaCoeficiente;
  data_frecuencia.db_insertar(descripcion, coeficiente,function(bandera) {
    bandera ?
        res.status(200).json({
          "status": 200,
          "message": "Éxito: Insertando frecuencia."
        }) :
        res.status(500).json({
          "status": 500,
          "message": "Error: Insertando frecuencia."
        });
  });
};
