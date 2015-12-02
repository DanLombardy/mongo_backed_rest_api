"use strict";

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var mongoose = require('mongoose');
var Message = require(__dirname + '/../models/message');

process.env.MONGOLAB_URI = 'mongodb://localhost/message_test';
require(__dirname + '/../server');

describe('message routes post', function(){
  var tokenSave = "";

  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      done();
    });
  });

  before(function(done){
    var messageData = {"username": "Tester", "password":"foobar123"};
    chai.request('localhost:3000')
    .post('/api/signup')
    .send(messageData)
    .end(function(err, res){
      tokenSave = res.body.token;
     done();
   }.bind(this));
  });

  it('should post a message', function(done){
    var messageData = {"oneWordTitle": "testMsg", "secretToRead":"Run away!", "priority":5, "views":0, "destructMessage":"default message", "token": tokenSave};
    chai.request('localhost:3000')
    .post('/api/messages')
    .send(messageData)
    .end(function(err, res){
      expect(err).to.eql(null);
      expect(res.body).eql({msg: 'It posted successfully!'});
      done();
    });
  });
});




describe('message routes gets', function(){
  var tokenSave = "";

  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      done();
    });
  });

  before(function(done){
    var messageData = {"username": "Tester", "password":"foobar123"};
    chai.request('localhost:3000')
    .post('/api/signup')
    .send(messageData)
    .end(function(err, res){
      tokenSave = res.body.token;
     done();
   }.bind(this));
  });

    before(function(done){
      (new Message({"oneWordTitle": "testMsg", "secretToRead":"Run away!", "priority":5, "views":0, "destructMessage":"default message"}))
      .save(function(err, data){
       expect(err).to.eql(null);
       this.message = data;
       done();
    }.bind(this));
  });

    it('should get a single message', function(done){
      chai.request('localhost:3000')
      .get('/api/messages/' + 'testMsg')
      .send({"token": tokenSave})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res.body.oneWordTitle).to.equal('testMsg');
        done();
      });
    });

    it('should get all the messages', function(done){
      chai.request('localhost:3000')
      .get('/api/messages')
      .send({"token": tokenSave})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res.body).to.eql([ "testMsg" ]);
        done();
      });
    });

  });


  describe('message deletes after 3 gets', function(){
    var tokenSave = "";

    after(function(done){
      mongoose.connection.db.dropDatabase(function(){
        done();
      });
    });

    before(function(done){
      var messageData = {"username": "Tester", "password":"foobar123"};
      chai.request('localhost:3000')
      .post('/api/signup')
      .send(messageData)
      .end(function(err, res){
        tokenSave = res.body.token;
       done();
     }.bind(this));
    });

      before(function(done){
        (new Message({"oneWordTitle": "testMsg", "secretToRead":"Run away!", "priority":5, "views":0, "destructMessage":"default message"}))
        .save(function(err, data){
         expect(err).to.eql(null);
         this.message = data;
         done();
      }.bind(this));
    });

    before(function(done){
      chai.request('localhost:3000')
      .get('/api/messages/' + 'testMsg')
      .send({"token": tokenSave})
      .end(function(err, res){
        done();
      }.bind(this));
    });

    before(function(done){
      chai.request('localhost:3000')
      .get('/api/messages/' + 'testMsg')
      .send({"token": tokenSave})
      .end(function(err, res){
        done();
      }.bind(this));
    });

      it('get initial message', function(done){
        chai.request('localhost:3000')
        .get('/api/messages/' + 'testMsg')
        .send({"token": tokenSave})
        .end(function(err, res){
          expect(err).to.eql(null);
          expect(res.body.destructMessage).to.equal("BOOM! Your message self-destructed!");
          done();
        });
      });



    });
