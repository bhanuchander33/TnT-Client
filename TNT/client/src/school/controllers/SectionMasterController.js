
(function( define ) {
    "use strict";

    /**
     * Register the SectionMasterController class with RequireJS
     */
    define( [ 'utils/supplant', 'utils/constants', 'utils/app'], function ( supplant, constants,app )
    {
       

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
    	var SectionMasterController = function($scope, $q, $location, $rootScope, $log, $route, $http )
    	{

    		$log.info("SectionMasterController.... ");
    		
    		var branchId = localStorage.getItem(constants.BRANCH_ID),
    		    regionalId = localStorage.getItem(constants.REGION_ID);
    		
    		$scope.saveSuccess = true;
    		
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
    					$scope.showClasses = true;
    				}else{
    					$scope.showClasses = false;
    				}


    			}).
    			error(function(data, status, headers, config) {
    				// called asynchronously if an error occurs
    				// or server returns response with an error status.
    				$scope.showClasses = false;
    			});
    		};
    		
    		$scope.fetchAllClassesByBranchAndRegion();
    		
    		
    		$scope.selectClassName = function(){
    			$scope.selClassName = $('#selClassID option:selected').text();
    			$log.info("selClassName ==> "+$scope.selClassName);
    		};
    		
    		
    		$scope.reNameClass = function(branchClassId, className){
    			$log.info("branchClassId ==>"+branchClassId+" classId ==> "+$scope.classId+" className==>"+className);
    			$scope.branchClassId = branchClassId;
    			 document.getElementById ("idConfirmDialogPromptReName").innerHTML = '<div style="font-size:18px;">Are you sure, you want to Rename this Class?</div>';
    		      //confirmDialogCallback = callback;
    		      $("#idConfirmDialogReName").modal ("show");
    		      
    		      $('#newClassName').val("");
    		      $('#oldClassName').val(className);
    			
    		};
    		
    		$scope.updateClassName = function(){
    			$("#idConfirmDialogReName").modal ('hide'); 
    			
    			var classMasterObj = {}, branchMaster = {};
    			classMasterObj.className = $scope.newClassName;
    			classMasterObj.regionalId = regionalId;
    			classMasterObj.branchClassId = $scope.branchClassId;
    			
    			branchMaster.branchClassId = branchId;
    			classMasterObj.branchMaster = branchMaster;
    			
    			$http({method: 'PUT', url:  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_BRANCH_MAP_RESOURCE'),
				    data:JSON.stringify(classMasterObj)}).
				    success(function(data, status, headers, config) {
				    	
				    	$scope.fetchAllClassesByBranchAndRegion();
            	
				    }).
				    error(function(data, status, headers, config) {
				    	// called asynchronously if an error occurs
				    	// or server returns response with an error status.
				    	$log.info("error while renaming class master ");
				    });
    			
    		};
    		
    		$scope.cancelUpdateClassName = function(){
    			$("#idConfirmDialogReName").modal ('hide'); 
    		};
    		
    		$scope.disableClass = function(branchClassId){
    			$log.info("branchClassId == > "+branchClassId);
    			var delUrl =  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_BRANCH_MAP_RESOURCE')+app.getConstantValueForKey('DELETE_CLASS_BRANCH_MAP');
    			delUrl = delUrl+'?classBranchMapId='+branchClassId;
    			
    			$http({method: 'DELETE', url: delUrl}).
				    success(function(data, status, headers, config) {
				    	
				    	$scope.fetchAllClassesByBranchAndRegion();
            	
				    }).
				    error(function(data, status, headers, config) {
				    	// called asynchronously if an error occurs
				    	// or server returns response with an error status.
				    	$log.info("error deleting class master ");
				    });
    		};
    		//again bhanu
    		//test-vikas
    		//test
    		$scope.saveClassMaster = function(){
    			//$scope.regionalMasterVO.domainControls = [];
    			var branchMaster = {};
    			$scope.classMasterVO = {};
    			$scope.classMasterVO.createdDateTime = new Date();
    			$scope.classMasterVO.createdBy = 1;
    			$scope.classMasterVO.className = $scope.selClassName;
    			$scope.classMasterVO.classId = $scope.classId;
    			$scope.classMasterVO.regionalId = regionalId;
    			
    			branchMaster.branchId = branchId;
    			$scope.classMasterVO.branchMaster = branchMaster;
    			
    			
    			$http({method: 'POST', url:  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_BRANCH_MAP_RESOURCE'),
    				    data:JSON.stringify($scope.classMasterVO)}).
    				    success(function(data, status, headers, config) {
                	
    				    	//$log.info("saved class master "+JSON.stringify(data));
    				    	$scope.saveSuccess = true;
    				    	$scope.classMasterVO = {};
    				    	$scope.fetchAllClassesByBranchAndRegion();
                	
                }).
                error(function(data, status, headers, config) {
                 // called asynchronously if an error occurs
                 // or server returns response with an error status.
                	$scope.saveSuccess = false;
                	$log.info("error saving class master ");
                });
    			
    		};
    		
    		
    		//alert("$rootScope.reloadCount in salesAdmin : "+app.retrieveFromLocalStorage(constants.RELOAD_COUNT));

    	};

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$log","$route","$http", SectionMasterController ];

    });


}( define ));
