var express = require('express');//import statement

var app = express();
var server = app.listen(8080); //listens on port 8080

app.use(express.static('public')); //hosts everything in public file

console.log("the sever is on");

var socket = require('socket.io'); //import statement

var io = socket(server);//creates a socket for this server

io.sockets.on('connection', newConnection);

function newConnection(socket){
	console.log(socket.id);

	socket.on('button-press', buttonPress); //if it receives a button press run the function
	socket.on('update-file', updateFile);
	//socket.broadcast.emit('init',readfile);

	function buttonPress(data){
		socket.broadcast.emit('button-press',data); //broadcast to everyone connected
		
		console.log(data);
	}

	function updateFile(string){
		console.log("recived data:" +string);
		//write into json file
		var fs = require('fs');
		fs.writeFile("public/data.json", string, function(err){
			if(err){
				return console.log(err);
			}
		});

		console.log("file saved");
	}
}