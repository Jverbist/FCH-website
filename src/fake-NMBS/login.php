<?php
session_start();
if (!isset($_SESSION['userName'])) {
    header('Location: login.php');
    exit;
}

$conn = new mysqli('mysql','admin','admin','mydb');
if ($conn->connect_error) {
    die("Connection failed: ".$conn->connect_error);
}

// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
// Change here: we no longer append a Ò--Ó comment.
// Now we require you to close the email string and inject your OR.
// A lone quote will produce a syntax error, not a full dump.
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
$userName = $_SESSION['userName'];

// THIS is the vulnerable line:
$sql = "SELECT * 
          FROM users 
         WHERE email    = '$userName' 
           AND password = ''";

$result = $conn->query($sql);

// If you donÕt inject properly, youÕll get an error or no rows:
if ($result === false) {
    die("SQL error: " . htmlentities($conn->error));
}

// Fetch rows for display
$rows = $result->fetch_all(MYSQLI_ASSOC);
$conn->close();
?>
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <title>My NMBS Ð SQLi Dump</title>
</head>
<body>
  <h1>Welkom, <?php echo htmlentities($userName) ?></h1>
  <p>Hieronder zie je de query en (alle) rijen als je een geldige SQL?injectie hebt gedaan:</p>

  <pre><code><?php echo htmlentities($sql); ?></code></pre>

  <?php if (count($rows)): ?>
    <table border="1" cellpadding="5" style="border-collapse:collapse">
      <thead>
        <tr><?php foreach (array_keys($rows[0]) as $col): ?>
          <th><?php echo htmlentities($col) ?></th>
        <?php endforeach ?></tr>
      </thead>
      <tbody>
        <?php foreach ($rows as $row): ?>
          <tr>
            <?php foreach ($row as $cell): ?>
              <td><?php echo htmlentities($cell) ?></td>
            <?php endforeach ?>
          </tr>
        <?php endforeach ?>
      </tbody>
    </table>
  <?php else: ?>
    <p><em>Geen rijen ontvangen.</em></p>
  <?php endif; ?>
</body>
</html>

