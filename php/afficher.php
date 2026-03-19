<?php
require_once 'config.php';

$requete  = "SELECT * FROM etudiants ORDER BY nom ASC";
$resultat = mysqli_query($connexion, $requete);
$etudiants = [];

if ($resultat) {
    while ($ligne = mysqli_fetch_assoc($resultat)) {
        $etudiants[] = $ligne;
    }
}

mysqli_close($connexion);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($etudiants, JSON_UNESCAPED_UNICODE);
?>
