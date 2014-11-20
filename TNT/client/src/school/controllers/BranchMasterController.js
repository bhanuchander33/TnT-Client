
(function( define ) {
    "use strict";

    /**
     * Register the BranchMasterController class with RequireJS
     */
    define( [ 'utils/supplant', 'utils/constants', 'utils/app'], function ( supplant, constants,app )
    {
       

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
    	var BranchMasterController = function($scope, $q, $location, $rootScope, $log, $route, $http )
    	{

    		$log.info("BranchMasterController.... ");
    		
    		$scope.saveSuccess = false;
    		
    		//alert("(app.retrieveFromLocalStorage(constants.RELOAD_COUNT)==> "+(app.retrieveFromLocalStorage(constants.RELOAD_COUNT)));
    		//to refresh app on switching to sales Admin
    		if(app.retrieveFromLocalStorage(constants.RELOAD_COUNT) == 1){
    			//window.location.reload();
    		}else{
    			//alert("reload 2");
    			app.setInLocalStorage(constants.SWITCH_USER, null);
    			app.setInLocalStorage(constants.RELOAD_COUNT, null);
    		}
    		
    		
    		if(typeof $rootScope.countriesListData != 'undefined'){
    			$scope.countriesList = $rootScope.countriesListData;
    		}
    		
    		if(typeof $rootScope.statesListData != 'undefined'){
    			$scope.statesList = $rootScope.statesListData;
    		}
    		
    		$scope.changeCountry = function(countryId){
    			
    			if(countryId > 1){
    				$scope.statesList = $rootScope.usStatesListData;
    			}else{
    				$scope.statesList = $rootScope.statesListData;
    			}
    		};
    		
    		
    	
    		
    		
    		//Fetching All Regional Masters
    		$scope.regionalMastersList = [];
    		$http({method: 'GET', url:app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('REGIONAL_RESOURCE')+app.getConstantValueForKey('GETALL_REGIONAL_MASTERS')}).
  			success(function(data, status, headers, config) {
  				//$log.info("Fetched ALL BRANCHES "+JSON.stringify(data));
  				if(data != null){
  					$scope.regionalMastersList = data;
  				}
  				
  					
  			}).
  			error(function(gradeData, status, headers, config) {
  				// called asynchronously if an error occurs
  				// or server returns response with an error status.
  			});
    		
    		$scope.saveBranchMaster = function(){
    			//$scope.regionalMasterVO.domainControls = [];
    			
    			$scope.branchMasterVO.createdDateTime = new Date();
    			$scope.branchMasterVO.createdBy = 1;
    			
    			$http({method: 'POST', url:  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('BRANCH_RESOURCE'),
    				    data:JSON.stringify($scope.branchMasterVO)}).
    				    success(function(data, status, headers, config) {
                	
    				    	$log.info("saved regional master "+JSON.stringify(data));
    				    	$scope.saveSuccess = true;
    				    	$scope.branchMasterVO = {};
                	
                }).
                error(function(data, status, headers, config) {
                 // called asynchronously if an error occurs
                 // or server returns response with an error status.
                	$log.info("error saving regional master ");
                });
    			
    		};
    		
    		
    		//alert("$rootScope.reloadCount in salesAdmin : "+app.retrieveFromLocalStorage(constants.RELOAD_COUNT));

    	};

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$log","$route","$http", BranchMasterController ];

    });


}( define ));
