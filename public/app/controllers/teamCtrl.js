// start our angular module and inject teamService
angular.module('teamCtrl', ['teamService'])

// team controller for the main page
// inject the Team factory
.controller('teamController', function (Team) {
	
	var vm = this;
	
	// set a processing variable to show loading things
	vm.processing = true;
	
    
    
	// grab all the teams at page load
	Team.all()
	.then(function(data) {
		
		// when all the teams come back, remove the processing variable
		vm.processing = false;
		
		// bind the teams that come back to vm.teams
		vm.teams = data.data;        
        console.log(vm.teams);
	});
    
	// function to delete a team
	vm.deleteTeam = function(single) {
		vm.processing = true;
        
        console.log(single);
		
		//accepts the team id as a parameter
		Team.delete(single._id)
		.then(function(data) {
            console.log(single._id);
			
			// get all teams to update the table
			// you can also set up your api
			// to return the list of teams with the delete call
			Team.all()
				.then(function(data) {
					vm.processing = false;
					vm.teams = data.data;
				});
		});
	};
})

// controller applied to team creation page
.controller('teamCreateController', function($scope, $location, $routeParams, User, Team, Auth) {
	
	var vm = this;
	
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';
	
	// function to create a team
	vm.saveTeam = function() {
                
		vm.processing = true;
		
		// clear the message
		vm.message = '';
		
        // get logged in user information and set it
        // as the created_by field
        Auth.getUser()
			.then(function(response) {
				vm.user = response.data;
                vm.teamData.created_by = vm.user.username;
                vm.teamData.members = vm.user;
                console.log(vm.user);
            
            
                // Add the creator as the first member
                // vm.teamData.members.push(vm.user._id);
			
        
            // use the create function in the teamService
            Team.create(vm.teamData)
                .then(function(data) {
                    vm.processing = false;

                    
                
                    // return to team list
                    $location.path('/teams');
                });
        });
	};
})

// controller applied to team view page
.controller('teamViewController', function($routeParams, $location, User, Team, Auth){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create, view or edit pages
    vm.type = 'view';
    
    // get the team data for the team you want to edit
    // $routeParams is the way we grab data from the URL
    Team.get($routeParams.team_id)
    .then(function(data){
         vm.teamData = data.data; 
         console.log(vm.teamData);

     })
    
    // Function to add a user to a team
    vm.joinTeam = function(){
        
        vm.processing = true;
        
        // Get username of logged in user
        Auth.getUser()
        .then(function(response){
            vm.user = response.data;
            vm.teamData.newest_member = vm.user.username;
            console.log(vm.teamData.newest_member);
            
            Team.update(vm.teamData._id, vm.teamData)
            .then(function(data){
                console.log(vm.teamData);
            });
    
        });   
        // Return to team selection screen
        $location.path('/teams');    
    };  
    
})

// controller applied to team edit page
.controller('teamUpdateController', function($location, $routeParams, Team){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'update';

    // get the team data for the team you want to edit
    // $routeParams is the way we grab data from the URL
    Team.get($routeParams.team_id)
        .then(function(data){
        vm.teamData = data.data;
    });
     
    // function to save the team
    vm.saveTeam = function(){
        vm.processing = true;
        vm.message = '';
        
        // call the teamService function to update
        Team.update($routeParams.team_id, vm.teamData)
            .then(function(data){
            vm.processing = false;
            
            // return to profile view
            $location.path('/teams/' + $routeParams.team_id.toString());
            
            // bind the message from our API to vm.message
            vm.message = data.message;
        });
    };
});