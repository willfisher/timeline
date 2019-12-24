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
		alert("imageStr: " + this.imageStr);
	}
}