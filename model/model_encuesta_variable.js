var inspect = require('util').inspect;
var Client = require('mariasql');
var client = new Client();

// genera la conexión a la base de datos "proyectoSeguridad"
exports.connect = function() {
    client.connect({
        host: '127.0.0.1',
        user: 'root',
        password: 'H3rm3sSanch3z',
        db: 'proyectoseguridad'
    });
    client.on('connect', function() { console.log('Client connected'); }
    ).on('error', function(err) { console.log('Client error: ' + err); }
    ).on('close', function(hadError) { console.log('Client closed'); });
}

exports.db_insertar = function(idEncuesta, variable, cb) {
    var insertado = true;
    client.query("INSERT INTO encuesta_variable (int_id_encuesta, int_id_variable) VALUES (?, ?);",[idEncuesta, variable])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_encuesta_variable / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

exports.db_get_listadoEncuestaVariable = function(req, cb) {
    var data = [];
    client.query("SELECT * FROM encuesta_variable WHERE int_id_encuesta = ?;",
        [req.body.int_id_encuesta])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta_variable / db_get_listadoEncuestaVariable : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0 ? cb(data) : cb(false);
        });
};



exports.db_eliminar = function(int_id_encuesta, int_id_variable, cb) {
    var eliminado = true;
    client.query("DELETE FROM encuesta_variable WHERE int_id_encuesta = ? AND int_id_variable = ?;",
        [int_id_encuesta, int_id_variable])
        .on('error', function(err) {
            eliminado = false;
            console.log('Error: SQL error model_encuesta_variable / db_eliminar : ' + inspect(err));
        })
        .on('end', function() {
            cb(eliminado);
        });
};