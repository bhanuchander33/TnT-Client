define(function() {
	"use strict";

	var properties = {

		'API_URL':"http://localhost:8090/",

		// Image uploads path
		"UPLOADS_PATH" : "./client/assets/uploads/",


		// Define the Consume part of url here
		'REGIONAL_RESOURCE' : 'regionalResource',
		'BRANCH_RESOURCE' : 'branchResource',
		'CLASS_BRANCH_MAP_RESOURCE' : 'classBranchMapResource',
		'CLASS_SECTION_MAP_RESOURCE' : 'classSectionMapResource',

		// Define the action part of url here
		'GETALLCATEGORIES' : 'getAllCategories',
		'GETALL_BRANCH_MASTERS' : 'getAllBranchMasters',
		'GETALL_REGIONAL_MASTERS' : '/getAllRegionalMasters',
		'GETALL_CLASS_BRANCH_MAP' : '/getAllClassBranchMaps',
		'DELETE_CLASS_BRANCH_MAP' : '/deleteClassBranchMapById',
		'GETALL_CLASS_SECTION_MAPS' :'getAllClassSectionMaps',
		
		
		// Define the other constants here
		'CONSUME_USER' : "user",

		'ROLE_SALES_ADMIN' : "SalesAdmin",
		'ROLE_SUPER_ADMIN' : "SuperAdmin",
		'ROLES_SUPER_SALES_ADMIN' : "SalesAndSuperAdmin",

		'SWITCH_USER' : 'switchUser',
		'TO_SALES_ADMIN' : 'toSalesAdmin',
		'TO_SUPER_ADMIN' : 'toSuperAdmin',
		'RELOAD_COUNT' : 'reloadCount',
		'USERID' : 'userId',
		'USER_NAME' : 'userName',
		'CURRENT_ROLE' : 'currentRole',
		'USER_ROLES' : 'userRoles',
		
		'REGION_ID' : 'regionId',
		'BRANCH_ID' : 'branchId',
		
		'SUCCESS':'Success',
		

	/* variables used in root scope */
	// imageUploaded
	// fileElement
	//
	// productObj
	// userRoles
	};

	return properties;

});