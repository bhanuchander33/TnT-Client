
define([
        'utils/constants'
        ],
        function (Constants) {
	"use strict";
	return {

		getUrl: function(consume, params, action) {
			var requestUrl = Constants.API_URL;
			requestUrl += consume;
			requestUrl = (action != null) ? (requestUrl + "/" + action) : requestUrl; 
            requestUrl = this.getQueryParamURL(requestUrl,params);
            return requestUrl;
		},
        
		//params should be object of type {key1:value1,key2:value2, key3:value3}
		getQueryParamURL : function(requestUrl,params){
			var startQuery = true;
			//if(params.length > 0){
				for (var p in params) {
					requestUrl += startQuery ? '?' : '&';
					requestUrl += encodeURIComponent(p) + "=" + encodeURIComponent(params[p]);
					startQuery = false;
				}
			//}
			return requestUrl;
		},

		
		getConstantValueForKey: function(key)    {
			return Constants[key];
		},
		
		setInLocalStorage : function(key , value) {
			// Check browser support
			if (typeof(Storage) != "undefined")
			{
				// Store
				localStorage.setItem(key , value);
			}
			else
			{
				alert("Sorry, your browser does not support Web Storage...");
			}
		},

		retrieveFromLocalStorage : function(key){
			return localStorage.getItem(key);
		},

		clearLocalStorage : function(){
			localStorage.clear();
		},
		
		trimAndToLowerCase : function(str){
			var dataStr = str;
			if(str != "" && typeof str != "undefined" && str != null){
				dataStr = (str.replace(/\s/g, '')).toLowerCase();
			}
			
			return dataStr;
		},

		 convertDate :function(inputtext) {
             if (inputtext.charAt(inputtext.length - 1) == "L") {
                 inputtext = inputtext.slice(0, -1);
             }
             inputtext = inputtext * 1;
             var extraInfo = 0;
             if (inputtext >= 100000000000000) {
                 inputtext = Math.round(inputtext / 1000);
             } else if (inputtext >= 100000000000) {
             } else {
                 if (inputtext > 10000000000) extraInfo = 1;
                 inputtext = (inputtext * 1000);
             }
             var datum = new Date(inputtext);
             if (this.isValidDate(datum)) {
            	 return datum.toLocaleString();
             } else {
            	 return "Invalid date";
             }
            //document.getElementById('result1').innerHTML = outputtext;
         },
         isValidDate:function(d) {
        	    if (Object.prototype.toString.call(d) !== "[object Date]")
        	        return false;
        	    return !isNaN(d.getTime());
        	},

    		formatMysqlDateTime : function (mysqlDate)
            {
        		var t = mysqlDate.split(/[- :]/);
    			// Apply each element to the Date function
    			//var date = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
    			return t[0] + "-" + t[1] + "-" + t[2] + " " +  t[3] + ":" + t[4]+ ":00";
            },
            getDaysBetweenDates: function(newDate, oldDate){
            	//Get 1 day in milliseconds
            	  var one_day=1000*60*60*24;
            	  newDate.setHours(0);
            	  newDate.setMinutes(0);
            	  newDate.setSeconds(0);
            	  
            	  oldDate.setHours(0);
            	  oldDate.setMinutes(0);
            	  oldDate.setSeconds(0);
            	  // Convert both dates to milliseconds
            	  var date1_ms = oldDate.getTime();
            	  var date2_ms = newDate.getTime();
            	  
            	  // Calculate the difference in milliseconds
            	  var difference_ms = date2_ms - date1_ms;
            	    
            	  // Convert back to days and return
            	  return Math.round(difference_ms/one_day); 
            },
            
            getDateStrIn_ddMMMyyyyFormat : function(dateObj, seperator){
            	
            	var day = dateObj.getDate(),
            	    month = dateObj.getMonth(),
            	    year = dateObj.getFullYear(),
            	    dateStr = "";
            	
            	    var monthNamesArray = [];
            	    	monthNamesArray[0] = "Jan";
            	    	monthNamesArray[1] = "Feb";
            	    	monthNamesArray[2] = "Mar";
            	    	monthNamesArray[3] = "Apr";
            	    	monthNamesArray[4] = "May";
            	    	monthNamesArray[5] = "Jun";
            	    	monthNamesArray[6] = "Jul";
            	    	monthNamesArray[7] = "Aug";
            	    	monthNamesArray[8] = "Sep";
            	    	monthNamesArray[9] = "Oct";
            	    	monthNamesArray[10] = "Nov";
            	    	monthNamesArray[11] = "Dec";
            	    
            	    dateStr = day +""+seperator + monthNamesArray[month] + seperator + year;
            	    
            	return dateStr;
            }
	};
});
