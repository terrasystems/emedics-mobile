'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')

	.controller('addPatientCtrl', function ($state,http,initParamsPOST, alertService,$scope) {

    var vm = this;
		$scope.users = [];
		$scope.clearSearch = function () {
			$scope.search = '';
		};

		vm.getFindUsers = function () {
			vm.paramsPOST ={
				'criteria':{
					'search':'',
					'list':null
				}
		};
			//vm.paramsPOST.criteria.search = val;
			 http.post('private/dashboard/patients/search', vm.paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					//if  (angular.isArray(res.result) && res.result.length===0) {
					//	res.result.push( { name: '... Create New', email: '', id: 'ADD' } );
					//}
					$scope.users = res.result;
					return res.result;
				});
		};

		vm.getFindUsers();

		$scope.numberOfItemsToDisplay = 7;
		$scope.addMoreItem = function() {
			if ($scope.users.length > $scope.numberOfItemsToDisplay){
				$scope.numberOfItemsToDisplay += 5;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}

		};

		vm.addPatient= function(model){
			vm.paramsPOST = initParamsPOST.params;
			vm.paramsPOST.criteria.list = [];
			vm.paramsPOST.criteria.search = '';
			vm.paramsPOST.criteria.list.push({id: model, email: null, phone: null, name: null, history: []});
			http.post('private/dashboard/patients/add', vm.paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					alertService.showAlert(res.state.message);
					$state.go('tab.patients');
				});
		}

	}).filter('searchContacts', function () {
		return function (items, query) {
			var filtered = [];
			var letterMatch = new RegExp(query, 'i');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (query) {
					if (letterMatch.test(item.name.substring(0, query.length))) {
						filtered.push(item);
					}else if(letterMatch.test(item.email.substring(0, query.length))) {
						filtered.push(item);
					}
				} else {
					filtered.push(item);
				}
			}
			return filtered;
		};

	});
