angular.module('meanhotel').filter('trustedSrcFilter', trustedSrcFilter);

function trustedSrcFilter($sce){
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}