var data_parroquia = require('../../model/model_parroquia.js');

/* obtiene el listado de todos los elementos de la tabla "frecuencia" en un objeto JSON */
exports.getlistado = function (req, res) {
    data_parroquia.connect();
    data_parroquia.db_get_listado(function (datos) {
        if (datos){
            res.status(200).json(datos);
        } else {
            res.status(500).json({
                "Estado":500,
                "Mensaje":"Error: Obteniendo listado de parroquia."
            });
        }
    });
};

exports.getlistadoFiltrado = function (req, res) {
    data_parroquia.connect();
    data_parroquia.db_get_elemento_by_id(req.body, function (datos) {
        if (datos){
            res.status(200).json(datos);
        } else {
            res.status(500).json({
                "Estado":500,
                "Mensaje":"Error: Obteniendo listado de parroquia filtrada."
            });
        }
    });
};

 exports.insertar = function(req,res){
     data_parroquia.connect();
     data_parroquia.db_insertar(req.body, function(bandera) {
         bandera ?
             res.status(200).json({
                 "status": 200,
                 "message": "Éxito: Ingreso parroquia."
             }) :
             res.status(500).json({
                 "status": 500,
                 "message": "Error: Insertanda parroquia."
             });
     });
 };

