<?php
require_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

$data      = json_decode(file_get_contents('php://input'), true);
$id        = intval($data['id']       ?? 0);
$nom       = trim($data['nom']        ?? '');
$prenom    = trim($data['prenom']     ?? '');
$email     = trim($data['email']      ?? '');
$telephone = trim($data['telephone']  ?? '');
$filiere   = trim($data['filiere']    ?? '');

if (!$id || empty($nom) || empty($prenom) || empty($email) || empty($telephone) || empty($filiere)) {
    echo json_encode(['succes' => false, 'erreur' => 'Données invalides.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['succes' => false, 'erreur' => 'Email invalide.']);
    exit;
}

$stmt = mysqli_prepare($connexion,
    "UPDATE etudiants SET nom=?, prenom=?, email=?, telephone=?, filiere=? WHERE id=?");
mysqli_stmt_bind_param($stmt, "sssssi", $nom, $prenom, $email, $telephone, $filiere, $id);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['succes' => true]);
} else {
    echo json_encode(['succes' => false, 'erreur' => 'Erreur lors de la mise à jour.']);
}

mysqli_stmt_close($stmt);
mysqli_close($connexion);
?>
