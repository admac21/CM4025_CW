angular.module('jobService', [])

.factory('Job', function($http){
	
	// create a new object
	var jobFactory = {};
	
	// get a single job
	jobFactory.get = function(id) {
		return $http.get('/api/jobs/' + id);
	};
	
	// get all jobs
	jobFactory.all = function() {
		return $http.get('/api/jobs/');
	};
	
	// create a job
	jobFactory.create = function(jobData) {
		return $http.post('/api/jobs/', jobData);
	};
	
	// update a job
	jobFactory.update = function(id, jobData) {
		return $http.put('/api/jobs/' + id, jobData);
	};
    
    // delete a job
    jobFactory.delete = function(id) {
        console.log('Deleting: ' + id);
        return $http.delete('/api/jobs/' + id);
    };
    
/*    // add a note to a job
    jobFactory.push = function(id, noteData) {
        return $http.put('/api/jobs/' + id, noteData);
    };*/
	
	// return our entire jobFactory object
	return jobFactory;
});