<?php
	$date = $_POST['date'];
	$vis = $_POST['importance'];
	$desc = $_POST['description'];
	
	$fileNames = array();
	
	// Upload image
	if(isset($_FILES['image'])){
		$errors= array();
		
		$fileCount = count($_FILES['image']);
		for ($i = 0; $i < $fileCount; $i++) {
			$file_name = $_FILES['image']['name'][$i];
			$file_size = $_FILES['image']['size'][$i];
			$file_tmp = $_FILES['image']['tmp_name'][$i];
			$file_type = $_FILES['image']['type'][$i];
			$file_ext = strtolower(end(explode('.', $_FILES['image']['name'][$i])));

			$extensions = array("jpeg", "jpg", "png");

			if(in_array($file_ext, $extensions) === false) {
				$errors[] = "Extension not allowed, please choose a JPEG or PNG file.";
			}

			if($file_size > 2097152) {
				$errors[] = 'File size must be under 2 MB';
			}

			if(empty($errors) == true) {
				move_uploaded_file($file_tmp, "images/".$file_name);
				echo "Success";
			} else {
				print_r($errors);
			}
			
			array_push($fileNames, $file_name);
		}
	}
	
	// Publish row to SQL database
	$conn = new mysqli('localhost', 'root', 'root', 'timeline');
	if($conn->connect_error) {
		die('Connection Failed : ' . $conn->connect_error);
	} else {
		echo 'creating row';
		$stmt = $conn->prepare("INSERT INTO events(date, description, importance, images)
			values(?, ?, ?, ?)");
		$stmt->bind_param("ssis", $date, $desc, $vis, implode(',', array_filter($fileNames)));
		$stmt->execute();
		$stmt->close();
		$conn->close();
	}
	
	// Return to homepage
	header('location:timeline.php');
?>