<?php
header('Content-Type: application/json');
require 'db.php'; // your PDO connection

// Input validation
$id = intval($_POST['id'] ?? 0);
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$role = $_POST['role'] ?? 'user';
$password = $_POST['password'] ?? '';

if (!$id || !$name || !$email || !in_array($role, ['admin', 'user'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input.']);
    exit;
}

// Check if email is already taken by another user
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
$stmt->execute([$email, $id]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Email already in use by another user.']);
    exit;
}

try {
    if ($password) {
        // Update including new password
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?");
        $stmt->execute([$name, $email, $hashed, $role, $id]);
    } else {
        // Update without changing password
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?");
        $stmt->execute([$name, $email, $role, $id]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>
