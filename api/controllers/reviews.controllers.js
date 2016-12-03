var mongoose = require("mongoose");
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res){
    var hotelId = req.params.hotelId;
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : []
            };
            if(err){
                console.log('error');
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                console.log('Hotel not found');
                response.status = 404;
                response.message = {
                    "message" : "Could not find hotel id: " + hotelId
                };
            } else if(hotel.reviews.length < 1){
                console.log('No reviews found');
                response.status = 404;
                response.message = {
                    "message" : "No reviews found"
                };
            } else {
                response.message = hotel.reviews;
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.reviewsGetOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : {}
            };
            if(err){
                console.log('error');
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                console.log('Hotel not found');
                response.status = 404;
                response.message = {
                    "message" : "Could not find hotel id: " + hotelId
                };
            } else {
                var review = hotel.reviews.id(reviewId);
                if(!review){
                    console.log('Review not found');
                    response.status = 404;
                    response.message = {
                        "message" : "Review " + reviewId + " not found for hotel " + hotelId
                    };
                } else {
                    response.message = review;
                }
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

var _addReview = function(req, res, hotel){
    hotel.reviews.push({
        name : req.body.name,
        rating : parseInt(req.body.rating, 10),
        review : req.body.review
    });
    
    hotel.save(function(err, updatedHotel){
        var response = {
            status : 201,
            message : {}
        };
        if(err){
            console.log('error');
            response.status = 500;
            response.message = err;
        } else {
            console.log("New Review Added!");
            response.message = updatedHotel.reviews[updatedHotel.reviews.length - 1];
        }
        res
            .status(response.status)
            .json(response.message);
        
    });
};

module.exports.reviewsAddOne = function(req, res){
    var hotelId = req.params.hotelId;
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : []
            };
            if(err){
                console.log('error');
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                console.log('Hotel not found');
                response.status = 404;
                response.message = {
                    "message" : "Could not find hotel id: " + hotelId
                };
            }
            if(hotel){
                _addReview(req,res,hotel);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
            }
        });
};

module.exports.reviewsUpdateOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : {}
            };
            if(err){
                console.log('error');
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                console.log('Hotel not found');
                response.status = 404;
                response.message = {
                    "message" : "Could not find hotel id: " + hotelId
                };
            } else {
                var review = hotel.reviews.id(reviewId);
                if(!review){
                    console.log('Review not found');
                    response.status = 404;
                    response.message = {
                        "message" : "Review " + reviewId + " not found for hotel " + hotelId
                    };
                } else {
                    response.message = review;
                }
            }
            if(response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            }else{
                review.name = req.body.name;
                review.rating = parseInt(req.body.rating, 10);
                review.review = req.body.review;
                
                hotel.save(function(err, reviewUpdate){
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

module.exports.reviewsDeleteOne = function(req, res){
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            var response = {
                status : 200,
                message : {}
            };
            if(err){
                console.log('error');
                response.status = 500;
                response.message = err;
            } else if(!hotel){
                console.log('Hotel not found');
                response.status = 404;
                response.message = {
                    "message" : "Could not find hotel id: " + hotelId
                };
            } else {
                var review = hotel.reviews.id(reviewId);
                if(!review){
                    console.log('Review not found');
                    response.status = 404;
                    response.message = {
                        "message" : "Review " + reviewId + " not found for hotel " + hotelId
                    };
                } else {
                    response.message = review;
                }
            }
            if(response.status !== 200){
                res
                    .status(response.status)
                    .json(response.message);
            }else{
                hotel.reviews.id(reviewId).remove();
                hotel.save(function(err, removedReview){
                    if(err){
                        res
                            .status(500)
                            .json(err);
                    }else{
                        console.log('Deleted review, id: ', reviewId);
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};