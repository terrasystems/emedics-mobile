'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('tasksCtrl', function (alertService,$translate,$state,$scope,localStorageService,http) {

		var vm = this;
		console.log("TasksCTRL");
		vm.user = localStorageService.get('userData');
		vm.page = {};
		vm.tasks = [];
		vm.history = [];
		vm.showFilter = true;
		vm.showFilterH = true;

		vm.filterModel = { period: 4, fromName: '', patientName: '', templateName: '' };
		vm.filterModelH= { period: 4, fromName: '', patientName: '', templateName: '' };

		if (vm.user.type === 'patient') {
			vm.filterModel.period = 4;
			vm.filterModelH.period = 4;
		}
		//$scope.$watch('vm.filterModel.period', function (newValue) {
		//	vm.onRefreshNew();
		//});

		//$scope.$watch('vm.filterModelH.period', function (newValue) {
		//	vm.onRefreshHistory();
		//});
		vm.onClickNew = function (index) {
			$state.go('tab.tasksedit', {id: index, type: 'tasks', patId: null});
		};
		//vm.onClearFilters = function() {
		//	vm.filterModel = { period: 1, fromName: null, patientName: null, templateName: null };
		//};

		//vm.onApplyFilters = function() {
		//	vm.onRefreshNew();
		//};

		vm.GetAllTasks = function() {
			http.post('private/dashboard/tasks/all',vm.filterModel)
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


		vm.CreateTask=function(){
			alertService.showPopap('','','dashboard/views/popups/CreateTask.html');
			//$ionicModal.fromTemplateUrl('dashboard/views/popups/CreateTask.html', {
			//	scope: $scope
			//});
		};

		vm.convertDateTime = function (d) {
			var y = new Date(d);
			return y.toLocaleString().replace(',', ' / ');
		};
	});

