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

// obtiene todos los elementos de la tabla "parroquia"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("SELECT * FROM parroquia;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_parroquia / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {

                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

// Inserta un elemento en parroquia
exports.db_insertar = function(parroquiaObj, cb) {
    var insertado = true;
    client.query("INSERT INTO parroquia (int_id, int_id_canton, str_descripcion) VALUES (?, ?, ?);",
        [parroquiaObj.int_id_parroquia, parroquiaObj.int_id_canton, parroquiaObj.str_descripcion])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_parroquia / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

// obtiene los elementos hijos (parroquia) de su padre (cantón)
exports.db_get_elemento_by_id = function(cantonObj, cb) {
    var data = [];
    client.query("SELECT * FROM parroquia WHERE int_id_canton = ?",[cantonObj.int_id])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_parroquia / db_get_elemento_by_id : ' + inspect(err));
                })
                .on('end', function(info) {
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};


