var Q = require('q');
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
exports.db_get_listadoPregunta = function(req,res,cb) {
    var data = [];
    client.query("SELECT p.int_id, p.int_id_encuesta, p.int_id_variable, p.int_id_tipo_pregunta, p.int_numero, p.str_enunciado, p.str_ayuda, " +
    "p.int_obligatoria, v.int_id as int_id_variable, v.int_id_padre as int_id_padre_variable,v.str_descripcion as str_descripcion_variable, " +
    "v.flt_numero FROM pregunta as p inner join variable as v on p.int_id_variable=v.int_id WHERE p.int_id_encuesta=? AND v.str_estado = ? " +
        "ORDER BY p.int_numero DESC",
        [req.query.intId, 'ACTIVO'])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_listadoPregunta : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

//
exports.db_get_listadoTest = function(req,res,cb) {
    var data = [];
    client.query("select t.int_id, t.int_id_pregunta, t.str_descripcion, t.int_valor, t.int_correcto, t.str_desc_campo, p.int_id_tipo_pregunta " +
    "from test as t inner join pregunta as p on p.int_id = t.int_id_pregunta AND p.int_id_encuesta = ?", [req.query.intId])

        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_listadoTest : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

exports.db_get_listadoEscala = function(req, res, cb) {
    var data = [];
    client.query("SELECT e.int_id_pregunta, e.str_desc_inicio, e.str_desc_fin, e.int_inicio, e.int_fin, p.int_id_tipo_pregunta from escala as e inner join pregunta " +
    "as p on p.int_id = e.int_id_pregunta AND p.int_id_encuesta = ?", [req.query.intId])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_listadoEscala : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};

//{"int_id":"149","int_id_padre":"141","flt_numero":"4","str_descripcion":"PRODUCTO HIJO2.4","str_estado":"ACTIVO",
// "nodes":[],"flt_costo":false,"respuesta":true,"flt_peso":false,"frecuencia":[
// {"int_id":"2","str_descripcion":"Semanal","flt_coeficiente":"4","str_estado":"ACTIVO","respuesta":true}
// ]}

exports.db_get_listado_canasta_frecuencia = function(req, res, cb) {
    var data = [];
    client.query("SELECT  f.int_id, f.str_descripcion, f.flt_coeficiente, f.str_estado, p.int_id_tipo_pregunta, cf.int_id_pregunta " +
    "FROM pregunta as p, canasta_frecuencia as cf, frecuencia as f " +
    "WHERE p.int_id = cf.int_id_pregunta AND  f.int_id = cf.int_id_frecuencia AND p.int_id_encuesta = ?", [req.query.intId])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_listado_canasta_frecuencia : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};


exports.db_get_listado_canasta_producto = function(req, res, cb) {
    var data = [];
    client.query("SELECT pr.int_id, pr.int_id_padre, pr.flt_numero, pr.str_descripcion, pr.str_estado, p.int_id_tipo_pregunta, cp.int_id_pregunta " +
    "FROM pregunta as p, canasta_producto as cp, producto as pr " +
    "WHERE p.int_id = cp.int_id_pregunta AND  pr.int_id = cp.int_id_producto AND p.int_id_encuesta = ?", [req.query.intId])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_listado_canasta_producto : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};


exports.db_insertar_respuesta = function(encuestaRespuesta, id, fecha, cb){
    var insertado = true;
    client.query("INSERT INTO respuesta (int_id_pregunta, int_id_encuesta_resuelta, dt_fecha_hora) " +
        "VALUES (?, ?, ?);",
        [encuestaRespuesta.int_id, id, fecha])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });

};


exports.db_insertar_respuesta_seleccion_simple = function(respuestaSeleccionSimple, id, cb){
    var insertado = true;
    if(respuestaSeleccionSimple.respuesta != false){
        client.query("INSERT INTO resp_seleccion_simple (int_id_respuesta, int_id_opc_seleccionada, str_campo_texto) " +
            "VALUES (?, ?, ?);",
            [id, respuestaSeleccionSimple.int_id, respuestaSeleccionSimple.respuestaOtros || 'NaN'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_seleccion_simple : ' + inspect(err));
            })
            .on('end', function() {
                cb(insertado);
            });
    }
};

exports.db_insertar_respuesta_seleccion_multiple = function(respuestaSeleccionMultiple, id, cb){
    var insertado = true;
    if(respuestaSeleccionMultiple.respuesta == true){
        client.query("INSERT INTO resp_seleccion_multiple (int_id_respuesta, int_id_opc_seleccionada, str_campo_texto) " +
            "VALUES (?, ?, ?);",
            [id, respuestaSeleccionMultiple.int_id, respuestaSeleccionMultiple.respuestaOtros || 'NaN'])
            .on('error', function(err) {
                insertado = false;
                console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_seleccion_multiple : ' + inspect(err));
            })
            .on('end', function() {
                cb(insertado);
            });
    }
};

exports.db_insertar_respuesta_escala = function(respuestaEscala, id, cb){
    var insertado = true;
    client.query("INSERT INTO resp_escala (int_id_respuesta, int_valor_seleccionado) " +
        "VALUES (?, ?);",
        [id, respuestaEscala[0].respuesta])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_escala : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
    };

exports.db_insertar_respuesta_hora = function(respuestaHora, id, cb){
    var insertado = true;
    client.query("INSERT INTO resp_hora (int_id_respuesta, t_hora) " +
        "VALUES (?, ?);",
        [id, respuestaHora.respuesta])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_escala : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};



exports.db_insertar_respuesta_fecha = function(respuestaHora, id, cb){
    var insertado = true;
    client.query("INSERT INTO resp_fecha (int_id_respuesta, d_fecha) " +
        "VALUES (?, ?);",
        [id, respuestaHora.respuesta])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_fecha : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

exports.db_insertar_respuesta_parrafo = function(respuestaParrafo, id, cb){
    var insertado = true;
    client.query("INSERT INTO resp_parrafo (int_id_respuesta, str_parrafo) " +
        "VALUES (?, ?);",
        [id, respuestaParrafo.respuesta])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_parrafo : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

exports.db_insertar_respuesta_texto = function(respuestaTexto, id, cb){
    var insertado = true;
    client.query("INSERT INTO resp_texto (int_id_respuesta, str_texto) " +
        "VALUES (?, ?);",
        [id, respuestaTexto.respuesta])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_parrafo : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

exports.db_insertar_respuesta_canasta = function(productoObj, id, cb){
    var insertado = true;
    var int_id_frecuencia = '';
    for(var i = productoObj.nodes.length - 1; i >=0; i--){
      if(productoObj.nodes[i].respuesta != false) {
          int_id_frecuencia = productoObj.nodes[i].int_id;
      }
    }
    client.query("INSERT INTO resp_canasta (int_id_respuesta, int_id_producto, flt_peso, flt_costo, int_id_frec_seleccionada) " +
        "VALUES (?, ?, ?, ?, ?);",
        [id, productoObj.int_id, productoObj.flt_peso, productoObj.flt_costo, int_id_frecuencia])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_vistaEncuesta / db_insertar_respuesta_canasta : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

// obtiene todos los elementos de la tabla "producto"
exports.db_get_ultimo_id_encuesta_resuelta = function(cb) {
    var data = [];
    client.query("SELECT int_id FROM encuesta_resuelta ORDER BY int_id DESC LIMIT 1;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_ultimo_id_encuesta_resuelta : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};


exports.db_get_ultimo_id_respuesta = function(cb) {
    var data = [];
    client.query("SELECT int_id FROM respuesta ORDER BY int_id DESC LIMIT 1;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_vistaEncuesta / db_get_ultimo_id_respuesta : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
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