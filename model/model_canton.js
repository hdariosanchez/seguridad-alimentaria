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

// obtiene todos los elementos de la tabla "cantón"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("select int_id, str_descripcion from canton;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_canton / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log("Info: " + JSON.stringify(info));
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};
// inserta un elemento en la tabla cantón
exports.db_insertar = function(cantonObj, cb) {
    var insertado = true;
    client.query("INSERT INTO canton (int_id, str_descripcion) VALUES (?, ?);",
        [cantonObj.int_id_canton, cantonObj.str_descripcion])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_canton / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};

