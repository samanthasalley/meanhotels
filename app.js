require("./api/data/db.js");
require("./gulpfile.js");
var bodyParser = require("body-parser");
var express = require('express');
var routes = require("./api/routes");
var path = require("path");
var gulp = require("gulp");
var app = express();

gulp.start('config'); 


// Custom middleware to console.log data from each request
app.use(function(req, res, next){
    // console.log(req.method, req.url);
    next();
});

// Sets static folder to use when requesting. If route specified in dir, it renders that file
app.use(express.static(path.join(__dirname, 'public')));

// Sets node_modules as folder to use when route is '/node_modules'
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// BodyParser Middleware (enable parsing of posted forms)
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


// Use routes for anything with /
app.use('/api', routes);





app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server running...");
});