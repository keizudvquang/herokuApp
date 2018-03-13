const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var pg = require('pg');
pg.defaults.ssl = true;
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
// var connection = pg.connect(process.env.DATABASE_URL, function(err, client) {
// 		if (err) throw err;
// 		connection = client;
// 	});
console.log('app start');
app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

app.post('/api/login', function (req, res) {
	console.log(req.body.username);
	request({
	  uri: "https://login.salesforce.com/services/oauth2/token",
	  method: "POST",
	  form: {
	    grant_type: "password",
	    client_id: "3MVG9ZL0ppGP5UrBkp4gcpR4zFArWdyWq_uSvtxHqB2Kh3XW9.DtvHL6_BBORBjn3MSRNvfQtldgmQL3VWb7D",
	    client_secret: "4597579409077764254",
	    username: req.body.username,
	    password: req.body.password
	  }
	}, 
	function(error, response, body) {
		var dt = JSON.parse(body);
		if(dt["access_token"] !== undefined){
		  	connection.query("SELECT id, name, canaccesscontact__c, canaccessorder__c FROM salesforce.User WHERE username ='" + req.body.username + "' ;", function(err, result) {
			 	if (err){
					res.send('false'); 
				}else{ 
					res.send(result.rows); 
				}
			});
		}else{
			res.send('false');
		}
	});
});

app.get('/api/getTest/:id', function (request, response) {
	console.log(request.params.id);
});
