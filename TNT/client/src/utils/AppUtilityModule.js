/**
 * ******************************************************************************************************
 *
 *   
 *
 *  @author     vishal
 *  @date       December 2013
 *
 * ******************************************************************************************************
 */

(function ( define, angular ) {
    "use strict";

    define([
            'utils/constants'
        ],
        function ( constants  )
        {
            var moduleName = "mybkr.utility", app = null;

            app = angular
                	.module( moduleName, ['angularFileUpload' ] );
                
                app.directive('ckEditor', function() {
    		return {
    			require: '?ngModel',
    			link: function(scope, elm, attr, ngModel) {
    				var ck = CKEDITOR.replace(elm[0]);

    				if (!ngModel) return;

    				ck.on('instanceReady', function() {
    					ck.setData(ngModel.$viewValue);
    				});

    				function updateModel() {
    					scope.$apply(function() {
    						ngModel.$setViewValue(ck.getData());
    					});
    				}

    				ck.on('change', updateModel);
    				ck.on('key', updateModel);
    				ck.on('dataReady', updateModel);

    				ngModel.$render = function(value) {
    					ck.setData(ngModel.$viewValue);
    				};
    			}
    		};
    	});
                
                app.directive('ngThumb', ['$window', function($window) {
                    var helper = {
                            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
                            isFile: function(item) {
                                return angular.isObject(item) && item instanceof $window.File;
                            },
                            isImage: function(file) {
                                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                            }
                        };

                        return {
                            restrict: 'A',
                            template: '<canvas/>',
                            link: function(scope, element, attributes) {
                                if (!helper.support) return;
                                var params = scope.$eval(attributes.ngThumb);

                                if (!helper.isFile(params.file)) return;
                                if (!helper.isImage(params.file)) return;

                                var canvas = element.find('canvas');
                                var reader = new FileReader();

                                reader.onload = onLoadFile;
                                reader.readAsDataURL(params.file);

                                function onLoadFile(event) {
                                    var img = new Image();
                                    img.onload = onLoadImage;
                                    img.src = event.target.result;
                                }

                                function onLoadImage() {
                                    var width = params.width || this.width / this.height * params.height;
                                    var height = params.height || this.height / this.width * params.width;
                                    canvas.attr({ width: width, height: height });
                                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                                }
                            }
                        };
                    }]);     
                
                
                app.directive('file',['$rootScope', function($rootScope) {
                    return {
                        restrict: 'E',
                        template: '<input ng-file-select type="file" />',
                        replace: true,
                        require: 'ngModel',
                        link: function(scope, element, attr, ctrl) {
                            var listener = function() {
                                scope.$apply(function() {
                                    attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                                    if(element[0].files[0] != null){
                                    	
                                    	
                                    	var imgSrc = constants.UPLOADS_PATH + element[0].files[0].name;
                                    	
                                    	//alert($(element).attr('id'));
                                    	$rootScope.fileElement = element;
                                    	$rootScope.thumbElement = '<img src="'+imgSrc+'" height="60" width="50" />';
                                    	
                                    }
                                });
                            }
                            element.bind('change', listener);
                        }
                    }
                }]);
                

            return moduleName;
        });


}( define, angular ));

