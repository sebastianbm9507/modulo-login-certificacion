//funcion que guarda los datos correspondientes a la sertificacion WEB
exports.guardarSql = function (req) {
    //variable que contiene la primera parte de la sentencia sql para guardar los datos en la tabla autentica web
    var sentencia = "insert into autentica_web (id_cliente, documento, servicio, cantidad, fecha_inicio, hora_inicio, atendido, nombre_tabla_sello) values ",
        //variable que contiene la segunda parte de la sentencia sql para guardar los datos en la tabla autentica web
        values = '',
        //la fecha actual del servidor
        hoy = new Date(),
        //variable donde se guardan los datos enviado por el cliente
        body = req.body,
        //fecha actual del servidor (AAAA/MM/DD)
        fecha = hoy.getFullYear() + '/' + hoy.getMonth() + '/' + hoy.getDay(),
        //hora actual del servidor (HH:mm)
        hora = ((hoy.getHours() < 10) ? '0' + hoy.getHours() : hoy.getHours()) + ":" + ((hoy.getMinutes() < 10) ? '0' + hoy.getMinutes() : hoy.getMinutes()),
        //variable que contiene los datos del usuario (usuario, id) tambien se incluye el id de la clave usuada
        usuario = body.datos,
        //id de la clave usada para la validacion
        idClave = usuario.idClave,
        //id del usuario
        idUSuario = usuario.idUsuario,
        /*las variables van a contener: el nombre del archivo, la cantidad de copias, el nombre de la tabla
        (teniendo encuenta el servicio) y el nombre del servicio respectivamente para cada uno de los archivos
        enviados*/
        nombreArchivo, cantCopias, nombreTabla, servicio;
    /*se recorre el array que corresponde a los archivos y sus repectivos servicios y copias para hacer
    una sentencia sql*/
    for (var i = 0; i < body.servicio.length; i++) {
        var coma = (i == body.servicio.length - 1) ? "" : ", ";
        servicio = body.servicio[i].servicio;
        nombreArchivo = body.servicio[i].archivo.nombre;
        cantCopias = body.servicio[i].copias;
        nombreTabla = body.servicio[i].nombreTabla;
        values += "( '" + idUSuario + "', '" + nombreArchivo + "', '" + servicio + "', '" + cantCopias + "', '" + fecha + "', '" + hora + "', 'NO', '" + nombreTabla + "')" + coma;
    }
    //se convinan ambas partes de la sentencia en una sola variable
    sentencia = sentencia + values;
    console.log('db.js - 22', sentencia);
    console.log('db.js - 22', body);
    //se obtiene la conexion a la base de datos
    req.getConnection(function (err, conexion) {
        if (err) {
            console.log(err);
        } else
        //se guarda la informacion correspondiente al proceso de sertificacion WEB
            conexion.query(sentencia, function (err, resultado) {
                if (err) {
                    console.log(err);
                } else
                    console.log('db.js - 29 :: resultado', resultado);
            })
            //se cambia el estado de la clave que fue usada para la validacion
        conexion.query("update autentica_codigos_generados set activo = 'NO' where id = " + idClave, function (err, resultado) {
            if (err) {
                console.log('db.js - 36 :: error', err);
            } else {
                console.log('db.js - 38 :: resultado', resultado);
            }
        })
    })
}

exports.consultaSql = function (req, res, sentencia) {
    req.getConnection(function (err, conexion) {
        if (err) {
            console.log('conexion', err);
        } else
            conexion.query(sentencia, function (err, resultado, campos) {
                if (err) {
                    console.log('sentencia', err);
                } else {
                    res.send(resultado)
                }
            })
    })
}

exports.verificarSql = function (req, res, sentencia) {
    req.getConnection(function (err, conexion) {
        if (err) {
            console.log(err);
        } else
            conexion.query(sentencia, function (err, resultado) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(resultado);
                    console.log(resultado.length >= 1);
                    if (resultado.length >= 1)
                        res.send('1')
                    else
                        res.send('0')
                }
            })
    })
}


exports.cambioSql = function (req, sentencia) {
    req.getConnection(function (err, conexion) {
        if (err) {
            console.log(err);
        } else
            conexion.query(sentencia, function (err, resultado, campos) {
                if (err) {
                    console.log(err);
                } else
                    console.log(resultado);
                console.log(campos);
            })
    })
}

exports.validarUsuario = function (req, res, sentencia) {
    req.getConnection(function (err, conexion) {
        if (err) {
            console.log(err);
        } else {
            conexion.query(sentencia, function (err, resultado) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('resultado:', resultado);
                    res.send(resultado)
                }
            })
        }

    })
}
