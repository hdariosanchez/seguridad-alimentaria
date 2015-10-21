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

// obtiene todos los elementos de la tabla encuesta con estado PENDIENTE
exports.db_get_listado = function(cb) {
    var data = [];
      client.query("SELECT * FROM encuesta WHERE str_estado = 'PENDIENTE';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
              data.length > 0? cb(data) : cb(false);
        });
};
// obtiene todos los elementos de la tabla encuesta con estado INACTIVO
exports.db_get_listado_inactivo = function(cb) {
    var data = [];
    client.query("SELECT * FROM encuesta WHERE str_estado = 'INACTIVO';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta / db_get_listado_inactivo : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};
// obtiene todos los elementos de la tabla encuesta con estado ACTIVO
exports.db_get_listado_activo = function(cb) {
    var data = [];
    client.query("SELECT * FROM encuesta WHERE str_estado = 'ACTIVO';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta / db_get_listado_activo : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

// inserta un nuevo elemento en la tabla encuesta
exports.db_insertar = function(encuestaNueva, cb) {
    var insertado = true;
    client.query("INSERT INTO encuesta (int_numero, str_titulo, str_descripcion, str_objetivo, str_destinado_a, str_instrucciones, dt_fecha_creacion, dt_fecha_modificacion) "
        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [encuestaNueva.int_numero, encuestaNueva.str_titulo, encuestaNueva.str_descripcion || null, encuestaNueva.str_objetivo || null, encuestaNueva.str_destinado_a || null, encuestaNueva.str_instrucciones || null, encuestaNueva.fechaCreacion || null, encuestaNueva.fechaModificacion || null])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_encuesta / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};


// cambia el estado de una encuesta de INACTIVO a ACTIVO
exports.db_activar_encuesta = function(id_encuesta, cb) {
    var actualizado = true;
    client.query("UPDATE encuesta SET str_estado = ? WHERE int_id = ?;",
        ["ACTIVO" , id_encuesta])
        //{var_id_producto: id_producto})
            .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_encuesta / db_activar_encuesta : ' + inspect(err));
            })
            .on('end', function() {
                cb(actualizado);
            });
};

// obtiene el ultimo elemento de la tabla encuesta
exports.db_get_ultimo_elemento = function(cb) {
    var data = [];
    client.query("SELECT int_id FROM encuesta ORDER BY int_id DESC LIMIT 1;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_encuesta / db_get_ultimo_elemento : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
}

//Actualiza el encabezado de la encuesta
exports.db_actualizar = function (encuestaEditar, cb){
    var actualizado = true;
    client.query("UPDATE encuesta SET str_titulo = ?, str_descripcion = ?, str_objetivo = ?, str_destinado_a = ?, str_instrucciones = ?, dt_fecha_modificacion = ? WHERE int_id = ?;",
        [encuestaEditar.str_titulo, encuestaEditar.str_descripcion, encuestaEditar.str_objetivo, encuestaEditar.str_destinado_a, encuestaEditar.str_instrucciones, encuestaEditar.dt_fecha_modificacion, encuestaEditar.int_id])
        .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_encuesta / db_actualizar : ' + inspect(err));
        })
        .on('end', function() {
            cb(actualizado);
        });
};

exports.db_guardar_inactivo = function (encuestaNueva, cb){
    var insertado = true;
    client.query("INSERT INTO encuesta (str_titulo, str_descripcion, str_objetivo, str_destinado_a, str_instrucciones, dt_fecha_creacion, dt_fecha_modificacion, str_estado) "
        + "VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [encuestaNueva.str_titulo, encuestaNueva.str_descripcion, encuestaNueva.str_objetivo, encuestaNueva.str_destinado_a, encuestaNueva.str_instrucciones, encuestaNueva.dt_fecha_creacion, encuestaNueva.dt_fecha_modificacion, encuestaNueva.str_estado])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_encuesta / db_guardar_inactivo : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};


exports.db_actualizar_inactivo = function (encuestaEditarId, cb){
    var actualizado = true;
    client.query("UPDATE encuesta SET str_estado = 'INACTIVO' WHERE int_id = ?;",
        [encuestaEditarId.int_id])
        .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_encuesta / db_actualizar_inactivo : ' + inspect(err));
        })
        .on('end', function() {
            cb(actualizado);
        });
};

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};
