// start our angular module and inject userService
angular.module('userCtrl', ['userService'])

// user controller for the main page
// inject the User factory
.controller('userController', function (User) {
	
	var vm = this;
	
	// set a processing variable to show loading things
	vm.processing = true;
	
	// grab all the users at page load
	User.all()
	.then(function(data) {
		
		// when all the users come back, remove the processing variable
		vm.processing = false;
		
		// bind the users that come back to vm.users
		vm.users = data.data;
        console.log(vm.users);
	});
	
	// function to delete a user
	vm.deleteUser = function(person) {
		vm.processing = true;
        
        console.log(person);
		
		//accepts the user id as a parameter
		User.delete(person._id)
		.then(function(data) {
			
			// get all users to update the table
			// you can also set up your api
			// to return the list of users with the delete call
			User.all()
				.then(function(data) {
					vm.processing = false;
					vm.users = data.data;
				});
		});
	};
})

// controller applied to user creation page
.controller('userCreateController', function($location, User) {
	
	var vm = this;
	
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';
	
	// function to create a user
	vm.saveUser = function() {
		vm.processing = true;
		
		// clear the message
		vm.message = '';
		
		// use the create function in the userService
		User.create(vm.userData)
			.then(function(data) {
				vm.processing = false;
				
				// return to user list
				$location.path('/users');
			});
	};
})

// controller applied to user view page
.controller('userViewController', function($routeParams, User){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create, view or edit pages
    vm.type = 'view';

    // get the user data for the user you want to edit
    // $routeParams is the way we grab data from the URL
    User.get($routeParams.user_id)
        .then(function(data){
        vm.userData = data.data;
    });
})

// controller applied to user edit page
.controller('userEditController', function($location, $routeParams, User){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';

    // get the user data for the user you want to edit
    // $routeParams is the way we grab data from the URL
    User.get($routeParams.user_id)
        .then(function(data){
        vm.userData = data.data;
    });
     
    // function to save the user
    vm.saveUser = function(){
        vm.processing = true;
        vm.message = '';
        
        // call the userService function to update
        User.update($routeParams.user_id, vm.userData)
            .then(function(data){
            vm.processing = false;
            
            // return to profile view
            $location.path('/users/' + $routeParams.user_id.toString());
            
            // bind the message from our API to vm.message
            vm.message = data.message;
        });
    };
});