const express = require('express'),
	app = express(),
	router = express.Router(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	MongoClient = require('mongodb').MongoClient,
	mongoUrl = 'mongodb://admin:password1@ds027335.mlab.com:27335/mymongdb',
	mongoName = 'mymongdb';


// Static Routes
// ===========================================================

app.use(express.static('public'));
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/stressed', function(req, res){
	res.sendFile(__dirname + '/public/stressed.html');
});
app.get('/encouraged', function(req, res){
	res.sendFile(__dirname + '/public/encouraged.html');
});


// Database
// ===========================================================
// Mongo Connection Functions
let storeData = function(c, data){
	MongoClient.connect(mongoUrl, function(err, client){
		client.db(mongoName).collection(c).insertOne({data}, function(err, res){
			console.log(JSON.stringify(res));
			client.close();
		});
	});
}


let getData = function(c, limit, callback){
	MongoClient.connect(mongoUrl, function(err, client){
		client.db(mongoName).collection(c).find({}).limit(limit).toArray(function(err, res){
			res.forEach((i)=> callback(i));
			client.close();
		});
	});
}

// Socket
// ===========================================================
io.on('connection', function(socket){
	console.log('connected');
	let communications = ['stress-word', 'stress-encourage', 'grateful-word'];
	
	// add listeners for each communication type
	// each time an even is emitted, store it 
	// and broadcast it 
	for(let c of communications){
		socket.on(c, function(data){
			console.log('heard ', c, ' of ', data);
			storeData(c, data);
			io.emit(c, data);
		});
	}

	// emit past data on initial connection
	// for each communication type, get db data
	// and emit results (one by one)
	socket.on('join', function(){
		console.log('joined...');
		for(let c of communications){
			let callback = function(item){ io.emit(c, item) };
			getData(c, 12, callback);
			// getData(c, 8).forEach((item)=> client.emit(c, item));
		}

	});
});

// Listener
// ===========================================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, function(){
	console.log('listening on 3000');
});