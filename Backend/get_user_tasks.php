<?php
header('Content-Type: application/json');
require 'db.php';

// For this example, assume you get the user ID from a query parameter
// e.g., user_dashboard.html?user_id=3
$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'No user_id provided.']);
    exit;
}

// Fetch tasks assigned to this user
$stmt = $pdo->prepare('SELECT * FROM tasks WHERE user_id = ?');
$stmt->execute([$user_id]);
$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'tasks' => $tasks]);
?>
