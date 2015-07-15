var fs = require('fs'),
    pdf = require('pdfkit');

function convertir(archivo) {
    //var rutaPDF = archivo.path.substr(0, archivo.path.lastIndexOf('.')) + ".pdf";
    var rutaPDF = 'public/temp/'+ archivo.name.substr(0, archivo.name.lastIndexOf('.')) + ".pdf";
    var nombrePDF = archivo.name.substr(0, archivo.name.lastIndexOf('.')) + ".pdf";
    //var stream = ''
    console.log(rutaPDF);
    var doc = new pdf()
    if (archivo.type == 'text/plain' || archivo.type == 'text/css' || archivo.type == 'text/html') {
        console.log(archivo.path);
        fs.readFile(archivo.path, 'utf-8', function(err, text) {
          if(err)
            console.log(err);
            doc.pipe(fs.createWriteStream(rutaPDF));
            //stream  = doc.pipe(blobStream());
            //console.log(stream);
            doc.text(text.replace(/\r/g, ''))
            doc.end()
            //stream = stream.toBlobURL()
        })
        fs.unlink(archivo.path)
        rutaPDF = rutaPDF.replace('public/', '')
        console.log(rutaPDF);
        return {
            ruta: rutaPDF,
            nombre: nombrePDF
        }
    }else if (archivo.type == 'image/jpeg' || archivo.type == 'image/gif' || archivo.type == 'image/png' || archivo.type == 'image/bmp' || archivo.type == 'image/gif') {
        doc.pipe(fs.createWriteStream(rutaPDF));
        doc.image(archivo.path, {width: 350})
        doc.end()
        rutaPDF = rutaPDF.replace('public/', '')
        return {
            ruta: rutaPDF,
            nombre: nombrePDF
        }
    } else
        return 'el tipo de archivo no esta soportado todavia'
}
module.exports = convertir