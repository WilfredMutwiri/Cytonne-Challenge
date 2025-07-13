<?php
header('Content-Type: application/json');
require 'db.php';

$user_id = $_GET['user_id'] ?? '';

if (!$user_id) {
    echo json_encode(['success' => false, 'error' => 'No user ID provided']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Server error: ' . $e->getMessage()]);
}
?>
