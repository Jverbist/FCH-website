/* 
Vulnerable SQL Query:
The SQL query is constructed using direct user input, making it susceptible to SQL injection attacks.
$_POST['userName'] and $_POST['password'] are directly included in the SQL query without any sanitization or escaping.
Demonstrating SQL Injection
In your demo environment, you can demonstrate SQL injection attacks, such as:

Bypassing Login:

Enter the following in the username field: admin' --
Leave the password field blank.
This comment out the rest of the SQL query, bypassing password checks.
Extracting Data:

Enter the following in the username field: ' OR '1'='1' --
This creates a condition that is always true, potentially exposing all user data if the script fetches more information.

Important Reminder:

Security: Never use this code in a production environment. It's intentionally insecure for educational purposes only.
Controlled Environment: Ensure the demo environment is isolated and secure.
*/
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
    if (!empty($_POST['userName'])) { // Removed password check for testing purposes
        // Vulnerable SQL query
        $userName = $_POST['userName'];
        $password = $_POST['password'];
        $sql = "SELECT password FROM users WHERE email = '$userName'";
        
        // Debugging: Output the constructed SQL query
        echo "Constructed SQL query: " . htmlspecialchars($sql) . "<br>";

        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($password === $row['password']) {
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
    } else {
        // Missing username
        header("Location: mynmbs.php?error=Please%20enter%20username");
        exit();
    }
}

$conn->close();
?>