var jwt = require('jwt-simple');
var validateUser = require(__dirname+'/../routes/auth').validateUser;

module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.
    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, 'ssshhh');

            if (decoded.exp <= Date.now()) {
                res.status(400).redirect('/');
                res.json({
                    "status": 400,
                    "message": "Token Expired"
                });
                return;
            }

            // Authorize the user to see if s/he can access our resources
            validateUser(key, function (dato) {
                var dbUser = dato[0];

                if (dbUser) {
                    if ((req.url.indexOf('admin') >= 0 && dbUser.rol == 'ADMINISTRADOR') || (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/user/') >= 0)) {
                        next(); // To move to next middleware
                    } else {
                        console.log('NO TIENE LA AUTORIZACION VIENE POR EL ELSE DE validateUser!!!!!!!!!');
                        res.status(403).redirect('/');
                        res.json({
                            "status": 403,
                            "message": "Not Authorized"
                        });
                        return;
                    }
                } else {
                    // No user with this name exists, respond back with a 401
                    console.log('VINO POR EL USUARIO INVALIDO');
                    res.status(401).redirect('/');
                    res.json({
                        "status": 401,
                        "message": "Invalid User"
                    });
                    return;
                }


            }); // The key would be the logged in user's username


        } catch (err) {
            res.status(500).redirect('/');
            res.json({
                "status": 500,
                "message": "Oops something went wrong",
                "error": err
            });
        }
    } else {
        console.log('VINO POR EL TOKEN O KEY NO VALIDO');
        res.status(401).redirect('/');
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
};