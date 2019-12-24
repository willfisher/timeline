class Event {
	constructor(date, importance, imageStr, startDate) {
		this.date = date;
		this.importance = importance;
		this.imageStr = imageStr;
		
		this.position = Math.abs(this.date - startDate)/Math.abs(new Date() - startDate);
		
		this.image = new Image();
		this.image.src = './images/' + this.imageStr.split(',')[0];
	}
	
	getImage() {
		var img = new Image();
		img.src = './images/' + this.imageStr.split(',')[0];
		return img;
	}
	
	display() {
		var modal = document.getElementById("modal-content");
		
		modal.innerHTML = '';
		
		var imageNames = this.imageStr.split(',');
		var i;
		for(i = 0; i < imageNames.length; i++) {
			modal.innerHTML += '<div class="gallery">' + '\n' +
					'<a target="_blank" href="' + './images/' + imageNames[i] + '">' + '\n' +
					'<img src="' + './images/' + imageNames[i] + '" alt="Cinque Terre" width="600" height="400">' + '\n' +
					'</a>' + '\n' +
					'<div class="desc">Add a description of the image here</div>' + '\n' +
					'</div>';
		}
		
		var modalDate = document.getElementById("modal-date");
		modalDate.innerHTML = formatDate(this.date);
		
		openModal();
	}
}