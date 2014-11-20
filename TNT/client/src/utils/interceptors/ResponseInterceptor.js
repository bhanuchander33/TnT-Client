/**
 * @author    
 * @description
 * Establishes global response interceptors and potential routing based on DataService responses
 *
 */
(function ()
{
    "use strict";

    define(['utils/app' ],function (app)
    {
        var errorModel = null,
            logger = null,
            $scope = null,
            $$q = null,
			sessionObj = null,
			loadingIndicatorElem = null,
			locationService = null;

        /**
         * Constructor function for the ResponseInterceptor.
         */
        var ResponseInterceptor = function ($httpProvider)
        {
		
            /**
             *   Only RESPONSE interceptors are implemented below.
             *   These interceptors receive and return promises.
             *   NOTE: We have not yet implemented REQUEST interceptors/transforms !
             */
            var globalResponseInterceptor = function (promise)
                {
				logger.info("onSuccess() response interceptor called loadingIndicatorElem ");
                    var onSuccess = function (packet)
                    {
                        // Routing by-pass
                        // !! ngRoutes will load templateUrls as strings...
						//alert("packet.data : "+packet.status);
                    	/*for(var p in loadingIndicatorElem){
                    		logger.info("P "+p+": "+loadingIndicatorElem[p]);
                    	}
                    	*/
                    	
                    	loadingIndicatorElem.disable();
                    	
                    	//for(var key in $httpProvider.defaults.headers.common){
                    	//	logger.info("\n\nkey ======================> "+key+" value:"+$httpProvider.defaults.headers.common[key]);
                    	//}
                    	
                    /*	if(app.retrieveFromLocalStorage("authkey") != null && app.retrieveFromLocalStorage("authkey") != 'null'
                    		&& typeof app.retrieveFromLocalStorage("authkey") != 'undefined'){
                    		app.setInLocalStorage("authkey",$httpProvider.defaults.headers.common['authKey']);
                    		sessionObj.sessionID = $httpProvider.defaults.headers.common['authKey'];
                    	}
                    	*/
                    /*	
                    	if(sessionObj != null && sessionObj.sessionID != null && typeof sessionObj.sessionID != 'undefined'){
                    		app.setInLocalStorage("authKey",sessionObj.sessionID);
                    	}
                    	
						var headers = packet['headers']();
						if(headers && headers['authkey']){
						
							sessionObj.sessionID = headers['authkey'];
						}
						
						logger.info("\n\nkey ======================>"+ $httpProvider.defaults.headers.common['authKey']);
						logger.info("small LS ======================>"+ app.retrieveFromLocalStorage('authkey'));
						logger.info("Big LS ======================>"+ app.retrieveFromLocalStorage('authKey'));
						*/
						//logger.info("sessionObj.sessionID is set to "+sessionObj.sessionID);
                        if(angular.isString(packet.data))
                        {
                            return packet;
                        }
					
                        

                        // Here we can check status codes, etc.
                        // and then extract the `true` data body

                        return packet;

                    },
                    /**
                     * FaultHandler
                     */
                    onFault = function (fault)
                    {
                        logger.info("response interceptor onFault({status})", fault);

                        var error = angular.isDefined(fault.error) ? fault.error :
                            angular.isDefined(fault.status) ?
                            {
                                code: fault.status,
                                message: "Unexpected Server Error"
                        } :
                        {
                            code: "404",
                            message: "Not Found"
                        };
                       
                        if(fault.status==401){
                        	
                        	//closeAllPopups();
                        	forceLogout();
                        	
                        }
                        loadingIndicatorElem.disable();
                        
							//sessionObj.sessionID = null;
							//sessionObj.error = error;
                        // Extract error and `report` via updates to the `errorModel`
                        return $$q.reject(error);
                    };

                    return promise.then(onSuccess, onFault);
                },
                
                forceLogout = function($rootScope, $q, $log, LoadingIndicatorHandler, $location, $window){

                 	 app.clearLocalStorage();
                    // var currentAppPath = ""+window.location;
                     window.location.href = "#/sessionexpmsg";
                 	
                    
                     
                },
                 
                closeAllPopups = function(){
                	if(typeof $(".black-overlay-myprogress") != 'undefined'){
                		$(".black-overlay-myprogress, .white-overlay, .white-content-myprogress").hide();
                		//alert($(".close-in-myprogress").html());
                		
                		$(".close-in-myprogress").hide();
                	}
                	if(typeof $("#popupcontentMyProgress") != 'undefined' ){
                		$("#popupcontentMyProgress").html("");
                		$("#popupcontentMyProgress").hide();
                	}
                	
                },
                
                /**
                 * Capture the injected instances and return our global ResponseInterceptor
                 * @returns {Function}
                 */
                registerInterceptor = function ($rootScope, $q, $log, LoadingIndicatorHandler, $location, $window)
                {
                    // Save references; required for interceptor features

                    $$q = $q;
                    logger = $log.getInstance("ResponseInterceptor");
					//logger.info("httpProvider response interceptor called " +LoadingIndicatorHandler);
                    
                    locationService = $location;
                    $scope = $rootScope;
                    //$rootScope.error = session.error;
                   // errorModel = session.error;
					//sessionObj = session;
					loadingIndicatorElem = LoadingIndicatorHandler;
                    return globalResponseInterceptor;
                };


            /**
             * Register global HTTP response interceptor
             */			 
            $httpProvider.responseInterceptors.push(
                ["$rootScope", "$q", "$log","LoadingIndicatorHandler","$location","$window", registerInterceptor ]
            );

        };

        return ["$httpProvider", ResponseInterceptor];
    });

}());
