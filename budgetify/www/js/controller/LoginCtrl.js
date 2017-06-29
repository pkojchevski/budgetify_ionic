angular.module("myApp.controllers").
 controller('LoginCtrl', ['$rootScope','$scope','superlogin','$state','$http','$ionicModal','$log', '$localStorage', 
 	function($rootScope, $scope, superlogin, $state, $http, $ionicModal, $log, $localStorage) {

$scope.user = {};
$scope.credentials= {};
$scope.encryptionKey = {};


 $scope.login = function(credentials) {
 	superlogin.login(credentials).then(function(response) {
 	  $localStorage.encryptionKey = CryptoJS.MD5(credentials.password).toString();
      $state.go('list');
 	}, function(error){
 		if(error) {
 		  $scope.loginError = error.message;	
 		} else {
          $scope.loginError = 'Could not connect to the server.';
 		}
 	});
 }

 $scope.register = function(user) {
 	superlogin.register(user).then(function(response) {
 		if(superlogin.authenticated()) {
 			$scope.modalRegister.hide();
 		   $state.go('list');	
 		   $scope.user = {};
 		}
 	}, function(error){
 		if(error) {
         $scope.signUpError = error.message;
 		} else {
 		 $scope.loginError =  'Could not connect to the server.';
 		}
 	});

 }

 $ionicModal.fromTemplateUrl('templates/register.html', {
 	scope:$scope,
 	animation:'slide-in-up'
 }).then(function(modalRegister) {
 	$scope.modalRegister = modalRegister;
 });

 $scope.open = function() {
 	$scope.modalRegister.show();
 }

 $scope.close = function() {
   $scope.modalRegister.hide();
 }




}]);