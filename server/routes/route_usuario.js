/**
 * Created by dario on 22/07/15.
 */
var jwt = require('jsonwebtoken');
var mySecretKey = 'mySecretKey';
var mySecretKeyAdmin = 'otraSecretKey';
var data_usuario = require('../../model/model_usuario');

exports.validar_nick = function (req, res) {
    data_usuario.connect();
    data_usuario.db_get_nicks(function (lista_nicks) {
        if(lista_nicks.length){
            var bandera = 0;
            for (var i=lista_nicks.length - 1; i >= 0; i--) {
                if (lista_nicks[i].str_nick == req.query.nick){
                    bandera ++;
                }
            }
            bandera == 0 ? res.status(200) : res.status(409);
        }
        else{
            if(!lista_nicks){
                res.status(404);
            }
        }
    })
};

exports.getlistado = function (req, res) {
    data_usuario.connect();
    data_usuario.db_get_listado(req.body, function (usuario) {
        if(usuario != false){
            if(req.body.str_nick == usuario[0].str_nick && req.body.str_contrasena == usuario[0].str_contrasena){
                var token = jwt.sign(usuario, mySecretKey, {expiresInMinutes: 1440});
                res.status(200).json(
                    {
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
            }
            else{
                res.status(404).json(
                    {
                        success: false,
                        message: 'Error en el route_usuario, viene mensaje desde el else',
                    });
            }
        }
        else
        {
            res.status(404).json(
                {
                    success: false,
                    message: 'Error en el route_usuario, viene mensaje desde el else',
                });
        }


        //res.json(datos);
    });
};

exports.getlistadoPendiente = function (req, res) {
    data_usuario.connect();
    data_usuario.db_get_usuarios_pendientes(function (usuario) {
        res.json(usuario);
    });
};


exports.insertar = function(req,res){
    data_usuario.connect();
    data_usuario.db_insertar(req.body,function(bandera) {
        bandera ?
            res.status(200).json({
                "status": 200,
                "message": "Ingreso correcto"
            }) :
            res.status(400).json({
                "status": 400,
                "message": "Error en el ingreso de usuario"
            });
    });
};

