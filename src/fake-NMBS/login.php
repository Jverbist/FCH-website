
<?php
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
// login.php
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ

// DB connection settings
$host   = 'mysql';
$dbUser = 'admin';
$dbPass = 'admin';
$dbName = 'mydb';

// 1) Connect
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 2) If form submitted, set session and redirect
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userInput = $_POST['userName'] ?? '';

    // ? session + redirect go here
    session_start();
    $_SESSION['userName'] = $userInput;
    header("Location: myaccount.php");
    exit;
}

// 3) Otherwise show your login formÉ
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>Login</title>
</head>
<body>
  <form method="post" action="login.php">
    <label>Email:<input type="text" name="userName" /></label><br>
    <label>Password:<input type="password" name="password" /></label><br>
    <button type="submit">Log in</button>
  </form>
</body>
</html>

