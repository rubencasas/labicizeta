// Utlizaremos una función anónima autoejecutable de modo que nuestras variables no sean globales. Más info: http://www.formandome.es/javascript/objetos-variables-funciones-javascript/

function iniciar(){
//(function () {
    /* ---------------------------------- Variables locales ---------------------------------- */
    //var adapter = new WebSqlAdapter();
    //var adapter = new MemoryAdapter();
    //var adapter = new JSONPAdapter();
   var watchID = null;
  
  /*var adapter = new LocalStorageAdapter();
    adapter.inicializar().done(function () {
        alert("Inicializado: Adaptador de datos");
    });
*/

	
	$('.bici-jpg').on('click',function(){
		localizar();
		return false;
	});
	$('.bici-gif').on('click',function(){
		localizarStop();
		return false;
	});


    function localizar() {
        // Throw an error if no update is received every 30 seconds
		$('.bici-jpg').hide();
		$('.bici-gif').show();
        var options = { timeout: 30000, maximumAge:1000, enableHighAccuracy:true };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

  function localizarStop() {  
alert("STOP");
	navigator.geolocation.clearWatch(watchID);
		$('.bici-gif').hide();
		$('.bici-jpg').show();
		$('.enviar-datos').show();
    }

    // onSuccess Geolocation
	
    function onSuccess(position) {
        var coordenadas = document.getElementById('datos-id');
        coordenadas.innerHTML = coordenadas.innerHTML + '{"lat":'  + position.coords.latitude +',"lon":' + position.coords.longitude  +',"alt":'+ position.coords.altitude + ',"acc":'+ position.coords.accuracy + ',"heading":'+ position.coords.heading + ',"speed":'+ position.coords.speed +',"timestamp":' + position.timestamp + '},';
    }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }


 };
//}());