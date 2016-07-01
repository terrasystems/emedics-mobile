'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('tasksCtrl', function ($state,$scope,localStorageService,http) {

		var vm = this;
		console.log("TasksCTRL");
		vm.user = localStorageService.get('userData');
		vm.page = {};
		vm.tasks = [];
		vm.history = [];

		vm.onClickNew = function (index) {
			$state.go('tab.tasksedit', {id: index, type: 'tasks', patId: null});
		};
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

		//vm.onRefreshNew = function() {
		//	var params = {
		//		period: null,
		//		templateName: null,
		//		patientName: null,
		//		fromName: null
		//	};
		//	http.post('private/dashboard/tasks/all', params)
		//		.then(function (res) {
		//			//blockUI.stop();
		//			if (res.result) {
		//				vm.tasks = res.result;
		//			}
		//		});
		//};
		//vm.onRefreshNew();
	});

