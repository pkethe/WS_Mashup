// List all dependencies
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

// Listening port
var port = Number(process.env.PORT || 3000);

server.listen(port);

// connect to mongoDB
mongoose.connect('mongodb://localhost/PA3', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
});

// default path to route
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


// create schema for api collection
var apiSchema = mongoose.Schema({
	id: String,
	title: String,
	summary: String,
	rating: Number,
	name: String,
	label: String,
	author: String,
	description: String,
	type: String,
	downloads: String,
	useCount: String,
	sampleUrl: String,
	downloadUrl: String,
	dateModified: String,
	remoteFeed: String,
	numComments: String,
	commentsUrl: String,
	Tags: String,
	category: String,
	protocols: String,
	serviceEndpoint: String,
	version: String,
	wsdl: String,
	data_format: String,
	apigroups: String,
	example: String,
	clientInstall: String,
	authentication: String,
	ssl: String,
	readonly: String,
	VendorApiKits: String,
	CommunityApiKits: String,
	blog: String,
	forum: String,
	support: String,
	accountReq: String,
	commercial:String,
	provider: String,
	managedBy: String,
	dataLicensing:String,
	fees: String,
	limits:String,
	terms:String,
	company: String,
	updated: Number
}); 

// Mongoose model
var apiModel = mongoose.model('ApiModel', apiSchema);

// read file api.txt
console.log('Reading data from api.txt...')
fs.readFile(path.join(__dirname, '/data/api.txt'), {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	var array = data.split('\n');

	for (var i = 0; i < array.length; i++) {
		var line = array[i];
		// console.log(line);

		//var attributes = line.split(/\$\#\$|\$\$\$/);
		var attributes = line.split(/\$\#\$/);
		if (attributes[45] !=null) {
			var yr = attributes[45].split('-');
		} else {
			yr[0] = null;
		}
		var rate = attributes[3];
		if (rate == null) {
			rate = 0; 
		} 
		var newTuple = new apiModel({id:attributes[0],
										title:attributes[1],
										summary: attributes[2],
										rating: rate,
										name: attributes[4],
                                        label: attributes[5],
                                        author: attributes[6],
                                        description: attributes[7],
                                        type: attributes[8],
                                        downloads: attributes[9],
                                        useCount: attributes[10],
                                        sampleUrl: attributes[11],
                                        downloadUrl: attributes[12],
                                        dateModified: attributes[13],
                                        remoteFeed: attributes[14],
                                        numComments: attributes[15],
                                        commentsUrl: attributes[16],
                                        Tags: attributes[17],
                                        category: attributes[18],
                                        protocols: attributes[19],
                                        serviceEndpoint: attributes[20],
                                        version: attributes[21],
                                        wsdl: attributes[22],
                                        data_format: attributes[23],
                                        apigroups: attributes[24],
                                        example: attributes[25],
                                        clientInstall: attributes[26],
                                        authentication: attributes[27],
                                        ssl: attributes[28],
                                        readonly: attributes[29],
                                        VendorApiKits: attributes[30],
                                        CommunityApiKits: attributes[31],
                                        blog: attributes[32],
                                        forum: attributes[33],
                                        support: attributes[34],
                                        accountReq: attributes[35],
                                        commercial:attributes[36],
                                        provider: attributes[37],
                                        managedBy: attributes[38],
                                        dataLicensing:attributes[39],
                                        fees: attributes[40],
                                        limits:attributes[41],
                                        terms:attributes[42],
                                        company: attributes[43],
                                        updated: yr[0]					
		 });

		//console.log(newTuple);
		//Commenting as the datbase is already populated
		// newTuple.save(function(err){
		// 	if (err) throw err;

		// });

	}
});
//db.apimodels.find({Tags: /science/i}).limit(2);
// create schema for mashup.txt
var mashupSchema = mongoose.Schema({
	id: String,
	title: String,
	summary: String,
	rating: Number,
	name: String,
	label: String,
	author: String,
	description: String,
	type: String,
	downloads: String,
	useCount: String,
	sampleUrl: String,
	dateModified: String,
	numComments: String,
	commentsUrl: String,
	tags: String,
	APIs: String,
	updated: Number
});

// Mongoose model
var mashupModel = mongoose.model('MashupModel', mashupSchema);

// read file mashup.txt
console.log('Reading data from mashup.txt...')
fs.readFile(path.join(__dirname, '/data/mashup.txt'), {encoding: 'utf-8'}, function (err, data) {
	if (err) throw err;
	var array = data.split('\n');

	for (var i = 0; i < array.length; i++) {
		var line = array[i];
		// console.log(line);

		//var attributes = line.split(/\$\#\$|\$\$\$/);
		var attributes = line.split(/\$\#\$/);
		if (attributes[17] !=null) {
			var yr = attributes[17].split('-');
		} else {
			yr[0] = null;
		}
		var rate = attributes[3];
		if (rate == null) {
			rate = 0; 
		} 
		var newTuple = new mashupModel({
			        id: attributes[0],
			        title: attributes[1],
			        summary: attributes[2],
			        rating: rate,
			        name: attributes[4],
			        label: attributes[5],
			        author: attributes[6],
			        description: attributes[7],
			        type: attributes[8],
			        downloads: attributes[9],
			        useCount: attributes[10],
			        sampleUrl: attributes[11],
			        dateModified: attributes[12],
			        numComments: attributes[13],
			        commentsUrl: attributes[14],
			        tags: attributes[15],
			        APIs: attributes[16],
			        updated: yr[0]
		 });


		// console.log(newTuple);

		// Commenting as the datbase is already populated
		// newTuple.save(function(err){
		// 	if (err) throw err;

		// });

	}
});


// start listening for requests.
io.sockets.on('connection', function(socket){
	
	socket.on('searchTerms', function(data, callback){
		console.log(data);
		if (data['searchType'] == 'API Search') {

			var api_tuples = mongoose.model('ApiModel', apiSchema);
			var termsArray = data['keyWords'].split(',');
			var combinedString = '';
			var defaultYear = 0;
			var defaultKeyWords = '.';
			var defaultProtocols = 'REST';
			var defaultCategory = '.';
			var defaultRating = 0;

			console.log(data['searchType']);
			for (var i = 0; i < termsArray.length; i++) {
			console.log(termsArray[i]);

			if ((i+1) >= termsArray.length) {
				combinedString = combinedString + termsArray[i];
				} else {
				combinedString = combinedString + termsArray[i] + "|";
				}
			}

			// Applying Default Values in case anything is missing.
			if (combinedString.length == 0) {
				combinedString = defaultKeyWords;
			}
			console.log("combinedString=>" + combinedString)

			if (data['Rating'] == "") {
				data['Rating'] = defaultRating;
			} else {
				data['Rating'] = data['Rating'] + "";
			}

			if (data['Protocols']== "") {
				data['Protocols'] = defaultProtocols;
			}

			if (data['Category']== "") {
				data['Category'] = defaultCategory;
			}

			if (data['year'] == "") {
				data['year'] = defaultYear;
			}

			console.log("Rating " + data['Rating'] + "Category " + data['Category'] + "updated " + data['year'] + "protocols " + data['Protocols'] + "cmb " + combinedString);
			//api_tuples.find({Tags: {$in:termsArray}}, function(err,data){
			api_tuples.find({rating:{$gte:data['Rating']},category: new RegExp(data['Category'], 'i'), protocols: new RegExp(data['Protocols'], 'i'),updated: {$eq:data['year']},$or:[{Tags: new RegExp(combinedString, 'i')}, {title: new RegExp(combinedString, 'i')}, {description: new RegExp(combinedString, 'i')}, {summary: new RegExp(combinedString, 'i')}]},function(err,findData){
				if (err) {

				}
				names =[];
				updatedYear = [];
				protocols = [];
				category = [];
				rating = [];

				// ready the tuples
				for (var i =0; i < findData.length; i++) {
					names[i] = findData[i].name;
					updatedYear[i] = findData[i].updated;
					protocols[i] = findData[i].protocols;
					category[i] = findData[i].category;
					rating[i] = findData[i].rating;
				}
				console.log("API RESULTS");
				console.log("name->" + names[0]);
				console.log("updatedYear->" + updatedYear[0]);
				console.log("protocols->"  +protocols[0]);
				console.log("category->" + category[0]);
				console.log("rating->" + rating[0]);
				io.sockets.emit('APIresults', {n: names, u:updatedYear, p: protocols, c: category, r: rating });
			});

		} else {
			var mashup_tuples = mongoose.model('MashupModel', mashupSchema);
			var termsArray = data['keyWords'].split(',');
			var apisArray = data['UsedAPIs'].split(',');
			var combinedString = '';
			var apicombString ='';
			var defaultYear = 0;
			var defaultKeyWords = '.';

			console.log(data['searchType']);
			for (var i = 0; i < termsArray.length; i++) {

				if ((i+1) >= termsArray.length) {
					combinedString = combinedString + termsArray[i];
				} else {
					combinedString = combinedString + termsArray[i] + "|";
				}
			}

			for (var i = 0; i < apisArray.length; i++) {

				if ((i+1) >= apisArray.length) {
					apicombString = apicombString + apisArray[i];
				} else {
					apicombString = apicombString + apisArray[i] + "|";
				}
			}
			// Applying Default Values in case anything is missing.
			if (apicombString.length == 0) {
				apicombString = '.';
			}

			console.log("apiterms=>" + apicombString);
			// Applying Default Values in case anything is missing.
			if (combinedString.length == 0) {
				combinedString = defaultKeyWords;
			}
			console.log("combinedString=>" + combinedString);

			if (data['year'] == "") {
				data['year'] = defaultYear;
			}

			console.log("updated " + data['year'] + " cmb " + combinedString);

			mashup_tuples.find({$or:[{tags: new RegExp(combinedString, 'i')}, {summary: new RegExp(combinedString, 'i')}, {description: new RegExp(combinedString, 'i')},{title: new RegExp(combinedString, 'i')}], updated: {$gte:data['year']}, APIs: new RegExp(apicombString, 'i')},
			function(err,findData){
				if (err) {

				}
				names =[];
				updatedYear = [];
				usedAPIs = [];
				tags = [];
				// ready the tuples
				for (var i =0; i < findData.length; i++) {
					names[i] = findData[i].name;
					updatedYear[i] = findData[i].updated;
					usedAPIs[i] = findData[i].APIs;
					tags[i] = findData[i].tags;
				}

				io.sockets.emit('MashupResults', {n: names, u:updatedYear, a: usedAPIs, t: tags});

			});
		}
	});
	
});

