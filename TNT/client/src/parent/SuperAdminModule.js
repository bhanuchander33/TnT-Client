/**
 * ******************************************************************************************************
 *
 *   
 *
 *   Defines controllers and services for the Teacher Module 
 *
 * 
 *
 * ******************************************************************************************************
 */

(function ( define, angular ) {
    "use strict";

    define([
            'parent/controllers/AdminDashboardController'
           
        ],
        function ( AdminDashboardController)
        {
            var moduleName = "TNT.Teacher";

            angular
                .module(     moduleName,    [ ] )
                .controller( "AdminDashboardController", AdminDashboardController );
               
            
            return moduleName;
        });


}( define, angular ));

