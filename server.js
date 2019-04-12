// server.js
// Process and send the data to client on request
// =============================================================================

// call the packages we need
var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var path = require('path');
var http = require('https');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');
var cron = require('node-cron');


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


var port = process.env.PORT || 8080;        // set our port

// Routes for our api
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.get('/', function(req, res) {
	console.log('request is -->'+ req.body.country);
    res.sendfile('./public/index.html');
  });


app.get('/getCurrency', function(request, response) {
  console.log('request on getCurrency -->'+request.url);
    response.send(dataArray[0]);
 });


//http request to send the converted data 
app.get('/convert', function(request, response) {
  console.log('request on rsvp -->'+request.url);

  var from =request.query.from;
  var to = request.query.to;
  var currency= request.query.currency;
  var value= (dataArray[0][to]*currency)/dataArray[0][from];
  response.send(''+value);
  
});

//Sends the Array of entire currency values to reproduce a graph
app.get('/getGraph', function(request, response) {
  console.log('request on getGraph -->'+request.url);
  response.send(dataArray);
});


app.use('/', router);

// Start the Server
//=================================//
app.listen(port);
console.log('Magic happens on port ' + port);
initialize();

var map={};
var dataArray=[];
var data = ''; 


// function to fetch data fro the URL. Will be called at the end of each day
function initialize(){
http.get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml', function(res) {
  
     if (res.statusCode >= 200 && res.statusCode < 400) {
       res.on('data', function(data_) { data += data_.toString(); });
       res.on('end', function() {
         //console.log(data);
         data = data.substring(data.indexOf('<Cube>'),data.lastIndexOf('</Cube')+7);
         //console.log(data);
         parser.parseString(data, function (err, result) {

          for (var k = 0; k < result.Cube.Cube.length; k++) {
            var temp ={};
             for (var i = 0; i < result.Cube.Cube[k].Cube.length; i++) {
              temp['time']=result.Cube.Cube[k].$.time;
              temp[result.Cube.Cube[k].Cube[i].$.currency]=result.Cube.Cube[k].Cube[i].$.rate;
            }
             dataArray.push(temp);
          }

        });
       });
     }
   });

}


/*
 * for scheduling job that fetches xml every day. 
 */
cron.schedule('0 0 19 * * *' , function(){
  dataArray=[];
  initialize();
  console.log('running a scheduler every day to fecth data');
}, null, true, 'Europe/Budapest');
