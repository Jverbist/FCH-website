<?php
$servername = "localhost";
$username = "webuser"; // use your MySQL username
$password = "@azertyuiop123"; // use your MySQL password
$dbname = "loginDB";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

/* Debugging: Check if form data is received
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "POST request received.<br>";
    echo "Username: " . $_POST['userName'] . "<br>";
    echo "Password: " . $_POST['password'] . "<br>";
}
*/

// Initialize an error message variable
//$error_message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_POST['userName']) && !empty($_POST['password'])) {
        $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
        $stmt->bind_param("s", $_POST['userName']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($stored_password);
            $stmt->fetch();
            if ($_POST['password'] === $stored_password) {
                // Successful login
                header("Location: myaccount.html");
                exit(); // Ensure no further code is executed after redirection
            } else {
                // Invalid password
                header("Location: mynmbs.php?error=Invalid%20password");
                exit();
            }
        } else {
            // No user found
            header("Location: mynmbs.php?error=No%20user%20found");
            exit();
        }

        $stmt->close();
    } else {
        // Missing username or password
        header("Location: mynmbs.php?error=Please%20enter%20both%20username%20and%20password");
        exit();
    }
}

$conn->close();
?>