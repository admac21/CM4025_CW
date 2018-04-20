angular.module('umbra', [
	'ngAnimate',
    'ngMaterial',
    'ngMessages',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'userService',
    'custCtrl',
    'custService',
    'productCtrl',
    'productService',
    'jobCtrl',
    'jobService'
])



// application configuration to integrate token into requests
.config(function($httpProvider) {
	
	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
});

