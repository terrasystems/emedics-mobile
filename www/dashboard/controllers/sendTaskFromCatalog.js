
'use strict';
/*jshint -W117, -W097, -W116*/

angular.module('core.dashboard')

	.controller('modalSendTaskMultiCtrl', function ( model, blockUI, alertService, http, localStorageService) {
		var vm = this;
		vm.model = model;
		vm.user = localStorageService.get('userData');
		vm.message = {template: model.data.template_id, message: '', patients:[], assignAll: false};
		vm.patients = [];

		vm.getFindUsers = function (val) {
			if  (val==='') { return []; }
			return http.post('private/dashboard/patients', {name: val})
				.then(function (res) {
					blockUI.stop();
					if  (angular.isArray(res.result) && res.result.length>0) {
						res.result.unshift( { name: '<< To ALL PATIENTS >>', email: '', id: 'ALL' } );
					}
					vm.patients = res.result;
					return res.result;
				});
		};

		vm.onSelectCallback = function (item, model) {
			if (model === 'ALL') {
				vm.message.patients = ['ALL'];
				vm.message.assignAll = true;
			}
		};

		vm.onRemoveCallback= function (item, model) {
			if (model === 'ALL') {
				vm.message.assignAll = false;
			}
		};

		vm.onSend = function () {
			if  (vm.message.assignAll === true) {
				vm.message.patients = [];
			}
			http.post('private/dashboard/tasks/multipleCreate', vm.message)
				.then(function (res) {
					blockUI.stop();
					if (res.state) {
						alertService.add(0, res.state.message);
					}
					$uibModalInstance.close(res);
				}, function (error) {
					$uibModalInstance.close(error);
					deferred.reject(error);
				});
		};

	});
