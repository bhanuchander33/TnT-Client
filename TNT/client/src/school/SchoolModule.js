/**
 * ******************************************************************************************************
 *
 *   
 *
 *   Defines controllers and services for the TeacherModule 
 *
 *
 * ******************************************************************************************************
 */

(function ( define, angular ) {
    "use strict";

    define([
           "user/controllers/MainController",
           "school/controllers/RegionalMasterController",
           "school/controllers/BranchMasterController",
           "school/controllers/ClassMasterController",
           "school/controllers/SectionMasterController",
           "school/controllers/StudentController"
           
            
        ],
        function ( MainController, RegionalMasterController,BranchMasterController, ClassMasterController,
        		  SectionMasterController, StudentController)
        {
            var moduleName = "TNT.School";

            angular
                .module(     moduleName,    [ ] )
                .controller("MainController",MainController)
                .controller("RegionalMasterController",RegionalMasterController)
                .controller("BranchMasterController",BranchMasterController)
                .controller("ClassMasterController",ClassMasterController)
                .controller("SectionMasterController",SectionMasterController)
                .controller("StudentController",StudentController);
               

            return moduleName;
        });


}( define, angular ));

