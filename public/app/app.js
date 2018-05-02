angular.module('RCS', [
	'ngAnimate',
    'ngMaterial',
    'ngMessages',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'userService',
    'jobCtrl',
    'jobService',
    'teamCtrl',
    'teamService'
])



// application configuration to integrate token into requests
.config(function($httpProvider) {
	
	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
});

