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

// obtiene todos los elementos de la tabla "grupo"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("SELECT * FROM producto WHERE str_estado = 'ACTIVO';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_producto / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};




exports.db_get_listado_variable_por_encuesta = function(int_id_encuesta, cb) {
    var data = [];
    client.query("SELECT v.int_id, v.int_id_padre, ev.int_id_encuesta, v.flt_numero, v.str_descripcion, v.str_estado " +
        "FROM variable as v, encuesta_variable as ev " +
        "WHERE v.int_id = ev.int_id_variable AND ev.int_id_encuesta = ?;",
        [int_id_encuesta])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_producto / db_get_listado_variable_por_encuesta : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

// inserta un nuevo SubGrupo en la tabla "producto"
//exports.db_insertar = function(id_grupo, desc_producto, cb) {
exports.db_insertar = function(producto, cb) {
    var insertado = true;
    if(producto._id_padre == 'NULL'){
        client.query("INSERT INTO producto (int_id_padre, flt_numero, str_descripcion, str_estado) VALUES (?, ?, ?, ?);",
            [null, '0',producto._descripcion, 'ACTIVO'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_producto / db_insertar (padre) : ' + inspect(err));
            })
            .on('end', function() {
                cb(insertado);
            });
    }else{
        client.query("INSERT INTO producto (int_id_padre, flt_numero, str_descripcion, str_estado) VALUES (?, ?, ?, ?);",
            [producto._id_padre, '0',producto._descripcion, 'ACTIVO'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_producto / db_insertar (hijo) : ' + inspect(err));
            })
            .on('end', function() {
                cb(insertado);
            });
    }
};



exports.db_eliminar = function(id_producto, cb) {
    var eliminado = true;
    client.query("UPDATE producto SET str_estado = ? WHERE int_id = ?;",
        ["Inactivo" ,id_producto])
        .on('error', function(err) {
            eliminado = false;
            console.log('Error: SQL error model_producto / db_eliminar : ' + inspect(err));
        })
        .on('end', function() {
            cb(eliminado);
        });
}


// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};

