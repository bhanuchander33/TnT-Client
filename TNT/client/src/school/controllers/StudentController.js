
(function( define ) {
    "use strict";

    /**
     * Register the StudentController class with RequireJS
     */
    define( [ 'utils/supplant', 'utils/constants', 'utils/app'], function ( supplant, constants,app )
    {
       

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
    	var StudentController = function($scope, $q, $location, $rootScope, $log, $route, $http )
    	{

    		$log.info("StudentController.... ");
    		
    		var branchId = localStorage.getItem(constants.BRANCH_ID),
		    regionalId = localStorage.getItem(constants.REGION_ID);
    		
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
    		
    		
    	
    		
    		
    		//Fetching All classes for branchId and regionalId
    		$scope.classesList = [];
    		$scope.fetchAllClassesByBranchAndRegion = function(){

    			var serUrl = app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_BRANCH_MAP_RESOURCE')+app.getConstantValueForKey('GETALL_CLASS_BRANCH_MAP');
    			serUrl = serUrl+"?regionalId="+regionalId+"&branchId="+branchId;

    			$http({method: 'GET', url:serUrl}).
    			success(function(data, status, headers, config) {
    				//$log.info("Fetched ALL CLASSES "+JSON.stringify(data));
    				if(data != null){
    					$scope.classesList = data;
    					
    				}


    			}).
    			error(function(data, status, headers, config) {
    				// called asynchronously if an error occurs
    				// or server returns response with an error status.
    				
    			});
    		};
    		
    		$scope.fetchAllClassesByBranchAndRegion();
    		
    		$scope.sectionsList = [];
    		
    		$scope.fetchSectionsByClassBranchMap = function(classBranchId){
    			var serUrl = app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_SECTION_MAP_RESOURCE')+app.getConstantValueForKey('GETALL_CLASS_SECTION_MAPS');
    			serUrl = serUrl+"?regionalId="+regionalId+"&branchId="+branchId+"&classId="+classBranchId;

    			$http({method: 'GET', url:serUrl}).
    			success(function(data, status, headers, config) {
    				//$log.info("Fetched ALL CLASSES "+JSON.stringify(data));
    				if(data != null){
    					$scope.sectionsList = data;
    				}


    			}).
    			error(function(data, status, headers, config) {
    				// called asynchronously if an error occurs
    				// or server returns response with an error status.
    				
    			});
    		}; 
    		
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

        return [ "$scope", "$q", "$location","$rootScope","$log","$route","$http", StudentController ];

    });


}( define ));
