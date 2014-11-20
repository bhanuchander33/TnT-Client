
/**
 * ******************************************************************************************************
 *
 *   Defines routes 
 *
 *  @author     Vikas
 *  @date       Sep 2014
 *
 * ******************************************************************************************************
 */

(function ( define ) {
    "use strict";


    define([
            'utils/logger/ExternalLogger',
            'user/controllers/AuthenticationController',
            'parent/controllers/AdminDashboardController',
           'user/controllers/MainController',
            'school/controllers/RegionalMasterController',
            'school/controllers/BranchMasterController',
            'school/controllers/ClassMasterController',
            'school/controllers/SectionMasterController',
            'school/controllers/StudentController'
           ],
            function ( $log, AuthenticationController, AdminDashboardController,MainController,
            		RegionalMasterController, BranchMasterController, ClassMasterController, 
            		SectionMasterController, StudentController)


        			{
                /**
                 * Route management constructor ()
                 * - to be used in angular.config()
                 *
                 * @see bootstrap.js
                 */
            var RouteManager = function ( $routeProvider, $location )
            {
                $log.debug( "Configuring $routeProvider...");
                
                
                $routeProvider
                    .when( '/dashboard', {
                        templateUrl : "./client/assets/views/super-admin/dashboard.tpl.html",
                        controller  : "AdminDashboardController"
                    })
                    .when( '/login', {
                        templateUrl : "./client/assets/views/login.tpl.html"
                    })
                    .when( '/main', {
                        templateUrl : "./client/assets/views/main.tpl.html"
                       // controller  : "MainController"
                    })
                   
                   
                   .when( '/newRegionalMaster', {
                      templateUrl : "./client/assets/views/school/RegionalMaster.html",
                      controller  : "RegionalMasterController"
                   })
                   .when( '/newBranchMaster', {
                      templateUrl : "./client/assets/views/school/BranchMaster.html",
                      controller  : "BranchMasterController"
                   })
                   .when( '/newClassMaster', {
                      templateUrl : "./client/assets/views/school/ClassMaster.html",
                      controller  : "ClassMasterController"
                   })
                   .when( '/newSectionMaster', {
                      templateUrl : "./client/assets/views/school/SectionMaster.html",
                      controller  : "SectionMasterController"
                   })
                   .when( '/addStudent', {
                      templateUrl : "./client/assets/views/school/StudentDetails.html",
                      controller  : "StudentController"
                   })
                   
                   
                    .otherwise({
                        redirectTo  : '/login'
                    });

            };

           // $log = $log.getInstance( "RouteManager" );

            return ["$routeProvider", RouteManager ];
        });


}( define ));
