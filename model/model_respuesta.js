/**
 * Created by darioh on 14/06/15.
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

exports.db_insertar = function(respuestaNueva, id_pregunta, cb) {
    var correcto = 0,
        insertado = true;
    respuestaNueva.valor ? correcto = 1 : correcto = 0;
    if(respuestaNueva.int_id_tipo_pregunta === 'checkbox' || respuestaNueva.int_id_tipo_pregunta === 'radio'){
        client.query("INSERT INTO test (int_id, int_id_pregunta, str_descripcion, int_valor, int_correcto, str_desc_campo) VALUES (?, ?, ?, ?, ?, ?);",
            [respuestaNueva.numId, id_pregunta, respuestaNueva.str_descripcion, respuestaNueva.numEscala, correcto, respuestaNueva.cuales || ''])
            .on('error', function(err) {
                console.log('Error: SQL error en model_respuesta / db_insertar (test): ' + inspect(err));
                insertado = false;
            })
            .on('end', function() {
                cb(insertado);
            });
    }else{
        if(respuestaNueva.int_id_tipo_pregunta === 'range'){
            client.query("INSERT INTO escala (int_id_pregunta, str_desc_inicio, str_desc_fin, int_inicio, int_fin) VALUES (?, ?, ?, ?, ?);",
                [id_pregunta, respuestaNueva.str_descripcion, respuestaNueva.str_desc_fin, respuestaNueva.numId , respuestaNueva.numEscala])
                .on('error', function(err) {
                    console.log('Error: SQL error en model_respuesta / db_insertar (escala): ' + inspect(err));
                    insertado = false;
                })
                .on('end', function() {
                    cb(insertado);
                });
        }
    }
};



exports.db_insertar_canasta_frecuencia = function(frecuencia, id_pregunta, cb) {
    var insertado = true;
    client.query("INSERT INTO canasta_frecuencia (int_id_pregunta, int_id_frecuencia) VALUES (?, ?);",
        [id_pregunta, frecuencia.int_id])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error en model_respuesta / db_insertar_canasta_frecuencia: ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
    };

exports.db_insertar_canasta_producto = function(producto, id_pregunta, cb) {
    var insertado = true;
    client.query("INSERT INTO canasta_producto (int_id_pregunta, int_id_producto) VALUES (?, ?);",
        [id_pregunta, producto.int_id])
        .on('error', function(err) {
            insertado = false;
            console.log('Error: SQL error en model_respuesta / db_insertar_canasta_frecuencia: ' + inspect(err));
        })
        .on('end', function() {
            cb(insertado);
        });
    };