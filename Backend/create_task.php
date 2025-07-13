<?php
header('Content-Type: application/json');
require 'db.php';
require 'email_helper.php'; // Make sure you created the helper function (shown below)

// Get POST data
$title = $_POST['title'] ?? null;
$description = $_POST['description'] ?? '';
$deadline = $_POST['deadline'] ?? null;
$user_id = $_POST['user_id'] ?? null;

// Validate required fields
if (!$title || !$deadline) {
    echo json_encode(['success' => false, 'error' => 'Title and deadline are required.']);
    exit;
}

// If user_id is empty string (no selection), set to null
if ($user_id === '') {
    $user_id = null;
}

// Insert the task
$stmt = $pdo->prepare('INSERT INTO tasks (title, description, deadline, status, user_id) VALUES (?, ?, ?, "Pending", ?)');

try {
    $stmt->execute([$title, $description, $deadline, $user_id]);

    // If assigned to a user, send notification email
    if ($user_id !== null) {
        // Get user info
        $userStmt = $pdo->prepare('SELECT name, email FROM users WHERE id = ?');
        $userStmt->execute([$user_id]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Send email notification
            sendTaskAssignedEmail(
                $user['email'],
                $user['name'],
                $title,
                $deadline
            );
        }
    }

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
