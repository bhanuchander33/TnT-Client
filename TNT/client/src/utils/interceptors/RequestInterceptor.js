/**
 *
 * @description
 * Establishes global request interceptors and potential routing based on DataService responses
 *
 */
(function ()
{
    "use strict";

    define(['utils/app'],function (app)
    {
        var errorModel = null,
            logger = null,
            $scope = null,
            $$q = null;

        /**
         * Constructor function for the RequestInterceptor.
         */
        var RequestInterceptor = function ($httpProvider,$provide)
        {
		
            /**
             *   Only RESPONSE interceptors are implemented below.
             *   These interceptors receive and return promises.
             *   NOTE: We have not yet implemented REQUEST interceptors/transforms !
             */
            var globalRequestInterceptor = function ( $rootScope,$q,$log,LoadingIndicatorHandler)
                {
				   logger = $log;
				
				 return {
					request: function(config) {
						
						//logger.info("httpProvider request interceptor called url : "+config.url);
						/*if (config.method === 'GET' && config.url.contains("/rest/")) {
						var sep = config.url.indexOf('?') === -1 ? '?' : '&';
						config.url = config.url + sep + 'cacheSlayer=' + new Date().getTime();
						
						} */
					//console.log(config.url);
						//logger.info(app.retrieveFromLocalStorage("userId"));
						//logger.info(app.retrieveFromLocalStorage("userName"));
						//logger.info(app.retrieveFromLocalStorage("userEmail"));
						
						/*$httpProvider.defaults.headers.common.authKey = session.sessionID;//app.retrieveFromLocalStorage('authkey');	
						$httpProvider.defaults.headers.common.userId = app.retrieveFromLocalStorage("userId");
						$httpProvider.defaults.headers.common.userName = app.retrieveFromLocalStorage("userName");
						$httpProvider.defaults.headers.common.userEmail = app.retrieveFromLocalStorage("userEmail");
						$httpProvider.defaults.headers.common.roleName = app.retrieveFromLocalStorage("roleName");*/
						//logger.info("httpProvider request interceptor called authKey : "+app.retrieveFromLocalStorage('authkey'));
							
					/*logger.info("httpProvider request interceptor called SESSION : "+session.sessionID);*/
					
					
					//config.headers['authKey'] = session.sessionID;
					/*if(app.retrieveFromLocalStorage("authKey") != null && app.retrieveFromLocalStorage("authKey") != 'null' 
						&& typeof app.retrieveFromLocalStorage("authKey") != 'undefined'){
						config.headers['authKey'] = app.retrieveFromLocalStorage("authKey");
					}
				     
					
					if((config.url).indexOf(app.getConstantValueForKey('UPDATE_QUIZ_TIME')) > -1){
						LoadingIndicatorHandler.ignore();
					}else{
					*/
						LoadingIndicatorHandler.enable();
					//}
					
					
					
						return config || $q.when(config);
					},
					
					requestError: function(rejection) {	
						logger.info("requestError : Error while requesting....");
						$rootScope.pendingRequests--;
						LoadingIndicatorHandler.enable();
						return $q.reject(rejection);
					}
				};
				
				
				
		
			},
				
		
                /**
                 * Capture the injected instances and return our global RequestInterceptor
                 * @returns {Function}
                 */
                registerInterceptor = function (session, $rootScope, $q, $log)
                {
                    // Save references; required for interceptor features

                    $$q = $q;
                    logger = $log.getInstance("RequestInterceptor");
					logger.info("httpProvider request interceptor called");
                    $scope = $rootScope;
                    errorModel = session.error;

                    return globalRequestInterceptor;
                };

				$provide.factory('RequestInterceptor',globalRequestInterceptor);
				
            /**
             * Register global HTTP response interceptor
             */			 
           $httpProvider.interceptors.push(
                ["$rootScope", "$q", "$log","LoadingIndicatorHandler", globalRequestInterceptor ]
            );

        };

        return ["$httpProvider","$provide", RequestInterceptor];
    });

}());
