<?php
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
// Database connection settings
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
$host     = "mysql";    // Docker service name
$dbUser   = "admin";    
$dbPass   = "admin";    
$dbName   = "mydb";

// Create connection
$conn = new mysqli($host, $dbUser, $dbPass, $dbName);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
// Handle the POSTed login form
// ÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑÑ
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Grab & trim inputs
    $userEmail = trim($_POST['userName'] ?? '');
    $userPass  = trim($_POST['password'] ?? '');

    // 1) Validate presence
    if ($userEmail === '' || $userPass === '') {
        header("Location: mynmbs.php?error=Please%20enter%20all%20fields");
        exit();
    }

    // 2) Prepare and execute query safely
    $stmt = $conn->prepare(
        "SELECT id, email 
           FROM users 
          WHERE email = ? 
            AND password = ?"
    );

    // if prepare() failed, bail with the error
    if ($stmt === false) {
        $err = urlencode($conn->error);
        header("Location: mynmbs.php?error=$err");
        exit();
    }

    $stmt->bind_param("ss", $userEmail, $userPass);
    $stmt->execute();
    $result = $stmt->get_result();

    // 3) Check results
    if ($result && $result->num_rows > 0) {
        // Successful login
        session_start();
        $_SESSION['userName'] = $userEmail;
        header("Location: myaccount.php");
        exit();
    } else {
        // Invalid credentials
        header("Location: mynmbs.php?error=Invalid%20username%20or%20password");
        exit();
    }
}

// Close the connection when done
$conn->close();

