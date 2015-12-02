"use strict";

var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var mongoose = require('mongoose');
var Message = require(__dirname + '/../models/message');

process.env.MONGOLAB_URI = 'mongodb://localhost/auth_test';
require(__dirname + '/../server');

describe('signup for users', function(){

  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      done();
    });
  });

  it('should post a user', function(done){
    var messageData = {"username": "Tester", "password":"foobar123"};
    chai.request('localhost:3000')
    .post('/api/signup')
    .send(messageData)
    .end(function(err, res){
      expect(err).to.eql(null);
      expect(res.body.msg).eql("User created");
      expect(res.body.token).to.be.a('string');
      done();
    });
  });
});


describe('signin', function(){

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
     done();
   }.bind(this));
  });

  it('users get signed in', function(done){
    chai.request('localhost:3000')
    .get('/api/signin')
    .auth("Tester", "foobar123")
    .end(function(err, res){
      expect(res.body.token).to.be.a('string');
      expect(res.body.msg).eql("signed in successfully");

     done();
    });
  });
});

describe("unique signin", function(){
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
     done();
   }.bind(this));
  });


  it('respond that a user already exists with this name', function(done){
    var messageData = {"username": "Tester", "password":"foobar123"};
    chai.request('localhost:3000')
    .post('/api/signup')
    .send(messageData)
    .end(function(err, res){
      expect(err).to.eql(null);
      expect(res.body.msg).eql("User already exists, cannot create.");
      done();
    });
  });
});
