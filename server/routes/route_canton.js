var data_canton = require('../../model/model_canton.js');

/* obtiene el listado de todos los elementos de la tabla "frecuencia" en un objeto JSON */
exports.getlistado = function (req, res) {
    data_canton.connect();
    data_canton.db_get_listado(function (datos) {
        if (datos){
            res.status(200).json(datos);
        } else {
            res.status(500).json({
                "Estado":500,
                "Mensaje":"Error: Obteniendo listado de cantón."
            });
        }
    });
};

exports.insertar = function(req,res){
    data_canton.connect();
    data_canton.db_insertar(req.body,function(bandera) {
        bandera ?
            res.status(200).json({
                "status": 200,
                "message": "Éxito: Ingreso cantón."
            }) :
            res.status(500).json({
                "status": 500,
                "message": "Error: Insertando cantón."
            });
    });
};
