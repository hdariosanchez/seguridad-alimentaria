/**
 * Created by chago on 17/08/15.
 */

var jwt = require('jwt-simple');

//var config = require('../config.js');
var inspect = require('util').inspect;
var Client = require('mariasql');
var client = new Client();

var connect = function() {        //Funcion para crear la conexion a la BD.
    client.connect({
        host: '127.0.0.1',
        user: 'root',
        password: 'H3rm3sSanch3z',
        db: 'proyectoseguridad'
    });
    client
        .on('connect', function() { console.log('Client connected'); })
        .on('error', function(err) { console.log('Client error: ' + err);})
        .on('close', function(hadError) { console.log('Client closed'); });
};

var auth = {

    login: function(req, res) {
        console.log('Desde el auth.js viendo el req.body '+ JSON.stringify(req.body));
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Credenciales Invalidas"
            });
            return;
        }

        var dbUserObj = false;

        // Fire a query to your DB and check if the credentials are valid
        //var dbUserObj = auth.validate(username, password);
        auth.validate(username, password, function (dato) {
            dbUserObj = dato;
            console.log('Viendo los datos que trae la consulta desde la BD en auth.validate: '+ JSON.stringify(dato));

            if (!dbUserObj) { // If authentication fails, we send a 401 back
                console.log('la autenticacion fallo por if (!dbUserObj) y el dato es: '+dbUserObj);
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Credenciales invalidas no existe en la base!"
                });
                return;
            }

            if (dbUserObj != false) {
                console.log('la autenticacion vino por (dbUserObj) y datos del dbUserObj: '+JSON.stringify(dbUserObj));
                // If authentication is success, we will generate a token
                // and dispatch it to the client
                res.json(genToken(dbUserObj[0]));
            }

        });



    },

    validate: function(username, password, cb) {
        connect();
        var data = [];
        client.query("select u.int_id, u.int_codigo, r.str_descripcion as rol, u.str_nick, concat(u.str_nombre,' ', u.str_apellido) as usuario  " +
            "from usuario as u, rol as r  " +
            "where u.str_nick = ? AND u.str_contrasena = ? AND u.int_id_rol = r.int_id;",
            [username, password])
            .on('result', function(res) {
                res.on('row', function(row) {
                    data.push(row);
                })
                    .on('error', function(err) {
                        console.log('Result error: ' + inspect(err));
                    })
                    .on('end', function(info) {
                        console.log('Result finished successfully');
                    });
            })
            .on('end', function() {
                data.length > 0 ? cb(data) : cb(false)
            });

        /*
         // spoofing the DB response for simplicity
         var dbUserObj = { // spoofing a userobject from the DB.
         name: 'arvind',
         role: 'admin',
         username: 'arvind@myapp.com'
         };

         return dbUserObj;
         */
    },

    validateUser: function(username, cb) {
        connect();
        var data = [];
        client.query("select u.int_id, u.int_codigo, r.str_descripcion as rol, u.str_nick, concat(u.str_nombre,' ', u.str_apellido) as usuario " +
            "from usuario as u, rol as r  " +
            "where u.str_nick = ? AND u.int_id_rol = r.int_id;",
            [username])
            .on('result', function(res) {
                res.on('row', function(row) {
                    data.push(row);
                })
                    .on('error', function(err) {
                        console.log('Result error: ' + inspect(err));
                    })
                    .on('end', function(info) {
                        console.log('Result finished successfully');
                    });
            })
            .on('end', function() {
                data.length > 0 ? cb(data) : cb(false)
            });

        /*
         // spoofing the DB response for simplicity
         var dbUserObj = { // spoofing a userobject from the DB.
         name: 'arvind',
         role: 'admin',
         username: 'arvind@myapp.com'
         };

         return dbUserObj;
         */
    }
};

// private method
function genToken(user) {
    console.log('Datos que llegan al getToken con: '+ JSON.stringify(user));

    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    },'ssshhh');

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;
