/**
 * Created by darioh on 03/06/15.
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
}

// obtiene todos los elementos de la tabla "grupo"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("SELECT int_id as id, int_id_padre, flt_numero, str_descripcion as title, str_estado FROM variable WHERE str_estado = 'ACTIVO';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_variable / db_get_listado : ' + inspect(err));
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
                    console.log('Error: SQL error model_variable / db_get_listado_variable_por_encuesta : ' + inspect(err));
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
exports.db_insertar = function(subVariableNueva, cb) {
    var insertado = true;
    if(subVariableNueva._id_padre == 'NULL'){
        client.query("INSERT INTO variable (int_id_padre, flt_numero, str_descripcion, str_estado) VALUES (?, ?, ?, ?);",
            [null, '0',subVariableNueva._descripcion, 'ACTIVO'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_variable / db_insertar (padre) : ' + inspect(err));
            })
            .on('end', function() {
                cb(insertado);
            });
    }else{
        client.query("INSERT INTO variable (int_id_padre, flt_numero, str_descripcion, str_estado) VALUES (?, ?, ?, ?);",
            [subVariableNueva._id_padre, '0',subVariableNueva._descripcion, 'ACTIVO'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_variable / db_insertar (hija) : ' + inspect(err));
            })
            .on('end', function() {
                console.log('Result finished successfully');
                cb(insertado);
            });
    }
};



exports.db_eliminar = function(id_producto, cb) {
    var eliminado = true;
    client.query("UPDATE variable SET str_estado = ? WHERE int_id = ?;",
        ["INACTIVO" ,id_producto])
        //{var_id_producto: id_producto})
        .on('error', function(err) {
            eliminado = false;
            console.log('Error: SQL error model_variable / db_eliminar : ' + inspect(err));
        })
        .on('end', function() {
            cb(eliminado);
        });
}



// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};
