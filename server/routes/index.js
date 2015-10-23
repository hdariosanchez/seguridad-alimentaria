/*jslint node: true */
var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

var model_usuario = require('./route_usuario');
var model_encuesta = require('./route_encuesta');
var model_variable = require('./route_variable');
var model_canton = require('./route_canton');
var model_parroquia = require('./route_parroquia');
var model_comunidad = require('./route_comunidad');
var model_pregunta = require('./route_pregunta');
var model_vistaEncuesta = require('./route_vistaEncuesta');
var model_producto = require('./route_producto');
var model_frecuencia = require('./route_frecuencia');
var model_solicitud = require('./route_solicitud');


router.post('/login', auth.login);

router.get('/validacion_nick', model_usuario.validar_nick);

router.get('/user/admin/encuesta', model_encuesta.getlistado);
router.post('/user/admin/encuestaVariables', model_encuesta.getlistadoEncuestaVariable);
router.post('/user/admin/encuestaVariables/eliminar', model_encuesta.eliminarEncuetaVariables);
router.post('/user/admin/encuestaVariables/agregar', model_encuesta.agregarEncuestaVariables);
router.post('/user/admin/pregunta/encuesta/variable', model_pregunta.getlistadoVariablePorEncuesta);
router.get('/user/admin/encuesta/inactivo', model_encuesta.getlistadoInactivo);
router.get('/user/encuesta', model_encuesta.getlistaActivo);
router.post('/user/admin/encuesta/guardar', model_encuesta.insertarEncuesta);
router.post('/user/admin/encuesta/editar', model_encuesta.editarEncuesta);
router.post('/user/admin/encuesta/definitivo', model_encuesta.guardarDefinitivo);
router.post('/user/admin/encuesta/editarDefinitivo', model_encuesta.actualizarDefinitivo);
router.get('/user/admin/solicitudes/listado', model_usuario.getlistadoPendiente);


//LOCALIDAD
router.post('/user/admin/canton/guardar', model_canton.insertar);
router.post('/user/admin/parroquia/guardar', model_parroquia.insertar);
router.post('/user/admin/comunidad/guardar', model_comunidad.insertar);
//-------


router.get('/user/admin/variable', model_variable.getlistadoVariable);
router.post('/user/admin/variable/guardar', model_variable.insertarVariable);
router.get('/user/admin/variablePuro', model_variable.getlistado);
router.post('/user/admin/variable/eliminar', model_variable.eliminar);


router.post('/user/admin/pregunta/guardar', model_pregunta.insertarPreguntas); //Ingreso de preguntas de la encuesta en gestion de preguntas!
//router.post('/user/admin/pregunta/guardar', model_pregunta.insertarPregunta); //Ingreso de pregunta idividual de la encuesta en gestion de preguntas!

router.get('/user/canton', model_canton.getlistado);


router.post('/user/parroquiaFiltrado', model_parroquia.getlistadoFiltrado);
router.post('/user/comunidadFiltrado', model_comunidad.getlistadoFiltrado);

router.post('/user/registro', model_usuario.insertar);

router.get('/user/vistaEncuesta/obtenertodo/', model_vistaEncuesta.getlistadovistaEncuesta);
router.post('/user/vistaEncuesta/ingresar', model_vistaEncuesta.insertar_pregunta_resuelta);

router.get('/user/admin/producto/arbol', model_producto.getlistadoProductoArbol);
router.get('/user/admin/frecuencia', model_frecuencia.getlistado);
router.post('/user/admin/producto/guardar', model_producto.insertarProducto);
router.post('/user/admin/producto/eliminar', model_producto.eliminar);


router.post('/user/admin/solicitudes/actualizar', model_solicitud.db_actualizar);
//'/api/user/admin/solicitudes/actualizar'


module.exports = router;
