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

// obtiene todos los elementos de la tabla "producto"
exports.db_get_listado = function(usuario, cb) {
    var data = [];
    client.query("select u.int_id, u.int_codigo, r.str_descripcion, u.str_nick, concat(u.str_nombre, u.str_apellido)  " +
        "from usuario as u, rol as r  " +
        "where u.str_nick = ? AND u.str_contrasena = ? AND u.int_id_rol = r.int_id;",
        [usuario.str_nick, usuario.str_contrasena])
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_usuario / db_get_listado : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0 ? cb(data) : cb(false)
        });
};

//obtiene todos los nicks de la tabla usuario
exports.db_get_nicks = function(cb) {
    var data = [];
    client.query("select str_nick FROM usuario;")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_usuario / db_get_nicks : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0 ? cb(data) : cb(false)
        });
};


exports.db_insertar = function(usuarioObj, cb) {
    var insertado = true;
    client.query("INSERT INTO usuario (str_nick, str_contrasena, str_nombre, str_apellido, str_email, str_telefono, str_sexo, d_fecha_nacimiento, str_estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [usuarioObj.str_nick, usuarioObj.str_contrasena, usuarioObj.str_nombre, usuarioObj.str_apellido, usuarioObj.str_email, usuarioObj.str_telefono, usuarioObj.str_sexo, usuarioObj.d_fecha_nacimiento, usuarioObj.str_estado])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error model_usuario / db_insertar : ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
};


// elimina un elemento de la tabla "producto" de acuerdo a su "id_producto"
exports.db_eliminar = function(id_producto, cb) {
    var eliminado = true;
    client.query("UPDATE producto SET str_estado = ? WHERE int_id = ?;",
        ["Inactivo" ,id_producto])
        .on('error', function(err) {
            eliminado = false;
            console.log('Error: SQL error model_usuario / db_eliminar : ' + inspect(err));
        })
        .on('end', function() {
            cb(eliminado);
        });
}

// obtiene un elemento de la tablas "producto" join "producto" a partir de "id_producto"
exports.db_get_usuarios_pendientes = function(cb) {
    var data = [];
    client.query("SELECT * FROM usuario WHERE str_estado = 'PENDIENTE';")
        .on('result', function(res) {
            res.on('row', function(row) {
                data.push(row);
            })
                .on('error', function(err) {
                    console.log('Error: SQL error model_usuario / db_get_usuarios_pendientes : ' + inspect(err));
                })
                .on('end', function(info) {
                    //console.log('Result finished successfully');
                });
        })
        .on('end', function() {
            data.length > 0 ? cb(data) : cb(false)
        });
}

exports.db_actualizar = function (productoEditar, cb){
    var actualizado = true;
    client.query("UPDATE producto SET int_id_grupo = ?, int_id_unidad = ?, str_descripcion = ?, flt_min = ?, flt_max = ? WHERE int_id = ?;",
        [productoEditar._num_grupo, productoEditar._num_unidad, productoEditar._descripcion, productoEditar._flt_min, productoEditar._flt_max, productoEditar._id])
        .on('error', function(err) {
            actualizado = false;
            console.log('Error: SQL error model_usuario / db_actualizar : ' + inspect(err));
        })
        .on('end', function() {
            cb(actualizado);
        });
}

// desconecta la base de datos
exports.disconnect = function() {
    client.end();
}