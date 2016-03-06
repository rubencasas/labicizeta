// Utlizaremos una función anónima autoejecutable de modo que nuestras variables no sean globales. Más info: http://www.formandome.es/javascript/objetos-variables-funciones-javascript/


function mensajes(texto){
  $('.mensajes p').text('');
  $('.mensajes p').text(texto);
}


function iniciar(){

  var localStorageBoleano;
  var ids=[];
  var nombres=[];
  var emails=[];
  var passwords=[];
  var nombreExisteBoleano=false
  var emailExisteBoleano=false
  var coincidenPassBoleano=true;
  var emailCorrectoBoleano=false;
  var coincidenNombreEmailPasswordBoleano= false;

  var inputNombre=$('.seccion-usuario .nombre input');
  var inputEmail=$('.seccion-usuario .email input');
  var inputPass=$('.seccion-usuario .password input');
  var inputPassRepetir=$('.seccion-usuario .password-repetir input');



  function consultarNombresEmailsPasswords(){
   var url = 'http://www.lasana.es/labicizeta/php/consulta-usuarios.php';

   $.ajax({ url: url,
       type: 'post',
      dataType: 'json', // will automatically convert array to JavaScript 
      beforeSend: function() {
      },
      error: function(response) {
       console.log('ERROR: '+response);
       mensajes('Ha habido un problema con la conexión, inténtalo de nuevo.');
     },
     success: function(response) {
      for(var i=0;i<response.length;i++){
        var obj = response[i];
        for(var key in obj){
          if(key==='id'){
            ids.push(obj[key]);
          }
          if(key==='nombre'){
            nombres.push(obj[key]);
          }
          if(key==='email'){
            emails.push(obj[key]);
          }
           if(key==='password'){
            passwords.push(obj[key]);
          }
        }
     }
     }
   });
 }


function nombreExiste(){
  nombreExisteBoleano=false;
  for(var i=0;i< nombres.length;i++) {
    if(inputNombre.val().toUpperCase() === nombres[i].toUpperCase()){
      mensajes("Nombre ocupado");
      nombreExisteBoleano=true;
      break;
    }
  }
 console.log( nombreExisteBoleano);
}

function emailExiste(){
  emailExisteBoleano=false;
  for(var i=0;i< emails.length;i++) {
    if(inputEmail.val().toUpperCase() === emails[i].toUpperCase()){
        if($('.usuario-crear').is(':visible')){
      mensajes("Email existe");
    }
      emailExisteBoleano=true;
      break;
    }
  }
 console.log( emailExisteBoleano);
}

function coincidenPass(){
  coincidenPassBoleano=true;
    if(inputPass.val() !== inputPassRepetir.val()){
      mensajes("No coinciden las contraseñas");
      coincidenPassBoleano=false;
  }
 console.log(coincidenPassBoleano);
}

function coincidenNombreEmailPassword(){
  var nombreExiste=$.inArray( inputNombre.val().toLowerCase(), nombres );
  var emailExiste=$.inArray( inputNombre.val().toLowerCase(),emails );
  console.log(emailExiste);
 if((nombreExiste>=0 && passwords[nombreExiste]=== inputPass.val())||(emailExiste>=0 && passwords[emailExiste]=== inputPass.val())){
        coincidenNombreEmailPasswordBoleano=true;
 }else{
     mensajes('Usuario, email o contraseña no válidos');
      coincidenNombreEmailPasswordBoleano=false;
 }
  
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  emailCorrectoBoleano=regex.test(email);
  console.log(email+regex.test(email));
  if(!emailCorrectoBoleano){
      mensajes("Email incorrecto");
  }
}

function registrarUsuario(){
 var url = 'http://www.lasana.es/labicizeta/php/registrar-usuario.php';

 $.ajax({
  url: url,
  type: 'post',
  cache: false,
  //data: $form.serialize(),
  data: {'nombre': inputNombre.val().toLowerCase(), 'email': inputEmail.val().toLowerCase(), 'pass': inputPass.val()},
  //dataType: 'json',
  dataType: 'text',
  beforeSend: function() {
    mensajes('Registrando...');
  },
  error: function(response) {
   console.log('ERROR: '+response);
   mensajes('Ha habido un problema con la conexión, inténtalo de nuevo.');
 },
 success: function(response) {
   console.log('respuesta: '+response);
   mensajes(response);
 }
});

}

function entrarUsuario(){
 var url = 'http://www.lasana.es/labicizeta/php/entrar-usuario.php';

 $.ajax({
  url: url,
  type: 'post',
  cache: false,
  //data: $form.serialize(),
  data: {'nombre': inputNombre.val().toLowerCase()},
  //dataType: 'json',
  dataType: 'text',
  beforeSend: function() {
    mensajes('Accediendo...');
  },
  error: function(response) {
   console.log('ERROR: '+response);
   mensajes('Ha habido un problema con la conexión, inténtalo de nuevo.');
 },
 success: function(response) {
   console.log('respuesta: '+response);
   mensajes(response);
   localStorageFunction(inputNombre.val().toLowerCase());
 }
});

}


function localStorageFunction(usuario){

  var nombreExiste=$.inArray( usuario, nombres );
  var emailExiste=$.inArray( usuario, emails );
  console.log('nombre'+nombreExiste);
    console.log('email'+emailExiste);
  var mostrarNombre=(nombreExiste>=0)?nombres[nombreExiste]:nombres[emailExiste];
  var idCual=(nombreExiste>=0)?nombreExiste:emailExiste;
  console.log( ids[idCual]);
  localStorage.setItem("usuario", mostrarNombre);
  localStorage.setItem("identificador", ids[idCual]);
  comprobarlocalStorage();
}




 function crearIntro(){
     mensajes('');
    $('.seccion-usuario').show();
     $('.seccion-usuario li, .seccion-usuario button').show();
    $('.seccion-usuario li, .seccion-usuario button').not('.clase-crear').hide();
    $('.seccion-usuario .nombre input').attr('placeholder','Nombre usuario');
    $('.seccion-intro').hide();
}

 function entrarIntro(){
    $('.seccion-usuario').show();
    $('.seccion-usuario li, .seccion-usuario button').show();
    $('.seccion-usuario li, .seccion-usuario button').not('.clase-entrar').hide();
    $('.seccion-usuario .nombre input').attr('placeholder','Nombre usuario o email');
    $('.seccion-intro').hide(); 
}


 function recordarIntro(){
    $('.seccion-usuario').show();
    $('.seccion-usuario li, .seccion-usuario button').show();
    $('.seccion-usuario li, .seccion-usuario button').not('.clase-recordar').hide();
    $('.seccion-intro').hide();
 }

 function atrasIntro(){
     $('.seccion-usuario').hide();
    $('.seccion-intro').show();
  }

function resetIntro(){
  mensajes('');
  inputNombre.val('');
  inputEmail.val('')
  inputPass.val('')
  inputPassRepetir.val('')
}



 function comprobarlocalStorage(){
  
  if (localStorage.identificador){
      localStorageBoleano=true;
      console.log('LocalStorage SI');
      mensajes('Bienvenido/a '+  localStorage.getItem("usuario"));
       ventanaRutas();

  }else{
       localStorageBoleano=false;
        consultarNombresEmailsPasswords();
      console.log('LocalStorage NO');
  }

}



function ventanaRutas(){
      $('.seccion-intro,.seccion-usuario').hide();
      $('.seccion-ruta').show();
      rutaSeccion();
}

function ventanaIntro(){
      resetIntro();
      $('.seccion-intro').show();
      $('.seccion-ruta').hide();
      comprobarlocalStorage();
}



comprobarlocalStorage();


//EVENTOS

inputNombre.on('focusout',function(){
  if($('.usuario-crear').is(':visible')){
      nombreExiste();
    }
});

inputEmail.on('focusout',function(){
  emailExiste();
});


//crear-intro
$('.intro-crear').on('click',function(){
  resetIntro();
  crearIntro();
});

//entrar-intro
$('.intro-entrar').on('click',function(){
  resetIntro();
  entrarIntro();
});

//recordar-intro
$('.intro-recordar').on('click',function(){
  resetIntro();
  recordarIntro();
});


//atras-usuario
$('.usuario-atras').on('click',function(){
  resetIntro();
  atrasIntro();
});

//atras-usuario
$('.usuario-salir').on('click',function(){
  localStorage.removeItem('identificador');
    localStorage.removeItem('usuario');
  ventanaIntro();
});


//registrar usuario
$('.usuario-crear').on('click',function(){
  if(inputNombre.val()==null || inputNombre.val()=='', inputEmail.val()==null || inputEmail.val()=='', inputPass.val()==null || inputPass.val()==''){
      mensajes('Rellena todos los campos');
  }else{
      mensajes('');
      coincidenPass();
      isEmail(inputEmail.val());
      if(coincidenPassBoleano && !nombreExisteBoleano && !emailExisteBoleano && emailCorrectoBoleano){
        console.log('REGISTRAR');
        registrarUsuario();
      }else{
          nombreExiste();
          emailExiste();
          coincidenPass();
      }
  }

 
});

//entrar usuario
$('.usuario-entrar').on('click',function(){
  if(inputNombre.val()==null || inputNombre.val()=='', inputPass.val()==null || inputPass.val()==''){
      mensajes('Rellena todos los campos');
  }else{
      mensajes('');
      coincidenNombreEmailPassword();
      if(coincidenNombreEmailPasswordBoleano){
        console.log('ENTRAR');
         entrarUsuario();
      }
  }

 
});

//recordar usuario
$('.usuario-recordar').on('click',function(){
  if(inputEmail.val()==null || inputEmail.val()==''){
      mensajes('Introduce un email');
  }else{
      mensajes('');
      if(emailExisteBoleano){
        console.log('RECORDAR');
      }else{  
           mensajes('No existe ningún usuario con ese email');
      }
  }

 
});





}// end iniciar()




function rutaSeccion(){
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

console.log('INICIADO id='+ localStorage.getItem("identificador"))

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
   mensajes(response);
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



 }; //end rutaSeccion()
//}());