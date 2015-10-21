/**
 * Created by darioh on 27/06/15.
 */
var data_comunidad = require('../../model/model_comunidad.js');

/* obtiene el listado de todos los elementos de la tabla "frecuencia" en un objeto JSON */
exports.getlistado = function (req, res) {
    data_comunidad.connect();
    data_comunidad.db_get_listado(function (datos) {
        if (datos){
            res.status(200).json(datos);
        } else {
            res.status(500).json({
                "Estado":500,
                "Mensaje":"Error: Obteniendo listado de comunidad."
            });
        }
    });
};

exports.getlistadoFiltrado = function (req, res) {
    data_comunidad.connect();
    data_comunidad.db_get_elemento_by_id(req.body, function (datos) {
        if (datos){
            res.status(200).json(datos);
        } else {
            res.status(500).json({
                "Estado":500,
                "Mensaje":"Error: Obteniendo listado de comunidad filtrada."
            });
        }
    });
};

 exports.insertar = function(req,res){
     data_comunidad.connect();
     data_comunidad.db_insertar(req.body, function(bandera) {
         bandera ?
             res.status(200).json({
                 "status": 200,
                 "message": "Éxito: Ingreso comunidad."
             }) :
             res.status(500).json({
                 "status": 500,
                 "message": "Error: Insertando comunidad."
             });
     });
 };
