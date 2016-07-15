"use strict";
angular.module('core.dashboard')
	.controller('SendTaskFromPatientTab', function (http, $state, $stateParams, alertService, localStorageService) {

		var vm = this;


		vm.patient = $stateParams.patient;
		vm.user = localStorageService.get('userData');

		vm.task = {
			template: {
				id: null,
				type: '',
				description: '',
				templateDto: null
			},
			patient: null,
			fromID: null,
			data: '{}'
		};


		vm.message = {
			toUser: null,
			event: null,
			message: '',
			patient: null
		};


		vm.send = function () {

			if ($stateParams.template && $stateParams.patient) {

				vm.task.template.id = $stateParams.template.id;
				vm.task.fromID = vm.user.id;
				vm.task.patient = $stateParams.patient.id;

				vm.message.toUser = $stateParams.patient.id;
				vm.message.event = $stateParams.event;
				vm.message.patient = vm.user.id;
				http.post('private/dashboard/tasks/create', vm.task)
					.then(function (res) {

						if (res) {
							http.post('private/dashboard/tasks/send', vm.message)
								.then(function (res) {

									alertService.showAlert(res.state.message);
									$state.go('tab.patients');
								});
						}
					});

			}


		};


	});
