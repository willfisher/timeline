<?php include ('config/db.php')?>
<?php include ('config/amazon-s3.php')?>

<?php
	$date = $_POST['date'];
	$vis = $_POST['importance'];
	$desc = $_POST['description'];
	
	$fileNames = array();
	$captions = array();
	
	$img_exts = array('png', 'jpg', 'jpeg', 'gif');
	
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
			try {
				$s3->upload($bucket, $file_name, fopen($file_tmp, 'rb'), 'public-read');
				if($i == 1 && !in_array($file_ext, $img_exts)) {
					$thmb_name = $_FILES['thumbnail']['name'];
					$thmb_tmp = $_FILES['thumbnail']['tmp_name'];
					$s3->upload($bucket, 'thumbnail/' . $thmb_name, fopen($thmb_tmp, 'rb'), 'public-read');
				}
			} catch(Exception $e) {
				echo 'Upload failed: ' . $e->getMessage();
			}
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
	header('location:https://polar-falls-65862.herokuapp.com/');
?>