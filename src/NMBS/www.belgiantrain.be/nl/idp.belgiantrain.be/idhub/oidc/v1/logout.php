<?php
session_start(); // Start the session

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Redirect to mynmbs.php
header('Location: mynmbs.php');
exit();
?>
