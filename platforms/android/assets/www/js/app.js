// Utlizaremos una función anónima autoejecutable de modo que nuestras variables no sean globales. Más info: http://www.formandome.es/javascript/objetos-variables-funciones-javascript/

(function () {
    /* ---------------------------------- Variables locales ---------------------------------- */
    //var adapter = new WebSqlAdapter();
    //var adapter = new MemoryAdapter();
    //var adapter = new JSONPAdapter();
   var watchID = null;
  
  var adapter = new LocalStorageAdapter();
    adapter.inicializar().done(function () {
        alert("Inicializado: Adaptador de datos");
    });

 document.getElementById("iniciar").addEventListener("click", localizar, false);
 document.getElementById("parar").addEventListener("click", localizarStop, false);


    function localizar() {
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000, maximumAge:1000, enableHighAccuracy:true };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

  function localizarStop() {  
alert("STOP");
	navigator.geolocation.clearWatch(watchID);
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('resultados');
        element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                            'Longitude: ' + position.coords.longitude     + '<br />' +
		'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n' +
                            '<hr />'      + element.innerHTML;
    }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }


 
}());
