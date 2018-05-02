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
    .when('/users/register', {
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
    
    // TEAMS --------------------------------------------------------- //
    // route for the all users page
    .when('/teams', {
        templateUrl : 'app/views/pages/teams/all.html',
        controller	: 'teamController',
        controllerAs: 'team'
    })
    
    // form to create a new team, same view as edit page
    .when('/teams/create', {
        templateUrl : 'app/views/pages/teams/single.html',
        controller  : 'teamCreateController',
        controllerAs: 'team'
    })
    
    // form to create a new team, same view as edit page
    .when('/teams/:team_id', {
        templateUrl : 'app/views/pages/teams/single.html',
        controller  : 'teamViewController',
        controllerAs: 'team'
    })
    
    // JOBS ---------------------------------------------------------- //
		
        // route for the all jobs page
    .when('/jobs', {
        templateUrl : 'app/views/pages/jobs/all.html',
        controller	: 'jobController',
        controllerAs: 'job'
    })

    // form to create a new job, same view as edit page
    .when('/jobs/repair', {
        templateUrl : 'app/views/pages/jobs/single.html',
        controller 	: 'jobViewController',
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