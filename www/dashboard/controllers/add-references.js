'use strict';
/*jshint -W117, -W097*/
angular.module('eMedicsMobile')

	.controller('addReferencesCtrl', function ($scope, localStorageService, $http, http,$state) {
		var vm = this;
		vm.user = localStorageService.get('userData');
		$scope.contacts = [];
    $scope.clearSearch = function () {
			$scope.search = '';
		};

		vm.getFind = function () {
			return $http.post('rest/private/dashboard/' + vm.user.type + '/references/refs', {search: '', type: 'all'})
				.then(function(res){
					$scope.contacts = res.data.result;
				});

		};
		vm.getFind();

		$scope.numberOfItemsToDisplay = 7;
		$scope.addMoreItem = function() {
			if ($scope.contacts.length > $scope.numberOfItemsToDisplay){
				$scope.numberOfItemsToDisplay += 5;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}

		};

		$scope.addRefs= function(id){
			console.log(id);
			http.get('private/dashboard/' + vm.user.type + '/references/add/'+ id)
				.then(function(res){
					if(res.state.value){
						$state.go('tab.references');
					}
				});

		};



	})
	.filter('searchContacts', function () {
		return function (items, query) {
			var filtered = [];
			var letterMatch = new RegExp(query, 'i');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (query) {
					if (letterMatch.test(item.name.substring(0, query.length))) {
						filtered.push(item);
					}
				} else {
					filtered.push(item);
				}
			}
			return filtered;
		};

	});
