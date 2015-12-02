/**
 * Created by darioh on 06/04/15.
 */

proyectoSaludApp.factory('MyAPIServiceFactory', ["$http", function ($http) {
    return {
    get: function () {
      return $http.get('/api/user/admin/variable');
    },
    obtener: function (urlController, todo) {
        var url = urlController;
        return $http.post(url, todo);
    },
    getGenerico: function (urlDato) {
        return $http.get(urlDato);
    }
  };
}])

    .service('compartirDatos', function($window){
        var datosCompartir;
        return {
            get: function (encuesta) {
                $window.localStorage.setItem('encuestaInactiva', JSON.stringify(encuesta));
            },
            out: function () {
                return datosCompartir;
            }
        };
    })

    .service('datosEncuestaPregunta', function(){

        var datosCompartir;
        var variablesCompartir;
        return {
            get: function (encuesta, variables) {
                datosCompartir = encuesta;
                variablesCompartir = variables;
            },
            out: function () {
                return datosCompartir;
            },
            out2: function () {
                return variablesCompartir;
            },
            delete: function(id) {
                //var url = '/todos/' + id;
                //return $http.delete(url);
            }
        };
    })


    .service('datosvistaEncuestaCanton', function($http){
        return {
            get: function () {
                return $http.get('/api/user/canton');
            },
            out: function () {
                return datosCompartir;
            },
            out2: function () {
                return variablesCompartir;
            },
            delete: function(id) {
                //var url = '/todos/' + id;
                //return $http.delete(url);
            }
        };
    })

    .service('datosvistaEncuestaParroquia', function($http){
        return {
            get: function () {
                return $http.get('/api/user/parroquia');
            },
            out: function () {
                return datosCompartir;
            },
            out2: function () {
                return variablesCompartir;
            },
            delete: function(id) {
                //var url = '/todos/' + id;
                //return $http.delete(url);
            }
        };
    })


    .service('datosvistaEncuestaComunidad', function($http){
        return {
            get: function () {
                return $http.get('/api/user/comunidad');
            },
            out: function () {
                return datosCompartir;
            },
            out2: function () {
                return variablesCompartir;
            },
            delete: function(id) {
                //var url = '/todos/' + id;
                //return $http.delete(url);
            }
        };
    })

    .factory('AuthenticationFactory', function($window) {
        var auth = {
            isLogged: false,
            check: function() {
                if ($window.sessionStorage.token && $window.sessionStorage.user) {
                    this.isLogged = true;
                } else {
                    this.isLogged = false;
                    delete this.user;
                }
            }
        };
        return auth;
    })

    .factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory) {
        return {
            login: function(username, password) {
                return $http.post('/api/login', {
                    username: username,
                    password: password
                });
            },
            logout: function() {

                if (AuthenticationFactory.isLogged) {

                    AuthenticationFactory.isLogged = false;
                    delete AuthenticationFactory.user;
                    delete AuthenticationFactory.userRole;

                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.user;
                    delete $window.sessionStorage.userRole;

                    $location.path("/");
                }

            }
        }
    })

    .factory('TokenInterceptor', function($q, $window) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers['X-Access-Token'] = $window.sessionStorage.token;
                    config.headers['X-Key'] = $window.sessionStorage.user;
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },

            response: function(response) {
                return response || $q.when(response);
            }
        };
    });