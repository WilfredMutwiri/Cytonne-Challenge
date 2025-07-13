<?php
$host = 'localhost';
$db   = 'task_system';
$user = 'Wilfred';
$pass = 'Wilfred#1234'; // or your MySQL password
$charset = 'utf8mb4';

$dsn = "mysql:host=127.0.0.1;port=3306;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
     exit;
}
?>
