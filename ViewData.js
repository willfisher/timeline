class ViewManager {
	construct(canvas, context) {
		this.canvas = canvas;
		this.context = context;
	
		this._originx = 0;
		this._originy = 0;
		this._scale = 1;
		this.visibleWidth = canvas.width;
		this.visibleHeight = canvas.height;
	}
	
	handleScroll(event) {
		
	}
}