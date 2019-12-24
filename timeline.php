<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<script src="jquery-3.4.1.min.js"></script>
		<script src="Event.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" type="text/css" href="create-event.css">
		<link rel="stylesheet" type="text/css" href="popup.css">
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
				<h1>New Event</h1>

				<label for="date"><b>Date</b></label>
				<input type="date" placeholder="Enter Date" name="date" required>
				
				<label for="importance"><b>Importance (>= 1)</b></label>
				<input type="number" value="1" min="1" name="importance" required>
				
				<label for="image"><b>Image</b></label>
				<input type="file" name="image[]" multiple accept="image/*" required>
				
				<button type="submit" name="submit" class="btn">Add</button>
				<button type="button" class="btn cancel" onclick="closeForm()">Close</button>
			</form>
		</div>
		<script>
			function openForm() {
				document.getElementById("create-event").style.display = "block";
			}

			function closeForm() {
				document.getElementById("create-event").style.display = "none";
			}
		</script>
		
		
		<div id="myModal" class="modal">
			<h1 id="modal-date" align="center"></h1>
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
		
	</body>
</html>