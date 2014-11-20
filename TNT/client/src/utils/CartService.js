
(function( define ) {
    "use strict";

    /**
     * Register the CartService 
     */
    define( [ 'utils/supplant',
              'utils/app',
              'utils/constants'], function ( supplant , app , constants)
    {

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
           var CartService = function( $q, $location , $http , $log)
            {
        	   $log = $log.getInstance( "CartService" );
       		   $log.info(" CartService....................... ");
       		   
       		   var cartItems = [],TotalItemsInCart=0 , TotalPrice=0 , ShoppingCartSession = {} , Discount = {} , TotalDiscountAmt = 0 , TotalAmountAfterDiscount = 0;
       		   
       		   
       		    /**
        	    * To add item from cart
        	    */
        	   var addItemToCart = function(cartObj){
        		   
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   //alert("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != "" ){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs.length > 0 && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        			   //alert("in if existing"+cartLength);
        		   }else{
        			   //alert("in else existing");
        			    cartLength = 0;
        		   }
        		   
        		   var count = 0;
        		   $log.info(cartObj.sessionId+"---- add tprodPriceo cart....prodPrice................... "+cartObj.cartVO.prodName);
        		   if(cartLength > 0){
        			   for(var i=0;i<cartLength;i++){
        				   count++;
            			   var item = cartItems[i];
            			   $log.info(cartObj.cartVO.prodId+"--ids----"+item.prodId);
            			   if(parseInt(item.prodId) == parseInt(cartObj.cartVO.prodId) && parseFloat(item.price) == parseFloat(cartObj.cartVO.price)){
            				   item.prodQty = parseInt(item.prodQty)+parseInt(cartObj.cartVO.prodQty);
            				   item.prodPrice = item.prodPrice + cartObj.cartVO.prodPrice;
            				   break;
            			   }else{
            				   if(count == cartLength){
            					   cartItems.push(cartObj.cartVO);
            				   }else{
            					   
            				   }
            			   }
            		   }
        		   }else{
        			   cartItems = [];
        			    cartItems.push(cartObj.cartVO);
        		   }
        		   
        		   ShoppingCartSession.sessionId=cartObj.sessionId;
        		   ShoppingCartSession.cartVOs = cartItems;
        		   $log.info(" ShoppingCartSession ShoppingCartSession ****.................... "+JSON.stringify(ShoppingCartSession));
        		   
        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   		if(localStorage.getItem("cartSessionID") == null || localStorage.getItem("cartSessionID") == ""){
	                   			localStorage.setItem("cartSessionID", ShoppingCartSession.sessionId);
	    	            	}
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   return JSON.stringify(ShoppingCartSession);
        	   };
        	   
        	   
        	   var addItemsListToCart = function(productsList){
        		   
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   $log.info("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != "" ){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs.length > 0 && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        			   //alert("in if existing"+cartLength);
        		   }else{
        			   //alert("in else existing");
        			    cartLength = 0;
        			    cartItems = [];
        		   }
        		   
        		   
        		   for(var k in productsList){
        			   var count = 0;
        			   var cartObj = productsList[k];
            		   $log.info(cartObj.sessionId+"---- add tprodPriceo cart....prodPrice................... "+cartObj.cartVO.prodName);
            		   if(cartLength > 0){
            			   for(var i=0;i<cartLength;i++){
            				   count++;
                			   var item = cartItems[i];
                			   $log.info(cartObj.cartVO.prodId+"--ids----"+item.prodId);
                			   if(cartObj.cartVO.isSample ){
                				   
                				   $log.info("adding  sample item ");
                				   
                				   if((parseInt(item.prodId) == parseInt(cartObj.cartVO.prodId)) && item.isSample 
                						&& parseFloat(item.price) == parseFloat(cartObj.cartVO.price)){
                    				   item.prodQty = parseInt(item.prodQty)+parseInt(cartObj.cartVO.prodQty);
                    				   item.prodPrice = item.prodPrice + cartObj.cartVO.prodPrice;
                    				   break;
                    			   }else{
                    				   if(count == cartLength){
                    					   cartItems.push(cartObj.cartVO);
                    				   }
                    			   }
                			   }
                			   else if((parseInt(item.prodId) == parseInt(cartObj.cartVO.prodId)) && !item.isSample
                					    && parseFloat(item.price) == parseFloat(cartObj.cartVO.price)){
                				   $log.info("adding to not sample item ");
                				   item.prodQty = parseInt(item.prodQty)+parseInt(cartObj.cartVO.prodQty);
                				   item.prodPrice = item.prodPrice + cartObj.cartVO.prodPrice;
                				   break;
                			   }else{
                				   if(count == cartLength){
                					   $log.info("Adding new item");
                					   cartItems.push(cartObj.cartVO);
                				   }
                			   }
                		   }
            		   }else{
            			  
            			    cartItems.push(cartObj.cartVO);
            		   }
            		   
            		   ShoppingCartSession.sessionId = cartObj.sessionId;
        		   }
        		  
        		   
        		  
        		   ShoppingCartSession.cartVOs = cartItems;
        		   $log.info(" ShoppingCartSession ShoppingCartSession ****.................... "+JSON.stringify(ShoppingCartSession));
        		   
        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   		if(localStorage.getItem("cartSessionID") == null || localStorage.getItem("cartSessionID") == ""){
	                   			localStorage.setItem("cartSessionID", ShoppingCartSession.sessionId);
	    	            	}
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   return JSON.stringify(ShoppingCartSession);
        	   };
        	   
        	   /**
        	    * To remove item from cart
        	    */
        	   var removeItemFromCart = function(prodId){
        		   $log.info(" remove from cart....................... "+prodId);
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   $log.info(" removeItemFromCart.. existingSessionData...111.............. "+JSON.stringify(existingSessionData));
        		   //alert("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != ""){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        		   }else{
        			    cartLength = 0;
        		   }
        		   
        		   for(var i=0;i<cartLength;i++){
        			   var cartOb = cartItems[i];
        			   if(cartOb.prodId == prodId){
        				   //remove from cart
        				   cartItems.splice(i,1);
        				   break;
        			   }else{
        				   //nothing
        			   }
        		   }
        		   
        		   $log.info(" removeItemFromCart.. existingSessionData.2222................ "+JSON.stringify(existingSessionData));
        		   ShoppingCartSession.sessionId = existingSessionData.sessionId;
        		   ShoppingCartSession.cartVOs = cartItems;
        		   ShoppingCartSession.discount = existingSessionData.discount;
        		   ShoppingCartSession.percent = existingSessionData.percent;
        		   ShoppingCartSession.appliedDiscount = existingSessionData.appliedDiscount;
        		   ShoppingCartSession.couponUsed = existingSessionData.couponUsed;
        		   $log.info(" removeItemFromCart.....ShoppingCartSession.............. "+JSON.stringify(ShoppingCartSession));

        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   //alert("just above remove-->"+JSON.stringify(ShoppingCartSession));
   				   return JSON.stringify(ShoppingCartSession);
        		   
        	   };
        	   
        	   /**
        	    * To get items from cart
        	    */
        	   var getItemsFromCart = function(){
        		   $log.info(" BaggetCartItemsItems--ssss->>> ....................... "+localStorage.getItem("cartSessionID"));
        		   var fetchCartURL = constants.API_URL+constants.AUTH_USERS+"/"+constants.GET_SHOP_CART+"?sessionID="+localStorage.getItem("cartSessionID");
        		   $.ajaxSetup({ "async": false });
        		   if(localStorage.getItem("cartSessionID") != undefined && localStorage.getItem("cartSessionID") != null && localStorage.getItem("cartSessionID") != ""){
                       $.ajax({
                           type: "GET",
                           url: fetchCartURL,
                           contentType: "application/json; charset=utf-8",
                           dataType: "json",
                           success: function (response) {
                			   ShoppingCartSession=angular.fromJson(response);
                			   cartItems = ShoppingCartSession.cartVOs;
                           },
                           error: function (XMLHttpRequest, textStatus, errorThrown) {
                               alert(XMLHttpRequest + "--textStatus--" + textStatus + "--ererrorThrown->" + errorThrown);
                           }
                       });
        		   }else{
        			   ShoppingCartSession = {};
        		   }
        		   $.ajaxSetup({ "async": true });
        		  // alert("lastone -- >>"+JSON.stringify(ShoppingCartSession));
        		   return JSON.stringify(ShoppingCartSession);
        	   };
        	   
        	   /**
        	    * To get total items in a bag
        	    */
        	   var getTotalItemsInBag = function(){
        		   if(localStorage.getItem("cartSessionID") != undefined && localStorage.getItem("cartSessionID") != null && localStorage.getItem("cartSessionID") != ""){
	        		   $log.info(" get BagItems--->>...................... "+ShoppingCartSession.cartVOs.length);
	        		   return ShoppingCartSession.cartVOs.length;
        		   }else{
        			   return 0;
        		   }
        	   };
        	   
        	   /**
        	    * To get total price 
        	    */
        	   var getTotalPrice = function(){
        		   if(localStorage.getItem("cartSessionID") != undefined && localStorage.getItem("cartSessionID") != null && localStorage.getItem("cartSessionID") != ""){
        			   $log.info(" get getTotalAmount--->>...................... "+ShoppingCartSession.cartVOs.length);
            		   var totalPrice = 0;
            		   for(var i=0;i<ShoppingCartSession.cartVOs.length;i++){
            			   var cartOb = ShoppingCartSession.cartVOs[i];
            			   totalPrice = totalPrice+cartOb.prodPrice;
            		   }
            		   $log.info(" get getTotalAmount- totalPrice-->>...................... "+totalPrice);
        		   }
        		   
        		   return totalPrice;
        	   };
        	   
        	   /**
        	    * To apply discount coupon
        	    */
        	   var applyCoupon = function(couponCode){
        		   var fetchCartURL = constants.API_URL+constants.DISCOUNTS+"/"+constants.APPLYCOUPON+"?couponCode="+couponCode;
        		  // alert("applyCoupon --->"+JSON.stringify(ShoppingCartSession));
        		   var percent_to_deduct = 0;
        		   var amt_to_deduct = 0;
        		   var total_price = getTotalPrice();
        		   $.ajaxSetup({ "async": false });
        		   var amt_aftr_dsct = 0;
        		   
        		   if(couponCode != undefined && couponCode != '' && couponCode!= null){
        			   $.ajax({
                           type: "GET",
                           url: fetchCartURL,
                           contentType: "application/json; charset=utf-8",
                           dataType: "json",
                           success: function (response) {
                        	   var discountObj = angular.fromJson(response);
                			   if(discountObj.percents){
                				   //percentage
                				   percent_to_deduct = parseFloat(discountObj.discValue);
                				   total_price = parseInt(total_price);
                				   TotalDiscountAmt =  ( total_price * (percent_to_deduct /100));
                				   TotalAmountAfterDiscount = total_price - ( total_price * (percent_to_deduct /100));
                				   Discount.totalApplicablePrice = discountObj.discValue;
                				   Discount.TotalAmountAfterDiscount = TotalAmountAfterDiscount;
                				   Discount.TotalDiscountAmt = TotalDiscountAmt;
                				   Discount.couponUsed = couponCode;
                				   Discount.percent = true;
                				   addDiscountToCart(JSON.stringify(Discount),JSON.stringify(ShoppingCartSession));
                			   }else{
                				   //price discount
                				   amt_to_deduct = parseFloat(discountObj.discValue);
                				   total_price = parseInt(total_price);
                				   TotalDiscountAmt = amt_to_deduct;
                				   Discount.totalApplicablePrice = discountObj.discValue;
                				   TotalAmountAfterDiscount = total_price - amt_to_deduct;
                				   Discount.TotalAmountAfterDiscount = TotalAmountAfterDiscount;
                				   Discount.TotalDiscountAmt = TotalDiscountAmt;
                				   Discount.couponUsed = couponCode;
                				   Discount.percent = false;
                				   addDiscountToCart(JSON.stringify(Discount),JSON.stringify(ShoppingCartSession));
                			   }
                           },
                           error: function (XMLHttpRequest, textStatus, errorThrown) {
                               alert("Invalid Coupon");
                               TotalAmountAfterDiscount = getTotalPrice();
                               Discount.TotalAmountAfterDiscount = TotalAmountAfterDiscount;
            				   Discount.TotalDiscountAmt = 0;
                           }
                       });
        		   }else{
        			   alert("Enter Coupon Code");
        			   TotalDiscountAmt = 0;
    				   Discount.totalApplicablePrice = 0;
    				   TotalAmountAfterDiscount = getTotalPrice();
    				   Discount.TotalAmountAfterDiscount = TotalAmountAfterDiscount;
    				   Discount.TotalDiscountAmt = TotalDiscountAmt;
    				   Discount.couponUsed = '';
    				   Discount.percent = false;
    				   addDiscountToCart(JSON.stringify(Discount),JSON.stringify(ShoppingCartSession));
        		   }
        		   
        		  
        		   $.ajaxSetup({ "async": true });
        		   return JSON.stringify(Discount);
        	   };
        	   
        	   /**
        	    * For adding discount details to session
        	    */
        	   var addDiscountToCart = function(dsct,cartObject){
        		   dsct = angular.fromJson(dsct);
        		   cartObject = angular.fromJson(cartObject);
        		   $.ajaxSetup({ "async": false });
        		   //ShoppingCartSession = angular.fromJson(getItemsFromCart());
        		   //alert("add dicount to cart --->"+JSON.stringify(cartObject));
        		   var sessionNewObj = {};       
        		   sessionNewObj.sessionId=cartObject.sessionId;
        		   sessionNewObj.cartVOs = cartObject.cartVOs;
        		   sessionNewObj.percent = dsct.percent;
        		   sessionNewObj.discount = dsct.totalApplicablePrice;
        		   sessionNewObj.appliedDiscount = dsct.TotalDiscountAmt;
        		   sessionNewObj.couponUsed = dsct.couponUsed;
        		   //alert("3--"+JSON.stringify(sessionNewObj));
        		   
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(sessionNewObj) }).
	                   success(function(data, status, headers, config) {
	                   		//alert("sccss---->>>"+JSON.stringify(data));
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
        		   
        	   };
        	   
        	   var emptyCart = function(){
        		   //add service for saving to session
        		   var cartObj = {};
        		   var emptyCartVO = [];
        		   cartObj.sessionId = localStorage.getItem("cartSessionID") ;
        		   cartObj.cartVOs = emptyCartVO;
        		   $.ajaxSetup({ "async": false });
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(cartObj) }).
	                   success(function(data, status, headers, config) {
	                	   //alert(JSON.stringify(data));
	                	   localStorage.removeItem("cartSessionID");
	                   }).
	                   error(function(data, status, headers, config) {
	                     localStorage.removeItem("cartSessionID");
	                   });
   				   $.ajaxSetup({ "async": true });
        	   };
        	   
        	   
        	   /**
        	    * To update item in cart
        	    */
        	   var updateItemsInCart = function(cartObj){
        		   
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   //alert("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   //var items = [];
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != ""){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        		   }else{
        			    cartLength = 0;
        		   }
        		   //alert("cartLength-->"+cartLength);
        		   var count = 0;
        		   $log.info(cartObj.sessionId+"---- add tprodPriceo cart....prodPrice................... "+cartObj.cartVO.prodName);
        		   if(cartLength > 0){
        			   for(var i=0;i<cartLength;i++){
        				   count++;
            			   var item = cartItems[i];
            			   $log.info(cartObj.cartVO.prodId+"--ids----"+item.prodId);
            			   if(parseInt(item.prodId) == parseInt(cartObj.cartVO.prodId)){
            				   $log.info("--ids matched----"+item.prodId);
            				   item.prodQty = parseInt(cartObj.cartVO.prodQty);
            				   item.prodPrice = item.prodQty * item.price;
            				   break;
            			   }else{
            				   $log.info("--ids not matched----"+item.prodId);
            			   }
            		   }
        		   }
        		   /*else{
        			    cartItems.push(cartObj.cartVO);
        		   }*/
        		   
        		   ShoppingCartSession.sessionId=cartObj.sessionId;
        		   ShoppingCartSession.cartVOs = cartItems;
        		   $log.info(" ShoppingCartSession ShoppingCartSession ****.................... "+JSON.stringify(ShoppingCartSession));
        		   
        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   		if(localStorage.getItem("cartSessionID") == null || localStorage.getItem("cartSessionID") == ""){
	                   			localStorage.setItem("cartSessionID", ShoppingCartSession.sessionId);
	    	            	}
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   return JSON.stringify(ShoppingCartSession);
        	   };
        	   
        	   
        	   /**
        	    * To update all item in cart
        	    */
        	   var updateAllItemsInCart = function(shoppingCartData){
        		   
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   //alert("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   //var items = [];
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != ""){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        		   }else{
        			    cartLength = 0;
        		   }
        		   //alert("cartLength-->"+cartLength);
        		   var count = 0;
        		  
        		   
        		   for(var k in shoppingCartData.cartVOs){
        			   var cartVO = shoppingCartData.cartVOs[k];
        			   
        			   $log.info(cartVO.sessionId+"---- add tprodPriceo cart....prodPrice................... "+cartVO.prodName);
        			   
        			   if(cartLength > 0){
            			   for(var i=0;i<cartLength;i++){
            				   count++;
                			   var item = cartItems[i];
                			   $log.info(cartVO.prodId+"--ids----"+item.prodId);
                			   
                			   if(cartVO.isSample){
                				   
                				   if(parseInt(item.prodId) == parseInt(cartVO.prodId) && item.isSample){
                    				   $log.info("--ids matched----"+item.prodId);
                    				   item.prodQty = parseInt(cartVO.prodQty);
                    				   item.price = cartVO.price;
                    				   item.prodPrice = item.prodQty * item.price;
                    				   break;
                    			   }
                			   
                			   } else if(parseInt(item.prodId) == parseInt(cartVO.prodId) && !item.isSample){
                				   $log.info("--ids matched----"+item.prodId);
                				   item.prodQty = parseInt(cartVO.prodQty);
                				   item.price = cartVO.price;
                				   item.prodPrice = item.prodQty * item.price;
                				   break;
                			   }else{
                				   $log.info("--ids not matched----"+item.prodId);
                			   }
                		   }
            		   }
        		   }
        		   
        		   /*else{
        			    cartItems.push(cartObj.cartVO);
        		   }*/
        		   
        		   ShoppingCartSession.sessionId = cartVO.sessionId;
        		   ShoppingCartSession.cartVOs = cartItems;
        		   $log.info(" ShoppingCartSession ShoppingCartSession ****.................... "+JSON.stringify(ShoppingCartSession));
        		   
        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   		if(localStorage.getItem("cartSessionID") == null || localStorage.getItem("cartSessionID") == ""){
	                   			localStorage.setItem("cartSessionID", ShoppingCartSession.sessionId);
	    	            	}
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   return JSON.stringify(ShoppingCartSession);
        	   };
        	   
        	   
        	   /**
        	    * To remove item from cart
        	    */
        	   var removeProductFromCart = function(prodId, isSampleProduct){
        		   $log.info(" remove from cart....................... "+prodId);
        		   $.ajaxSetup({ "async": false });
        		   var existingSessionData = angular.fromJson(getItemsFromCart());
        		   $log.info(" removeItemFromCart.. existingSessionData...111.............. "+JSON.stringify(existingSessionData));
        		   //alert("existingSessionData-->"+JSON.stringify(existingSessionData));
        		   var cartLength = 0;
        		   if(existingSessionData != undefined && existingSessionData != null && existingSessionData != ""){
        			   if(existingSessionData.cartVOs != undefined && existingSessionData.cartVOs != null && existingSessionData.cartVOs != ""){
        				 cartLength = existingSessionData.cartVOs.length;//cartItems.length;
        				 cartItems = existingSessionData.cartVOs;
        			   }
        		   }else{
        			    cartLength = 0;
        		   }
        		   
        		   for(var i=0;i<cartLength;i++){
        			   var cartOb = cartItems[i];
        			   if(isSampleProduct){
        				   if((cartOb.prodId == prodId) && cartOb.isSample){
            				   //remove from cart
            				   cartItems.splice(i,1);
            				   break;
            			   }
        			   
        			   }else if(cartOb.prodId == prodId){
        				   //remove from cart
        				   cartItems.splice(i,1);
        				   break;
        			   }
        		   }
        		   
        		   $log.info(" removeItemFromCart.. existingSessionData.2222................ "+JSON.stringify(existingSessionData));
        		   ShoppingCartSession.sessionId = existingSessionData.sessionId;
        		   ShoppingCartSession.cartVOs = cartItems;
        		   ShoppingCartSession.discount = existingSessionData.discount;
        		   ShoppingCartSession.percent = existingSessionData.percent;
        		   ShoppingCartSession.appliedDiscount = existingSessionData.appliedDiscount;
        		   ShoppingCartSession.couponUsed = existingSessionData.couponUsed;
        		   $log.info(" removeItemFromCart.....ShoppingCartSession.............. "+JSON.stringify(ShoppingCartSession));

        		   //add service for saving to session
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(ShoppingCartSession) }).
	                   success(function(data, status, headers, config) {
	                   		ShoppingCartSession = angular.fromJson(data);
	                   }).
	                   error(function(data, status, headers, config) {
	                    // or server returns response with an error status.
	                   });
   				   $.ajaxSetup({ "async": true });
   				   //alert("just above remove-->"+JSON.stringify(ShoppingCartSession));
   				   return JSON.stringify(ShoppingCartSession);
        		   
        	   };
        	   
        	   
        	   var emptyCartAfterOrder = function(){
        		   //add service for saving to session
        		   $.ajaxSetup({ "async": false });
        		   var cartObj = {};
        		   var emptyCartVO = [];
        		   cartObj.sessionId = localStorage.getItem("cartSessionID") ;
        		   cartObj.cartVOs = emptyCartVO;
        		   cartObj.email = localStorage.getItem(constants.EMAIL);
        		   cartObj.userName = localStorage.getItem(constants.USER_NAME);
        		   cartObj.roles = localStorage.getItem(constants.USER_ROLES);
        		   cartObj.userId = localStorage.getItem(constants.USER_ID);
        		   cartObj.authUserid = localStorage.getItem(constants.AUTH_USER_ID);
        		   
        		   var saveCartUrl  = constants.API_URL+constants.AUTH_USERS+"/"+constants.SAVE_SHOP_CART;
   				   $http({method: 'POST', url:  saveCartUrl,
      				   data:JSON.stringify(cartObj) }).
	                   success(function(data, status, headers, config) {
	                	   //alert(JSON.stringify(data));
	                	   localStorage.removeItem("cartSessionID");
	                   }).
	                   error(function(data, status, headers, config) {
	                     localStorage.removeItem("cartSessionID");
	                   });
   				   $.ajaxSetup({ "async": true });
        	   };
        	   
        	   
        	   
	           return {
	        	   addToCart : addItemToCart,
	        	   removeFromCart : removeItemFromCart,
	        	   getCartItems : getItemsFromCart,
	        	   BagItems : getTotalItemsInBag,
	        	   getTotalAmount : getTotalPrice,
	        	   validateCoupon : applyCoupon,
	        	   AmountAfterDiscount : TotalAmountAfterDiscount,
	        	   clearCart : emptyCart,
	        	   updateCart : updateItemsInCart,
	        	   addMultipleItemsToCart : addItemsListToCart,
	        	   updateCartItems : updateAllItemsInCart,
	        	    deleteProductFromCart: removeProductFromCart,
	        	    emptyCartAfterOrderPlaced : emptyCartAfterOrder
	           } ;
        	   
            };

        // Register as global constructor function

        return ["$q", "$location", "$http" , "$log" , CartService ];

    });


}( define ));
