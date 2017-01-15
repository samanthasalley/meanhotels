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
    console.log('Requested by: ' + req.user);
    
    var offset = 0;
    var count = 15;
    var maxCount = 15;
    
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

var _splitArray = function(input){
    var output;
    if(input && input.length > 0){
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res){
    var newHotel = {
        name : req.body.name,
        description : req.body.description,
        stars : parseInt(req.body.stars, 10),
        services : _splitArray(req.body.services),
        photos : _splitArray(req.body.photos),
        currency : req.body.currency,
        location : {
            address : req.body.address,
            coordinates : [
                parseFloat(req.body.lng), 
                parseFloat(req.body.lat)
            ]
        }
    };
    
    Hotel
        .create(newHotel, function(err, hotel){
            var response = {
                status : 201,
                message : {}
            };
            if(err){
                response.status = 500;
                response.message = err;
            } else {
                response.message = hotel;
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.hotelsUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;
    console.log('GET hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
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
            if(response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                hotel.name = req.body.name;
                hotel.description = req.body.description;
                hotel.stars = parseInt(req.body.stars, 10);
                hotel.services = _splitArray(req.body.services);
                hotel.photos = _splitArray(req.body.photos);
                hotel.currency = req.body.currency;
                hotel.location = {
                    address : req.body.address,
                    coordinates : [
                        parseFloat(req.body.lng), 
                        parseFloat(req.body.lat)
                    ]
                };
                
                hotel.save(function(err, hotelUpdate){
                    if(err){
                        res
                            .status(500)
                            .json(err);
                    }else{
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};

module.exports.hotelsDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;
    
    Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, deletedHotel){
            if(err){
                res
                    .status(404)
                    .json(err);
            }else{
                console.log('Hotel deleted, id: ', hotelId);
                res
                    .status(204)
                    .json();
            }
        });
};