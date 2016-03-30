var app = angular.module('synergy', ['ngResource','ui.bootstrap', 'ui.router', 'ui.navbar']);

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

app.controller('MainCtrl', function($scope) {
    $scope.name = 'World';
});