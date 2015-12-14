module.exports = function(app){
  app.controller("MessagesController", ['$scope', "$http", function($scope, $http){
    $scope.messages = [];
    $scope.errors = [];
    $scope.defaults = {views: 0, destructMessage: "You only get to read this 3 times!" };
    $scope.newMessage = angular.copy($scope.defaults);
    $scope.messageView = undefined;
    saveMsg = {};



    $scope.getAll = function(){
      $http.get('/api/messages')
        .then(function(res){
          $scope.messages = res.data;
        }, function(err){
          console.log(err.data);
      });
    };

    $scope.get = function(title){


      $http.get('/api/messages/' + title)
        .then(function(res){
          $scope.messageView = res.data;
          $scope.getAll();
        }, function(err){
          console.log("get error was " + err);
        });
    };

    $scope.close = function(){
      title = false;
      $scope.messageView = undefined;
    };

    $scope.create = function(message){
      $http.post('/api/messages', message)
      .then(function(res){
        $scope.messages.push(res.data);
        $scope.newMessage = angular.copy($scope.defaults);
        console.log("Message created");
      }, function(err){
        console.log(err.data)
      });
    };

    $scope.update = function(message){
      message.editing = false;
      $http.put('/api/messages/' + message._id, message)
      .then(function(res){
        console.log(res.data.msg);
      }, function(err){
        $scope.errors.push("Could not edit "+ message.oneWordTitle);
        console.log(err.data);
      });
    };

    $scope.editMsg = function(message){
      saveMsg.oneWordTitle = message.oneWordTitle;
      saveMsg.secretToRead = message.secretToRead;
      saveMsg.priority = message.priority;

      message.editing = true;
    };

    $scope.cancelEdit = function(message){
      message.editing = false;
      message.oneWordTitle = saveMsg.oneWordTitle;
      message.secretToRead = saveMsg.secretToRead;
      message.priority = saveMsg.priority;

    };

    $scope.remove = function(message){
      $scope.messages.splice($scope.messages.indexOf(message), 1);
      $http.delete('/api/messages/' + message._id)
        .then(function(res){
          console.log("Message was deleted but not self destructed");
        }, function(err){
          console.log(err.data);
          $scope.errors.push('Could not delete message ' + message.oneWordTitle);
          $scope.getAll();
        });
    };
  }]);
};
