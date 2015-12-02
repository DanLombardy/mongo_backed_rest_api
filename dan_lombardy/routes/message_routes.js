"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var Message = require(__dirname + '/../models/message');
var updateDBSendClient = require(__dirname + '/../lib/updateDoc.js');
var errorHandler = require(__dirname + '/../lib/errorHandler');
var eatAuth = require(__dirname + '/../lib/eat_auth.js');

var messagesRouter = module.exports = exports = express.Router();
messagesRouter.use(bodyParser.json());

messagesRouter.get('/messages', eatAuth, function(req, res){
  Message.find({}, function(err, data){
  if (err) return errorHandler(err, res);
    var titles =[];
    for(var i = 0; i < data.length; i++)
    {
      titles[i] = data[i]["oneWordTitle"];
    }
    console.log(titles);
    res.json(titles);
  });

});

messagesRouter.get('/messages/*', eatAuth, function(req, res){
  var path = req.path;
  var title = path.slice(10);
    var alert = "a self destruct count for the client";

  Message.find({oneWordTitle: title}, function(err, data){
    if (err) return errorHandler(err, res);

    var adder = 0;

    if(data.length === 0){
      console.log("Client tried to get an object that doesnt exist");
      return res.status(404).json({errmsg: "That message does not exist"});
    }


    if(data[0].views >= 2){
      console.log("Message with title " + data[0].oneWordTitle + " self destructed!");
      data[0].destructMessage = "BOOM! Your message self-destructed!";
      data[0].views = data[0].views +1;

      Message.remove({oneWordTitle: title}, function(err){
        errorHandler(err, res);

        console.log("Message was deleted from database.");
        data.destructMessage = "BOOM! Your message self-destructed!";
        res.json({"destructMessage": "BOOM! Your message self-destructed!"} );
      });
    }

    if(data[0].views === 1){
      alert = "You can GET this message 1 more time and it self destructs!";
      console.log("Message has two views left");
      adder = 2;

      updateDBSendClient({oneWordTitle: title},{$set:{destructMessage: alert, views:adder}}, res);
    }

    if(data[0].views === 0){
      alert = "You can GET this message 2 more times and it self destructs!";
      console.log("Message has three views left");
      adder = 1;

      updateDBSendClient({oneWordTitle: title},{$set:{destructMessage: alert, views:adder}}, res);
    }
  });
});

messagesRouter.post('/messages', eatAuth, function(req, res){
  var newMessage = new Message(req.body);
  console.log("made it this far");
  newMessage.save(function(err, data){
    errorHandler(err, res);

    res.json({msg: "It posted successfully!"});
  });
});
