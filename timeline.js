const padding = 50;
const dotRadius = 5;
var maxHeight = window.innerHeight/2 - 50;
var maxWidth = window.innerWidth/10;
const IMAGE_PATH = "./images/";

var MAX_SCALE = 1;

const startDate = new Date("12/28/2017");
var today = new Date();

var zoomIntensity = 0.1;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// Resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	maxHeight = canvas.height/2 - 50;
	maxWidth = canvas.width/10;
}
resizeCanvas();

window.onresize = function() {
	location.reload();
}

var scale = 1;
var originx = 0;
var originy = 0;
var visibleWidth = canvas.width;
var visibleHeight = canvas.height;

var nodes = [];

handleData();

function handleData() {
	data.forEach(function (item, index) {
		MAX_SCALE = Math.max(MAX_SCALE, item.importance);
		
		nodes.push(new Event(new Date(item.date), item.description, Number(item.importance), item.images, item.captions, startDate));
	});
}


function draw() {
    // Clear screen to white.
    context.fillStyle = "white";
    context.fillRect(originx, originy, canvas.width/scale, canvas.height/scale);
	
    context.fillStyle = "black";
	
	context.lineWidth = 5 / scale;
	
	context.beginPath(); 
	context.moveTo(padding, canvas.height/2);
	context.lineTo(canvas.width - padding, canvas.height/2);
	context.stroke();
	
	nodes.forEach(function(item, index) {
		var abspos = padding + item.position * (canvas.width - 2*padding);
		if(abspos >= originx && abspos <= originx + visibleWidth) {
			context.beginPath();
			context.arc(abspos, canvas.height/2, dotRadius/scale * Math.min(1, scale/item.importance), 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
			
			var img = item.getImage();
			
			var imgWidth = img.width;
			var imgHeight = img.height;
			var imgScale = Math.min(maxHeight/imgHeight, maxWidth/imgWidth) * Math.min(1, scale/item.importance) / scale;
			imgWidth *= imgScale;
			imgHeight *= imgScale;
			context.drawImage(img, abspos - imgWidth/2, canvas.height/2 - 20/scale - imgHeight, imgWidth, imgHeight);
		}
	});
}
// Draw loop at 60FPS.
setInterval(draw, 1000/60);

canvas.onclick = function(event) {
    var mousePos = {
		x: originx + (event.clientX - canvas.offsetLeft)/canvas.width*visibleWidth,
		y: originy + (event.clientY - canvas.offsetTop)/canvas.height*visibleHeight
    };
	
    nodes.forEach(function(item, index) {
		var abspos = padding + item.position * (canvas.width - 2*padding);
		var img = item.getImage();
		
		var imgWidth = img.width;
		var imgHeight = img.height;
		var imgScale = Math.min(maxHeight/imgHeight, maxWidth/imgWidth) * Math.min(1, scale/item.importance)/ scale;
		imgWidth *= imgScale;
		imgHeight *= imgScale;
		
		if(isInside(mousePos, {
			x: abspos - imgWidth/2,
			y: canvas.height/2 - 20/scale - imgHeight,
			width: imgWidth,
			height: imgHeight
		})) {
			item.display();
		}
	});
}
function isInside(pos, rect){
	return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y;
}


canvas.onwheel = function (event) {
    event.preventDefault();
    // Get mouse offset.
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = canvas.height/2;
    // Normalize wheel to +1 or -1.
    var wheel = event.deltaY < 0 ? 1 : -1;
	
    // Compute zoom factor.
    var zoom = Math.exp(wheel*zoomIntensity);
	if(zoom*scale < 1) {
		scale = 1;
		originx = 0;
		originy = 0;
		visibleWidth = canvas.width;
		visibleHeight = canvas.height;
		context.resetTransform();
		updateDate();
		return;
	}
	if(zoom*scale > MAX_SCALE) {
		zoom = MAX_SCALE/scale;
	}
    
    // Translate so the visible origin is at the context's origin.
    context.translate(originx, originy);
	
	var oldX = originx*scale;
	
    // Compute the new visible origin. Originally the mouse is at a
    // distance mouse/scale from the corner, we want the point under
    // the mouse to remain in the same place after the zoom, but this
    // is at mouse/new_scale away from the corner. Therefore we need to
    // shift the origin (coordinates of the corner) to account for this.
    originx -= mousex/(scale*zoom) - mousex/scale;
    originy -= mousey/(scale*zoom) - mousey/scale;
    
    // Scale it (centered around the origin due to the trasnslate above).
    context.scale(zoom, zoom);
    // Offset the visible origin to it's proper position.
    context.translate(-originx, -originy);

    // Update scale and others.
    scale *= zoom;
	scale = Math.max(1, scale);
    visibleWidth = canvas.width / scale;
    visibleHeight = canvas.height / scale;
	
	updateDate();
}

var dragging = false;
var lastPos = 0;
canvas.onmousedown = function(event) {
	dragging = true;
	lastPos = event.clientX - canvas.offsetLeft;
}
canvas.onmouseup = function(event) {
	dragging = false;
}
canvas.onmouseout = function(event) {
	dragging = false;
}
canvas.onmousemove = function(event) {
	if(dragging) {
		var delta = event.clientX - canvas.offsetLeft - lastPos;
		delta /= scale;
		if(originx - delta < 0 || originx + visibleWidth - delta > canvas.width)
			return;
		lastPos = event.clientX - canvas.offsetLeft;
		originx -= delta;
		context.translate(delta, 0);
		updateDate();
	}
}

function formatDate(date) {
	var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];

	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();

	return monthNames[monthIndex] + ' ' + day + ', ' + year;
}

function updateDate() {
	var percent = (originx + visibleWidth/2 - padding)/(canvas.width - 2*padding);
	var dateStr = formatDate(new Date(startDate.getTime() + Math.abs(today - startDate) * percent));
	document.getElementById("currDate").innerHTML = dateStr;
}
updateDate();
