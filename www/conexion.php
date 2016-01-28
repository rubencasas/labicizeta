<?php

$servername = "mysql.hostinger.es";
$username = "u669857375_na";
$password = "notvnotv1A";
$dbname = "u669857375_lasa";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Fallo la conexión a la Base de Datos");
}
?>