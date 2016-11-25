var express     = require("express"),
    router      = express.Router(),
    ctrlHotels  = require("../controllers/hotels.controllers.js");
    
router
    .route('/hotels')
    .get(ctrlHotels.hotelsGetAll);
    
router
    .route('/hotels/:hotelId')
    .get(ctrlHotels.hotelsGetOne);
    
router
    .route('/hotels/new')
    .post(ctrlHotels.hotelsAddOne);
    
module.exports = router;