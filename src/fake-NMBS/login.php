<?php
session_start(); // ? must be first line, no output before this

// If already Òlogged inÓ, send straight to the dump page
if (isset($_SESSION['userName'])) {
    header('Location: myaccount.php');
    exit;
}

// DB connection settings
$host   = 'mysql';    // Docker service name
$dbUser = 'admin';
$dbPass = 'admin';
$dbName = 'mydb';

// 1) Connect
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 2) Handle the login form
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Grab raw username (email) field
    $userInput = $_POST['userName'] ?? '';

    // Store it in the session for the dump page
    $_SESSION['userName'] = $userInput;

    // Redirect immediately to your vulnerable dump page
    header('Location: myaccount.php');
    exit;
}

// 3) If not a POST, show the login form
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>Login</title>
  <style>
    body { font-family:sans-serif; padding:2rem; }
    form { max-width:300px; margin:auto; }
    input { width:100%; padding:.5rem; margin:.5rem 0; }
    button { padding:.5rem 1rem; }
  </style>
</head>
<body>
  <h1>Fake NMBS Login</h1>
  <form method="post" action="login.php">
    <label>
      Email:<br>
      <input type="text" name="userName" placeholder="e.g. alice@example.com" required>
    </label>
    <label>
      Password:<br>
      <input type="password" name="password" placeholder="(ignored)" required>
    </label>
    <button type="submit">Log in</button>
  </form>
  <p><em>For a full SQLi dump, use <code>' OR '1'='1</code> as the email.</em></p>
</body>
</html>

