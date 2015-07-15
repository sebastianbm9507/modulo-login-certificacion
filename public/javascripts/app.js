var div = null
var datos = null;
var mensaje = '';
var informacion = {};
var accesoCookie = '';
var app = angular.module('app', ['ngSanitize', 'ui.bootstrap', 'ngCookies', 'ngRoute'])

//.config(function($sceDelegateProvider) {
//    $sceDelegateProvider.resourceUrlWhitelist([
//        // Allow same origin resource loads.
//        'self',
//        // Allow loading from our assets domain.  Notice the difference between * and **.
//        '**'
//    ]);
//
//});

//damos configuración de ruteo a nuestro sistema de login
app.config(function ($routeProvider) {
    $routeProvider.when("/", {
            controller: "loginController",
            templateUrl: "../plantillas/login.html"
                //        templateUrl : "./index.html"
        })
        .when("/proceso", {
            controller: "control",
            templateUrl: "../plantillas/proceso-certificacion.html"
        })
        .otherwise({
            redirectTo: "/"
        })
});

//factoria que controla la autentificación, devuelve un objeto
//$cookies para crear cookies
//$cookieStore para actualizar o eliminar
//$location para cargar otras rutas
app.factory("auth", function ($cookies, $cookieStore, $location, $http, $window) {
    return {
        login: function (username, password) {

            $http.post('/express/validar', {
                usuario: username,
                clave: password
            }).success(function (data) {
                informacion = data;
                console.log(informacion);

                if (informacion.length === 0) {
                    $window.alert("ERROR : Su usuario o contraseña son incorrectos")
                } else {
                    if (informacion[0].activo === 'SI') {

                        $window.alert("MENSAJE: " + "\n" + "Bienvenido usuario -> " + username);
                        //creamos la cookie con el nombre que nos han pasado como usuario
                        $cookies.put('username' , username);
                        
                        $location.path('/proceso');
//                        console.log("ruta ", $window.location.pathname);
                    }
                }

            });



        },
        logout: function () {

            $location.path('/');
            $cookieStore.remove("username");

        },
        checkStatus: function () {
            //creamos un array con las rutas que queremos controlar
            var rutasPrivadas = ["/proceso", "/dashboard", "/"];
            // controlamos el acceso a las rutas con la cookie almacenada en accesoCookie
            accesoCookie = $cookies.get('username');
            // en caso de que el usuario intente accerder a los procesos sin estar logueado
            if (this.in_array($location.path(), rutasPrivadas) && typeof (accesoCookie) == "undefined") {
//                 $window.alert('Mensaje : ' + '\n' + 'inicie Sesion para tener acceso a la ruta , Gracias..');
                $location.path("/");
            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if (this.in_array("/", rutasPrivadas) && typeof (accesoCookie) != "undefined") {

                $location.path("/proceso");
            }
        },
        in_array: function (needle, haystack) {
            var key = '';
            for (key in haystack) {
                if (haystack[key] == needle) {
                    return true;
                }
            }
            return false;
        }
    }
});




//creamos el controlador pasando $scope y $http, así los tendremos disponibles
app.controller('loginController', function ($scope, auth, $cookieStore, $window , $cookies) {

    // al cargar la pagina borramos las cookies 
//    $cookieStore.remove("username");
//    console.log("ruta ", $window.location.pathname);

    $scope.login = function () {
        auth.login($scope.username, $scope.password);
    }

});


//creamos el controlador pasando $scope y auth
app.controller('homeController', function ($scope, $cookies, auth, $window, $http) {

    //la función logout que llamamos en la vista llama a la función
    console.log("ruta ", $window.location.pathname);
    //logout de la factoria auth
    $scope.logout = function () {
        auth.logout();
    }

});

app.controller('control', ['$scope', 'convertir', '$sce', '$modal', 'cargarServicios', 'auth', function ($scope, convertir, $sce, $modal, cargarServicios, auth) {


    $scope.cargados = []
    $scope.services = []
    $scope.copias = 0
    cargarServicios.success(function (data) {
        console.log(data.nombre_ta);
        for (var i = 0; i < data.length; i++) {
            $scope.services.push(data[i])
        }
    })

    $scope.tramsformar = function (archivo) {
        convertir.convertir(archivo).then(function (res) {
            console.log(res);
            if (typeof res.data.nombre !== 'undefined')
                $scope.cargados.push(res.data)
            else
                alert(res.data)
        })
    }

    $scope.logout = function () {
        auth.logout();
    }

    $scope.mostrarPDF = function (ruta) {
        /*        if ($scope.ruta == '' || typeof $scope.ruta == 'undefined') {
                    //window.open('plantillas/plantilla.html')
                    $scope.ruta = ''
                    var val = $sce.trustAsResourceUrl(ruta);
                    console.log(val);
                    div = $('#pdf').clone()
                    $scope.ruta = 'file:///' + val
                } else {
                    $('#pdf').remove()
                    console.log(div);
                    var val = $sce.trustAsResourceUrl(ruta);
                    console.log(val);
                    $scope.ruta = 'file:///' + val
                    $('#ver').append(div) 
                    $('#pdf').attr('ng-src', $scope.ruta)
                    $('#pdf').attr('src', $scope.ruta)  
                }*/

        /*      $modal.open('ej.html')
              
                    $scope.ruta = ''
                    
                    console.log(val);
                    //div = $('#pdf').clone()
                    $scope.ruta = 'file:///' + val
                   // $scope.mostrar = !$scope.mostrar*/
        $scope.ruta = '';
        // var val = $sce.trustAsResourceUrl(ruta);
        // $scope.ruta = 'file:///' + val
        $scope.ruta = ruta
        var ventanaModal = $modal.open({
            templateUrl: 'verPdf',
            size: 'lg',
            controller: 'modalPdf',
            resolve: {
                ruta: function () {
                    return $scope.ruta
                }
            }
        })
    }

    $scope.mostrarClave = function () {
        var servicios = [];
        /*        angular.forEach($scope.cargados, function(valor, llave, obj) {
                    servicios.push({
                        servicio: valor,
                        archivo: $scope.cargados[llave],
                        copias: $scope.copias[llave]
                    })
                    console.log('copias', typeof $scope.copias[llave]);

                    console.log('obj', obj);
                })*/
        var copias = verificarCopias($scope.copias, $scope.cargados)
        var servicios = verificarServicios($scope.servicios, $scope.cargados)

        if (copias === null && servicios === null) {
            var servicios = []
            for (var i = 0; i < $scope.cargados.length; i++) {
                servicios.push({
                    servicio: $scope.servicios[i].nombre_ta,
                    nombreTabla: $scope.servicios[i].nombre_tabla,
                    archivo: $scope.cargados[i],
                    copias: $scope.copias[i]
                })
                console.log(servicios);
            }
            var ventanaModal = $modal.open({
                templateUrl: 'verClave',
                size: 'lg',
                controller: 'modalClave',
                resolve: {
                    servicios: function () {
                        return servicios
                    }
                }
            })
        } else
            alert((copias !== null && servicios !== null) ? copias + '\n' + servicios : (copias !== null) ? copias : servicios)


    }



}])

.controller('modalPdf', ['$scope', 'ruta', function ($scope, ruta) {
    console.log(ruta);
    $scope.rutas = ruta
}])

.controller('modalClave', function ($scope, clave, $modalInstance, enviar, servicios, verificar) {
    $scope.clave = ''
    $scope.respuesta = ''
    clave.clave().then(function (res) {
        console.log(res.data);
        $scope.res = res
        $scope.clave = 'fila: ' + res.data[0].fila + ", columna: " + res.data[0].col
        var id = $scope.res.id
        console.log($scope.clave);
        datos = {
            nombre: null,
            idClave: res.data[0].id
        }
    })

    $scope.validar = function () {
        verificar.verificar($scope.respuesta).then(function (res) {
            console.log(res);
            if (res.data[0] == 1) {
                alert('se verifico el codigo')
                $scope.guardar();
            } else
                alert('clave codigo erroneo por favor intente nuevamente')
        })
    }
    $scope.guardar = function () {
        console.log('servicios', servicios);
        console.log('datos', datos);
        enviar.enviar(datos, servicios)
        $scope.cargados = []
        servicios = []
    }


})


//mientras corre la aplicación, comprobamos si el usuario tiene acceso a la ruta a la que está accediendo
app.run(function ($rootScope, auth) {
    //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function () {
        //llamamos a checkStatus, el cual lo hemos definido en la factoria auth
        //la cuál hemos inyectado en la acción run de la aplicación
        auth.checkStatus();
    })
})
