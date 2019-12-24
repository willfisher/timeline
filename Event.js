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
	
	draw(originx, originy, visibleWidth, visibleHeight, padding, context, canvas) {
		var abspos = padding + this.position * (canvas.width - 2*padding);
		if(abspos >= originx && abspos <= originx + visibleWidth) {
			context.beginPath();
			context.arc(abspos, canvas.height/2, dotRadius/scale * Math.min(1, scale/item.importance), 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
			
			var img = this.getImage();
			
			var imgWidth = img.width;
			var imgHeight = img.height;
			var imgScale = Math.min(maxHeight/imgHeight, maxWidth/imgWidth) * Math.min(1, scale/item.importance) / scale;
			imgWidth *= imgScale;
			imgHeight *= imgScale;
			context.drawImage(img, abspos - imgWidth/2, canvas.height/2 - 20/scale - imgHeight, imgWidth, imgHeight);
		}
	}
}