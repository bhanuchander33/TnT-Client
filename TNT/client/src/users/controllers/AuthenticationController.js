
(function( define ) {
    "use strict";

    /**
     * Register the LoginController class with RequireJS
     */
    define( [ 'utils/supplant',
              'utils/constants',
              'utils/app'], function ( supplant, constants, app )
    {
        var SERVER_NOT_RESPONDING  = "The Quizzler server is not responding",
            UNABLE_TO_CONNECT      = 'Unable to connect to secure Quizzler dataservices',
            TIMEOUT_RESPONSE       = 'Dataservice did not respond and timed out.',
            PAGE_NOT_FOUND         = '404 Not Found',

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
            AuthenticationController = function($scope, $q, $location, $rootScope, $compile, $log, $http, $routeParams, $route )
            {
        	
        		$log = $log.getInstance( "AuthenticationController" );
        		$log.info("called AuthenticationController...");
        	
        		$scope.showLoginTemplate = false;
        		$("#loginTplId").hide();
        	
        		if(typeof $rootScope.logout != 'undefined' && $rootScope.logout){
        			app.clearLocalStorage();
        			$("#loginTplId").show();
        			window.location.reload();
        		}
        		
        		var userLoggedIn = app.retrieveFromLocalStorage("userName"),
        			
        		hideSuperAdminHeaderAndNav = function(){
        			$("#headerBar").hide();
        			$("#sideNav").hide();
        			$("#title").hide();
        		},
        		
        		showSuperAdminHeaderAndNav = function(){
        			$("#headerBar").hide();
        			$("#sideNav").hide();
        			$("#title").hide();
        		},
        		hideSalesAdminHeaderAndNav = function(){
    				$("#salesAdminNav").hide();
    				$("#salesAdminHeader").hide();
    				
    			},

    			showSalesAdminHeaderAndNav = function(){
    				$("#salesAdminNav").show();
    				$("#salesAdminHeader").show();
    			};
        		
    			/* redirect to appropriate user based on role 
    			*  on login or page refresh
    			*/
        		var redirectOnRole = function(roles, isSwitchUser){
    				//redirecting to appropriate template based on role
        			var templateUrl = "", consRole = "", 
        				currentRole = app.retrieveFromLocalStorage(constants.CURRENT_ROLE);
    				//roles = constants.ROLE_SUPER_ADMIN;
            		
        		/*	if(roles.indexOf(constants.ROLE_SALES_ADMIN) != -1 && roles.indexOf(constants.ROLE_SUPER_ADMIN) != -1){
        				templateUrl = "./client/assets/views/main.tpl.html";
        				consRole = constants.ROLES_SUPER_SALES_ADMIN;
        				currentRole = constants.ROLE_SUPER_ADMIN;
        				
        			}else */
        			
        			if(roles.indexOf(constants.ROLE_SUPER_ADMIN) != -1){
        				templateUrl = "./client/assets/views/main.tpl.html";
        				consRole = constants.ROLE_SUPER_ADMIN;
        				currentRole = constants.ROLE_SUPER_ADMIN;
        				
        			}else if(roles.indexOf(constants.ROLE_SALES_ADMIN) != -1){
            			templateUrl = "./client/assets/views/main.tpl.html";
            			consRole = constants.ROLE_SALES_ADMIN;
            			currentRole = constants.ROLE_SALES_ADMIN;
        			} 
        			
        			if(!isSwitchUser){
    					$rootScope.userRoles = consRole;
    				}
        			
        			if(app.retrieveFromLocalStorage(constants.CURRENT_ROLE) == null){
        				app.setInLocalStorage(constants.CURRENT_ROLE, currentRole);
        			}
        			
            		$.get(templateUrl , function( data ) {
						$("#dash_div_id").html($compile(angular.element(data))($scope));
					});
            		
    			},
    			
    			/*redirect to multi role user on switching from
    			 *  sales admin to super admin and vice-versa
    			 */
    			redirectOnUserSwitch = function(toUserRole){
    				//redirecting to appropriate template based on role
        			var templateUrl = "", consRole = "";
    				//roles = constants.ROLE_SUPER_ADMIN;
            		//alert("toUserRole "+toUserRole);
        			if(toUserRole.indexOf(constants.TO_SALES_ADMIN) != -1){
        				templateUrl = "./client/assets/views/sales_admin_main.tpl.html";
        				//consRole = constants.ROLES_SUPER_SALES_ADMIN;
        				app.setInLocalStorage(constants.CURRENT_ROLE, constants.ROLE_SALES_ADMIN);
        				
        			}else if(toUserRole.indexOf(constants.TO_SUPER_ADMIN) != -1){
        				templateUrl = "./client/assets/views/main.tpl.html";
        				//consRole = constants.ROLE_SUPER_ADMIN;
        				app.setInLocalStorage(constants.CURRENT_ROLE, constants.ROLE_SUPER_ADMIN);
        				
        			}
        			
        			
        			if(app.retrieveFromLocalStorage(constants.RELOAD_COUNT) != null && app.retrieveFromLocalStorage(constants.RELOAD_COUNT) == 1){
        				app.setInLocalStorage(constants.RELOAD_COUNT, 2);
        			}else{
        				app.setInLocalStorage(constants.RELOAD_COUNT, 1);
        			}
        			
        			$rootScope.userRoles = constants.ROLES_SUPER_SALES_ADMIN;
        			
            		$.get(templateUrl , function( data ) {
						$("#dash_div_id").html($compile(angular.element(data))($scope));
					});
            		
    			},
    			
    			setUserDetails = function(userData){
    				var userRoles = "", username = "";
					if(userData != null){
						app.setInLocalStorage("loginName",userData.userName);
						
						app.setInLocalStorage("emailId",userData.emailAddress);
						app.setInLocalStorage(constants.USERID,userData.authUserId);
						
						//@TODO : Must fetch these values from user login response data
						app.setInLocalStorage(constants.BRANCH_ID,1);
						app.setInLocalStorage(constants.REGION_ID,1);
						
						
						username = (userData.firstName != null && userData.firstName.length > 0 ) ? userData.firstName+" ":"";
						username += (userData.lastName != null && userData.lastName.length > 0 ) ? userData.lastName:"";
						
						
						if(userData.authUserRoleses != null && userData.authUserRoleses.length > 0){
							$.each(userData.authUserRoleses,function(index, item){
								userRoles = userRoles+","+item.authRoles.roleName;
							});
						}
						
						app.setInLocalStorage(constants.USER_NAME,username);
						app.setInLocalStorage(constants.USER_ROLES,userRoles);
						
						redirectOnRole(userRoles, false);
					}
					
    			};
    			
    			//redirecting if user is already loggedIn
				if(userLoggedIn != null){
					var lsUserRoles = app.retrieveFromLocalStorage("userRoles"),
					
					  switchUser =  app.retrieveFromLocalStorage(constants.SWITCH_USER);
					
					$scope.showLoginTemplate = false;
					$("#loginTplId").css("display","none");
					$("#loginTplId").hide();
					
					if(switchUser == constants.TO_SALES_ADMIN ){
						
						//lsUserRoles = constants.ROLE_SALES_ADMIN;
						redirectOnUserSwitch(constants.TO_SALES_ADMIN);
					}else if(switchUser == constants.TO_SUPER_ADMIN ){
						
						//lsUserRoles = constants.ROLE_SALES_ADMIN;
						redirectOnUserSwitch(constants.TO_SUPER_ADMIN);
					}
					else{
						 if($location.path() != '/login'){

							showSalesAdminHeaderAndNav();
							showSuperAdminHeaderAndNav();

							$rootScope.refreshLocation = $location.path();

							redirectOnRole(app.retrieveFromLocalStorage(constants.CURRENT_ROLE), false);

						}
						else{
							$("#loginTplId").show();
							hideSalesAdminHeaderAndNav();
							hideSuperAdminHeaderAndNav();
						}
					}
					
					
				}else{
					$scope.showLoginTemplate = true;
					$("#loginTplId").css("display","block");
					$("#loginTplId").show();
				}
    				
        		
        		//hideSuperAdminHeaderAndNav();
        	
        		$scope.login = function(){
        			
        			var serviceUrl = "./client/assets/data/user.json";
        				
        			//Authenticating user
        			if($scope.userName != "" && $scope.password != "" && userLoggedIn == null){
        				
        				var userObj = {
        						userName : $scope.userName,
        						password : $scope.password
        				};
        				$log.info("info : "+JSON.stringify(userObj));
        				$http({method: 'GET', url:  serviceUrl,
							   data: JSON.stringify(userObj) }).
						success(function(data, status, headers, config) {
								$log.info("login data : "+JSON.stringify(data));
								setUserDetails(data);
						}).
						error(function(data, status, headers, config) {
							$log.info("login data error");
							$scope.isInvalid = true;
						}); 
						
        			}
        			
        		}
        		
        		$scope.$watch('userName', function(){
        			$scope.isInvalid = false;
        		});
        		
        		$scope.$watch('password', function(){
        			$scope.isInvalid = false;
        		});
        			
            };

        // Register as global constructor function

        return [ "$scope", "$q", "$location","$rootScope","$compile","$log","$http","$routeParams","$route", AuthenticationController ];

    });


}( define ));
