var myApp = angular.module('myApp', ['infinite-scroll',  ,'ngRoute']);

myApp.controller('DemoController', function($scope, GHRepo) {
  $scope.ghRepo = new GHRepo();
});

// Reddit constructor function to encapsulate HTTP and pagination logic
myApp.factory('GHRepo', function($http) {
  var GHRepo = function() {
    this.repos = [];
    this.busy = false;
    this.page = 1
  };

  GHRepo.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "https://api.github.com/search/repositories?q=angular&page="+ this.page + "&per_page=50"
    $http.get(url).success(function(data) {
      var items = data.items;
      for (var i = 0; i < items.length; i++) {
        this.repos.push(items[i]);
      }
      this.page += 1
      this.busy = false;
    }.bind(this));
  };

  return GHRepo;
});