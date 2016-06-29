'use strict';
/*jshint -W117, -W097*/

angular.module('eMedicsMobile')
	.controller('tasksCtrl', function ($scope) {

		var vm = this;
		console.log("TasksCTRL");
		$scope.data = {
			showDelete: false
		};

		$scope.edit = function(item) {
			alert('Edit Item: ' + item.id);
		};
		$scope.share = function(item) {
			alert('Share Item: ' + item.id);
		};

		$scope.moveItem = function(item, fromIndex, toIndex) {
			$scope.items.splice(fromIndex, 1);
			$scope.items.splice(toIndex, 0, item);
		};

		$scope.onItemDelete = function(item) {
			$scope.items.splice($scope.items.indexOf(item), 1);
		};

		$scope.items = [
			{ id: 0,
			  name:'Doctor Form'
			},
			{ id: 1,
				name:'Doctor Form' },
			{ id: 2,
				name:'Doctor Form' },
			{ id: 3,
				name:'Doctor Form' },
			{ id: 4,
				name:'Doctor Form' },
			{ id: 5,
				name:'Doctor Form' },
			{ id: 6,
				name:'Doctor Form' },
			{ id: 7,
				name:'Doctor Form' },
			{ id: 8,
				name:'Doctor Form' },
			{ id: 9,
				name:'Doctor Form' },
			{ id: 10,
				name:'Doctor Form' },
			{ id: 2,
				name:'Doctor Form' },
			{ id: 3,
				name:'Doctor Form' },
			{ id: 4,
				name:'Doctor Form' },
			{ id: 5,
				name:'Doctor Form' },
			{ id: 6,
				name:'Doctor Form' },
			{ id: 7,
				name:'Doctor Form' },
			{ id: 8,
				name:'Doctor Form' },
			{ id: 9,
				name:'Doctor Form' },
			{ id: 10,
				name:'Doctor Form' }
		];
	});

