angular.module('teamService', [])

.factory('Team', function($http){
	
	// create a new object
	var teamFactory = {};
	
	// get a single team
	teamFactory.get = function(id) {
		return $http.get('/api/teams/' + id);
	};
	
	// get all teams
	teamFactory.all = function() {
		return $http.get('/api/teams/');
	};
	
	// create a team
	teamFactory.create = function(teamData) {
		return $http.post('/api/teams/', teamData);
	};
	
	// update a team
	teamFactory.update = function(id, teamData) {
		return $http.put('/api/teams/' + id, teamData);
	};
    
    // delete a team
    teamFactory.delete = function(id) {
        return $http.delete('/api/teams/' + id);
    };
	
	// return our entire teamFactory object
	return teamFactory;
});