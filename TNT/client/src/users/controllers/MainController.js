
(function( define ) {
    "use strict";

    /**
     * Register the MainController class with RequireJS
     */
    define( [ 'utils/supplant', 'utils/constants', 'utils/app' ], function ( supplant, constants, app )
    {
       

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
    	var MainController = function($scope, $q, $location, $rootScope, $log )
            {
    		
    		
    			//window.location.href = "#/salesAdminDashboard";
    			
    		
    			
    			$scope.logout = function(){
    				$rootScope.logout = true;
    				$location.path('/swUser');
    			};

    			$rootScope.countriesListData = [];
    			$rootScope.statesListData = [];
    			$rootScope.usStatesListData = [];
    			
    			//countries List
    		   var country1 = {countryId : 1, countryName : 'India'};
    		   var country2 = {countryId : 2, countryName : 'US'};
    		    
    		    $rootScope.countriesListData.push(country1);
    		    $rootScope.countriesListData.push(country2);
    			
    		    //States List
    		    var	state1 = {stateId : 1, stateName : 'Andhra Pradesh'};
    		    var	state2 = {stateId : 2, stateName : 'Arunachal Pradesh'};
    		    var	state3 = {stateId : 3, stateName : 'Madhya Pradesh'};
    			
    			$rootScope.statesListData.push(state1);
    			$rootScope.statesListData.push(state2);
    			$rootScope.statesListData.push(state3);
    			
    			var state4 = {stateId : 4, stateName : 'California'};
    			var state5 = {stateId : 5, stateName : 'Florida'};
    			var state6 = {stateId : 6, stateName : 'Newyork'};
    			
    			$rootScope.usStatesListData.push(state4);
    			$rootScope.usStatesListData.push(state5);
    			$rootScope.usStatesListData.push(state6);
    			
    			//alert('$rootScope.userRoles '+$rootScope.refreshLocation+" $rootScope.userRoles : "+$rootScope.userRoles);
    			
    			if(typeof $rootScope.refreshLocation != 'undefined' && $rootScope.refreshLocation.length > 0
    					&& $rootScope.refreshLocation != null){
    				
    				var refLocation = $rootScope.refreshLocation;
    				$rootScope.refreshLocation = "";
    				if(refLocation != "/login"){
    					
    					window.location.href = "#"+refLocation;
    				}

    			}else if(typeof $rootScope.userRoles != 'undefined'){
    				$log.info(" MAINCONTROLLER : $rootScope.userRoles==> "+$rootScope.userRoles);
    				window.location.href = "#/newRegionalMaster";
    			}
        	
    			var userRoles = app.retrieveFromLocalStorage(constants.USER_ROLES);
				var backUrl = userRoles.split(",") ;
				$scope.userName = app.retrieveFromLocalStorage('userName');
				$log.info(JSON.stringify(backUrl));
				
			
				
					
				
    			
        	
            };

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$log", MainController ];

    });


}( define ));
