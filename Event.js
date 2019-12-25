class Event {
	constructor(date, description, importance, imageStr, captions, startDate) {
		this.date = date;
		this.description = description;
		this.importance = importance;
		this.imageStr = imageStr;
		this.captions = captions;
		
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
		var imageCaptions = this.captions.split(',');
		var i;
		for(i = 0; i < imageNames.length; i++) {
			modal.innerHTML += '<div class="gallery">' + '\n' +
					'<a target="_blank" href="' + './images/' + imageNames[i] + '">' + '\n' +
					'<img src="' + './images/' + imageNames[i] + '" alt="Cinque Terre" width="600" height="400">' + '\n' +
					'</a>' + '\n' +
					'<div class="desc">' + imageCaptions[i] + '</div>' + '\n' +
					'</div>';
		}
		
		var modalDate = document.getElementById("modal-date");
		modalDate.innerHTML = formatDate(this.date);
		
		var modalDesc = document.getElementById("modal-description");
		modalDesc.innerHTML = this.description;
		
		openModal();
	}
}