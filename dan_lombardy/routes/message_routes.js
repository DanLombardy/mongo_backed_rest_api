"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var Message = require(__dirname + '/../models/message');

var messagesRouter = module.exports = exports = express.Router();

messagesRouter.get('/messages', function(req, res){
  Message.find({}, function(err, data){
    if(err) return function(err, res){
      console.log("There was a connection error of " + err);
      res.status(500).json({errmsg: "There was a connection error"})
    };
    var titles =[];
    for(var i = 0; i < data.length; i++)
    {
      titles[i] = data[i]["oneWordTitle"];
    }
    console.log(titles);
    res.json(titles);
  });

});

messagesRouter.get('/messages/*', function(req, res){
  var path = req.path;
  var title = path.slice(10);
  Message.find({oneWordTitle: title}, function(err, data){
    if(err) return function(err, res){
      console.log("There was a connection error of " + err);
      res.status(500).json({errmsg: "There was a connection error"})
    };
    console.log(data);
    if(data == '[]'){
      console.log("Client tried to get an object that doesnt exist");
      res.status(404).json({errmsg: "That message does not exist"});
      res.json()
    }

    var alert = "a self destruct count for the client";


    if(data[0].views >= 3){
      console.log("Message with title" + data[0].oneWordTitle + " self destructed!");
      data[0].destructMessage = "BOOOOM! Your message self destructed because you reached 3 views!";

      Message.remove({oneWordTitle: title}, function(err){
        if(err) return function(err, res){
          console.log("There was a connection error of " + err);
          res.status(500).json({errmsg: "There was a connection error"})
        };
        console.log("Message was deleted from database.");

        res.json(data);

      });
    }

    var adder = data[0].views + 1;

    if(data[0].views === 2){

      data[0].views = adder;
      console.log("Message has one view left");
      alert = "If you GET this message again it will self destruct!";
      Message.update({oneWordTitle: title},{destructMessage: alert, views:adder}, function(err){
        if(err) return function(err, res){
          console.log("There was a connection error of " + err);
          res.status(500).json({errmsg: "There was a connection error"})
        };

          res.json(data);
          console.log("Saved messeage back to database");
      });
    }

    if(data[0].views === 1){

      data[0].views = adder;
      console.log("Message has two views left");
      alert = "You can GET this message 2 more times and then it self destructs!";
      Message.update({oneWordTitle: title},{destructMessage: alert, views:adder}, function(err){
        if(err) return function(err, res){
          console.log("There was a connection error of " + err);
          res.status(500).json({errmsg: "There was a connection error"})
        };

          res.json(data);
          console.log("Saved messeage back to database");
      });
    }




  });








});

messagesRouter.post('/messages', bodyParser.json(), function(req, res){
  var newMessage = new Message(req.body);
  console.log("made it this far");
  newMessage.save(function(err, data){
    if(err) return function(err, res){
      console.log("There was a connection error of " + err);
      res.status(500).json({errmsg: "There was a connection error"})
    };

    res.json({msg: "It posted successfully!"});
  });
});
