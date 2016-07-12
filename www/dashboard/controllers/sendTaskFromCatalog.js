'use strict';
/*jshint -W117, -W097, -W116*/

angular.module('core.dashboard')

	.controller('modalSendTaskMultiCtrl', function ($translate, $stateParams, $log, $scope, alertService, http) {
		var vm = this;
		vm.message = {template: $stateParams.templates.id, message: '', patients: [], assignAll: false};

		//vm.user = localStorageService.get('userData');
		//vm.message = { message: '', patients:[], assignAll: false};
		vm.patients = [];


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


		$scope.itemsClicked = function (callback) {
			if (callback.item.id === 'ALL') {
				vm.message.patients = ['ALL'];
				vm.message.assignAll = true;
			}
			$scope.clickedValueModel = callback;

		};
		$scope.itemsRemoved = function (callback) {
			if (callback.item.id === 'ALL') {
				vm.message.assignAll = false;
			}
			$scope.removedValueModel = callback;


		};

		//vm.model = model;
		//vm.user = localStorageService.get('userData');
		//vm.message = {template: model.data.template_id, message: '', patients:[], assignAll: false};
		//vm.patients = [];
		//
		//vm.getFindUsers = function (val) {
		//	if  (val==='') { return []; }
		//	return http.post('private/dashboard/patients', {name: val})
		//		.then(function (res) {
		//			//blockUI.stop();
		//			if  (angular.isArray(res.result) && res.result.length>0) {
		//				res.result.unshift( { name: '<< To ALL PATIENTS >>', email: '', id: 'ALL' } );
		//			}
		//			vm.patients = res.result;
		//			return res.result;
		//		});
		//};
		//
		//vm.onSelectCallback = function (item, model) {
		//	if (model === 'ALL') {
		//		vm.message.patients = ['ALL'];
		//		vm.message.assignAll = true;
		//	}
		//};
		//
		//vm.onRemoveCallback= function (item, model) {
		//	if (model === 'ALL') {
		//		vm.message.assignAll = false;
		//	}
		//};
		//
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
					//$uibModalInstance.close(res);
				}, function (error) {
					alertService.showAlert(error);
					//$uibModalInstance.close(error);
					//deferred.reject(error);
				});
		};

	});
