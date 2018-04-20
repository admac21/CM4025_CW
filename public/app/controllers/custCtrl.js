// start our angular module and inject custService
angular.module('custCtrl', ['custService'])

// customer controller for the main page
// inject the Customer factory
.controller('custController', function(Customer) {
    
    var vm = this;
    
    // set a processing variable to show loading things
    vm.processing = true;
    
    // grab all the customerss at page load
    Customer.all()
    .then(function(data){
        
        // when all the customers come back, remove the processing variable
        vm.processing = false;
        
        // bind the customers that come back to vm.customers
        vm.customers = data.data;
        console.log(vm.customers);
    });
    
    // function to delete a customer
    vm.deleteCustomer = function(id) {
        vm.processing = true;
        
        // accepts the custo mer id as a parameter
        Customer.delete(id)
        .then(function(data) {
            
            // get all the customers to update the table
            // you can also set up your api
            // to return the list of customers with the delete call
            Customer.all()
            .then(function(data) {
                vm.processing = false;
                vm.customers = data.data;
            });
        });
    };
})

// controller applied to customer creation page
.controller('custCreateController', function($location, Customer) {
    
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiate between create or edit pages
    vm.type = 'create';
    
    // function to create a customer
    vm.saveCustomer = function() {
        vm.processing = true;
        
        // clear the message
        vm.message = '';
        
        // use the create function in custService
        Customer.create(vm.customerData)
        .then(function(data) {
            vm.processing = false;
            
             // grab all the customerss at page load
            Customer.all()
            .then(function(data){
        
                // when all the customers come back, remove the processing variable
                vm.processing = false;
        
                // get the id of the most recent customer
                vm.last = data.data;
                vm.last = vm.last[vm.last.length -1];
                vm.last = vm.last._id;
                
                console.log(vm.last);
                
                // load user profile that was just created
                $location.path('/customers/' + vm.last);
            });
            
            
        });
    };
})

// controller applied to the customer view page
.controller('custViewController', function($routeParams, Customer) {
    
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiate between create or edit pages
    vm.type = 'view';
    
    // get the customer data for the customer that you want to edit
    // $routeParams is the way we grab data from the URL
    Customer.get($routeParams.customer_id)
    .then(function(data){
        vm.customerData = data.data;
    });
})



// controller applied to the customer edit page
.controller('custEditController', function($location, $routeParams, Customer) {
    
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiate between create or edit pages
    vm.type = 'edit';
    
    // get the customer data for the customer that you want to edit
    // $routeParams is the way we grab data from the URL
    Customer.get($routeParams.customer_id)
    .then(function(data){
        vm.customerData = data.data;
    });
    
    // function to save the customer
    vm.saveCustomer = function() {
        vm.processing = true;
        vm.message = '';
        
        //call the custService function to update
        Customer.update($routeParams.customer_id, vm.customerData)
        .then(function(data) {
            vm.processing = false;
            
            // return to profile view
            $location.path('/customers/' + $routeParams.customer_id.toString());
            
            // bind the message from our API to vm.message
            vm.message = data.message;
        });
    };
});