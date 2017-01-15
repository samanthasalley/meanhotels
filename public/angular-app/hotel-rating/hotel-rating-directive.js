// angular.module('meanhotel').directive('hotelRating', hotelRating);

// function hotelRating(){
//     return {
//         restrict: 'E',
//         template: '<span ng-repeat="star in vm.stars track by $index"><i class="fa fa-star" aria-hidden="true"></i></span>',
//         bindToController: true,
//         controller: 'HotelController',
//         controllerAs: 'vm',
//         scope: {
//             stars: '@'
//         }
//     };
// }

angular.module('meanhotel').component('hotelRating', {
    bindings: {
        stars: '='
    },
    template: '<span ng-repeat="star in vm.stars track by $index"><i class="fa fa-star" aria-hidden="true"></i></span>',
    controller: 'HotelController',
    controllerAs: 'vm'
});