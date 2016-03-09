module.exports = function(app){
  app.directive('buttonDirective', function(){
    return{
      restrict: 'EA',
      replace: true,
      template: '<button data-ng-click="close()">Close</button>',
      scope: {
        closer: '='
      }
    }
  });
};
