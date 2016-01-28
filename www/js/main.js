// Utlizaremos una función anónima autoejecutable de modo que nuestras variables no sean globales. Más info: http://www.formandome.es/javascript/objetos-variables-funciones-javascript/

function iniciar(){
//(function () {
  /* ---------------------------------- Variables locales ---------------------------------- */
    //var adapter = new WebSqlAdapter();
    //var adapter = new MemoryAdapter();
    //var adapter = new JSONPAdapter();
    var watchID = null;
    var cogiendoDatos=false;
    var coordenadas = $('.coordenadas-textarea');
    var coordenadasTodas;
    var velocidad = $('.velocidad');
    var distancia = $('.distancia');
    var CO2 = $('.CO2');
    var latitudNueva,latitudVieja,longitudNueva,longitudVieja,distanciaParcial, distanciaTotal=0, CO2parcial, CO2total=0;
    var cronometroIntervalo;
    var tiempo = {
        hora: 0,
        minuto: 0,
        segundo: 0
    };
    var textosBotones={
      empezar:'PEDALEAR',
      parar:'PARAR'
    };

    var okFuncion, cancelFuncion;

  /*var adapter = new LocalStorageAdapter();
    adapter.inicializar().done(function () {
        alert("Inicializado: Adaptador de datos");
    });
*/

console.log('INICIADO')

$('.start-stop').text(textosBotones.empezar);



//FUNCIONES

  /** Converts numeric degrees to radians */
  if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
      return this * Math.PI / 180;
    }
  }

  function calcularDistancia(lat1,lat2,lon1,lon2){
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}


//cronometro

function iniciarCronometro(){

cronometroIntervalo = setInterval(function(){
                // Segundos
                tiempo.segundo++;
                if(tiempo.segundo >= 60)
                {
                    tiempo.segundo = 0;
                    tiempo.minuto++;
                }      

                // Minutos
                if(tiempo.minuto >= 60)
                {
                    tiempo.minuto = 0;
                    tiempo.hora++;
                }

                $(".hour").text(tiempo.hora < 10 ? '0' + tiempo.hora : tiempo.hora);
                $(".minute").text(tiempo.minuto < 10 ? '0' + tiempo.minuto : tiempo.minuto);
                $(".second").text(tiempo.segundo < 10 ? '0' + tiempo.segundo : tiempo.segundo);
            }, 1000);
}


function localizar() {
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000, maximumAge:1000, enableHighAccuracy:true };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
      }

      function localizarStop() {  
        navigator.geolocation.clearWatch(watchID);
        console.log(coordenadas.html());

        //evitamos que cuando se pare la ruta las coordenadas entremedias sumen a la distacia total
        latitudNueva=0;
        longitudNueva=0;
      }

    // onSuccess Geolocation

    function onSuccess(position) {
      coordenadas.html(coordenadas.html()+'{"lat":'  + position.coords.latitude +',"lon":' + position.coords.longitude  +',"alt":'+ position.coords.altitude + ',"acc":'+ position.coords.accuracy + ',"heading":'+ position.coords.heading + ',"speed":'+ position.coords.speed +',"timestamp":' + position.timestamp + '},');
      velocidad.text(position.coords.speed);

      var estasEnZamora=enZamora(position.coords.latitude,position.coords.longitude);

      if(estasEnZamora){
        mensajes('Zamora');
        if(latitudNueva){
          latitudVieja=latitudNueva;
        }
        latitudNueva=position.coords.latitude;

        if(longitudNueva){
          longitudVieja=longitudNueva;
        }
        longitudNueva=position.coords.longitude;

        if(latitudNueva && latitudVieja){
          console.log('CALCULAR');
          distanciaParcial=calcularDistancia(latitudVieja,latitudNueva,longitudVieja,longitudNueva);
          distanciaTotal+=Math.round(distanciaParcial * 1000) / 1000;
          console.log(distanciaParcial);
          
          CO2parcial=distanciaTotal*0.15;
          CO2total+=Math.round(CO2parcial * 1000) / 1000;
        }



        distancia.html(distanciaTotal);
        CO2.html(CO2total);

      }else{
        mensajes('No estás dentro de Zamora');
        parar();
      }

    }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
          alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
        }



//GUARDAR RUTA

function guardarRuta(){
 var url = 'http://www.lasana.es/labicizeta/php/guardar-ruta.php';
  var usuario=1;
 
 //eliminar ultima coma del objeto
 coordenadasTodas=coordenadas.html();
 coordenadasTodas = coordenadasTodas.substr(0,coordenadas.length - 1);

 $.ajax({
  url: url,
  type: 'post',
  cache: false,
  //data: $form.serialize(),
  data: {'datos': coordenadasTodas, 'user': usuario, 'distancia': distanciaTotal},
  //dataType: 'json',
  dataType: 'text',
   beforeSend: function() {
      mensajes('Enviando ruta...');
  },
   error: function(response) {
   console.log('ERROR: '+response);
    mensajes('Ha habido un problema con la conexión, inténtalo de nuevo.');
   },
   success: function(response) {
   console.log('respuesta: '+response);
    mensajes('Datos recibidos. ¡Gracias!');
     resetRuta();
     }


    });

}

//comprobar que estas en Zamora

function enZamora(lati,longi){

  var latSur=41.487346
  var latNorte=41.522060;
  var lonOeste= -5.800794;
  var lonEste=-5.717501

  if(lati>=latSur && lati<=latNorte && longi<=lonEste && longi>=lonOeste) {
    return true;
  }else{
    return false;
  }

}


function empezar(){
   console.log(textosBotones.empezar);
        $('.start-stop').text(textosBotones.parar);
        $('.bici-jpg').hide();
        $('.bici-gif,.datos').show();
        iniciarCronometro();
        localizar();
        $('.botones-ruta').hide();
        cogiendoDatos=true;
}

function parar(){
        console.log("STOP");
        $('.start-stop').text(textosBotones.empezar);
        $('.bici-gif').hide();
        $('.bici-jpg').show();
        clearInterval(cronometroIntervalo);
        localizarStop();
        $('.botones-ruta').show();
        cogiendoDatos=false;
}

function resetRuta(){
        distanciaParcial=0;
        distanciaTotal=0;
        CO2parcial=0;
        CO2total=0;
        latitudNueva=0;
        longitudNueva=0;
        $('.coordenadas-textarea').html('');
        $(".hour").text('00');
        $(".minute").text('00');
        $(".second").text('00');
        $('.botones-ruta').hide();
        tiempo = {
        hora: 0,
        minuto: 0,
        segundo: 0
         };
        $('.datos').hide();
}



function modal(ok,cancel,pregunta){

$('.modal p').text(pregunta);
$('.modal').show();
okFuncion=function(){ok();}
cancelFuncion=function(){cancel();}

}

function cerrarModal(){
  $('.modal').hide();
}


function mensajes(texto){
  $('.mensajes p').text('');
  $('.mensajes p').text(texto);
}




 //EVENTOS

  $('.start-stop').on('click',function(){
      if(!cogiendoDatos){
       empezar();
        return false;
    }else{
        parar();
        return false;
    }
  });


  $('.guardar-ruta').on('click',function(){
    modal(guardarRuta,cerrarModal,'¿Seguro que quieres mandarnos los datos de tu ruta?');
    return false;
  });

    $('.reset-ruta').on('click',function(){
    modal(resetRuta,cerrarModal,'¿Seguro que quieres eliminar los datos de tu ruta?');
    return false;
  });


  $('.modal .siOK').on('click', function(){
    okFuncion();
    cerrarModal();
    return false;
  });
  $('.modal .noOK').on('click', function(){
    cancelFuncion();
    return false;
  });



 }; //end iniciar()
//}());