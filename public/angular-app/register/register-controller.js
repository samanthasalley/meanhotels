angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController(userDataFactory){
    var vm = this;
    vm.register = function(){
        var user = {
            username: vm.username,
            password: vm.password
        };
        
        if(!vm.username || !vm.password){
            vm.error = 'Please add a username and password.';
        }else{
            if(vm.password !== vm.passwordRepeat){
                vm.error = 'Please make sure the passwords match.';
            }else{
                userDataFactory.registerUser(user).then(function(response){
                    console.log(response.status);
                    if(response.status === 201){
                        vm.message = 'Successful registration, please login.';
                        vm.error = '';
                    }
                }).catch(function(err){
                    console.log(err);
                    vm.error = 'There was an error.';
                });
            }
        }
        
    };
}