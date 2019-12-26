class Event {
	constructor(date, description, importance, imageStr, captions, startDate) {
		this.date = date;
		this.description = description;
		this.importance = importance;
		this.imageStr = imageStr;
		this.captions = captions;
		
		this.position = Math.abs(this.date - startDate)/Math.abs(new Date() - startDate);
		
		this.image = new Image();
		this.image.src = uploadBaseURL + (this.isImage() ? '' : 'thumbnails/') + this.imageStr.split(',')[0];
	}
	
	getImage() {
		//var img = new Image();
		//img.src = uploadBaseURL + (this.isImage() ? '' : 'thumbnails/') + this.imageStr.split(',')[0];
		return this.image;
	}
	
	isImage() {
		var imgExtensions = ['png', 'jpeg', 'jpg', 'gif'];
		var firstName = this.imageStr.split(',')[0];
		return imgExtensions.includes(firstName.split('.')[firstName.split('.').length - 1].toLowerCase());
	}
	
	display() {
		var imgExtensions = ['png', 'jpeg', 'jpg', 'gif'];
		var modal = document.getElementById("modal-content");
		
		modal.innerHTML = '';
		
		var imageNames = this.imageStr.split(',');
		var imageCaptions = this.captions.split(',');
		var i;
		for(i = 0; i < imageNames.length; i++) {
			if(imgExtensions.includes(imageNames[i].split('.')[imageNames[i].split('.').length - 1].toLowerCase())) {
				modal.innerHTML += '<div class="gallery">' + '\n' +
						'<a target="_blank" href="' + uploadBaseURL + imageNames[i] + '">' + '\n' +
						'<img src="' + uploadBaseURL + imageNames[i] + '" alt="Cinque Terre" width="600" height="400">' + '\n' +
						'</a>' + '\n' +
						'<div class="desc">' + imageCaptions[i] + '</div>' + '\n' +
						'</div>';
			} else {
				modal.innerHTML += '<div class="gallery">' + '\n' +
						'<a target="_blank" href="' + uploadBaseURL + imageNames[i] + '">' + '\n' +
						'<video autoplay loop muted width="600" height="400">' + '\n' +
						'<source src="' + uploadBaseURL + imageNames[i] + '" type="video/mp4">' + '\n' +
						'</video>' + '\n' +
						'</a>' + '\n' +
						'<div class="desc">' + imageCaptions[i] + '</div>' + '\n' +
						'</div>';
			}
		}
		
		var modalDate = document.getElementById("modal-date");
		modalDate.innerHTML = formatDate(this.date);
		
		var modalDesc = document.getElementById("modal-description");
		modalDesc.innerHTML = this.description;
		
		openModal();
	}
}