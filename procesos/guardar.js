var fs = require('fs'),
    ruta = 'archivos/'

//funcion que se encarga de guardar los archivos en el servidor
function guardarArchivos(datos) {
    //var nombre = datos.datos
  //se valida que exista un carpeta con id del usuario donde se guardan los archivos
  //si no existe se crea una
    if (!fs.existsSync(ruta + datos.datos.id))
        fs.mkdirSync(ruta + datos.datos.id)
    //variable que contiene la ruta donde se guardara el archivo
    var rutaFinal = ruta + datos.datos.nombre + '/';
  //variable que contiene la ruta donde esta actualmente el archivo
    var rutaInicial = 'public/temp/' + datos.servicio[i].archivo.ruta;
    //var rutaInicial = datos.servicio[i].archivo.ruta
  //se recorre el array donde estan las rutas de los archivos
    for (var i = 0; i < datos.servicio.length; i++) {
        console.log(datos.servicio[i].archivo)
            /*    var rd = fs.createReadStream(datos.servicio[i].archivo.ruta)
                var wt = fs.createWriteStream(ruta + datos.servicio[i].archivo.nombre)
                rd.pipe(wt)*/
        console.log('ruta', datos.servicio[i].archivo.ruta);
        fs.rename(rutaInicial, rutaFinal + datos.servicio[i].archivo.nombre, function(err) {
                if (err)
                    console.log(err);
            })
            /*    fs.rename(datos.servicio[i].archivo.ruta, ruta + datos.servicio[i].archivo.nombre, function (err) {
                  console.log(err);*/
    }
    return rutaFinal
}

module.exports = guardarArchivos