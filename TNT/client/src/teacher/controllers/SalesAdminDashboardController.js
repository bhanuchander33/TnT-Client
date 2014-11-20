
(function( define ) {
    "use strict";

    /**
     * Register the SalesAdminDashboardController class with RequireJS
     */
    define( [ 'utils/supplant', 'utils/constants', 'utils/app'], function ( supplant, constants,app )
    {
       

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
    	var SalesAdminDashboardController = function($scope, $q, $location, $rootScope, $log, $route )
    	{

    		$log.info("SalesAdminDashboardController.... ");
    		
    		alert("(app.retrieveFromLocalStorage(constants.RELOAD_COUNT)==> "+(app.retrieveFromLocalStorage(constants.RELOAD_COUNT)));
    		//to refresh app on switching to sales Admin
    		if(app.retrieveFromLocalStorage(constants.RELOAD_COUNT) == 1){
    			//window.location.reload();
    		}else{
    			//alert("reload 2");
    			app.setInLocalStorage(constants.SWITCH_USER, null);
    			app.setInLocalStorage(constants.RELOAD_COUNT, null);
    		}
    		
    		
    		
    		
    		//alert("$rootScope.reloadCount in salesAdmin : "+app.retrieveFromLocalStorage(constants.RELOAD_COUNT));

    	};

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$log","$route", SalesAdminDashboardController ];

    });


}( define ));
