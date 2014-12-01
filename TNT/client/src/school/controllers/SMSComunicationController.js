
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
	var SMSComunicationController = function($scope, $q, $location, $rootScope, $log, $route, $http ) {
		

		$scope.selectAudience = function(audience){
			  
	        jQuery("#transactionalDivID").hide();
	        jQuery("#promotionalID").hide();

	        jQuery("#templateView").hide();
	        jQuery("#buttonDivId").hide();
	        jQuery("#dynamicGrid").hide();
	        jQuery("#submitFinal").hide();

	        jQuery("#classListDivID").hide();

	        jQuery("#studentClassSection").hide();
	        jQuery("#staffSlectionDepart").hide();
	        jQuery("#dynamicGrid").hide();
	        
	        jQuery("#noOfCantacts").hide();

	          //Staff
	        jQuery("#staffSlectionDepart").hide();
	        jQuery("#staffListDivID").hide();

	};
		
		
		
	};
		return [ "$scope", "$q", "$location","$rootScope","$log","$route","$http", SMSComunicationController ];

			});


}( define ));
