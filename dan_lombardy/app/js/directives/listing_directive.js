module.exports = function(app){
  app.directive('listingDirective', function(){
    return {
      restrict: 'AC',
      templateUrl: '/templates/listing_directive_template.html',
      transclude: true,
      scope: {
        resource: '=',
        title: '@'
      }
    }
  });
};
