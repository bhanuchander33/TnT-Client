
(function( define ) {
	"use strict";

	/**
	 * Register the AdminDashboardController class with RequireJS
	 */
	define( [ 'utils/supplant', 'utils/constants', 'utils/app' ], function ( supplant, constants, app )
			{


		/**
		 * Constructor function used by AngularJS to create instances of
		 * a service, factory, or controller.
		 *
		 * @constructor
		 */
		var AdminDashboardController = function($scope, $q, $location, $rootScope, $log ,$http)
		{

			$log.info("$rootScope.userRoles...."+$rootScope.userRoles);

			var userRoles = app.retrieveFromLocalStorage(constants.USER_ROLES);

			//to refresh app on switching to sales Admin
			if(app.retrieveFromLocalStorage(constants.RELOAD_COUNT) == 1){
				window.location.reload();
			}else{
				app.setInLocalStorage(constants.SWITCH_USER, null);
				app.setInLocalStorage(constants.RELOAD_COUNT, null);
			}

			if(userRoles.indexOf(constants.ROLE_SALES_ADMIN) != -1 && userRoles.indexOf(constants.ROLE_SUPER_ADMIN) != -1){
				$scope.showGoToSalesAdmin = true;
			}
			//  app.setInLocalStorage(constants.SWITCH_USER,null);
			$scope.gotoSalesAdmin = function(){
				app.setInLocalStorage(constants.SWITCH_USER, constants.TO_SALES_ADMIN);
				// $location.path('/switchUser/'+constants.TO_SALES_ADMIN);
				$location.path('/swUser');
			};

			if($location.path() == "/dashboard"){
				//alert("dashboard");http://localhost:8080/mybkr-ws/services/order/getDashBoardData
				$scope.months = [];
				$scope.retail = [];
				$scope.wholesale = [];

				$scope.fetchChart = function(){
					$scope.chartConfig = {
							title: {
								text: ""
							},

							options: {
								chart: {
									type: 'column'
								},
								plotOptions: {
									
		                            series: {
		                              stacking: ''
		                            },
		                            column: {
						                pointPadding: 0.0,
						                borderWidth: 0
						            }
		                          },
								legend: {
									layout: 'vertical',
									align: 'topright',
									verticalAlign: 'top',
									borderWidth: 0
								}
							},
							xAxis: {
								categories: $scope.months
							},
							//adding y axis 
							yAxis: {
					            min: 0,
					            title: {
					                text: 'Number of Orders'
					            }
					        },
							credits: {
								enabled: true
							},
							series: [{
								name: 'Retail',
								data: $scope.retail//[5,3,8,6]//$scope.retail//JSON.parse([angular.fromJson($scope.wholesale)])//[angular.fromJson($scope.wholesale)]//$scope.retail //[250,500,1500,1800]//$scope.retail
							},
							{
								name: 'Wholesale',
								data: $scope.wholesale//[9,1,5,4]//$scope.wholesale//[7,8,2,1]//$scope.wholesale
							}
							],

							loading: false
					};
				};
				
				
				var dashboard_url=constants.API_URL+constants.ORDERS+"/"+constants.GET_DASHBOARD_DATA;
				$http.get(dashboard_url).success(function(response) {
					$scope.data = angular.fromJson(response);
					$log.info("$scope.data==============> "+JSON.stringify($scope.data));
					$scope.comlete = false;
					var count=0;
					for(var i = 0; i < $scope.data.length; i++){
						count++;
						$scope.months.push($scope.data[i].month);
						
						//pushing only numbers into corresponding arrays  
						if(angular.isNumber($scope.data[i].retail))
						{
							$scope.retail.push($scope.data[i].retail);
						}else{
							$scope.retail.push(+$scope.data[i].retail);
						}
						if(angular.isNumber($scope.data[i].wholesale))
						{
							$scope.wholesale.push($scope.data[i].wholesale);
						}else{
							$scope.wholesale.push(+$scope.data[i].wholesale);
						}
							
						
						if(count == $scope.data.length){
							$scope.fetchChart();
							$scope.comlete = true;
						}
					}
					
					$scope.toggleHighCharts = function () {
						this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks;
					};

					
					$scope.$watch("comlete",function(){
						//alert(JSON.stringify($scope.months)+"---"+JSON.stringify($scope.retail)+"=-=--"+JSON.stringify($scope.wholesale));
	       			  },true);

					$scope.reflow = function () {
						$scope.$broadcast('highchartsng.reflow');
					};

				});

				$scope.chartTypes = [
				                     {"id": "line", "title": "Line"},
				                     {"id": "spline", "title": "Smooth line"},
				                     {"id": "area", "title": "Area"},
				                     {"id": "areaspline", "title": "Smooth area"},
				                     {"id": "column", "title": "Column"},
				                     {"id": "bar", "title": "Bar"},
				                     {"id": "pie", "title": "Pie"},
				                     {"id": "scatter", "title": "Scatter"}
				                     ];

				$scope.dashStyles = [
				                     {"id": "Solid", "title": "Solid"},
				                     {"id": "ShortDash", "title": "ShortDash"},
				                     {"id": "ShortDot", "title": "ShortDot"},
				                     {"id": "ShortDashDot", "title": "ShortDashDot"},
				                     {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
				                     {"id": "Dot", "title": "Dot"},
				                     {"id": "Dash", "title": "Dash"},
				                     {"id": "LongDash", "title": "LongDash"},
				                     {"id": "DashDot", "title": "DashDot"},
				                     {"id": "LongDashDot", "title": "LongDashDot"},
				                     {"id": "LongDashDotDot", "title": "LongDashDotDot"}
				                     ];

				$scope.chartSeries = [
				                      {"name": "Retail", "data": $scope.retail, type: "column"},
				                      {"name": "Wholesale", "data": $scope.wholesale, type: "column"}
				                      ];

			}


		};

		// Register as global constructor function

		return [ "$scope", "$q", "$location","$rootScope","$log", "$http", AdminDashboardController ];

			});


}( define ));
