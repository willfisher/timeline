<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<script src="jquery-3.4.1.min.js"></script>
		<script src="Event.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" type="text/css" href="create-event.css">
		<link rel="stylesheet" type="text/css" href="popup.css">
		<link href="https://fonts.googleapis.com/css?family=Open+Sans|Roboto&display=swap" rel="stylesheet">
		
		<script src="lib/rsvp.js"></script>
		<script src="frame-grab.js"></script>
	</head>
	<body>
		<?php
			$conn = new mysqli('localhost', 'root', 'root', 'timeline');
			if($conn->connect_error) {
				die('Connection Failed : ' . $conn->connect_error);
			} else {
				$result = $conn->query("SELECT * FROM events");
				$data = array();
				if($result->num_rows > 0) {
					while($row = $result->fetch_assoc()) {
						array_push($data, $row);
					}
				}
				$conn->close();
			}
		?>
		<script type="text/javascript">
			var data = <?php echo json_encode($data); ?>;
		</script>
		<div id="overlay">
			<div id="overlay-item">
				<span id="currDate"></span>
			</div>
		</div>
		<canvas id="canvas"></canvas>
		<div id="images">
		</div>
		<script src="timeline.js"></script>
		
		<button class="open-button" onclick="openForm()">Add Event</button>
		
		<div class="form-popup" id="create-event">
			<form action="/save-event.php" class="form-container" method="POST" enctype="multipart/form-data">
				<h1 align="center">New Event</h1>

				<label for="date"><b>Date</b></label>
				<input type="date" placeholder="Enter Date" name="date" required>
				
				<label for="description"><b>Description</b></label>
				<input type="text" placeholder="Description..." name="description" maxlength="2000">
				
				<label for="importance"><b>Importance</b></label>
				<input type="number" value="1" min="1" name="importance" required>
				
				<label for="image"><b>Images</b></label>
				<div id="image-uploads">
					<input type="file" name="image-1" accept="image/*, video/*" required>
					<input type="text" name="caption-1" placeholder="Caption..." maxlength="100" required>
				</div>
				
				<div>
					<button type="button" class="img-btn" onclick="addUpload();">+</button>
					<button type="button" class="img-btn" onclick="resetUploads();">Reset</button>
				</div>
				
				<button type="submit" name="submit" class="btn">Add</button>
				<button type="button" class="btn cancel" onclick="closeForm()">Close</button>
			</form>
		</div>
		<script>
			var uploadCount = 1;
			function openForm() {
				document.getElementById("create-event").style.display = "block";
			}

			function closeForm() {
				document.getElementById("create-event").style.display = "none";
			}
			
			function addUpload() {
				uploadCount++;
				document.getElementById("image-uploads").innerHTML += '<input type="file" name="image-' + uploadCount + '" accept="image/*, video/*" required>' + '\n' +
					'<input type="text" name="caption-' + uploadCount + '" placeholder="Caption..." maxlength="100" required>';
			}
			function resetUploads() {
				uploadCount = 0;
				document.getElementById("image-uploads").innerHTML = '';
				addUpload();
			}
		</script>
		
		
		<div id="myModal" class="modal">
			<h1 id="modal-date" align="center"></h1><br>
			<div style="display:block;width:50%;margin:0 auto;">
				<p id="modal-description" align="justify"></p>
			</div><br>
			<span class="close cursor" onclick="closeModal()">&times;</span>
			<div class="modal-content" id="modal-content">
			</div>
		</div>
		<script>
			function openModal() {
				document.getElementById("myModal").style.display = "block";
			}

			function closeModal() {
				document.getElementById("myModal").style.display = "none";
			}
		</script>
		
		
		<video hidden id="thumbnail" preload="metadata">
		</video>
	</body>
</html>