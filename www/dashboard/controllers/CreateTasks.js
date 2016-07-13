"use strict";
angular.module('core.dashboard')
	.controller('createTasksCTRL', function (http,alertService,$state,localStorageService,$rootScope,$stateParams) {

		var vm = this;
		console.log('createTasksCTRL');
		vm.user = localStorageService.get('userData');
		vm.message = {template: '', message: '', patients:[], assignAll: false};
		vm.myForms = [];
		vm.patients = [];
		vm.isMulti = false;
		vm.clickedValueModel = '';
		vm.removedValueModel = '';


		vm.findForms = function () {
			return http.get('private/dashboard/user/template')
				.then(function (res) {
					if (res.state) {
						if (angular.isArray(res.result) && res.result.length > 0) {
							res.result.map(function (item) {
								item.name = item.templateDto.name;
								return item;
							});
						}
						if (res) {
							vm.myForms = res.result;
							return {template: vm.myForms};

						}
					}
				});

		};

		vm.findPatients=function(query){

			if (vm.user.type==='doctor') {
				return http.post('private/dashboard/patients', {name: query})
					.then(function (res) {
						if  (angular.isArray(res.result) && res.result.length>0) {
							res.result.unshift( { name: '<< To ALL PATIENTS >>', email: '', id: 'ALL' } );
						}
						if(res){

							vm.patients = res.result;
							return {patients: vm.patients};

						}
					});
			}

			//vm.Selected = function(item) {
			//	vm.isMulti = vm.user.type==='doctor' &&  item.templateDto.typeEnum==='PATIENT';
			//};

		};


		vm.Create = function () {
			if  (vm.isMulti) {
				if  (vm.message.assignAll === true) {
					vm.message.patients = [];
				}
				vm.message.template=vm.message.template[0].id;
				vm.message.patients=_.map(vm.message.patients, 'id');

				http.post('private/dashboard/tasks/multipleCreate', vm.message)
					.then(function (res) {
						if (res.state) {
							alertService.showAlert( res.state.message);
						}
					});
			} else {
				var paramsPOST = {
					template: {id: vm.message.template, type: null, description: null, templateDto: null	},
					patient: vm.user.id,
					data: "{}"
				};
				http.post('private/dashboard/tasks/create', paramsPOST)
					.then(function (res) {
						alertService.showAlert(res.state.message);
					});
			}
		};



		vm.itemsClicked = function (callback) {
			vm.isMulti = vm.user.type==='doctor' &&  callback.item.templateDto.typeEnum==='PATIENT';
			vm.clickedValueModel = callback;


			if (model === 'ALL') {
				vm.message.patients = ['ALL'];
				vm.message.assignAll = true;
			}

		};
		vm.itemsRemoved = function (callback,model) {

			if (model === 'ALL') {
				vm.message.assignAll = false;
			}
			vm.removedValueModel = callback;


		};
		//vm.send = function () {
		//	console.log(vm.message);
		//	vm.message.patient = vm.message.patient[0].id;
		//	vm.message.toUser = vm.message.toUser[0].id;
		//	if ($rootScope.offlineState) {
		//		vm.message.task = $stateParams.task;
		//	}
		//
		//	http.post('private/dashboard/tasks/send', vm.message)
		//		.then(function (res) {
		//			if (res.state) {
		//				alertService.showAlert(res.state.message);
		//				$state.go('tab.sub.tasks');
		//			}
		//
		//		});

		//};

		//
		//http.get('private/dashboard/user/template')
		//	.then(function (res) {
		//		if (res.state) {
		//			if (angular.isArray(res.result) && res.result.length > 0) {
		//				res.result.map(function (item) {
		//					item.name = item.templateDto.name;
		//					return item;
		//				});
		//			}
		//			vm.myForms = res.result;
		//		}
		//	});



		//vm.user = localStorageService.get('userData');
		//vm.message = {template: '', message: '', patients:[], assignAll: false};
		//vm.myForms = [];
		//vm.patients = [];
		//vm.isMulti = false;
		//
		//http.get('private/dashboard/user/template')
		//	.then(function (res) {
		//		blockUI.stop();
		//		if (res.state) {
		//			if (angular.isArray(res.result) && res.result.length > 0) {
		//				res.result.map(function (item) {
		//					item.name = item.templateDto.name;
		//					return item;
		//				});
		//			}
		//			vm.myForms = res.result;
		//		}
		//	});
		//
		//if (vm.user.type==='doctor') {
		//	http.post('private/dashboard/patients', {name: ''})
		//		.then(function (res) {
		//			blockUI.stop();
		//			if (res.result && angular.isArray(res.result)) {
		//				vm.patients = res.result;
		//			}
		//		});
		//}
		//
		//vm.onSelected = function(item) {
		//	vm.isMulti = vm.user.type==='doctor' &&  item.templateDto.typeEnum==='PATIENT';
		//};
		//
		//vm.Create = function () {
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
		//				$uibModalInstance.close(res);
		//			});
		//	}
		//};

	});
