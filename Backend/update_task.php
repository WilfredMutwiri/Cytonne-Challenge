<?php
header('Content-Type: application/json');
require 'db.php';

$task_id = $_POST['task_id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$task_id || !$status) {
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

$stmt = $pdo->prepare('UPDATE tasks SET status = ? WHERE id = ?');
$success = $stmt->execute([$status, $task_id]);

echo json_encode(['success' => $success]);
?>
