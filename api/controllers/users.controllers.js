var mongoose = require("mongoose");
var User = mongoose.model('User');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jsonwebtoken");

module.exports.register = function(req, res) {
    console.log('registering user');
    var newUser = {};
        newUser.username = req.body.username;
        newUser.name = req.body.name || null;
        newUser.password = req.body.password;
        
    User.create({
        username: newUser.username,
        name: newUser.name,
        password: bcrypt.hashSync(newUser.password, bcrypt.genSaltSync(10))
    }, function(err, user){
        if(err){
            console.log(err);
            res.status(400).json(err);
        }else{
            console.log('user created', user);
            res.status(201).json(user);
        }
    });
};

module.exports.login = function(req, res) {
    console.log('logging in user');
    var curUser = {};
        curUser.username = req.body.username;
        curUser.password = req.body.password;
        
    User.findOne({
        username: curUser.username
    }).exec(function(err, user){
        if(err){
            console.log(err);
            res.status(400).json(err);
        }else{
            if(bcrypt.compareSync(curUser.password, user.password)){
                console.log('user found!', user);
                var token = jwt.sign({ username: user.username }, 's3cr3t', { expiresIn: 3600 });
                res.status(200).json({ success: true, token: token });
            }else{
                res.status(401).json('Unauthorized');
            }
        }
    });
};

// Middleware to check for and validate jwt token
module.exports.authenticate = function(req, res, next){
    var headerExists = req.headers.authorization;
    if(headerExists) {
        var token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 's3cr3t', function(err, decoded){
            if(err){
                console.log(err);
                res.status(401).json('Unauthorized');
            }else{
                req.user = decoded.username;
                next();
            }
        });
    }else{
        res.status(403).json('No token provided');
    }
};