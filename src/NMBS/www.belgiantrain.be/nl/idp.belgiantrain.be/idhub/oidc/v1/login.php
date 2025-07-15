<?php
$servername = "localhost";
$username = "webuser"; // use your MySQL username
$password = "#WeAreExclusive"; // use your MySQL password
$dbname = "loginDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['userName'])) {
        // Vulnerable SQL query
        $userName = $_POST['userName'];
        $password = $_POST['password'];
        $sql = "SELECT * FROM users WHERE email = '$userName' AND password = '$password'";

        $result = $conn->query($sql);

        if ($result === FALSE) {
            // SQL error
            $error = urlencode($conn->error);
            header("Location: mynmbs.php?error=$error");
            exit();
        } else if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
			
            // Successful login
            session_start();
            $_SESSION['userName'] = $userName;
            header("Location: myaccount.php");
            exit(); // Ensure no further code is executed after redirection
        } else {
            // No user found or invalid password
            header("Location: mynmbs.php?error=Invalid%20username%20or%20password");
            exit();
        }
    } else {
        // Missing username
        header("Location: mynmbs.php?error=Please%20enter%20username");
        exit();
    }
}
$conn->close();
?>
