var usados = [];

function numAzar (max, min) {
  return  Math.floor(Math.random() * (max - min + 1) + min)
}

function darFila () {
  return numAzar(1, 4).toString()
}

function darColumna () {
  var fila = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  return fila[numAzar(0, 9)]
}

function repetido (fila, col) {
  for(var i = 0; i < usados.length; i++){
    if(usados[i] == (fila+col)){
      console.log((fila+col));
      return true
    }
  }
  return false
}

exports.sqlClave = function (body) {
  var fila, columna;
  do{
    fila = darFila()
    columna = darColumna()
  }while(repetido(fila, columna))
    usados.push(fila+columna)
    console.log(usados);
    return "select fila, col, id, from autentica_codigos_generados where fila = '" + fila + "' and col = '" + columna + "' and activo = 'SI' and id_cliente = "+ body.dato.id +" limit 1"  
}