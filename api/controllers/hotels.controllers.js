var mongoose = require("mongoose");
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res){
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    
    if(isNaN(lng) || isNaN(lat)){
        res
            .status(400)
            .json({
                "message" : "If specified, lng and lat should be numbers"
            });
        return;
    }
    
    // geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    
    var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };
    
    Hotel
        .geoNear(point, geoOptions, function(err, results, stats){
            console.log('stats',  stats);
            var response = {
                status : 200,
                message : results
            };
            if(err){
                console.log('Error getting coordinates');
                response.status = 500;
                response.message = err;
            } else if(stats.objectsLoaded < 1){
                response.status = 404;
                response.message = {
                    "message" : "No results found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.hotelsGetAll = function(req, res){
    
    var offset = 0;
    var count = 6;
    var maxCount = 10;
    
    if(req.query && req.query.lat && req.query.lng){
        runGeoQuery(req,res);
        return;
    }
    
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
    }
    
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
    }
    
    if(isNaN(offset) || isNaN(count)){
        res
            .status(400)
            .json({
                "message" : "If supplied, count and offset should be numbers"
            });
        return;
    }
    
    if(count > maxCount){
        res
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " exceeded"
            });
        return;
    }
    
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){
            if(err){
                res
                    .status(500)
                    .json(err);
            } else {
                console.log('Found hotels: ', hotels.length);
                res
                    .json(hotels);
            }
        });
};

module.exports.hotelsGetOne = function(req, res){
    
    var hotelId = req.params.hotelId;
    console.log('GET hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : hotel
            };
            if(err){
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                response.status = 404;
                response.message = "Hotel ID not found";
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.hotelsAddOne = function(req, res){
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;
    
    if(req.body && req.body.name && req.body.stars){
        newHotel = req.body;
        newHotel.stars = parseInt(req.body.stars, 10);
        collection.insertOne(newHotel,function(err, resp){
            if(err){
                console.log(err);
                return;
            }
            console.log(resp.ops);
            res
                .status(201)
                .json( resp.ops );
        });
        
    } else {
        console.log('data missing from body');
        res
            .status(400)
            .json( {message: "required data missing from body"} );
    }
};