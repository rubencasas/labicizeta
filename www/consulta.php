

<?php

include 'conexion.php';

$sql = 'SELECT * FROM rutas';
/* Consultas de selección que devuelven un conjunto de resultados */
if ($consulta = mysqli_query($conn, $sql, MYSQLI_USE_RESULT)) {

    while ($fila = mysqli_fetch_assoc($consulta)) {
        $todo[] = $fila;
    }
    // echo "<div class='burbujas'>" . $fila['descripcion'] . "</div>";
    
    //Por ultimo, para que nuestro archivo.php, muestre los datos por pantalla y puedan leerse, utilizamos json_encode y añadir JSON_NUMERIC_CHECK si queremos que los numeros, los devuelva asi y no como string json_encode($datas,JSON_NUMERIC_CHECK)
    echo json_encode($todo, JSON_NUMERIC_CHECK);
	echo '<br>';
	var_dump($todo);
    /* liberar el conjunto de resultados */
    mysqli_free_result($consulta);
}

$conn->close();

$ruta=$todo[0]["id"];
$usuario=$todo[0]["usuario"];
$datos=$todo[0]["datos"];
echo '<br>';
echo '<br>';
echo $datos;
echo '<br>';
echo '<br>';
$rutas = json_decode($datos);
print_r($rutas);
echo '<br>';
echo '<br>';
foreach ($rutas as $valor){
echo '<br>';
print_r($valor);
echo $valor->lat;
}



$cuantasCoordenadas=count($rutas->coordenadas);
?>