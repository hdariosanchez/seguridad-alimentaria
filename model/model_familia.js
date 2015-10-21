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
    client.query("INSERT INTO familia (int_id, int_id_canton, int_id_parroquia, int_id_comunidad, str_descripcion) " +
        "VALUES (?, ?, ?, ?, ?);",
        [encuestaResuelta[6].numero, 1, encuestaResuelta[5].int_id_canton, encuestaResuelta[5].int_id_parroquia, encuestaResuelta[5].int_id, encuestaResuelta[6].str_descripcion])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_familia / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};
