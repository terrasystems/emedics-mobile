'use strict';
/*jshint -W117, -W097*/
angular.module('eMedicsMobile')

	.controller('addReferencesCtrl',function($scope, localStorageService,http,initParamsPOST){
    var vm = this;
		vm.user = localStorageService.get('userData');
		vm.references = [];
		$scope.contacts = window.CONTACTS;

		$scope.clearSearch = function() {
			$scope.search = '';
		};
		console.log('addrefCtrl');

		$scope.getFindRefs = function (val) {
			vm.paramsPOST = initParamsPOST.params;
			vm.paramsPOST.criteria.search = val;
			return http.post('private/dashboard/' + vm.user.type + '/references/search', vm.paramsPOST)
				.then(function (res) {
					//blockUI.stop();
					if  (angular.isArray(res.result) && res.result.length>0) {
						res.result.map(function (item) {
							item.all = item.name + ', ' + item.email + ( (item.type === null) ? '' : ', ' + item.type);
							return item;
						});
					}
					//else {
					//	res.result.push( { all: 'Add new reference...', id: 'add' } );
					//}
					return res.result;
				});
		};

		//vm.refresh = function () {
		//	vm.paramsPOST = initParamsPOST.params;
		//	vm.paramsPOST.criteria.list = [];
		//	http.get('private/dashboard/' + vm.user.type + '/references', vm.paramsPOST)
		//		.then(function (res) {
		//			//blockUI.stop();
		//			if (res.result) {
		//				vm.references = res.result;
		//			}
		//		});
		//};
		//vm.refresh();
	})
	.filter('searchContacts', function(){
		return function (items, query) {
			var filtered = [];
			var letterMatch = new RegExp(query, 'i');
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				if (query) {
					if (letterMatch.test(item.first_name.substring(0, query.length))) {
						filtered.push(item);
					}
				} else {
					filtered.push(item);
				}
			}
			return filtered;
		};
	});

window.CONTACTS = [];
	//[{"id":1,"first_name":"Patrick","last_name":"Rogers","country":"Cyprus","ip_address":"153.88.89.148","email":"progers@yata.net"},
	//{"id":2,"first_name":"Janet","last_name":"Gordon","country":"Croatia","ip_address":"209.73.121.212","email":"jgordon@skivee.biz"},
	//{"id":3,"first_name":"Kathy","last_name":"Hamilton","country":"Armenia","ip_address":"164.214.217.162","email":"khamilton@rhynyx.biz"},
	//{"id":4,"first_name":"Stephanie","last_name":"Johnson","country":"Mauritius","ip_address":"8.199.242.67","email":"sjohnson@jabbertype.mil"},
	//{"id":5,"first_name":"Jerry","last_name":"Palmer","country":"Thailand","ip_address":"230.207.100.163","email":"jpalmer@avamm.org"},
	//{"id":6,"first_name":"Lillian","last_name":"Franklin","country":"Germany","ip_address":"150.190.116.1","email":"lfranklin@eare.mil"},
	//{"id":7,"first_name":"Melissa","last_name":"Gordon","country":"Serbia","ip_address":"162.156.29.99","email":"mgordon@flashset.org"},
	//{"id":8,"first_name":"Sarah","last_name":"Burns","country":"Grenada","ip_address":"13.177.156.223","email":"sburns@eimbee.info"},
	//{"id":9,"first_name":"Willie","last_name":"Burton","country":"Croatia","ip_address":"115.133.81.82","email":"wburton@dynazzy.info"},
	//{"id":10,"first_name":"Tina","last_name":"Simmons","country":"United States Virgin Islands","ip_address":"113.49.63.18","email":"tsimmons@devpulse.mil"},
	//{"id":11,"first_name":"Kenneth","last_name":"Larson","country":"Mexico","ip_address":"92.89.76.196","email":"klarson@browseblab.info"},
	//{"id":12,"first_name":"Philip","last_name":"Welch","country":"Cuba","ip_address":"223.180.48.70","email":"pwelch@skippad.edu"},
	//{"id":13,"first_name":"Nicholas","last_name":"Parker","country":"British Indian Ocean Territory","ip_address":"200.150.119.13","email":"nparker@twitternation.net"},
	//{"id":14,"first_name":"Nicole","last_name":"Webb","country":"Moldova","ip_address":"47.66.237.205","email":"nwebb@midel.biz"},
	//{"id":15,"first_name":"Clarence","last_name":"Schmidt","country":"China","ip_address":"134.84.246.67","email":"cschmidt@dazzlesphere.net"},
	//{"id":16,"first_name":"Jessica","last_name":"Murray","country":"Sao Tome and Principe","ip_address":"211.30.32.109","email":"jmurray@jumpxs.net"},
	//{"id":17,"first_name":"Willie","last_name":"Schmidt","country":"US Minor Outlying Islands","ip_address":"158.40.109.208","email":"wschmidt@babbleset.edu"},
	//{"id":18,"first_name":"Margaret","last_name":"Evans","country":"Bhutan","ip_address":"252.123.77.101","email":"mevans@voolia.info"},
	//{"id":19,"first_name":"Arthur","last_name":"Morales","country":"Faroe Islands","ip_address":"116.5.126.29","email":"amorales@brainlounge.biz"},
	//{"id":20,"first_name":"Charles","last_name":"Perez","country":"Italy","ip_address":"10.43.255.4","email":"cperez@avaveo.net"},
	//{"id":21,"first_name":"Jeffrey","last_name":"Webb","country":"Liechtenstein","ip_address":"55.140.114.8","email":"jwebb@mynte.net"},
	//{"id":22,"first_name":"Andrea","last_name":"Simpson","country":"Nauru","ip_address":"22.243.12.86","email":"asimpson@browsetype.mil"},
	//{"id":23,"first_name":"Steve","last_name":"Reynolds","country":"Morocco","ip_address":"21.166.38.112","email":"sreynolds@topiclounge.biz"},
	//{"id":24,"first_name":"Gerald","last_name":"Reyes","country":"Isle of Man","ip_address":"235.115.15.46","email":"greyes@voolith.biz"},
	//{"id":25,"first_name":"Judy","last_name":"Washington","country":"Sweden","ip_address":"39.120.240.182","email":"jwashington@oyondu.net"},
	//{"id":26,"first_name":"Brandon","last_name":"Patterson","country":"Vietnam","ip_address":"18.176.165.38","email":"bpatterson@skyba.org"},
	//{"id":27,"first_name":"Jacqueline","last_name":"Stephens","country":"Cambodia","ip_address":"207.226.109.97","email":"jstephens@fivespan.net"},
	//{"id":28,"first_name":"Carlos","last_name":"Harrison","country":"Burkina Faso","ip_address":"130.22.96.6","email":"charrison@yacero.gov"},
	//{"id":29,"first_name":"Carol","last_name":"Payne","country":"Estonia","ip_address":"194.1.83.133","email":"cpayne@brightbean.com"},
	//{"id":30,"first_name":"David","last_name":"Baker","country":"Montenegro","ip_address":"39.212.209.46","email":"dbaker@youspan.name"},
	//{"id":31,"first_name":"Justin","last_name":"Watkins","country":"Timor-Leste","ip_address":"8.56.161.224","email":"jwatkins@centimia.net"},
	//{"id":32,"first_name":"Roy","last_name":"Meyer","country":"Seychelles","ip_address":"166.207.153.210","email":"rmeyer@quire.com"},
	//{"id":33,"first_name":"Kelly","last_name":"Richardson","country":"Central African Republic","ip_address":"74.86.34.94","email":"krichardson@agivu.net"},
	//{"id":34,"first_name":"Howard","last_name":"Mason","country":"Portugal","ip_address":"139.237.150.73","email":"hmason@wikivu.info"},
	//{"id":35,"first_name":"Karen","last_name":"Jackson","country":"Swaziland","ip_address":"143.153.219.220","email":"kjackson@kazio.net"},
	//{"id":36,"first_name":"Christine","last_name":"Bennett","country":"France","ip_address":"102.220.71.37","email":"cbennett@pixoboo.edu"},
	//{"id":37,"first_name":"Ashley","last_name":"Jordan","country":"Svalbard and Jan Mayen Islands","ip_address":"217.38.155.41","email":"ajordan@oba.edu"},
	//{"id":38,"first_name":"David","last_name":"Lopez","country":"Mongolia","ip_address":"87.83.224.164","email":"dlopez@gevee.net"},
	//{"id":39,"first_name":"Andrew","last_name":"Pierce","country":"Vatican City State (Holy See)","ip_address":"107.33.80.251","email":"apierce@einti.info"},
	//{"id":40,"first_name":"Michael","last_name":"Hughes","country":"New Caledonia","ip_address":"230.246.102.4","email":"mhughes@roodel.name"},
	//{"id":41,"first_name":"Earl","last_name":"Henderson","country":"Wallis and Futuna Islands","ip_address":"209.198.245.189","email":"ehenderson@youspan.name"},
	//{"id":42,"first_name":"Frank","last_name":"Simpson","country":"Uruguay","ip_address":"101.40.193.226","email":"fsimpson@browseblab.edu"},
	//{"id":43,"first_name":"Jane","last_name":"Simpson","country":"New Zealand","ip_address":"232.49.15.188","email":"jsimpson@jayo.net"},
	//{"id":44,"first_name":"Sarah","last_name":"Cook","country":"Thailand","ip_address":"91.41.176.224","email":"scook@jumpxs.com"},
	//{"id":45,"first_name":"Marilyn","last_name":"Tucker","country":"Western Sahara","ip_address":"146.77.96.245","email":"mtucker@zoomzone.mil"},
	//{"id":46,"first_name":"Scott","last_name":"Lewis","country":"Spain","ip_address":"119.197.8.105","email":"slewis@kwilith.com"},
	//{"id":47,"first_name":"Tammy","last_name":"Mills","country":"Spain","ip_address":"48.52.175.97","email":"tmills@dabz.gov"},
	//{"id":48,"first_name":"Susan","last_name":"Crawford","country":"Slovenia","ip_address":"23.120.101.112","email":"scrawford@voonyx.biz"},
	//{"id":49,"first_name":"Barbara","last_name":"Palmer","country":"Oman","ip_address":"143.107.3.220","email":"bpalmer@blogtag.org"},
	//{"id":50,"first_name":"Stephanie","last_name":"Diaz","country":"Equatorial Guinea","ip_address":"175.115.251.194","email":"sdiaz@meevee.com"}];
