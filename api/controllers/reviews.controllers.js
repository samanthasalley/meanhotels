var mongoose = require("mongoose");
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res){
    var hotelId = req.params.hotelId;
    console.log('GET hotelId', hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            if(err){
                console.log('error');
                return;
            }
            res
                .status(200)
                .json( hotel.reviews );
        });
};

module.exports.reviewsGetOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('GET reviewID ' + reviewId + 'for hotelId ', hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            if(err){
                console.log('error');
                return;
            }
            var review = hotel.reviews.id(reviewId);
            res
                .status(200)
                .json( review );
        });
};

// module.exports.hotelsAddOne = function(req, res){
//     var db = dbconn.get();
//     var collection = db.collection('hotels');
//     var newHotel;
    
//     if(req.body && req.body.name && req.body.stars){
//         newHotel = req.body;
//         newHotel.stars = parseInt(req.body.stars, 10);
//         collection.insertOne(newHotel,function(err, resp){
//             if(err){
//                 console.log(err);
//                 return;
//             }
//             console.log(resp.ops);
//             res
//                 .status(201)
//                 .json( resp.ops );
//         });
        
//     } else {
//         console.log('data missing from body');
//         res
//             .status(400)
//             .json( {message: "required data missing from body"} );
//     }
// };