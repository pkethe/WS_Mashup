var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');



// connect to mongoDB
mongoose.connect('mongodb://localhost/PA3', function(err){
	if(err){
		console.log(err);
	} else{
		console.log('Connected to mongodb!');
	}
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
	updated: Date
});

// Mongoose model
var mashupModel = mongoose.model('MashupModel', mashupSchema);


var mashup_tuples = mongoose.model('MashupModel', mashupSchema);

mashupNames = [];
usedAPIS = [];
uniqueAPIS = [];
unique2APIS = [];



mashup_tuples.find({updated:{$gte:new Date("2005-09-01T00:00:00.000Z"), $lte: new Date("2011-12-31T00:00:00.000Z")}}, function(err,findData){
	if (err) {

	}

	// ready the tuples
	for (var i = 0; i < findData.length; i++) {
		console.log(findData[i].name);
		mashupNames.push(findData[i].name);
		var temp = findData[i].APIs.split("###");
		for (var j =0; j < temp.length; j++) {
			var temp2 = temp[j].split("$$$");
			temp[j] = temp2[0];
		}
		var temp3 = '';
		for (var j = 0; j < temp.length; j++) {
			if (temp[j] in uniqueAPIS) {
				// ignore
			} else {
				uniqueAPIS.push(temp[j]);
			}
			temp3 = temp3 + temp[j];
			temp3 = temp3 + "?@"
		}
		usedAPIS.push(temp3);
		//console.log(temp3);

	}

	for (var i=0; i < uniqueAPIS.length; i++) {
		var matches = 0;
		for (var j =0; j < unique2APIS.length; j++) {
			if (uniqueAPIS[i] == unique2APIS[j]) {
				matches = 1;
				break;
			}
		}
		if (matches !=1) {
			unique2APIS.push(uniqueAPIS[i]);
		}
	}
	console.log(findData.length);
	console.log(unique2APIS);
	console.log("unique " + unique2APIS.length);

	mashupBooleans = new Array(mashupNames.length);
	for(var i =0; i < mashupNames.length; i++) {
		mashupBooleans[i] = new Array(unique2APIS.length);
	}

	for (var i =0; i< mashupNames.length; i++) {
		for (var j =0; j< unique2APIS.length; j++) {
			mashupBooleans[i][j] = 0;
			// console.log("i->" +i + "j->" + j + " " +mashupBooleans[i][j]);
		}
	}

	for (var i = 0; i < mashupNames.length;i++) {
		for (var j =0; j < unique2APIS.length; j++) {
			var temp = usedAPIS[i].split("?@")
			for (var k = 0; k < temp.length; k++) {
				if (unique2APIS[j] == temp[k]) {
					mashupBooleans[i][j] = 1;
				}
			}
			// console.log("i->" +i + "j->" + j + " " +mashupBooleans[i][j]);
		}
	}

	var filebuf = '';
	for (var i =0; i < unique2APIS.length; i++) {
		 filebuf = filebuf + unique2APIS[i];
		 if((i + 1) >= unique2APIS.length) {
		 	break;
		 } else {
		 	filebuf = filebuf + ",";
		 }
	}

	var stream = fs.createWriteStream(path.join(__dirname, '/data/data4.csv')); 

	stream.once('open', function(fd) {
		filebuf = "," + filebuf;
		stream.write(filebuf + "\n");
		

		for (var i = 0; i < mashupNames.length;i++) {
			var temp = '';
			for (var j =0; j < unique2APIS.length; j++) {
				temp = temp + mashupBooleans[i][j];
				if((j + 1) >= unique2APIS.length) {
			 		break;
			 	} else {
			 		temp = temp + ",";
			 	}
			 	// console.log("i->" +i + "j->" + j + " " +mashupBooleans[i][j]);
			}
			temp = mashupNames[i] + ',' + temp;
			stream.write(temp + "\n");
		}
		stream.end();
	});

});


