var express     = require("express"),
    router      = express.Router(),
    ctrlHotels  = require("../controllers/hotels.controllers.js"),
    ctrlReviews  = require("../controllers/reviews.controllers.js");
    
router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll);
    
router
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne);
    
router
    .route('/hotels/new')
    .post(ctrlHotels.hotelsAddOne);
    
router
    .route('/hotels/:hotelId/reviews')
    .get(ctrlReviews.reviewsGetAll);
    
router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctrlReviews.reviewsGetOne);
    
module.exports = router;