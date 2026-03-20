<?php
/**
 * MAXBOX - Contact Form Handler
 * Handles form submissions and sends emails
 */

// Set header to JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Validate CSRF or API key (optional but recommended)
// Uncomment if you have a frontend that generates a token

// Get form data
$firstName = trim($_POST['firstName'] ?? '');
$lastName = trim($_POST['lastName'] ?? '');
$company = trim($_POST['company'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if (strlen($firstName) < 2) {
    $errors['firstName'] = 'Prénom trop court';
}

if (strlen($lastName) < 2) {
    $errors['lastName'] = 'Nom trop court';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Email invalide';
}

if (strlen(preg_replace('/\D/', '', $phone)) < 10) {
    $errors['phone'] = 'Téléphone invalide';
}

if (strlen($message) < 10) {
    $errors['message'] = 'Message trop court';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ]);
    exit;
}

// Prepare email content
$to = 'location@groupe-hgi.com';
$subject = "Nouvelle demande de réservation MAXBOX - $firstName $lastName";

$body = "
<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { background: linear-gradient(135deg, #0f4c9f 0%, #0a3a7a 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #0f4c9f; }
        .footer { background: #f5f7fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>Nouvelle Réservation MAXBOX</h2>
    </div>

    <div class=\"content\">
        <div class=\"field\">
            <span class=\"label\">Prénom:</span> $firstName
        </div>
        <div class=\"field\">
            <span class=\"label\">Nom:</span> $lastName
        </div>
        <div class=\"field\">
            <span class=\"label\">Société:</span> $company
        </div>
        <div class=\"field\">
            <span class=\"label\">Email:</span> $email
        </div>
        <div class=\"field\">
            <span class=\"label\">Téléphone:</span> $phone
        </div>
        <div class=\"field\">
            <span class=\"label\">Message:</span>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        <div class=\"field\">
            <span class=\"label\">Soumis le:</span> " . date('d/m/Y H:i:s') . "
        </div>
    </div>

    <div class=\"footer\">
        <p>Cet email a été généré automatiquement par le formulaire de contact MAXBOX.</p>
    </div>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@maxbox.fr\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
$emailSent = mail($to, $subject, $body, $headers);

// Optional: Send confirmation email to user
if ($emailSent) {
    $userSubject = "Nous avons reçu votre demande - MAXBOX";
    $userBody = "
<!DOCTYPE html>
<html lang=\"fr\">
<head>
    <meta charset=\"UTF-8\">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { background: linear-gradient(135deg, #0f4c9f 0%, #0a3a7a 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f5f7fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class=\"header\">
        <h2>Confirmation de Réception</h2>
    </div>

    <div class=\"content\">
        <p>Bonjour $firstName,</p>
        <p>Merci d'avoir soumis votre demande de réservation MAXBOX.</p>
        <p>Nous avons bien reçu votre message et un membre de notre équipe vous recontactera dans les 24 heures pour discuter de vos besoins en détail.</p>
        <p><strong>En attendant, vous pouvez nous appeler directement :</strong><br>
        <strong>Téléphone :</strong> 0756833089<br>
        <strong>Horaires :</strong> Lundi à Samedi, 9h-18h</p>
    </div>

    <div class=\"footer\">
        <p>&copy; 2026 MAXBOX - Centre de self-stockage</p>
    </div>
</body>
</html>
    ";

    $userHeaders = "MIME-Version: 1.0\r\n";
    $userHeaders .= "Content-type: text/html; charset=UTF-8\r\n";
    $userHeaders .= "From: noreply@maxbox.fr\r\n";

    mail($email, $userSubject, $userBody, $userHeaders);
}

// Log the submission (optional)
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'firstName' => $firstName,
    'lastName' => $lastName,
    'email' => $email,
    'status' => $emailSent ? 'success' : 'failed'
];

// You could save this to a database or log file
// file_put_contents('logs/contact_submissions.log', json_encode($logEntry) . "\n", FILE_APPEND);

// Return response
if ($emailSent) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Votre demande a été envoyée avec succès'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi de l\'email'
    ]);
}
?>
