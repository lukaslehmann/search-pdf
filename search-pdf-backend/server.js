//needed modules
var express = require("express");
var app = express()
  , server = require('http').createServer(app);
var pool = require('./libs/pool.js');
var util = require('util');
//var _und = require('underscore');

//configure the express settings
app.configure(function () {
  app.use(app.router);
});

//set the ajax request URL
if(process.env.VCAP_APPLICATION){
  //app is running in the cloud
  var application = JSON.parse(process.env.VCAP_APPLICATION);
  var uris = application['uris'][0];
  var url = "http://" + uris;
}
else{
  //for local testing
  var url = "http://localhost:3000";
}

//start server, on CF use binded port
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("Listening on " + url + port);
  console.log(pool.getPoolSize() + " running hdb clients");
});

//get main - index
app.get('/', function(req, res) {
  res.send('welcome to backend');
});

//return JSON for requests on app/search?name=
app.get('/search', function(req, res){
  var name = req.query.name;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  //make more than one file searchable
  var searchOptions = name.split(" ");
  var response_body;
    var i = 0;
    (function loop() {
        if (i < searchOptions.length) {
            req_statement.exec([searchOptions[i]], function (err, rows) {
                if (err) {
                    return console.error('Error:', err);
                }
                else {
                    if (response_body == undefined) {
                        response_body = rows;
                    }
                    else {
                        rows.forEach(function (row) {
                                console.log(row);
                                var found = false;
                                response_body.forEach(function (body_row) {
                                    if (body_row.FILENAME === row.FILENAME) {
                                        body_row.COUNT_FILENAME = +row.COUNT_FILENAME;
                                        found = true;
                                    }
                                });
                                if (found === false) {
                                    response_body.push(row);
                                }
                            }
                        );
                    }
                    i++;
                    loop();
                }

            });
        } else {
            response_body.sort(function(a, b){
                // Compare the 2 dates
                if(a.COUNT_FILENAME > b.COUNT_FILENAME) return -1;
                if(a.COUNT_FILENAME < b.COUNT_FILENAME) return 1;
                return 0;
            });
            //return results as response
            res.send(response_body);
        }
    }());
});


//return JSON for requests on app/search?name=
app.get('/sample', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.send("[ { \"COUNT(FILENAME)\": 27, \"FILENAME\": \"CRM_spa2013.pdf\" } ]");  
});

//return JSON for requests on app/file?name=
app.get('/file', function(req, res){
  var name = req.query.name;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //execute the prepared statement
  req_statement_file.exec([name], function (err, rows) {
    if (err) {
      return console.error('Error:', err);
    }
    else {
      //return results as response
      console.log(req_statement_file);
      console.log(rows);
      res.send(rows);  
    } 
  });
});

