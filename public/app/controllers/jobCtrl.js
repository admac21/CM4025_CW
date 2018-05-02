// start our angular module and inject jobService
angular.module('jobCtrl', ['jobService'])

// job controller for the main page
// inject the Job factory
.controller('jobController', function (Job, $scope, Auth, User, $location) {
	
	var vm = this;
	
	// set a processing variable to show loading things
	vm.processing = true;
	
    // Get the user data
    Auth.getUser()
    .then(function(response){
        vm.user = response.data;
        
        User.get(vm.user._id)
        .then(function(data){
            vm.user = data.data;
            //console.log(vm.user);

            // Array of first names to generate customers
            vm.firstNames = [
                {V: "Otto"},
                {V: "James"},
                {V: "Fiona"},
                {V: "Fraser"},
                {V: "Jill"},
                {V: "Daisy"},
                {V: "Margaret"},
                {V: "Rob"},

                {V: "Finlay"},
                {V: "Sarah"},
                {V: "John"},
                {V: "Crisana"},
                {V: "Stuart"},
                {V: "Molly"},
                {V: "Niall"},
                {V: "Amelia"},

                {V: "Trevor"},
                {V: "Karen"},
                {V: "Gordon"},
                {V: "Lucy"},
                {V: "Philip"},
                {V: "Leela"},
                {V: "Hubert"},
                {V: "Amy"}
            ];

            // Array of last names to generate customers
            vm.lastNames = [
                {V: "Osterman"},
                {V: "Maclean"},
                {V: "Gray"},
                {V: "Henderson"},
                {V: "Buchan"},
                {V: "Keir"},
                {V: "Wales"},
                {V: "Hawkins"}
            ];

            vm.products = [
                {V: "HP"},
                {V: "Acer"},
                {V: "Sony"},
                {V: "Dell"},
                {V: "Compaq"},
                {V: "Toshiba"},
                {V: "Samsung"},
                {V: "Lenovo"}
            ];

            vm.devices = [
                {V: "Laptop"},
                {V: "Desktop"},
                {V: "Netbook"},
                {V: "Smartphone"},
                {V: "Tablet"},
                {V: "Ultrabook"},
                {V: "Chromebook"},
                {V: "All in One"}
            ];

            vm.faults = [
                {V: "Broken Screen (Hardware)"},
                {V: "Liquid spillage (Hardware)"},
                {V: "No Wifi (General)"},
                {V: "No power (General)"},
                {V: "Virus removal (Software)"},
                {V: "Crashing (Software)"},
                {V: "Data Backup (Data)"},
                {V: "Data Recovery (Data)"}
            ];

            vm.random = function(){
                return Math.floor((Math.random()*8));
            };

            // Consistant random numbers to link certain attributes together.
            var ran1 = vm.random();
            var ran2 = vm.random();
            var ran3 = vm.random();
            
            // Manual override of players level for testing purposes.
            // Levels tested up to 100
            // vm.user.level = 100;

            vm.customers = [
                {
                    id:0,
                    avatar: '../assets/img/faces/face-'+[vm.random()]+'.jpg',
                    firstName: vm.firstNames[vm.random()].V, 
                    lastName: vm.lastNames[vm.random()].V,
                    product: vm.products[vm.random()].V,
                    device: vm.devices[vm.random()].V,
                    fault: vm.faults[ran1].V,
                    faultImg: '../assets/img/fault-'+ran1+'.jpg',
                    level: vm.user.level+1,
                    reward: (vm.user.level+1)*((vm.random()+5)/2),
                    number: ran1,
                    repair: 100,
                    time: 14 - (vm.user.level/20) - (ran1/4) + 7
                },
                {
                    id:1,
                    avatar: '../assets/img/faces/face-'+[vm.random()+8]+'.jpg',
                    firstName: vm.firstNames[vm.random()+8].V,
                    lastName: vm.lastNames[vm.random()].V,
                    product: vm.products[vm.random()].V,
                    device: vm.devices[vm.random()].V,
                    fault: vm.faults[ran2].V,
                    faultImg: '../assets/img/fault-'+ran2+'.jpg',
                    level: vm.user.level+2,
                    reward: (vm.user.level+2)*((vm.random()+7)/2),
                    number: ran2,
                    repair: 100,
                    time: 10 - (vm.user.level/10) - (ran2/4) + 7
                },
                {   
                    id:2,
                    avatar: '../assets/img/faces/face-'+[vm.random()]+'.jpg',
                    firstName: vm.firstNames[vm.random()+16].V,
                    lastName: vm.lastNames[vm.random()].V,
                    product: vm.products[vm.random()].V,
                    device: vm.devices[vm.random()].V,
                    fault: vm.faults[ran3].V,
                    faultImg: '../assets/img/fault-'+ran3+'.jpg',
                    level: vm.user.level+3,
                    reward: (vm.user.level+3)*((vm.random()+10)/2),
                    number: ran3,
                    repair: 100,
                    time: 7 - (vm.user.level/10) - (ran3/4) + 7
                }
            ];
            
            vm.processing = false;
            
            vm.chooseJob = function(id){
                console.log(id);
                vm.view = 'repair';
                Job.saveChosen(vm.customers[id]);
                $location.path('/jobs/repair');
            };
            
        })
    });
})

// controller applied to job view page
.controller('jobViewController', function($routeParams, Team, $location, User, $route, Job, Auth){
     
    var vm = this;
    
    // Random number generator for 'critical repairs'
    vm.random = function(){
        return Math.floor((Math.random()*10));
    };
    
    // Get the user data
    Auth.getUser()
    .then(function(response){
        vm.user = response.data;
        
        User.get(vm.user._id)
        .then(function(data){
            vm.user = data.data;
            console.log(vm.user);
    
            // retrieve customer data from chosen customer
            vm.customer = Job.getChosen();
            console.log(vm.customer);
            
            vm.modifiers = [1,1,1,1];
            
            // set modifiers for type of repair
            // Hardware
            if(vm.customer.number <2){
                // Check if they are HW tech
                if(vm.user.class === "Hardware Technician"){
                    vm.modifiers = [1,3.5,1,1];
                } else if(vm.user.class === "General Technician"){
                    vm.modifiers = [1.5,3,1.5,1.5];
                } else {
                    vm.modifiers = [0.5,2,0.5,0.5];
                }
            } 
            // Data
            else if (vm.customer.number >5){
                // Check if they are Data tech
                console.log(vm.user.class);
                if(vm.user.class === "Data Technician"){
                    vm.modifiers = [1,1,1,3.5];
                } else if(vm.user.class === "General Technician"){
                    vm.modifiers = [1.5,1.5,1.5,3];
                } else {
                    vm.modifiers = [0.5,0.5,0.5,2];
                }
            } 
            // Software 
            else if (vm.customer.number >3 && vm.customer.number <6 ){
                // Check if they are SW tech
                if(vm.user.class === "Software Technician"){
                    vm.modifiers = [3.5,1,1,1];
                }else if(vm.user.class === "General Technician"){
                    vm.modifiers = [3,1.5,1.5,1.5];
                } else {
                    vm.modifiers = [2,0.5,0.5,0.5];
                }
            } 
            // General
            else {
                // Check if they are General tech
                if(vm.user.class === "General Technician"){
                    vm.modifiers = [5,5,5,5];
                } else {
                    vm.modifiers = [1,1,1,1];
                }
            }
            
            // Function to round numbers to avoid multiple decimal places
            vm.round = function(number){
                var factor = Math.pow(10, 1);
                return Math.round(number * factor) / factor;
            }
            
            // Time for each action
            vm.actionTime = 1;
            if(vm.customer.level-vm.user.level > 0){
                vm.actionTime = vm.round((vm.customer.level-vm.user.level)-0.5);
            }
            if(vm.actionTime>vm.customer.time){
                vm.actionTime = Math.floor(vm.customer.time/2);
            }
            
            // Final stats
            vm.software = (vm.user.software*vm.modifiers[0]);
            vm.hardware = (vm.user.hardware*vm.modifiers[1]);
            vm.virus    = (vm.user.virus*vm.modifiers[2]);
            vm.data     = (vm.user.data*vm.modifiers[3]);
            
            // set progress
            vm.progress = 0;
            
            // set time
            vm.timeRemaining = vm.round(vm.customer.time);
            
            // Function for software action
            vm.useSW = function(){
                // Some random number events for variety
                vm.ran = vm.random();
                if(vm.ran == 0){
                    window.alert("A cat video popped up on the screen, causing you to lose an hour!");
                    vm.timeRemaining -= 1;
                } else if (vm.ran == 5){
                    window.alert("Turning the device off then on fixed an issue, you gain an extra 10% towards completion!");
                    vm.progress += 10;
                } else if (vm.ran == 8){
                    window.alert("The customer has been delayed at work! You've got an extra 4 hours to complete the job.");
                    vm.timeRemaining += 4;
                } 
                vm.timeRemaining -= vm.actionTime;
                vm.timeRemaining = vm.round(vm.timeRemaining);
                vm.progress += vm.software;
                if(vm.timeRemaining<=0){
                   window.alert("Oh dear, you didn't complete the job in time and now the customer is angry. Better luck next time!"); 
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
                else if(vm.progress >= 100){
                    window.alert("Congratulations! You have made £" + vm.customer.reward + " for your team, and gained a level.");
                    Team.get(vm.user.teamId)
                    .then(function(data){
                        vm.teamData = data.data;
                        vm.teamData.money += vm.customer.reward;
                        
                        // Adjust team level based on money
                        vm.teamData.level = Math.floor((vm.teamData.money/100));
                        
                        Team.update(vm.teamData._id, vm.teamData)
                        .then(function(data){
                            console.log(vm.teamData);
                        });
                    });
                    
                    // Increase players exp and level by 1
                    vm.user.exp += vm.customer.reward;
                    vm.user.level += 1;
                    User.update(vm.user._id, vm.user)
                    .then(function(data){
                        console.log(vm.user);
                        vm.message = data.message;
                    });
                    // Return to job selection screen
                    $location.path('/jobs/'); 
                }
            };
            
            // Function for hardware action
            vm.useHW = function(){
                // Some random number events
                vm.ran = vm.random();
                if(vm.ran == 0){
                    window.alert("You misplace your screwdriver, causing you to lose an hour!");
                    vm.timeRemaining -= 1;
                } else if (vm.ran == 5){
                    window.alert("Crossing some wires had an unexpected benefit, you're 10% closer to completion!");
                    vm.progress += 10;
                } else if (vm.ran == 8){
                    window.alert("The customer has been delayed at work! You've got an extra 4 hours to complete the job.");
                    vm.timeRemaining += 4;
                } 
                vm.timeRemaining -= vm.actionTime;
                vm.timeRemaining = vm.round(vm.timeRemaining);
                vm.progress += vm.hardware;
                if(vm.timeRemaining<=0){
                   window.alert("Oh dear, you didn't complete the job in time and now the customer is angry. Better luck next time!");
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
                else if(vm.progress >= 100){
                    window.alert("Congratulations! You have made £" + vm.customer.reward + " for your team, and gained a level.");
                    Team.get(vm.user.teamId)
                    .then(function(data){
                        vm.teamData = data.data;
                        vm.teamData.money += vm.customer.reward;
                        
                        // Adjust team level based on money
                        vm.teamData.level = Math.floor((vm.teamData.money/100));
                        
                        Team.update(vm.user.teamId, vm.teamData)
                        .then(function(data){
                            console.log(vm.teamData);
                        });
                    });
                    
                    // Increase players exp and level by 1
                    vm.user.exp += vm.customer.reward;
                    vm.user.level += 1;
                    User.update(vm.user._id, vm.user)
                    .then(function(data){
                        console.log(vm.user);
                        vm.message = data.message;
                    });
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
            };
            
            // Function for virus
            vm.useVirus = function(){
                // Some random number events for increased variety
                vm.ran = vm.random();
                if(vm.ran == 0){
                    window.alert("A customer comes back to complain about their repair, causing you to lose an hour!");
                    vm.timeRemaining -= 1;
                } else if (vm.ran == 5){
                    window.alert("A stroke of genius gets you an extra 10% closer to completion!");
                    vm.progress += 10;
                } else if (vm.ran == 8){
                    window.alert("The customer forgot about a doctors appointment they made. You've got an extra 4 hours to complete the job!");
                    vm.timeRemaining += 4;
                } 
                vm.timeRemaining -= vm.actionTime;
                vm.timeRemaining = vm.round(vm.timeRemaining);
                vm.progress += vm.virus;
                if(vm.timeRemaining<=0){
                   window.alert("Oh dear, you didn't complete the job in time and now the customer is angry. Better luck next time!");
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
                else if(vm.progress >= 100){
                    window.alert("Congratulations! You have made £" + vm.customer.reward + " for your team, and gained a level.");
                    Team.get(vm.user.teamId)
                    .then(function(data){
                        vm.teamData = data.data;
                        vm.teamData.money += vm.customer.reward;
                        
                        // Adjust team level based on money
                        vm.teamData.level = Math.floor((vm.teamData.money/100));
                        
                        Team.update(vm.user.teamId, vm.teamData)
                        .then(function(data){
                            console.log(vm.teamData);
                        });
                    });
                    
                    // Increase players exp and level by 1
                    vm.user.exp += vm.customer.reward;
                    vm.user.level += 1;
                    User.update(vm.user._id, vm.user)
                    .then(function(data){
                        console.log(vm.user);
                        vm.message = data.message;
                    });
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
            };
            
            // Function for Data action
            vm.useData = function(){
                // Random number events for added variety
                vm.ran = vm.random();
                if(vm.ran == 0){
                    window.alert("You forgot to take the customers password, causing you to lose an hour!");
                    vm.timeRemaining -= 1;
                } else if (vm.ran == 5){
                    window.alert("Turns out there isn't as much data as you thought, gain 10% towards completion!");
                    vm.progress += 10;
                } else if (vm.ran == 8){
                    window.alert("The customer is stuck in traffic! You've got an extra 4 hours to complete the job.");
                    vm.timeRemaining += 4;
                } 
                vm.timeRemaining -= vm.actionTime;
                vm.timeRemaining = vm.round(vm.timeRemaining);
                vm.progress += vm.data;
                if(vm.timeRemaining<=0){
                   window.alert("Oh dear, you didn't complete the job in time and now the customer is angry. Better luck next time!"); 
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
                else if(vm.progress >= 100){
                    window.alert("Congratulations! You have made £" + vm.customer.reward + " for your team, and gained a level.");
                    Team.get(vm.user.teamId)
                    .then(function(data){
                        vm.teamData = data.data;
                        vm.teamData.money += vm.customer.reward;
                        
                        // Adjust team level based on money
                        vm.teamData.level = Math.floor((vm.teamData.money/100));
                        
                        Team.update(vm.user.teamId, vm.teamData)
                        .then(function(data){
                            console.log(vm.teamData);
                        });
                    });
                    
                    // Increase players exp and level by 1
                    vm.user.exp += vm.customer.reward;
                    console.log(vm.user.exp);
                    vm.user.level += 1;
                    User.update(vm.user._id, vm.user)
                    .then(function(data){
                        console.log(vm.user);
                        vm.message = data.message;
                    });
                    // Return to job selection screen
                    $location.path('/jobs/');
                }
            };


        });
    });
});
