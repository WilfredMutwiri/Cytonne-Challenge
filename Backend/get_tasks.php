<?php
header('Content-Type: application/json');
require 'db.php';

$stmt = $pdo->prepare("
  SELECT 
    tasks.*,
    users.name AS user_name
  FROM tasks
  LEFT JOIN users ON tasks.user_id = users.id
");
$stmt->execute();
$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($tasks);
?>
