'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('patientsCtrl', function ($scope,http,localStorageService,$translate) {

		var vm = this;
    console.log('patientsCTRL');
		vm.user = localStorageService.get('userData');
		vm.searchref = '';
		vm.patients = [];
		vm.templates = [];

		vm.getMyPatients = function () {
			http.get('private/dashboard/patients')
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
