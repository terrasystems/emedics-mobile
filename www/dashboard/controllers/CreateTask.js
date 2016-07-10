'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('CreateTaskCtrl',function(  alertService, http, localStorageService){
		var vm = this;

		console.log('CreateTaskCtrl');
		vm.user = localStorageService.get('userData');
		vm.message = {template: '', message: '', patients:[], assignAll: false};
		vm.myForms = [];
		vm.patients = [];
		vm.isMulti = false;

		http.get('private/dashboard/user/template')
			.then(function (res) {
				//blockUI.stop();
				if (res.state) {
					if (angular.isArray(res.result) && res.result.length > 0) {
						res.result.map(function (item) {
							item.name = item.templateDto.name;
							return item;
						});
					}
					vm.myForms = res.result;
				}
			});

		if (vm.user.type==='doctor') {
			http.post('private/dashboard/patients', {name: ''})
				.then(function (res) {
					blockUI.stop();
					if (res.result && angular.isArray(res.result)) {
						vm.patients = res.result;
					}
				});
		}

		vm.onSelected = function(item) {
			vm.isMulti = vm.user.type==='doctor' &&  item.templateDto.typeEnum==='PATIENT';
		};

		//vm.onCreate = function () {
		//	if  (vm.isMulti) {
		//		http.post('private/dashboard/tasks/multipleCreate', vm.message)
		//			.then(function (res) {
		//				blockUI.stop();
		//				if (res.state) {
		//					alertService.add(0, res.state.message);
		//				}
		//				$uibModalInstance.close(res);
		//			});
		//	} else {
		//		var paramsPOST = {
		//			template: {id: vm.message.template, type: null, description: null, templateDto: null	},
		//			patient: vm.user.id,
		//			data: "{}"
		//		};
		//		http.post('private/dashboard/tasks/create', paramsPOST)
		//			.then(function (res) {
		//				blockUI.stop();
		//				alertService.add(0, res.state.message);
		//				//$uibModalInstance.close(res);
		//			});
		//	}
		//};

	});
