//preload data
var person;
var socket;
var btn = document.getElementById("press");
var place = document.getElementById("list");

function init(){
	var xobj = new XMLHttpRequest();
	xobj.open("GET","data.json");
	xobj.onload = function(){
		if(xobj.status===200 && xobj.readyState ===4){
			person = JSON.parse(xobj.responseText); 
			if(person){//not sure if this check helps
				for(var i=0;i<person.things.length;i++){
					place.insertAdjacentHTML('beforeend',"<p>"+ person.things[i].text +"</p>");
				}
			}
		}else{
			console.log("error getting data");
		}
	}
	xobj.send();
}

init();//get initial data

socket = io.connect('http://localhost:8080');//connect to socket to server
socket.on('button-press', update);//if there is an message recieved from server

//update when data recieved from socket
function update(data){
	place.insertAdjacentHTML('beforeend',data.d);
}

//button listeneer
btn.addEventListener("click", function(){
	var string = "hello";
	var htmlString = "<p>" +string + "</p>";
	place.insertAdjacentHTML('beforeend',htmlString);

	var data = {
		d: htmlString
	};

	socket.emit('button-press',data); //sent message to sever
	console.log("sending data");
	

	sendDataToFile(string);
});

function sendDataToFile(data){
	person.things.push({text:data}); //pushing new data to object that holds the 
	var sendString = JSON.stringify(person);
	console.log(sendString);
	socket.emit('update-file',sendString);
}


