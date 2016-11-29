var mongoose = require("mongoose");
var Hotel = mongoose.model('Hotel');

module.exports.hotelsGetAll = function(req, res){
    
    var offset = 0;
    var count = 6;
    
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
    }
    
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
    }
    
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){
            if(err){
                console.log(err);
                return;
            }
            console.log('Found hotels: ', hotels.length);
            res
                .json(hotels);
        });
};

module.exports.hotelsGetOne = function(req, res){
    
    var hotelId = req.params.hotelId;
    console.log('GET hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .exec(function(err, doc){
            if(err){
                console.log('error');
                return;
            }
            res
                .status(200)
                .json( doc );
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