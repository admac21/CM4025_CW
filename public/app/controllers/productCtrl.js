// start our angualr module and inject productService
angular.module('productCtrl', ['productService'])

// product controller for the main page
// inject the productFactory
.controller('productController', function(Product){
    
    var vm = this;
    
    // set a processing variable to show loading things
	vm.processing = true;
	
	// grab all the products at page load
	Product.all()
	.then(function(data) {
		
		// when all the productss come back, remove the processing variable
		vm.processing = false;
		
		// bind the product that come back to vm.products
		vm.products = data.data;
        console.log(vm.products);
	});
    
    // fucntion to delete a product
	vm.deleteProduct = function(id) {
		vm.processing = true;
        
		//accepts the product id as a parameter
		Product.delete(id)
		.then(function(data) {
			
			// get all products to update the table
			// you can also set up your api
			// to return the list of products with the delete call
			Product.all()
				.then(function(data) {
					vm.processing = false;
					vm.products = data.data;
				});
		});
	};
})

// controller applied to product creation page
.controller('productCreateController', function($scope, $location, $routeParams, Product){
    
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiate between create or edit
    vm.type = 'create';
    
    $scope.cust_id = $routeParams.customer_id;
    
    // function to create a product
    vm.saveProduct = function(){
        vm.processing = true;
        vm.productData.cust_id = $routeParams.customer_id.toString();
        
        // clear the message
        vm.message = '';
        
        // use the create function in the productService
        Product.create(vm.productData)
        .then(function(data){
            vm.processing = false;
            
            // return to profile view
            $location.path('/customers/' + $routeParams.customer_id.toString());   
        });
    };
})

// controller applied to product view page
.controller('productViewController', function($routeParams, Product){
     
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create, view or edit pages
    vm.type = 'view';

    // get the product data for the product you want to edit
    // $routeParams is the way we grab data from the URL
    Product.get($routeParams.product_id)
        .then(function(data){
        vm.productData = data.data;
        vm.productData.dop = new Date(vm.productData.dop);
    });
})

//controller applied to product edit page
.controller('productEditController', function($location, $routeParams, Product){
    
    var vm = this;
    
    // variable to hide/show elements of the view
    // differentiates between create or edit pages
    vm.type = 'edit';
    
    // get the product data for the product you want to edit
    // $routeParams is the way we grab data from the URL
    Product.get($routeParams.product_id)
    .then(function(data){
        vm.productData = data.data;
        vm.productData.dop = new Date(vm.productData.dop);
    });
    
    // function to save the product
    vm.saveProduct = function(){
        vm.processing = true;
        vm.message = '';
        
        // call the productService function to update
        Product.update($routeParams.product_id, vm.productData)
        .then(function(data){
            vm.processing = false;
            
            // return to profile view
            $location.path('/products/' + $routeParams.product_id.toString());
            
            // bind the message from our API to vm.message
            vm.message = data.message;
        });
        
    };
});