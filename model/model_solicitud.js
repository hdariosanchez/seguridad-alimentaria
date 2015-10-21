/**
 * Created by darioh on 07/10/15.
 */

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

exports.db_actualizar_solicitud = function (solicitudObj, cb){
    var actualizado = true;
    console.log(JSON.stringify(solicitudObj));
    client.query("UPDATE usuario SET int_id_rol = ?, int_codigo = ? WHERE int_id = ?;",
        [solicitudObj.int_id_rol, solicitudObj.int_codigo, solicitudObj.int_id])
        .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_solicitud / db_actualizar_solicitud : ' + inspect(err));
        })
        .on('end', function() {
            cb(actualizado);
        });
};

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};

