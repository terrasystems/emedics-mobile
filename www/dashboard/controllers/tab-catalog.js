'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('catalogCtrl', function ( $state,localStorageService,http) {

		var vm = this;
		console.log('catalogCTRL');

		vm.arr = [];
		vm.userType = localStorageService.get('userData');
		vm.FormTemplate = [];
		vm.myForms = [];
		vm.user = localStorageService.get('userData');
		vm.isPatient = ((vm.user.type).toUpperCase() === 'PATIENT');

		vm.convertFormTemplate = function (arr) {
			arr.map(function (item) {
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


		vm.getAllTemplates =  function () {
			http.get('private/dashboard/template')
				.then(function (res) {
					console.log(res);
					if (res.state) {
						vm.FormTemplate = vm.convertFormTemplate(res.result);
					}
				});
		};
		vm.getAllTemplates();


		vm.getUserTemplate=function () {
			http.get('private/dashboard/user/template')
				.then(function (res) {
					if (res.state) {
						vm.myForms = res.result;
					}
				});
		}

		vm.getUserTemplate();


		vm.onLoad = function (id) {
			http.get('private/dashboard/template/load/' + id)
				.then(function (rest) {
					vm.templateParams = vm.FormTemplate.find(function (form) {
						return form.id === id;
					});
					var paramsPOST = {
						template: {
							id: rest.result,
							type: null,
							description: null,
							templateDto: null
						},
						patient: null
					};
					http.post('private/dashboard/tasks/create', paramsPOST);
						//.then(function (res) {
						//	//blockUI.stop();
						//	//alertService.add(0, res.state.message);
						//});
				}
				//function (res) {
				//	blockUI.stop();
				//	alertService.add(0, res.state.message);
				//}
			);
		};

		vm.DeleteMyForm = function (id) {
			http.get('private/dashboard/template/delete/' + id)
				.then(function () {
					vm.getUserTemplate();
					//blockUI.stop();
					//alertService.add(0, res.state.message);
				});
		};
		vm.Buy = function (id) {
			http.get('private/dashboard/template/pay/' + id);
				//.then(function (res) {
				//	blockUI.stop();
				//	alertService.add(0, res.state.message);
				//});
		};
		vm.onView = function (id) {
			http.get('private/dashboard/template/preview/' + id);
				//.then(function (res) {
				//	blockUI.stop();
				//	alertService.add(0, res.state.message);
				//});
		};
	});
