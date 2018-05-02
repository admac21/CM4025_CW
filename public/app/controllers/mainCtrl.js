angular.module('mainCtrl', [])

.controller('mainController', function($scope, $rootScope, $location, Auth, User) {
	
	var vm = this;
    
    $scope.location = $location.path();
    $rootScope.$on('$routeChangeSuccess', function(){
        $scope.location = $location.path();
    });
    
	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();
	
	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		
		// get user information on page load
		Auth.getUser()
			.then(function(response) {
				vm.user = response.data;
                $scope._id = vm.user._id;
                User.get(vm.user._id)
                .then(function(user){
                    vm.user = user.data;
                })
                console.log(vm.user);
			});
	});
	
	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;
		
		// clear the error
		vm.error = '';
		
		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(data) {
            console.log('Auth.login', data);
				vm.processing = false;
				
				// if a user successfully logs in, redirect to home page
				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;
			});
	};
    
	
	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = {};
		
		$location.path('/login');
	};
    
    // function to check if a user is part of a team
    vm.inTeam = Auth.isInTeam();
    
/*    vm.inTeam = function() {
        User.findOne({username : vm.user.username}, function(err, user){
            if(err) return res.send(err);
            if(user.team == ""){
               return 'false';
            } else {
               return 'true';
            }
        });
    };*/

	vm.createSample = function() {
		Auth.createSampleUser();
	};
	
});
