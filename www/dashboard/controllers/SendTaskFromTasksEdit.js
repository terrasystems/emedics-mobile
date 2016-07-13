'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('SendTaskCTRL', function (http, $stateParams, alertService, localStorageService, $rootScope, $state) {
		console.log('SendTasksTab');
		var vm = this;
		vm.user = localStorageService.get('userData');
		vm.patients = [];
		vm.clickedValueModel = '';
		vm.removedValueModel = '';
		vm.message = {toUser: null, event: $stateParams.templates, message: '', patient: null};


		vm.find = function (query, type) {
			return http.post('private/dashboard/' + vm.user.type + '/references/refs', {search: query, type: type})
				.then(function (res) {
					//if (angular.isArray(res.result) && res.result.length > 0) {
					//	res.result.map(function (item) {
					//		item.all = item.name + ',' + item.email + ( (item.type == null) ? '' : ', ' + item.type);
					//		return item;
					//	});
					//}
					if (res) {
						vm.patients = res.result;
						return {patients: vm.patients};

					}
				});


		};


		vm.itemsClicked = function (callback) {
			vm.clickedValueModel = callback;

		};
		vm.itemsRemoved = function (callback) {
			vm.removedValueModel = callback;


		};
		vm.send = function () {
			console.log(vm.message);
			vm.message.patient = vm.message.patient[0].id;
			vm.message.toUser = vm.message.toUser[0].id;
			if ($rootScope.offlineState) {
				vm.message.task = $stateParams.task;
			}

			http.post('private/dashboard/tasks/send', vm.message)
				.then(function (res) {
					if (res.state) {
						alertService.showAlert(res.state.message);
						$state.go('tab.sub.tasks');
					}

				});

		};

	});
