<?php include ('config/db.php')?>

<?php
	$date = $_POST['date'];
	$vis = $_POST['importance'];
	$desc = $_POST['description'];
	
	$fileNames = array();
	$captions = array();
	
	// Upload images
	for($i=1; isset($_FILES['image-'.$i]); $i++) {
		$errors= array();
	
		$file_name = $_FILES['image-'.$i]['name'];
		$file_size = $_FILES['image-'.$i]['size'];
		$file_tmp = $_FILES['image-'.$i]['tmp_name'];
		$file_type = $_FILES['image-'.$i]['type'];
		$file_ext = strtolower(end(explode('.', $_FILES['image-'.$i]['name'])));

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
		array_push($captions, $_POST['caption-'.$i]);
	}
	
	// Publish row to SQL database
	$stmt = $conn->prepare("INSERT INTO events(date, description, importance, images, captions)
		values(:date, :desc, :importance, :images, :captions)");
	$stmt->bindValue(':date', $date);
	$stmt->bindValue(':desc', $desc);
	$stmt->bindValue(':importance', $vis);
	$stmt->bindValue(':images', implode(',', array_filter($fileNames)));
	$stmt->bindValue(':captions', implode(',', array_filter($captions)));
	$stmt->execute();
	$stmt->close();
	
	// Return to homepage
	header('location:index.php');
?>