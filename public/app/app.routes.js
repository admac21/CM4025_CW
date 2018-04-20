// inject ngRoute for all our routing needs
angular.module('app.routes', ['ngRoute'])

// configure our routes
.config(function($routeProvider, $locationProvider) {
	
$routeProvider

    // route for the home page
    .when('/', {
        templateUrl : 'app/views/pages/home.html'
    })

    // route for the login page
    .when('/login', {
        templateUrl : 'app/views/pages/login.html',
        controller	: 'mainController',
        controllerAs: 'login'
    })

    // USERS --------------------------------------------------------- //
    // route for the all users page
    .when('/users', {
        templateUrl : 'app/views/pages/users/all.html',
        controller	: 'userController',
        controllerAs: 'user'
    })

    // form to create a new user, same view as edit page
    .when('/users/create', {
        templateUrl : 'app/views/pages/users/single.html',
        controller 	: 'userCreateController',
        controllerAs: 'user'
    })
    
    // page to view a user
    .when('/users/:user_id', {
        templateUrl : 'app/views/pages/users/single.html',
        controller  : 'userViewController',
        controllerAs: 'user'
    })
    
    // page to edit a user
    .when('/users/:user_id/edit', {
        templateUrl : 'app/views/pages/users/single.html',
        controller  : 'userEditController',
        controllerAs: 'user'
    })

    // CUSTOMERS ----------------------------------------------------- //
    // form for the all customers page
    .when('/customers', {
        templateUrl : 'app/views/pages/customers/all.html',
        controller  : 'custController',
        controllerAs: 'customer'
    })

    // form to create a new customer, same view as edit page
    .when('/customers/create', {
        templateUrl : 'app/views/pages/customers/single.html',
        controller  : 'custCreateController',
        controllerAs: 'customer'
    })
    
    // form to view a customer
    .when('/customers/:customer_id', {
        templateUrl : 'app/views/pages/customers/single.html',
        controller  : 'custViewController',
        controllerAs: 'customer'
    })
    
    // form to edit a customer
    .when('/customers/:customer_id/edit', {
        templateUrl : 'app/views/pages/customers/single.html',
        controller  : 'custEditController',
        controllerAs: 'customer'
    })
    
    // PRODUCTS ------------------------------------------------------ //

    
    // form to create a new product, same view as edit page
    .when('/products/create/:customer_id', {
        templateUrl : 'app/views/pages/products/single.html',
        controller  : 'productCreateController',
        controllerAs: 'product'
    })
    
    // form to view a product
    .when('/products/:product_id', {
        templateUrl : 'app/views/pages/products/single.html',
        controller  : 'productViewController',
        controllerAs: 'product'
    })
    
    // form to edit a product
    .when('/products/:product_id/edit', {
        templateUrl : 'app/views/pages/products/single.html',
        controller  : 'productEditController',
        controllerAs: 'product'
    })
    
    // JOBS ---------------------------------------------------------- //
		
        // route for the all jobs page
    .when('/jobs', {
        templateUrl : 'app/views/pages/jobs/all.html',
        controller	: 'jobController',
        controllerAs: 'job'
    })

    // form to create a new job, same view as edit page
    .when('/jobs/create/:device_id', {
        templateUrl : 'app/views/pages/jobs/single.html',
        controller 	: 'jobCreateController',
        controllerAs: 'job'
    })
    
    // page to view a job
    .when('/jobs/:job_id', {
        templateUrl : 'app/views/pages/jobs/single.html',
        controller  : 'jobViewController',
        controllerAs: 'job'
    })
    
    // page to edit a job
    .when('/jobs/:job_id/edit', {
        templateUrl : 'app/views/pages/jobs/single.html',
        controller  : 'jobUpdateController',
        controllerAs: 'job'
    });
    
	// set our app up to have pretty URLS
	$locationProvider.html5Mode(true);
});