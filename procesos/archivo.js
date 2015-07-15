var express = require('express'),
    router = express.Router(),
    pdf = require('pdfkit'),
    fs = require('fs'),
    blobStream = require('blob-stream'),
    ipCliente = require('client-ip'),
    guardarArchivos = require('./guardar'),
    convertir = require('./convertir'),
    BaseDatos = require('./bd'),
    sql = require('./sql');



router.route('/guardar').post(function(req, res) {+
/*  var ip = ipCliente(req)
  console.log('antes de guardar', req.body);
  var sentencia = "select id from autentica_codigos_generados where id = '" + req.body.datos.id+ "'";
  console.log(sentencia);
  BaseDatos.consultaSql(req, res, sentencia)
  
      
  
  var archivos = req.body;
  console.log('funciona');*/
  guardarArchivos(archivos)
  BaseDatos.guardarSql(req)
  res.sendStatus(200)
})


router.route('/validar').post(function(req, res){
    
    var usuario = req.body.usuario
    var clave = req.body.clave
    
    console.log("usuario" , usuario);
    console.log('contraseña:', clave);
    BaseDatos.validarUsuario(req , res , 'select activo  from usuarios_vpn where usuario='+"'"+usuario+"' && clave ='" +clave +"'")
    
})



router.route('/revisar').post(function(req, req) {
    console.log('funciona');
})

//ruta que se encarga de convertir los archivos enviados a PDF
router.route('/convertir').post(function(req, res) {
    var archivo = req.files.file;
    //var rutaPDF = 'public/temp/' + archivo.name.substr(0, archivo.path.lastIndexOf('.')) + ".pdf";
    res.send(convertir(archivo))
})

//ruta que se encarga de solicitar el codigo de certificacion web
router.route('/clave').post(function (req, res) {
  var clve = sql.sqlClave(req.body);
  console.log(clve);
  BaseDatos.consultaSql(req, res, clve)

  //res.sendStatus(404)
})

//ruta que se encarga de responder con los servicios web
router.route('/servicios').get(function (req, res) {
  BaseDatos.consultaSql(req,res, "select * from control_tipo_procesos where area = 'W' and activo= 'SI'")
})

//ruta que se encarga de verificar la clave de validacion usada por el cliente
router.route('/verificar').post(function (req, res) {
    BaseDatos.verificarSql(req, res, "select id from autentica_codigos_generados where codigo = " + req.body.clave)
  // console.log('este es el inportante')
})

router.route('/provar').get(function (req, res) {
    BaseDatos.consultaSql(req, res, "select * from autentica_codigos_generados ")
    //res.sendStatus(100)
})




module.exports = router