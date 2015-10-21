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

// obtiene todos los elementos de la tabla "comunidad"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("SELECT int_id, int_id_canton, int_id_parroquia, str_descripcion FROM comunidad;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_comunidad / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {

                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

//Inserta un elemento en la tabla comunidad
exports.db_insertar = function(comunidadObj, cb) {
    var insertado = true;
    client.query("INSERT INTO comunidad (int_id, int_id_canton, int_id_parroquia, str_descripcion) VALUES (?, ?, ?, ?);",
        [comunidadObj.int_id_comunidad, comunidadObj.int_id_canton, comunidadObj.int_id_parroquia, comunidadObj.str_descripcion])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_comunidad / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};


// obtiene los elementos hijos (comunidad) de los padres (canton y parroquia)
exports.db_get_elemento_by_id = function(cantonParroquiaObj, cb) {
    var data = [];
    client.query("SELECT * FROM comunidad WHERE int_id_canton = ? AND int_id_parroquia = ?;",
        [cantonParroquiaObj.int_id_canton, cantonParroquiaObj.int_id])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_comunidad / db_get_elemento_by_id : ' + inspect(err));
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


