var express = require('express');
var User = require(__dirname + '/../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/errorHandler');
var basicHttp = require(__dirname + '/../lib/basic_http_authentication');

var authRouter = module.exports = express.Router();

authRouter.post('/signup', jsonParser, function(req, res){
  User.findOne({'username': req.body.username}, function(err, user){
    //database error, no user doesnt populate an error, error is communication err with db
    if(err){
      console.log("Database error");
      return res.status(500).json({msg:'Database error. Please try again'});
    }

    //if user in database, return a rejection
    if(user){
      console.log("User already exists, cannot create.");
      return res.status(401).json({msg: "User already exists, cannot create."});
    }

    var user = new User();
    user.auth.basic.username = req.body.username;
    user.username = req.body.username;
    user.hashPassword(req.body.password);

    user.save(function(err, data){
      if(err) return handleError(err);
      user.generateToken(function(err, token){
        if(err) return handleError(err, res);
        res.status(200).json({msg:"User created", token: token});
      });
    });
  });
});

authRouter.get('/signin', basicHttp, function(req, res){
  //fail point: auth object didnt come in, no user name or password sent
  if(!(req.auth.username || req.auth.password)){
    console.log("Username and password not provided");
    return res.status(401).json({msg:'Username and password not provided'});
  }

  //error checks: username database err, user not in database, password is wrong
  User.findOne({'auth.basic.username': req.auth.username}, function(err, user){
    //database error, no user doesnt populate an error, error is communication err with db
    if(err){
      console.log("Database error");
      return res.status(500).json({msg:'Database error. Please try again'});
    }

    //this one actually checks for user in database
    if(!user){
      console.log("No user in database");
      return res.status(401).json({msg: "User not in database. Try another user"});
    }

    //incorrect password
    if(!user.checkPassword(req.auth.password)){
      console.log("User entered an incorrect password");
      return res.status(401).json({msg: "Password was incorrect"});
    }

    user.generateToken(function(err, token){
      if(err) return handleError(err, res);
      res.status(200).json({msg:"signed in successfully", token:token});
    });

  });
});
