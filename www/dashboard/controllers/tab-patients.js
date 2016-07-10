'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard')
	.controller('patientsCtrl', function ($state,$scope,http,localStorageService,$translate,initParamsPOST,alertService) {
		var vm = this;
    console.log('patientsCTRL');
		vm.user = localStorageService.get('userData');
		vm.searchref = '';
		vm.patients = [];
		vm.templates = [];

		vm.getMyPatients = function () {
			http.post('private/dashboard/patients',{"name":''})
				.then(function (res) {
					//blockUI.stop();
					if (res.result && angular.isArray(res.result) ) {
						vm.patients = res.result;
					}
				});
		};
		vm.getMyPatients();

		vm.onOpenPatient = function (id) {
			vm.templates = [];
			http.get('private/dashboard/patients/' + id + '/events')
				.then(function (res) {
					//blockUI.stop();
					if (res.result && angular.isArray(res.result) ) {
						vm.templates = res.result;
					}
				});
		};

		vm.convertDate = function (d) {
			var y = new Date(d);
			return y.toLocaleString().replace(',', ' / ');
		};

		vm.Remove = function (id_,$event) {
			if($event){
				$event.stopPropagation();
				$event.preventDefault();
			}
			vm.paramsPOST = initParamsPOST.params;
			vm.paramsPOST.criteria.list = [];
			vm.paramsPOST.criteria.list.push({id: id_});
			alertService.showPopap('Do you want to remove patient?')
				.then(function(res){

			if(res.isIonicTap === true) {
				http.post('private/dashboard/patients/remove', vm.paramsPOST)
					.then(function (res) {
						//blockUI.stop();
						alertService.showAlert(res.state.message);
						vm.getMyPatients();
					});
			}else{
				console.log("canceled");
			}
			});
		};

		vm.Invite = function (id, event) {
			if(event){
				event.isPropagationStopped() ;
				event.preventDefault();
			}
			http.get('private/dashboard/' + vm.user.type + '/references/invite/' + id)
				.then(function (res) {
					//blockUI.stop();
					if  (res.state) {
						alertService.showAlert(0, res.state.message);
						vm.getMyPatients();
					}
				});
		};


		vm.SendForm = function (obj,hist) {
			var model = { templ_id: obj.id, obj: obj };

			//blockUI.start();
			//alertService.showPopap('','','dashboard/views/popups/SendTaskFromPatientTab.html');
			//	.then(function (res) {
			//	console.log(res);
			//});

			//
			var result = alertService.showPopap({
				templateUrl: 'dashboard/views/popups/SendTaskFromPatientTab.html',
				resolve: {
					model: function ($q) {
						var deferred = $q.defer();
						deferred.resolve({data: model,patient:{
							'name':hist.patient.username,
							'email':hist.patient.email,
							'id':hist.patient.id
						}});
						return deferred.promise;
					}
				}
			}).result;
		};
		vm.onView = function (histId, patientId) {
			$state.go('tab.tasksedit', {id: histId, type: 'patients+', patId: patientId});
		};


		vm.onCopyTask = function(taskObj, patientId) {
			var paramsPOST = {
				template: {
					id: taskObj.template.id,
					templateDto: {id : taskObj.template.id}
				},
				patient: patientId,
				data: "{}"
			};
			http.post('private/dashboard/tasks/create', paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					if (res.state && res.state.value && !!res.state.value) {
						var newTaskID = res.result.id;
						paramsPOST = {event:
						{	id: newTaskID,
							patient: taskObj.patient,
							template: taskObj.template,
							data: taskObj.data,
							fromUser: taskObj.fromUser,
							toUser: taskObj.toUser,
							descr: taskObj.descr
						}
						};
						http.post('private/dashboard/tasks/edit', paramsPOST)
							.then(function (res) {
								//blockUI.stop();
								if (res.result) {
									alertService.showAlert(res.state.message);
									newTaskID = res.result.id;
									$state.go('tab.tasksedit', {id: newTaskID, type: 'patients', patId: patientId});
								}
							});
					} else {
						alertService.showAlert(res.state.message);
					}
				});
		};

		vm.onEditTask = function(histId, patientId) {
			$state.go('tab.tasksedit', {id: histId, type: 'patients', patId: patientId});
		};
		//script for accordion
		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		};

		//script for nested accordion
		$scope.toggleGroup1 = function(group) {
			if ($scope.isGroupShown1(group)) {
				$scope.shownGroup1 = null;
			} else {
				$scope.shownGroup1 = group;
			}
		};
		$scope.isGroupShown1 = function(group) {
			return $scope.shownGroup1 === group;
		};
	});
