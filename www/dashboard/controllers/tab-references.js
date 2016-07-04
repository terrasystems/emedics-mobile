'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('referencesCtrl', function ($scope,initParamsPOST,http, localStorageService) {

		var vm = this;
		console.log("referencesCTRL");



		vm.user = localStorageService.get('userData');
		//get my refs
		vm.addRefs = function () {
			//vm.paramsPOST = initParamsPOST.params;
			//vm.paramsPOST.criteria.list = [];
			http.get('private/dashboard/' + vm.user.type + '/references')
				.then(function (res) {
					//blockUI.stop();
					if (res.result) {
						vm.references = res.result;
					}
				});
		};
		vm.addRefs();
		vm.deleteRef = function (index, id) {
			http.get('private/dashboard/' + vm.user.type + '/references/remove/'+id)
				.then(function (res) {
					//blockUI.stop();
					//alertService.add(0, res.state.message);
					vm.addRefs();
				});
		};

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
	});
