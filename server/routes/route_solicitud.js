var data_solicitud = require('../../model/model_solicitud');

exports.db_actualizar = function (req, res) {
    data_solicitud.connect();
    data_solicitud.db_actualizar_solicitud(req.body, function (datos) {
        res.end();
    });
};

