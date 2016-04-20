var myApp = angular.module('myApp', [ 'onsen.directives']);

myApp.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

myApp.factory('authService', function($http, $rootScope, AUTH_EVENTS){
	var authService = {
		state:AUTH_EVENTS.notAuthenticated,
		username : "",
		first_name : "",
		last_name : "",
		balance : 0
	};
	  	 
			/*
	//http://docs.phonegap.com/en/1.8.0rc1/guide_whitelist_index.md.html#Domain%20Whitelist%20Guide
	authService.login = function (credentials) {
		var $promise = $http.post('http://23.95.115.211/login.php', credentials);
		
		$promise.then(function (response) {
			console.log(">>>>> then authService ", response);
			
			if(response.data.failed) {
				console.log(">>>>> authService - login failed");
				authService.state = AUTH_EVENTS.loginFailed;
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
			};
			if(response.data.success) {
				console.log(">>>>> authService - login success");
				authService.state = AUTH_EVENTS.loginSuccess;
				authService.username = response.data.success.username;
				authService.first_name = response.data.success.first_name;
				authService.last_name = response.data.success.last_name;
				authService.balance = response.data.success.balance;
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, response.data.success);
			}
			
		});
		  
		return $promise;			
		  
    }; 

	authService.logout = function (credentials) {
		authService.state = AUTH_EVENTS.notAuthenticated;
		$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
	}; */
	
    return authService;
});

myApp.controller('AccountController', function($scope, $rootScope, authService, AUTH_EVENTS) {
	
	console.log(">>>>> AccountController");


	$scope.updateFields = function() {
		console.log(">>>>> AccountController - updateFields");
		$scope.username = authService.username;
		$scope.first_name = authService.first_name;
		$scope.last_name = authService.last_name;
		$scope.balance = authService.balance;
		$scope.connected = false;//authService.state == AUTH_EVENTS.loginSuccess;
	};
	
	$scope.updateFields();
	
	$scope.loginClick = function() {
		//console.log(">>>>> AccountController - login:", document.getElementById("password").value);
		console.log(">>>>> AccountController - login:", $scope);
		$scope.connected = true;
	};
	
	$scope.logoutClick = function() {
		//console.log(">>>>> AccountController - login:", document.getElementById("password").value);
		console.log(">>>>> AccountController - logout");
		$scope.connected = false;
	};

	$scope.exit = function() {
		//console.log(">>>>> AccountController - login:", document.getElementById("password").value);
		console.log(">>>>> AccountController - exit");
		
		navigator.app.exitApp();
		
	};
	
	$scope.$watch('username',function(newVlaue){
        console.log('Watching YOU !' + newVlaue);
    });
	
	/*
	$scope.$on(AUTH_EVENTS.loginSuccess, function (event, data) {
		$scope.updateFields();
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function (event, data) {
		$scope.updateFields();
	});
	
	$scope.$on(AUTH_EVENTS.loginFailed, function (event, data) {
		$scope.updateFields();
	});*/

	//$rootScope.userName = authService.isAuth
});

myApp.controller('MainCtrl', function($scope) {
    $scope.name = 'World';
});