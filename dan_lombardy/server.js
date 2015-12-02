var mongoose = require('mongoose');
var app = require('express')();
var messagesRouter = require(__dirname + '/routes/message_routes');
var authRouter = require(__dirname + '/routes/auth_routes');
var fs = require('fs');

process.env.APP_SECRET = process.env.APP_SECRET || "changemeforproduction"

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/self_destruct');

app.get('/:filename', function(req, res, next){
  fs.stat(__dirname + '/build/' + req.params.filename, function(err, stats){
      if(err){
        console.log("We have a stats err of: " + err);
        return res.status(404).send('404: File not found');
      }

      if(!stats.isFile())  return res.status(404).send('404: File not found');

      var file = fs.createReadStream(__dirname + '/build/' + req.params.filename);
      file.pipe(res);
  });
});

app.use('/api', messagesRouter);
app.use('/api', authRouter);

app.listen(process.env.PORT || 3000, function(){
  console.log("Server up. All systems go.")
});
