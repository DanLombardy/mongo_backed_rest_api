var eat = require('eat');
var User = require(__dirname + '/../models/user');

module.exports = exports = function(req, res, next){
   var token = req.headers.token || (req.body)? req.body.token: "";
   if(!token){
     console.log("no token");
     return res.status(401).json({msg: 'You have no token'});
   }
   eat.decode(token, process.env.APP_SECRET, function(err, decoded){
     if (err){
       console.log(err);
       return res.status(401).json({msg: 'You are not authorized'});
     }

     User.findOne({_id: decoded.id}, function(err, user){
       if (err){
         console.log(err);
         return res.status(500).json({msg: 'Database connection error'});
       }

      if(!user){
        console.log(err);
        return res.status(401).json({msg: 'User does not exist or password is incorrect'});
      }

      req.user = user;
      next();

     });
   });
};
