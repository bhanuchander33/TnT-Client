/*
 Reorderablr row plugin
 */

function ngGridReorderable(propertyName) {
    var self = this;
    self.$scope = null;
    self.myGrid = null;
    
    // The init method gets called during the ng-grid directive execution.
    self.init = function (scope, grid, services) {
        // The directive passes in the grid scope and the grid object which we will want to save for manipulation later.
        self.$scope = scope;
        self.myGrid = grid;
        self.services = services;
        // In this example we want to assign grid events.
        self.assignEvents();
    };
    self.colToMove = undefined;
    self.groupToMove = undefined;
    self.assignEvents = function () {
        // Here we set the onmousedown event handler to the header container.
        self.myGrid.$viewport.on('mousedown', self.onRowMouseDown).on('dragover', self.dragOver).on('drop', self.onRowDrop);
    };
    // Row functions
    self.onRowMouseDown = function (event) {
        // Get the closest row element from where we clicked.
        var targetRow = $(event.target).closest('.ngRow');
        // Get the scope from the row element
        var rowScope = angular.element(targetRow).scope();
        if (rowScope) {
            // set draggable events
            targetRow.attr('draggable', 'true');
            // Save the row for later.
            self.services.DomUtilityService.eventStorage.rowToMove = { targetRow: targetRow, scope: rowScope };
        }
    };
    self.onRowDrop = function (event) {
        // Get the closest row to where we dropped
        var targetRow = $(event.target).closest('.ngRow');
        // Get the scope from the row element.
        var rowScope = angular.element(targetRow).scope();
        if (rowScope) {
            // If we have the same Row, do nothing.
            var prevRow = self.services.DomUtilityService.eventStorage.rowToMove;
            if (prevRow.scope.row === rowScope.row) {
                return;
            }
            //console.log("prevRow.scope.row ==> "+prevRow.scope.row.entity.name+ " rowScope.row ===> "+rowScope.row.entity.name);
            self.changeRowOrder(prevRow.scope.row, rowScope.row);
            self.myGrid.searchProvider.evalFilter();
            
            if(propertyName != null && typeof propertyName != 'undefined' && propertyName.length > 0){
            	self.assignRowIndexOnProperty(propertyName);
            }
            
            
            // clear out the rowToMove object
            self.services.DomUtilityService.eventStorage.rowToMove = undefined;
            // if there isn't an apply already in progress lets start one
            self.services.DomUtilityService.digest(rowScope.$root);
            //self.$scope.$emit('ngGridEventAssingedIndexToProperty', self.myGrid.rowCache);
        }
    };
    self.changeRowOrder = function (prevRow, targetRow) {
        // Splice the Rows via the actual datasource
        var i = self.myGrid.rowCache.indexOf(prevRow.orig);
        var j = self.myGrid.rowCache.indexOf(targetRow.orig);
        self.myGrid.rowCache.splice(i, 1);
        self.myGrid.rowCache.splice(j, 0, prevRow.orig); 
        self.$scope.$emit('ngGridEventChangeOrder', self.myGrid.rowCache);
    };
    
    self.assignRowIndexOnProperty = function () {
    	//assigning rowIndex value to property to row object in actual datasource 
        for(var obj in self.myGrid.rowCache){
        	// console.log("prod name "+self.myGrid.rowCache[obj].name);
        	for (var prop in self.myGrid.rowCache[obj]) {
        		// console.log("obj.hasOwnProperty(propertyName) "+ obj.hasOwnProperty(propertyName) + " propertyName : "+propertyName);
                if (self.myGrid.rowCache[obj][prop].hasOwnProperty(propertyName)) {
                	//console.log("assigning index on propertyName "+propertyName + " : "+self.myGrid.rowCache.indexOf(self.myGrid.rowCache[obj]));
                	self.myGrid.rowCache[obj][prop][propertyName] = self.myGrid.rowCache.indexOf(self.myGrid.rowCache[obj])+1;
                }
            }
        }
        
      /*  for(ob in self.myGrid){
        	console.log(" key :  "+ob+ " value : "+self.myGrid[ob]);
        } */
        
        self.$scope.$emit('ngGridEventAssingedIndexToProperty', self.myGrid.rowCache);
     
    };
    
    self.dragOver = function (evt) {
        evt.preventDefault();
    };
    
    self.moveRowToFirst = function () {
        // Get the closest row to where we dropped
        var targetRow = $(event.target).first('.ngRow');
        // Get the scope from the row element.
        var rowScope = angular.element(targetRow).scope();
        
        for(var m in self.myGrid.filteredRows[0]){
        	console.log("key ::: "+m+" value +++> "+self.myGrid.filteredRows[0][m]);
        }
        if (rowScope) {
            // If we have the same Row, do nothing.
            var prevRow = self.myGrid.filteredRows[0];//self.services.DomUtilityService.eventStorage.rowToMove;
            
            console.log("prevRow.scope.row ==> "+prevRow.entity.name+ " rowScope.row ===> "+rowScope.row.entity.name);
            if (prevRow === rowScope.row) {
                return;
            }
            
            self.changeRowOrder(prevRow, rowScope.row);
            self.myGrid.searchProvider.evalFilter();
            
            if(propertyName != null && typeof propertyName != 'undefined' && propertyName.length > 0){
            	self.assignRowIndexOnProperty(propertyName);
            }
            
            
            // clear out the rowToMove object
            self.services.DomUtilityService.eventStorage.rowToMove = undefined;
            // if there isn't an apply already in progress lets start one
            self.services.DomUtilityService.digest(rowScope.$root);
            //self.$scope.$emit('ngGridEventAssingedIndexToProperty', self.myGrid.rowCache);
        }
    };
    
	/*$scope.$on('ngGridEventAssingedIndexToProperty', function(rowCache){
		$log.info("changed table order......");
		var firstIdx = $scope.sortGridOptions.ngGrid.rowCache[0].sortOrder;
		for(var k in $scope.sortGridOptions.ngGrid){
			$log.info("key --> "+k+"  val : "+$scope.sortGridOptions.ngGrid);//.rowCache[0][k] +"  name : "+$scope.sortGridOptions.ngGrid.rowCache[0].entity.name);
		}
		//$scope.sortGridOptions.columnDefs[5].sortDirection = 'asc';
		//$scope.sortGridOptions.useExternalSorting = true;
		//$scope.sortGridOptions.sortInfo = {fields : ['sortOrder'], directions : ['asc']};
		//$scope.sortGridOptions.sortBy('sortOrder');
		//$scope.sortGridOptions.sortBy('sortOrder');
		
		//$scope.sortGridOptions.sortBy('sortOrder');
		
		
		
	}); */
    
    
}