"use strict";
angular.module('core.dashboard')
	.controller('createTasksCTRL', function (http, alertService, $state, localStorageService, $log) {

		var vm = this;
		console.log('createTasksCTRL');
		vm.user = localStorageService.get('userData');
		vm.message = {template: '', message: '', patients: [], assignAll: false};
		vm.myForms = [];
		vm.patients = [];
		vm.isMulti = false;
		vm.clickedValueModel = '';
		vm.removedValueModel = '';


		vm.findForms = function (query) {
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
							if (query) {
								 query = query.toLowerCase();
								return _.filter(res.result, function(o) {
									var name = o.name.toLowerCase();
									return -1 !== name.indexOf(query);
								});
							} else {

								return res.result;
							}
						}
					}
				});

		};
		vm.findForms();

		vm.findPatients = function (query) {

			if (vm.user.type === 'doctor') {
				return http.post('private/dashboard/patients', {name: query})
					.then(function (res) {
						if (angular.isArray(res.result) && res.result.length > 0) {
							res.result.unshift({name: 'Create for all PATIENTS ', email: '', id: 'ALL'});
						}
						if (res) {

							vm.patients = res.result;
							return {patients: vm.patients};

						}
					});
			}


		};


		vm.Create = function () {

			if (vm.isMulti) {

				vm.message.template = vm.message.template[0].templateDto.id;
				vm.message.patients = _.map(vm.message.patients, 'id');

				if (vm.message.assignAll === true) {
					vm.message.patients = ['ALL'];
				}
				http.post('private/dashboard/tasks/multipleCreate', vm.message)
					.then(function (res) {
						if (res.state) {
							alertService.showAlert(res.state.message);
							$state.go('tab.sub.tasks');
						}
					});
			} else {
				var paramsPOST = {
					template: {id: vm.message.template[0].templateDto.id, type: null, description: null, templateDto: null},
					patient: vm.user.id,
					data: "{}"
				};
				http.post('private/dashboard/tasks/create', paramsPOST)
					.then(function (res) {
						alertService.showAlert(res.state.message);
						$state.go('tab.sub.tasks');
					}, function (error) {
						$log.error(error);
						$state.go('tab.sub.tasks');
					});
			}
		};


		//callbacks
		vm.itemsClicked = function (callback) {
			vm.clickedValueModel = callback;
			if (callback.item.id === 'ALL') {
				vm.message.patients = ['ALL'];
				vm.message.assignAll = true;
			}



		};

		vm.itemsClicked1 = function (callback) {
			vm.clickedValueModel = callback;
			vm.isMulti = vm.user.type === 'doctor' && callback.item.templateDto.typeEnum === 'PATIENT';



		};

		vm.itemsRemoved = function (callback) {


			if (callback.item.id === 'ALL') {
				vm.message.assignAll = false;
				vm.removedValueModel = callback;
			}
			if (vm.isMulti === true) {
				vm.isMulti = false;

			}


		};


	});
