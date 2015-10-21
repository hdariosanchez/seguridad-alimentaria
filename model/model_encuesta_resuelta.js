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
};


exports.db_insertar = function(encuestaResuelta, cb) {
    var insertado = true;
    client.query("INSERT INTO encuesta_resuelta (int_id_encuesta, int_id_usuario, int_id_canton, int_id_parroquia, int_id_comunidad, int_id_familia, d_fecha) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?);",
        [encuestaResuelta[0].int_id, encuestaResuelta[6].int_id_usuario, encuestaResuelta[5].int_id_canton, encuestaResuelta[5].int_id_parroquia, encuestaResuelta[5].int_id, encuestaResuelta[6].numero, encuestaResuelta[1].fecha])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_encuesta_resuelta / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};


exports.db_get_ultimo_id = function(cb) {
    var data = [];
    client.query("SELECT int_id FROM encuesta_resuelta ORDER BY int_id DESC LIMIT 1;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta_resuelta / db_get_ultimo_id : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};