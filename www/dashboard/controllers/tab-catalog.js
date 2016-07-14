'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('catalogCtrl', function ($state, localStorageService, http, alertService, $scope) {

		var vm = this;
		console.log('catalogCTRL');

		vm.arr = [];
		vm.userType = localStorageService.get('userData');
		vm.FormTemplate = [];
		vm.myForms = [];
		vm.user = localStorageService.get('userData');
		vm.isPatient = ((vm.user.type).toUpperCase() === 'PATIENT');

		vm.type = 'main';
		getTemplates('main');
		vm.getTemplates = getTemplates;

		vm.convertFormTemplate = function (arr) {
			arr = arr.map(function (item) {
				item.isPay = false;
				item.isLoad = false;
				item.isPreview = false;
				return item;
			});

			vm.arr.forEach(function (e) {
				arr.map(function (item) {
					if (item.id == e.id) {
						if (e.type == 'PAID') {
							item.isPay = true;
							item.isLoad = true;
						}
						else {
							item.isPay = false;
							item.isLoad = true;
						}
					}
					return item;
				});
			});
			return arr;
		};

		function getTemplates(type) {
			if ('main' === type) {
				http.get('private/dashboard/template')
					.then(function (res) {
						if (res.state) {
							vm.formTemplates = vm.convertFormTemplate(res.result);
							vm.type = type;
						}
					});
			}
			else {
				http.get('private/dashboard/user/template')
					.then(function (res) {
						if (res.state) {
							vm.formTemplates = res.result;
							vm.type = type;
						}
					});
			}

		}

		vm.addFromAllTasks = function (template) {
			if (template.typeEnum === 'PATIENT' && vm.userType.type !== 'patient') {
				$state.go('tab.sendTask', {templates: template});
			} else {
				vm.loadTask(template);
			}


		};

		vm.loadTask = function (template) {
			http.get('private/dashboard/template/load/' + template.id)
				.then(function (rest) {
					alertService.showAlert(rest.state.message);
					});

       var paramsPOST={};

			if(template.templateDto === undefined){
				paramsPOST = {
					template: {
						id: template.id,
						type: template.typeEnum,
						description: null,
						templateDto: null
					},
					patient: null,
					data: "{}"
				};
			}
			if(template.templateDto){
				paramsPOST = {
					template: {
						id: obj.templateDto.id,
						type: obj.templateDto.typeEnum,
						description: null,
						templateDto: null
					},
					patient: null,
					data: '{}'
				};
			}


			vm.taskCreate(paramsPOST);
		};

vm.taskCreate=function(template){
	http.post('private/dashboard/tasks/create', template)
		.then(function (res) {
			alertService.showAlert(res.state.message);
		});
};

		vm.DeleteMyForm = function (id) {
			http.get('private/dashboard/template/delete/' + id)
				.then(function (res) {
					vm.getTemplates('my');
					//blockUI.stop();
					alertService.showAlert(res.state.message);
				});
		};
		vm.Buy = function (id) {
			http.get('private/dashboard/template/pay/' + id)
				.then(function (res) {
					//	blockUI.stop();
					alertService.showAlert(res.state.message);
				});
		};
		vm.onView = function (id) {
			http.get('private/dashboard/template/preview/' + id)
				.then(function (res) {
					//	blockUI.stop();
					alertService.showAlert(res.state.message);
				});
		};
	});
