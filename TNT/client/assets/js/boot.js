/**
 *  Use aysnc script loader, configure the application module (for AngularJS)
 *  and initialize the application ( which configures routing )
 *
 * 
 */

 (function( head ) {
    "use strict";

    head.js(

      // Pre-load these for splash-screen progress bar...

      { require    : "./client/vendor/requirejs/require.js",                  size: "80196"   },
      { underscore : "./client/vendor/underscore/underscore.js",              size: "43568"   },

      { angular    : "./client/vendor/angular/angular.js",                    size: "551057"  },
      { ngRoute    : "./client/vendor/angular-route/angular-route.js",        size: "30052"   },
      { ngSanitize : "./client/vendor/angular-sanitize/angular-sanitize.js",  size: "19990"   },
      { jquery : "./client/vendor/jquery/jquery.min.js",  size: "19990"   },
      {jqueryUI : "./client/assets/customJS/jquery-ui-1.8.custom.min.js"},
      { ckeditor : "./client/vendor/ckeditor/ckeditor.js"   },
      { angularFileUpload   : "./client/assets/customJS/angular-file-upload.js"     },
      { ngGrid : "./client/vendor/ng-grid/ng-grid-2.0.11.min.js"},
      { ngGridReorderList : "./client/assets/customJS/ng-grid-reorderable.js"},
      { ngGridDebug : "./client/vendor/ng-grid/ng-grid-2.0.11.debug.js"},
      { bootstrapUI : "./client/vendor/bootstrap/dist/js/bootstrap.min.js"},
      {angular_UI_bootrap : "./client/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js"},
      {highchartsng : "./client/assets/js/highcharts-ng.js"},
      {highcharts : "./client/assets/js/highcharts.js"}
      
    )
    .ready("ALL", function() {

        require.config (
            {
            appDir  : '',
            baseUrl : './client/src',
            paths   :
            {
                // Configure alias to full paths

                'user'         : './users',
                'utils'        : './utils',
                'parent'  : './parent',
                'teacher'  : './teacher',
                'school'  : './school'	
               
            },
            shim    :
            {
                'underscore':
                {
                    exports : '_'
                }
                
            }
        });


        require( [ "main" ], function( app )
        {
            // Application has bootstrapped and started...
        });


    });



}( window.head ));
