'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('tasksCtrl', function ($scope,localStorageService,http) {

		var vm = this;
		console.log("TasksCTRL");
		vm.user = localStorageService.get('userData');
		vm.page = {};
		vm.tasks = [];
		vm.history = [];


		vm.GetAllTasks = function() {
			http.get('private/dashboard/tasks/all')
				.then(function (res) {
					//blockUI.stop();
					if (res.result) {
						vm.tasks = res.result;
					}
				});
		};
		vm.GetAllTasks();
		//$scope.items = [
		//	{ id: 0,
		//	  name:'Doctor Form'
		//	},
		//	{ id: 1,
		//		name:'Doctor Form' },
		//	{ id: 2,
		//		name:'Doctor Form' },
		//	{ id: 3,
		//		name:'Doctor Form' },
		//	{ id: 4,
		//		name:'Doctor Form' },
		//	{ id: 5,
		//		name:'Doctor Form' },
		//	{ id: 6,
		//		name:'Doctor Form' },
		//	{ id: 7,
		//		name:'Doctor Form' },
		//	{ id: 8,
		//		name:'Doctor Form' },
		//	{ id: 9,
		//		name:'Doctor Form' },
		//	{ id: 10,
		//		name:'Doctor Form' },
		//	{ id: 2,
		//		name:'Doctor Form' },
		//	{ id: 3,
		//		name:'Doctor Form' },
		//	{ id: 4,
		//		name:'Doctor Form' },
		//	{ id: 5,
		//		name:'Doctor Form' },
		//	{ id: 6,
		//		name:'Doctor Form' },
		//	{ id: 7,
		//		name:'Doctor Form' },
		//	{ id: 8,
		//		name:'Doctor Form' },
		//	{ id: 9,
		//		name:'Doctor Form' },
		//	{ id: 10,
		//		name:'Doctor Form' }
		//];
	});

