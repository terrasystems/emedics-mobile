'use strict';
/*jshint -W117, -W097, -W116*/

angular.module('core.dashboard')

	.controller('modalSendTaskMultiCtrl', function ($translate, $stateParams, $log, $scope, alertService, http) {
		var vm = this;
		vm.message = {template: $stateParams.templates.id, message: '', patients: [], assignAll: false};

		//vm.user = localStorageService.get('userData');
		//vm.message = { message: '', patients:[], assignAll: false};
		vm.patients = [];
		vm.clickedValueModel = '';
		vm.removedValueModel = '';

		vm.getTestItems = function (query) {
			return http.post('private/dashboard/patients', {name: query})
				.then(function (res) {
					if (angular.isArray(res.result) && res.result.length > 0) {
						res.result.unshift({name: 'Send to all PATIENTS', email: '', id: 'ALL'});
					}
					if (res) {
						vm.patients = res.result;
						return {patients: vm.patients};

					}

				});


		};


		vm.itemsClicked = function (callback) {
			if (callback.item.id === 'ALL') {
				vm.message.patients = ['ALL'];
				vm.message.assignAll = true;
			}
			vm.clickedValueModel = callback;

		};
		vm.itemsRemoved = function (callback) {
			if (callback.item.id === 'ALL') {
				vm.message.assignAll = false;
			}
			vm.removedValueModel = callback;


		};

		vm.onSend = function () {
			if (vm.message.assignAll === true) {
				vm.message.patients = [];
			}
			http.post('private/dashboard/tasks/multipleCreate', vm.message)
				.then(function (res) {
					//blockUI.stop();
					if (res.state) {
						alertService.showAlert(res.state.message);
					}
				}, function (error) {
					alertService.showAlert(error);
				});
		};

	});
