var app = angular.module('synergy', ['ngResource','ui.bootstrap', 'ui.router', 'ui.navbar'], function($httpProvider)
{ //https://habrahabr.ru/post/181009/
  // Используем x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  // Переопределяем дефолтный transformRequest в $http-сервисе
  $httpProvider.defaults.transformRequest = [function(data)
  {
    /**
     * рабочая лошадка; преобразует объект в x-www-form-urlencoded строку.
     * @param {Object} obj
     * @return {String}
     */ 
    var param = function(obj)
    {
      var query = '';
      var name, value, fullSubName, subValue, innerObj, i;
      
      for(name in obj)
      {
        value = obj[name];
        
        if(value instanceof Array)
        {
          for(i=0; i<value.length; ++i)
          {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object)
        {
          for(subName in value)
          {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
        {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
      }
      
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});

app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})

app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/login");

    // Now set up the states
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "login.html"
        })
        .state('account', {
            url: "/account",
            templateUrl: "account.html"
        })
});

app.controller('LoginController', function($scope, $rootScope, $state, authService, AUTH_EVENTS) {
	$scope.visible = !(authService.state==AUTH_EVENTS.loginSuccess);
	console.log(">>>>> LoginController", authService.state);
	$scope.userName = authService.username;
	$scope.loginError = false;
	$scope.$state = $state;
	
	$scope.login = function(credentials) {
		console.log(">>>>> onLoginClick");
		$scope.loginError = false;
		authService.login(credentials);
	};
	
	$scope.logout = function() {
		console.log(">>>>> onLogout");
		$scope.visible = true;
		authService.logout();
	};	
	
	$scope.$on(AUTH_EVENTS.loginSuccess, function (event, data) {
		console.log("rcv loginSuccess", data); // 'Data to send'
		$scope.visible = false;
		$state.go("account");
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function (event, data) {
		console.log("rcv notAuthenticated", data); // 'Data to send'
		$scope.visible = true;
	});
	
	$scope.$on(AUTH_EVENTS.loginFailed, function (event, data) {
	  console.log("rcv loginFailed", data); // 'Data to send'
	  $scope.loginError = true;
	});

	//$rootScope.userName = authService.isAuth
});

app.controller('AccountController', function($scope, $rootScope, $state, authService, AUTH_EVENTS) {
	
	console.log(">>>>> AccountController");

	$scope.updateFields = function() {
		$scope.username = authService.username;
		$scope.first_name = authService.first_name;
		$scope.last_name = authService.last_name;
		$scope.balance = authService.balance;
		$scope.state = authService.state == AUTH_EVENTS.loginSuccess;
	};
	
	$scope.updateFields();
	
	$scope.$on(AUTH_EVENTS.loginSuccess, function (event, data) {
		$scope.updateFields();
	});

	$scope.$on(AUTH_EVENTS.notAuthenticated, function (event, data) {
		$scope.updateFields();
	});
	
	$scope.$on(AUTH_EVENTS.loginFailed, function (event, data) {
		$scope.updateFields();
	});

	//$rootScope.userName = authService.isAuth
});

app.factory('authService', function($http, $rootScope, AUTH_EVENTS){
	var authService = {
		state:AUTH_EVENTS.notAuthenticated,
		username : "",
		first_name : "",
		last_name : "",
		balance : 0
	};
	  	  
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
	};
	
    return authService;
});

app.controller('MainCtrl', function($scope) {
    $scope.name = 'World';
});