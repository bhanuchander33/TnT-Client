
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
    		$scope.sectionsList = [];
    		$scope.fetchAllSectionsByBranchAndRegionAndClass = function(){
    			var classIdNew = $scope.classesId;
    			var serUrl = app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_SECTION_MAP_RESOURCE')+app.getConstantValueForKey('GETALL_CLASS_SECTION_MAP');
    			serUrl = serUrl+"?regionalId="+regionalId+"&branchId="+branchId+"&classId="+classIdNew;

    			$http({method: 'GET', url:serUrl}).
    			success(function(data, status, headers, config) {
    				//$log.info("Fetched ALL CLASSES "+JSON.stringify(data));
    				
    				if(data != null){
    					$scope.sectionsList = data;
    					$scope.showSections = true;
    					
    				}else{
    					$scope.showSections = false;
    				}
    			}).
    			error(function(data, status, headers, config) {
    				// called asynchronously if an error occurs
    				// or server returns response with an error status.
    				$scope.showSections = false;
    			});
    		};
    		
    		//$scope.fetchAllSectionsByBranchAndRegionAndClass();
    		
    		
    		$scope.selectSectionName = function(){
    			$scope.selSectionName = $('#selSectionID option:selected').text();
    			$log.info("selSectionName ==> "+$scope.selSectionName);
    		};
    		
//    		$scope.selectSectionForClasses = function(){
//    			$scope.selClasssName = $('#selClassesID option:selected').text();
//    			$log.info("selClasssName ==> "+$scope.selClasssName);
//    		};
    		
    		$scope.reNameSection = function(sectionClassId, sectionName){
    			$log.info("sectionClassId ==>"+sectionClassId+" sectionId ==> "+$scope.sectionId+" sectionName==>"+sectionName);
    			$scope.sectionClassId = sectionClassId;
    			 document.getElementById ("idConfirmDialogPromptReName").innerHTML = '<div style="font-size:18px;">Are you sure, you want to Rename this Section?</div>';
    		      //confirmDialogCallback = callback;
    		      $("#idConfirmDialogReName").modal ("show");
    		      
    		      $('#newSectionName').val("");
    		      $('#oldSectionName').val(sectionName);
    			
    		};
    		
    		$scope.updateSectionName = function(){
    			$("#idConfirmDialogReName").modal ('hide'); 
    			
    			var sectionMasterObj = {}, classMaster = {}, branchMaster = {};
    			sectionMasterObj.sectionName = $scope.newSectionName;
    			sectionMasterObj.regionalId = regionalId;
    			sectionMasterObj.sectionClassId = $scope.sectionClassId;
    			sectionMasterObj.updatedBy = "1";//for now hardcoded
    			
    			classMaster.classId = $scope.classesId;
    			sectionMasterObj.classMaster = classMaster;
    			
    			branchMaster.branchId = branchId;
    			sectionMasterObj.branchMaster = branchMaster;
    			
    			$http({method: 'PUT', url:  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_SECTION_MAP_RESOURCE'),
				    data:JSON.stringify(sectionMasterObj)}).
				    success(function(data, status, headers, config) {
				    	
				    	$scope.fetchAllSectionsByBranchAndRegionAndClass();
            	
				    }).
				    error(function(data, status, headers, config) {
				    	// called asynchronously if an error occurs
				    	// or server returns response with an error status.
				    	$log.info("error while renaming class master ");
				    });
    			
    		};
    		
    		$scope.cancelUpdateSectionName = function(){
    			$("#idConfirmDialogReName").modal ('hide'); 
    		};
    		
    		  
    		$scope.disableSection = function(sectionClassId){

      			$scope.sectionClassId = sectionClassId;
      			 document.getElementById ("idConfirmDialogPrompt").innerHTML = '<div style="font-size:18px;">Are you sure, you want to Disable this Section?</div>';
      		      //confirmDialogCallback = callback;
      		      $("#idConfirmDialog").modal ("show");
    		}
    		
    		$scope.disableSectionAfterConfirmName = function(){
    			
    			$("#idConfirmDialog").modal ('hide'); 
    			
    			$log.info("sectionClassId == > "+$scope.sectionClassId);
    			var delUrl =  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_SECTION_MAP_RESOURCE')+app.getConstantValueForKey('DELETE_CLASS_SECTION_MAP_BYID');
    			delUrl = delUrl+'?classSectionMapId='+$scope.sectionClassId;
    			
    			$http({method: 'DELETE', url: delUrl}).
				    success(function(data, status, headers, config) {
				    	
				    	$scope.fetchAllSectionsByBranchAndRegionAndClass();
            	
				    }).
				    error(function(data, status, headers, config) {
				    	// called asynchronously if an error occurs
				    	// or server returns response with an error status.
				    	$log.info("error deleting class master ");
				    });
    		};
    		
    		$scope.cancelUpdateSectionName = function(){
    			$("#idConfirmDialog").modal ('hide'); 
    		};
    		
    		
    		$scope.saveSectionMaster = function(){

    			var branchMaster = {},
    			classMaster = {};
    			$scope.sectionMasterVO = {};//why scope variable here????
    			
    			
    			$scope.sectionMasterVO.createdBy = 1;//hardcodded
    			$scope.sectionMasterVO.updatedBy = 1;//hardcodded
    			$scope.sectionMasterVO.activeFlag = true;
    			$scope.sectionMasterVO.sectionName = $scope.selSectionName;
    			//$scope.sectionMasterVO.sectionId = $scope.sectionId;
    			$scope.sectionMasterVO.regionalId = regionalId;
    			
    			classMaster.classId = $scope.classesId;
    			$scope.sectionMasterVO.classMaster = classMaster;
    			
    			branchMaster.branchId = branchId;
    			$scope.sectionMasterVO.branchMaster = branchMaster;
    			
    			
    			$http({method: 'POST', url:  app.getConstantValueForKey('API_URL')+app.getConstantValueForKey('CLASS_SECTION_MAP_RESOURCE'),
    				    data:JSON.stringify($scope.sectionMasterVO)}).
    				    success(function(data, status, headers, config) {
                	
    				    	//$log.info("saved class master "+JSON.stringify(data));
    				    	$scope.saveSuccess = true;
    				    	$scope.sectionMasterVO = {};
    				    	$scope.fetchAllSectionsByBranchAndRegionAndClass();
                	
                }).
                error(function(data, status, headers, config) {
                 // called asynchronously if an error occurs
                 // or server returns response with an error status.
                	$scope.saveSuccess = false;
                	$log.info("error saving section master ");
                });
    			
    		};
    	};

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$log","$route","$http", SectionMasterController ];

    });


}( define ));
