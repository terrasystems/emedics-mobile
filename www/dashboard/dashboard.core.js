'use strict';
/*jshint -W117, -W097*/

angular.module('core.dashboard', [])
	//работа с базой pouchdb
	.service('db2', function($q) {
		function save (base, id, info, model){
			var deferred = $q.defer();
			if  (id === 'add') {
				var doc = {
					_id: new Date().toISOString(),
					status: 'draft',
					draftName: info.name,
					body: {sections: model, formInfo: info}
				};
				base.put(doc, function(res) {
					deferred.resolve(res);
				});
			}  else {
				base.get(id).then(function(doc) {
					doc.body = {sections: model, formInfo: info};
					return doc;
				}, function() {
					deferred.reject(false);
				}).then(function(doc) {
					base.put(doc, function(res) {
						deferred.resolve(res);
					});
				});
			}
			return deferred.promise;
		}

		function load_all (base, scope) {
			var deferred = $q.defer();
			base.allDocs({include_docs: true, descending: true}, function(err, doc) {
				scope.$apply(function(){
					deferred.resolve(doc);
				});
			});
			return deferred.promise;
		}

		function load (base, id) {
			var deferred = $q.defer();
			base.get(id).then(function(doc) {
				deferred.resolve(doc);
			}, function() {
				deferred.reject(false);
			});
			return deferred.promise;
		}

		function del (base, id) {
			var deferred = $q.defer();
			base.get(id).then(function(doc) {
				return base.remove(doc);
			}, function() {
				deferred.reject(false);
			}).then(function(resp) {
				deferred.resolve(resp);
			});
			return deferred.promise;
		}
		//******
		return {
			save: save,
			load: load,
			load_all: load_all,
			del: del
		};
	})
.service('forEditTask', function ($q, http, $base64, $translate,db2, $rootScope) {
	var getModelForEdit = function (getUrl, id) {
		var deferred = $q.defer();
		var data = { sections: [], options: [], model: [], sectionsName: [], selectedSection: '', selectedKey: '', editModel: {}, formInfo: {} };

		var convertModel = function() {
			if (!data.model) {
				data.model = [];
				data.sectionsName.forEach(function (item) {
					var it = {};
					it[item] = {};
					data.model.push(it);
				});
			}
			if (data.sectionsName.length > 0) {
				data.selectedSection = data.sectionsName[0];
				for (var key in  data.model) {
					var obj = data.model[key][Object.keys(data.model[key])[0]];
					for (var prop in obj) {
						if (obj.hasOwnProperty(prop) && prop.indexOf('_DATE') > 0 && obj[prop] !== null) {
							obj[prop] = new Date(obj[prop]);
						}
					}
				}
			}
		};

		if  (getUrl==='' && id !==  null) {
			db2.load($rootScope.db, id)
				.then(function(res) {
					data.x = res;
					data.formInfo = res.body.formInfo;
					data.sections = eval($base64.decode(data.formInfo.body.sections));
					data.sections.forEach(function (item) {
						data.sectionsName.push(Object.keys(item)[0]);
					});
					data.model = (res.body && res.body.sections) ? res.body.sections : undefined;
					convertModel();
					deferred.resolve(data);
				}, function() {
					deferred.reject(false);
				});
		} else {
			http.get(getUrl)
				.then(function (res) {
					//blockUI.stop();
					data.editModel = res.result;
					if (res.result && res.result.template && res.result.template.body && res.result.template.body.sections && res.result.id) {
						data.formInfo.id = res.result.id;
						data.formInfo.category = res.result.template.category;
						data.formInfo.name = res.result.template.name;
						data.formInfo.number = res.result.template.number;
						data.formInfo.descr = res.result.template.descr;
						data.formInfo.body = res.result.template.body;
						data.formInfo.rawData = data.editModel;

						data.sectionsName = [];
						data.sections = [];
						data.sections = eval($base64.decode(res.result.template.body.sections));
						data.sections.forEach(function (item) {
							data.sectionsName.push(Object.keys(item)[0]);
						});
						data.model = (res.result.data && res.result.data.sections) ? res.result.data.sections : undefined;
						convertModel();
						deferred.resolve(data);
					} else {
						deferred.reject(false);
					}
				}, function() {
					deferred.reject(false);
				});
		}
		return deferred.promise;
	};

	return {
		getModel: getModelForEdit
	};
})
	.run(function (formlyConfig) {

		formlyConfig.setType({
			name: 'datepicker',
			template: '<input class="datePicker" type="date" ng-model="model[options.key]" />'
		});







	});




