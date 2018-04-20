// start our angular module and inject jobService
angular.module('jobCtrl', ['jobService'])

// job controller for the main page
// inject the Job factory
.controller('jobController', function (Job, Product) {
	
	var vm = this;
	
	// set a processing variable to show loading things
	vm.processing = true;
	
    
    
	// grab all the jobs at page load
	Job.all()
	.then(function(data) {
		
		// when all the jobs come back, remove the processing variable
		vm.processing = false;
		
		// bind the jobs that come back to vm.jobs
		vm.jobs = data.data;        
        console.log(vm.jobs);
	});
    
    // method to calculate age of job
    vm.getAge = function(created){
      vm.currentDate = new Date();
        created = new Date(created);

        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = vm.currentDate.getTime() - created.getTime();
        var days = millisBetween / millisecondsPerDay;

        return Math.floor(days);
    };
    
    // grab all the products at page load
    Product.all()
	.then(function(data) {
		
		// when all the jobs come back, remove the processing variable
		vm.processing = false;
		
		// bind the jobs that come back to vm.jobs
		vm.products = data.data;        
        console.log(vm.products);
        
        // return the device that matches the product_id
        vm.getDevice = function(id){
            //console.log(id);
            vm.device = vm.products.find(device => device._id === id);
            //console.log(vm.device);
            return vm.device;
        };
	});
    
	// function to delete a job
	vm.deleteJob = function(single) {
		vm.processing = true;
        
        console.log(single);
		
		//accepts the job id as a parameter
		Job.delete(single._id)
		.then(function(data) {
            console.log(single._id);
			
			// get all jobs to update the table
			// you can also set up your api
			// to return the list of jobs with the delete call
			Job.all()
				.then(function(data) {
					vm.processing = false;
					vm.jobs = data.data;
				});
		});
	};
})

// controller applied to job creation page
.controller('jobCreateController', function($scope, $location, $routeParams, Job, Auth, Product, Customer) {
	
	var vm = this;
	
	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';
    
    $scope.product_id = $routeParams.device_id;
    
    // get the product and customer data for the job    
        Product.get($routeParams.device_id)
        .then(function(response){
            vm.deviceData = response.data;
            console.log(vm.deviceData);

            // get the customer data for the job
            Customer.get(vm.deviceData.cust_id)
            .then(function(response){
                vm.customerData = response.data;
                console.log(vm.customerData);
            })
        });
	
	// function to create a job
	vm.saveJob = function() {
                
		vm.processing = true;
        
        vm.jobData.product_id = $routeParams.device_id.toString();
		
		// clear the message
		vm.message = '';
		
        // get logged in user information and set it
        // as the created_by field
        Auth.getUser()
			.then(function(response) {
				vm.user = response.data;
                vm.jobData.created_by = vm.user.username;
                console.log(vm.jobData);
			
        
            // use the create function in the jobService
            Job.create(vm.jobData)
                .then(function(data) {
                    vm.processing = false;

                    // return to job list
                    $location.path('/jobs');
                });
        });
	};
})

// controller applied to job view page
.controller('jobViewController', function($routeParams, $route, Job, Product, Customer, Auth){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create, view or edit pages
    vm.type = 'view';

    vm.saveNote = function(username, id) {
        vm.processing = true;
        Job.push(username)
        .then(function(data, id){
            vm.processing = false;
        });
    };
    
    // get the job data for the job you want to edit
    // $routeParams is the way we grab data from the URL
    Job.get($routeParams.job_id)
    .then(function(data){
         vm.jobData = data.data;
         //console.log(vm.jobData);
         
         // get the product data for the job    
         Product.get(vm.jobData.product_id)
         .then(function(response){
             vm.deviceData = response.data;
             // console.log(vm.deviceData);
             
             // get the customer data for the job
             Customer.get(vm.deviceData.cust_id)
             .then(function(response){
                 vm.customerData = response.data;
                 // console.log(vm.customerData);
             })
         });
     });
    
    vm.saveNote = function(){
        vm.processing = true;
        
        Auth.getUser()
			.then(function(response) {
				vm.user = response.data;
                vm.jobData.left_by = vm.user.username;
                console.log(vm.jobData);
        
        Job.update($routeParams.job_id, vm.jobData)
            .then(function(data){
            vm.processing = false;
            
            
        });
        
        });
        
        $route.reload();
    };
    
})

// controller applied to job edit page
.controller('jobUpdateController', function($location, $routeParams, Job){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'update';

    // get the job data for the job you want to edit
    // $routeParams is the way we grab data from the URL
    Job.get($routeParams.job_id)
        .then(function(data){
        vm.jobData = data.data;
    });
     
    // function to save the job
    vm.saveJob = function(){
        vm.processing = true;
        vm.message = '';
        
        // call the jobService function to update
        Job.update($routeParams.job_id, vm.jobData)
            .then(function(data){
            vm.processing = false;
            
            // return to profile view
            $location.path('/jobs/' + $routeParams.job_id.toString());
            
            // bind the message from our API to vm.message
            vm.message = data.message;
        });
    };
});