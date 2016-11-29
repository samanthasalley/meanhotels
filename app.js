require("./api/data/db.js");
var express = require('express');
var app = express();
var path = require("path");
var routes = require("./api/routes");
var bodyParser = require("body-parser");

// Custom middleware to console.log data from each request
app.use(function(req, res, next){
    console.log(req.method, req.url);
    next();
});

// Sets static folder to use when requesting. If route specified in dir, it renders that file
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended : false }));


// Use routes for anything with /
app.use('/api', routes);





app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server running...");
});