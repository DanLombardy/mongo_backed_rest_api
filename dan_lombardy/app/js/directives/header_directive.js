module.exports = function(app){
  app.directive('headerDirective', function(){
    return {
      restrict:'AC',
      replace: true,
      template: '<header class="header-flex"><h1 class="in-header">Self Destruct Messenger</h1><div class="in-header logo"></div></header>',
      scope: {}
    }
  });
};
