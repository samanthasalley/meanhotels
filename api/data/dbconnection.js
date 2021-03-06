var MongoClient = require("mongodb").MongoClient;
var ip = process.env.IP;
var dburl = 'mongodb://'+ip+':27017/meanhotel';

var _connection = null;

var open = function(){
    MongoClient.connect(dburl, function(err, db){
        if(err){
            console.log('DB connection failed');
            return;
        }
        _connection = db;
        console.log('DB connection open', db);
    });
};

var get = function(){
    return _connection;
};

module.exports = {
    open : open,
    get : get
};