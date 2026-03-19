<?php
$host      = "localhost";
$dbname    = "etudiants_db";
$username  = "root";
$password  = "";

$connexion = mysqli_connect($host, $username, $password, $dbname);

if (!$connexion) {
    http_response_code(500);
    die(json_encode(["erreur" => "Connexion échouée : " . mysqli_connect_error()]));
}

mysqli_set_charset($connexion, "utf8mb4");
?>
