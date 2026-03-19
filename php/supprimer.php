<?php
require_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);
$id   = intval($data['id'] ?? 0);

if (!$id) {
    echo json_encode(['succes' => false, 'erreur' => 'ID manquant.']);
    exit;
}

$stmt = mysqli_prepare($connexion, "DELETE FROM etudiants WHERE id=?");
mysqli_stmt_bind_param($stmt, "i", $id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['succes' => true]);
} else {
    echo json_encode(['succes' => false, 'erreur' => 'Erreur suppression.']);
}

mysqli_stmt_close($stmt);
mysqli_close($connexion);
?>
