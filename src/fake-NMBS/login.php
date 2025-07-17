<?php
// ???????????????????????????????????
// login.php
// ???????????????????????????????????

// 1) Start session (must be very first thing Ñ no BOM, no blank lines)
session_start();

// 2) DB connection (if you still need it for other checks; you can remove
//    entirely if youÕre not actually validating credentials in this demo)
$host   = 'mysql';
$dbUser = 'admin';
$dbPass = 'admin';
$dbName = 'mydb';
$conn   = new mysqli($host, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 3) Only on POST do we capture and redirect.
//    We *do not* auto-redirect on every GET, so no loops:
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Grab your (injectable) username payload
    $userInput = $_POST['userName'] ?? '';

    // Store it in the session
    $_SESSION['userName'] = $userInput;

    // Jump to the dump page just once
    header('Location: myaccount.php');
    exit;
}

// 4) If weÕre here, itÕs a normal GET. Show the form.
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>Fake NMBS Login</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    form { max-width: 300px; margin: auto; }
    input, button { width: 100%; padding: .5rem; margin: .5rem 0; }
  </style>
</head>
<body>
  <h1>Login (SQLi demo)</h1>
  <form method="post" action="login.php">
    <label>
      Email (injection point):<br>
      <input type="text" name="userName" required>
    </label>
    <label>
      Password (ignored):<br>
      <input type="password" name="password" required>
    </label>
    <button type="submit">Submit</button>
  </form>
  <p><em>To dump the whole table, try: <code>' OR '1'='1</code></em></p>
</body>
</html>

