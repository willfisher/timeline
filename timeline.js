const padding = 50;
const dotRadius = 5;
const maxHeight = 500;
const maxWidth = 200;

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
/*
var start = {
	xpos : 0,
	vis : 1,
	img : "testimage.jpg"
};
var middle = {
	xpos : .5,
	vis : 1.5,
	img : "testimage.jpg"
};
var end = {
	xpos : 1,
	vis : 1,
	img : "testimage.jpg"
};
nodes.push(start);
nodes.push(middle);
nodes.push(end);*/

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {parseCSV(data);}
     });
});

function parseCSV(txt) {
	
	var data = [];

    // split by line breaks
    var rows = txt.split("\r\n");

    for(var i=1; i < rows.length; i++) {
    	// split each row by comma
    	var row_columns = rows[i].split(",");

    	data.push(row_columns);
	}
	
	data.forEach(function (item, index) {
		var eventDate = new Date(item[1]);
		var xval = Math.abs(eventDate - startDate)/Math.abs(today - startDate);
		
		nodes.push({
			xpos : xval,
			vis : Number(item[0]),
			img : item[2]
		});
	});
}


function draw(){
    // Clear screen to white.
    context.fillStyle = "white";
    context.fillRect(originx, originy, canvas.width/scale, canvas.height/scale);
	
    context.fillStyle = "black";
	
	context.lineWidth = 5 / scale;
	
	context.beginPath(); 
	context.moveTo(padding, canvas.height/2);
	context.lineTo(canvas.width - padding, canvas.height/2);
	context.stroke();
	
	nodes.forEach(function (item, index) {
		var abspos = padding + item.xpos * (canvas.width - 2*padding);
		if(abspos >= originx && abspos <= originx + visibleWidth) {
			context.beginPath();
			context.arc(abspos, canvas.height/2, dotRadius/scale * Math.min(1, scale/item.vis), 0, 2 * Math.PI, false);
			context.fill();
			context.stroke();
			
			var img = new Image();
			img.src = "./" + item.img;
			
			var imgWidth = img.width;
			var imgHeight = img.height;
			var imgScale = Math.min(maxHeight/imgHeight, maxWidth/imgWidth) * Math.min(1, scale/item.vis) / scale;
			imgWidth *= imgScale;
			imgHeight *= imgScale;
			context.drawImage(img, abspos - imgWidth/2, canvas.height/2 - 20/scale - imgHeight, imgWidth, imgHeight);
		}
	});
}
// Draw loop at 60FPS.
setInterval(draw, 1000/60);

canvas.onwheel = function (event){
    event.preventDefault();
    // Get mouse offset.
    var mousex = event.clientX - canvas.offsetLeft;
    var mousey = canvas.height/2;
    // Normalize wheel to +1 or -1.
    var wheel = event.deltaY < 0 ? 1 : -1;
	
    // Compute zoom factor.
    var zoom = Math.exp(wheel*zoomIntensity);
	if(zoom*scale < 1) {
		if(scale == 1)
			return;
		else {
			scale = 1;
			originx = 0;
			originy = 0;
			visibleWidth = canvas.width;
			visibleHeight = canvas.height;
			context.setTransform(1, 0, 0, 1, 0, 0);
			return;
		}
	}
    
    // Translate so the visible origin is at the context's origin.
    context.translate(originx, originy);
  
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

Date.prototype.addDays = function(days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
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

	return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function updateDate() {
	var percent = (originx + visibleWidth/2 - padding)/(canvas.width - 2*padding);
	console.log(Math.abs(today - startDate) * percent);
	var dateStr = formatDate(new Date(startDate.getTime() + Math.abs(today - startDate) * percent));
	document.getElementById("currDate").innerHTML = dateStr;
}
updateDate();
