/**
 * Created by darioh on 11/06/15.
 */

var inspect = require('util').inspect;
var Client = require('mariasql');

var client = new Client();

//genera la conexión a la base de datos "proyectoSeguridad"
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


//OBSERVACIÓN PARA ELIMINAR
// obtiene todos los elementos de la tabla "producto"
exports.db_get_listado = function(cb) {
    var data = [];
    client.query("SELECT producto.int_id, producto.str_descripcion as Producto, grupo.str_descripcion as Grupo, unidad.str_descripcion " +
    "as Unidad_medida, flt_min, flt_max FROM producto INNER JOIN grupo ON producto.int_id_grupo = grupo.int_id " +
    "INNER JOIN unidad On producto.int_id_unidad = unidad.int_id WHERE producto.str_estado = 'ACTIVO' ORDER BY producto.int_id LIMIT 0 , 30;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_pregunta / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Exito en model_pregunta/db_insertar!!!');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};


// obtiene todos los elementos de la tabla "producto"
exports.db_get_ultimo_id = function(cb) {
    var data = [];
    client.query("SELECT int_id FROM pregunta ORDER BY int_id DESC LIMIT 1;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_pregunta / db_get_ultimo_id : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
};


exports.db_insertar = function(preguntaNueva, cb) {
    var int_id_tipo_pregunta = null;
    var int_obligatoria = null;
    var insertado = true;

    if(preguntaNueva.int_id_tipo_pregunta === 'checkbox'){
        int_id_tipo_pregunta = 4;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'radio'){
        int_id_tipo_pregunta = 3;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'text'){
        int_id_tipo_pregunta = 1;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'range'){
        int_id_tipo_pregunta = 5;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'date'){
        int_id_tipo_pregunta = 6;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'time'){
        int_id_tipo_pregunta = 7;
    }
    if(preguntaNueva.int_id_tipo_pregunta === 'canasta'){
        int_id_tipo_pregunta = 10;
    }
    if(preguntaNueva.int_obligatoria){
        int_obligatoria = 1;
    }
    if(!preguntaNueva.int_obligatoria){
        int_obligatoria = 0;
    }
    client.query("INSERT INTO pregunta (int_id_encuesta, int_id_variable, int_id_tipo_pregunta, int_numero, str_enunciado, str_ayuda, int_obligatoria) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [preguntaNueva.int_id_encuesta, preguntaNueva.int_id_variable, int_id_tipo_pregunta, preguntaNueva.numId, preguntaNueva.str_enunciado || 'Sin definir', preguntaNueva.str_ayuda || 'Sin definir', int_obligatoria])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_pregunta / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};

exports.db_insertar_matriz = function(preguntaNueva, cb) {
    var int_id_tipo_pregunta = null;
    var int_obligatoria = null;
    var insertado = true;

    if(preguntaNueva.int_id_tipo_pregunta === 'matriz'){
        int_id_tipo_pregunta = 12;
    }
    if(preguntaNueva.int_obligatoria){
        int_obligatoria = 1;
    }
    if(!preguntaNueva.int_obligatoria){
        int_obligatoria = 0;
    }
    client.query("INSERT INTO pregunta (int_id_encuesta, int_id_variable, int_id_tipo_pregunta, int_numero, str_enunciado, str_ayuda, int_obligatoria) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [preguntaNueva.int_id_encuesta, preguntaNueva.int_id_variable, int_id_tipo_pregunta, preguntaNueva.numId, preguntaNueva.str_enunciado || 'Sin definir', preguntaNueva.str_ayuda || 'Sin definir', int_obligatoria])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_pregunta / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};



//OBSERVACIÓN PARA ELIMINAR
// elimina un elemento de la tabla "producto" de acuerdo a su "id_producto"
exports.db_eliminar = function(id_producto, cb) {
    var insertado = true;
    client.query("UPDATE producto SET str_estado = ? WHERE int_id = ?;",
        ["INACTIVO" ,id_producto])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_pregunta / db_eliminar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
}


//OBSERVACIÓN PARA ELIMINAR
// obtiene un elemento de la tablas "producto" join "producto" a partir de "id_producto"
exports.db_get_elemento_by_id = function(id_producto, cb) {
    var data = [];
    client.query("SELECT id_producto, desc_producto, num_grupo FROM producto INNER JOIN grupo "+
    "ON producto.id_grupo = grupo.id_grupo WHERE id_producto = :id;",{id: id_producto})
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_pregunta / db_get_elemento_by_id : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0? cb(data) : cb(false);
        });
}

exports.db_actualizar = function (productoEditar, cb){
    var actualizado = true;
    client.query("UPDATE producto SET int_id_grupo = ?, int_id_unidad = ?, str_descripcion = ?, flt_min = ?, flt_max = ? WHERE int_id = ?;",
        [productoEditar._num_grupo, productoEditar._num_unidad, productoEditar._descripcion, productoEditar._flt_min, productoEditar._flt_max, productoEditar._id])
        .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_pregunta / db_actualizar : ' + inspect(err));
        })
        .on('end', function() {
            cb(actualizado);
        });
};

exports.eliminarPregunta = function(preguntaObj, cb) {
    var data = [];
    var eliminado = true;
     client.query("DELETE FROM pregunta WHERE int_id = ?;",
     [preguntaObj.int_id])
         .on('error', function(err) {
             eliminado = false;
             console.log('Error: SQL error model_pregunta / db_actualizar : ' + inspect(err));
         })
         .on('end', function() {
             cb(eliminado);
         });
};

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
};