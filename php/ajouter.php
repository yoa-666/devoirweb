<?php
require_once 'config.php';
header('Content-Type: application/json; charset=utf-8');

$data      = json_decode(file_get_contents('php://input'), true);
$nom       = trim($data['nom']       ?? '');
$prenom    = trim($data['prenom']    ?? '');
$email     = trim($data['email']     ?? '');
$telephone = trim($data['telephone'] ?? '');
$filiere   = trim($data['filiere']   ?? '');

if (empty($nom) || empty($prenom) || empty($email) || empty($telephone) || empty($filiere)) {
    echo json_encode(['succes' => false, 'erreur' => 'Tous les champs sont obligatoires.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['succes' => false, 'erreur' => 'Email invalide.']);
    exit;
}

$stmt = mysqli_prepare($connexion,
    "INSERT INTO etudiants (nom, prenom, email, telephone, filiere) VALUES (?, ?, ?, ?, ?)");
mysqli_stmt_bind_param($stmt, "sssss", $nom, $prenom, $email, $telephone, $filiere);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['succes' => true, 'id' => mysqli_insert_id($connexion)]);
} else {
    echo json_encode(['succes' => false, 'erreur' => 'Email déjà utilisé.']);
}

mysqli_stmt_close($stmt);
mysqli_close($connexion);
?>
