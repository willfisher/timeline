<?php
	$log_name = 'data.csv'; // Change to the log file name
	$date = $_POST['date'];
	$vis = $_POST['importance'];
	$image = $_POST['image'];
	
	file_put_contents($log_name, $message, FILE_APPEND);
	header('location:timeline.html'); // redirect back to the main site
?>