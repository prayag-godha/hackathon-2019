var myApp = angular.module('myApp', ['infinite-scroll','ui.bootstrap','ngRoute','ngSanitize', 'ui.select']);

myApp.controller('DemoController', function($scope, GHRepo) {
  $scope.ghRepo = new GHRepo();
});

myApp.controller("MainController",['$scope','$uibModal',function($scope,$uibModal){ 
 $scope.openModal = function(){
	 $scope.modalInstance = $uibModal.open({
	 ariaLabelledBy: 'modal-title',
	 ariaDescribedBy: 'modal-body',
	 templateUrl: 'modalWindow.html',
	 controller :'ModelHandlerController',
	 controllerAs: '$ctrl',
	 size: 'lg',
	 resolve: {
	 
	 }
	 });

 }
 
}]);
myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
myApp.controller("ModelHandlerController",function($scope,$uibModalInstance){
	$scope.itemArray = [
        {id: 1, name: 'Real Estate Buy/Sell/Rent'},
        {id: 2, name: 'Carpool'},
        {id: 3, name: 'Vehicles Buy/Sell/Rent'},
        {id: 4, name: 'Sports'},
        {id: 5, name: 'Gigs/Concerts'},
        {id: 6, name: 'Ask'},
        {id: 7, name: 'Misc'},
    ];
	$scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/fileUpload";
        alert(file.name + " Uploaded successfully")
        $scope.myFile = '';
        $scope.model.imageName=file.name
        //fileUpload.uploadFileToUrl(file, uploadUrl);
    };
    //
    $scope.model = {selectedCategory :[]};
    
 $scope.cancelModal = function(){
	 $uibModalInstance.dismiss('close');
 }
 $scope.ok = function(){
	 alert('Your Post has been uploaded');
	 $uibModalInstance.close('save');
 
 }
 
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