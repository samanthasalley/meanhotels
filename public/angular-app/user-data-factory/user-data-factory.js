angular.module('meanhotel').factory('userDataFactory', userDataFactory);

function userDataFactory($http){
    return {
        registerUser: registerUser,
        loginUser: loginUser,
        updatePassword: updatePassword
    };
    
    function registerUser(user){
        return $http.post('/api/users/register', user).then(complete).catch(failed);
    }
    
    function loginUser(user){
        return $http.post('/api/users/login', user).then(complete).catch(failed);
    }
    
    function updatePassword(user){
        return $http.post('/api/users/update', user).then(complete).catch(failed);
    }
    
    function complete(response){
        return response;
    }
    
    function failed(err){
        console.log(err.statusText);
    }
}