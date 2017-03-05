angular.module('meanhotel').controller('ProfileController', ProfileController);

function ProfileController($routeParams, $route, AuthFactory, jwtHelper, $window, userDataFactory, $timeout){
    var vm = this;
    
    var token = jwtHelper.decodeToken($window.sessionStorage.token);
    vm.username = token.username;
    
    vm.isLoggedIn = function(){
        if(AuthFactory.isLoggedIn){
            return true;
        }else{
            return false;
        }
    };
    
    vm.closeForm = function(){
        vm.currentPassword = '';
        vm.newPassword = '';
        vm.newPasswordRepeat = '';
        vm.showForm = false;
    };
    
    vm.changePassword = function(){
        var user = {
            username: vm.username,
            currentPassword: vm.currentPassword,
            newPassword:vm.newPassword
        };
        
        if(!vm.currentPassword){
            vm.error = 'Please enter your current password.';
        }else if(!vm.newPassword){
            vm.error = 'Please enter a new password.';
        }else if (vm.currentPassword === vm.newPassword){
            vm.error = 'New password cannot match current password.';
        }else{
            if(vm.newPassword !== vm.newPasswordRepeat){
                vm.error = 'Please make sure the new passwords match.';
            }else{
                
                userDataFactory.updatePassword(user).then(function(response){
                    if(response.status === 204){
                        vm.message = 'Password successfully updated!';
                        vm.error = '';
                        vm.closeForm();
                        
                        $timeout(function(){
                            vm.message = '';
                        },1000);
                    }
                }).catch(function(err){
                    console.log(err);
                    vm.error = 'There was an error updating your profile.';
                });
            }
        }
        
    };
}