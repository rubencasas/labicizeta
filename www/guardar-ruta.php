<?php
header('Access-Control-Allow-Origin: *');
if ($_POST) {
    //echo "recibo algo POST";
    //recibo los datos y los decodifico con PHP
    $coordenadas = $_POST["datos"];
	 $usuario = $_POST["user"];

    //con esto podría mostrar todos los datos del JSON recibido
    //print_r($misDatosJSON);
    //ahora muestro algún dato de este array bidimiesional
    $salida = "";


//SQL

    include 'conexion.php';

    $sql = "INSERT INTO rutas (datos, usuario) VALUES ('$coordenadas', '$usuario')";

    if ($conn->query($sql) === TRUE) {
        $salida = "Nueva ruta insertada: " . $coordenadas." usuario: ".$usuario;
    } else {
        $salida = "Ruta no insertada";
    }
    echo $salida;

    $conn->close();

    exit();
}else{
		return false;
		 $salida = "No han llegado los datos de la ruta";

}