<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/../vendor/autoload.php';

function sendTaskAssignedEmail($toEmail, $toName, $taskTitle, $deadline) {
    // SMTP configuration
    $smtpHost = 'smtp.gmail.com';
    $smtpUsername = 'wilfredmutwiri20@gmail.com';
    $smtpPassword = 'cvjowirtedklqfyt';
    $smtpPort = 587;
    $smtpEncryption = 'tls';


    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $smtpHost;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpUsername;
        $mail->Password   = $smtpPassword;
        $mail->SMTPSecure = $smtpEncryption;
        $mail->Port       = $smtpPort;
        $mail->CharSet    = 'UTF-8';

        // Sender and recipient
        $mail->setFrom('wilfredmutwiri20@gmail.com', 'Task Management System');
        $mail->addAddress($toEmail, $toName);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Task Assigned: $taskTitle";
$mail->Body = '
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #333;">
        <h2 style="color: #4CAF50;">Hello ' . htmlspecialchars($toName) . ',</h2>
        <p>You have been assigned a new task in the <strong>Task Management System</strong>:</p>
        <table cellpadding="8" cellspacing="0" border="0" style="border:1px solid #ddd; border-collapse:collapse; margin:15px 0;">
            <tr style="background:#f0f0f0;">
                <th align="left">Task</th>
                <td>' . htmlspecialchars($taskTitle) . '</td>
            </tr>
            <tr>
                <th align="left">Deadline</th>
                <td>' . htmlspecialchars($deadline) . '</td>
            </tr>
        </table>
        <p style="margin-top:20px;">
            Please log in to your dashboard to view more details and update the task status.
        </p>
        <br>
        <p>Thank you,<br>The Task Management System Team</p>
    </div>
';

$mail->AltBody = "Hello $toName,\n\n"
    . "You have been assigned a new task:\n\n"
    . "Task: $taskTitle\n"
    . "Deadline: $deadline\n\n"
    . "Please log in to your dashboard to view and update the task:\n"
    . "Thank you,\nThe Task Management System Team";

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}
?>
