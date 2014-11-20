/**
 * Now let's start our AngularJS app...
 * which uses RequireJS to load  packages and code
 *
 */
(function ( define ) {
    "use strict";

    define([
			'utils/logger/ExternalLogger',
			'utils/logger/LogDecorator',
            'user/AuthenticateModule',
            'user/RouteManager',
            'utils/app',
            'utils/AppUtilityModule',
            'school/SchoolModule',
            'utils/interceptors/ResponseInterceptor',
    		'utils/interceptors/RequestInterceptor',
            
        ],
        function ( $log, LogDecorator, AuthenticateModule , RouteManager  , apputil, 
        		  apputilMod , SchoolModule ,ResponseInterceptor,RequestInterceptor )
        {
            /**
             * Specify main application dependencies...
             * one of which is the Authentication module.
             *
             * @type {Array}
             */
            var app, appName = 'Mybkr.admin';
            $log.info(" main js........................ ");
            $log.debug( "Initializing {0}", [ appName ] );

            /**
             * Start the main application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            app = angular
                    .module(
                        appName,
                        [ "ngRoute", "ngSanitize" , "highcharts-ng" , AuthenticateModule ,"mybkr.utility", 
                           "ngGrid", SchoolModule,ResponseInterceptor,RequestInterceptor ]
                    )
                    .config( LogDecorator  )
                     .config( RouteManager  )
                     .config(RequestInterceptor)
                     
                     .directive('dynamic', function ($compile) {
                    	 	return {
                    	 		restrict: 'A',
                    	 		replace: true,
                    	 		link: function (scope, ele, attrs) {
                    	 			scope.$watch(attrs.dynamic, function(html) {
                    	 				ele.html(html);
                    	 				$compile(ele.contents())(scope);
                    	 			});
                    	 		}
                    	 	};
                     })

                     //adding the filter for viewdiscounts page and DiscountsController
                     .filter('true_false', function() {
                    	 return function(text, length, end) {
                    		 if (text) {
                    			 return 'YES';
                    		 }
                    		 return 'No';
                    	 }
                     });
           
                     
            //for loader ..  
            app.factory('LoadingIndicatorHandler', function()
            		{
            	// The element we want to show/hide.
            	var $element = $('#loading-indicator');
            	return {
            		// Counters to keep track of how many requests are sent and to know
            		// when to hide the loading element.
            		enable_count: 0,
            		disable_count: 0,
            		ignore_count: 0,
            		/**
            		 * Fade the blocker in to block the screen.
            		 *
            		 * @return {void}
            		 */
            		enable: function() {
            			this.enable_count++;
            			if ( $element.length ) $element.show();
            		},
            		/**
            		 * Fade the blocker out to unblock the screen.
            		 *
            		 * @return {void}
            		 */
            		disable: function() {
            			this.disable_count++;
            			$log.info(" LoadingIndicatorHandler........ disable_count "+this.disable_count+"  this.enable_count "+ this.enable_count+" ignore_count "+this.ignore_count);
            			if ( (this.enable_count/2) == (this.disable_count-(this.ignore_count/2)) ) {
            				if ( $element.length ) $element.hide();
            			}
            		},
            		ignore: function() {
            			this.ignore_count++;
            		},
            	}
            });

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

            return app;
        }
    );

}( define ));
