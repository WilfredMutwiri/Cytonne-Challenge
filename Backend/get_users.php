<?php
require 'db.php';

$stmt = $pdo->prepare("SELECT id, name, email, role FROM users");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($users);
?>
