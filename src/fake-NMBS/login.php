<?php
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
// login.php
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ

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

// 2) If form submitted, run our fully-vulnerable query
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Take the raw username input
    $userInput = $_POST['userName'] ?? '';

    // Build an injectable SQL. The trailing -- comments out the rest.
    $sql = "SELECT * FROM users 
            WHERE email = '$userInput' 
            -- ' AND password = ''";

    $result = $conn->query($sql);
    if ($result === false) {
        die("SQL error: " . $conn->error);
    }

    // Dump all returned rows
    echo "<h1>User Dump</h1><pre>";
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // JSON-encode each row for readability
            echo htmlentities(json_encode($row)) . "\n";
        }
    } else {
        echo "No rows returned.\n";
    }
    echo "</pre>";
    exit;
}

// 3) Otherwise show a simple form
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SQLi Login Demo</title>
</head>
<body>
  <h1>Fake Login (SQLi-vulnerable)</h1>
  <form method="post" action="login.php">
    <label>
      Username (email):
      <input type="text" name="userName" />
    </label><br><br>
    <label>
      Password:
      <input type="password" name="password" />
    </label><br><br>
    <button type="submit">Log In</button>
  </form>
  <p><em>Hint for full dump:</em> use <code>' OR '1'='1</code> as the username and leave password blank.</p>
</body>
</html>

