'use strict';
/*jshint -W117, -W097*/

angular.module('public.core')
	.service('pat_fields', function ($translate) {
		var arr = [
			{
				key: 'user.firstName',
				type: 'input',
				templateOptions: {
					type: 'text',
					label: $translate.instant('NAME'),
					placeholder: $translate.instant('USER_NAME'),
					required: false
				},
				validation: {
					show: true
				}
			},
			{
				key: 'user.lastName',
				type: 'input',
				templateOptions: {
					type: 'text',
					label: $translate.instant('LAST_NAME'),
					placeholder: $translate.instant('ENTER_LAST_NAME'),
					required: false
				},
				validation: {
					show: true
				}
			},
			{
				key: 'user.email',
				type: 'input',
				validators: {
					EmailAddress: {
						expression: function ($viewValue, $modelValue) {
							var value = $modelValue || $viewValue;
							return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
						},
						message: '$viewValue + $translate.instant("NO_VALID_EMAIL")'
					}
				},
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('EMAIL'),
					placeholder: $translate.instant('EMAIL_1')
				},
				validation: {
					show: true,
					messages: {
						required: function ($viewValue, $modelValue, scope) {
							return scope.to.label + ' is required';
						}
					}
				}
			},
			{
				key: 'user.password',
				type: 'input',
				templateOptions: {
					type: 'password',
					required: true,
					label: $translate.instant('PASSWORD'),
					placeholder: $translate.instant('PASSWORD_1')
				},
				validation: {
					show: true
				}
			}
		];
		return arr;
	})

	.service('doc_fields', function ($translate) {
		var arr = [
			{
				className: 'col-md-12',
				key: 'user.firstName',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('NAME'),
					placeholder: $translate.instant('USER_NAME')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'user.lastName',
				type: 'input',
				templateOptions: {
					type: 'text',
					label: $translate.instant('LAST_NAME'),
					placeholder: $translate.instant('ENTER_LAST_NAME'),
					required: true
				},
				validation: {
					show: true
				}
			},
			//{
			//	className: 'col-md-12',
			//	key: 'user.birth',
			//	type: 'datepicker',
			//	templateOptions: {
			//		type: 'text',
			//		label: $translate.instant('BIRTH_DATE'),
			//		placeholder: $translate.instant('BIRTH_DATE'),
			//		datepickerPopup: 'yyyy-MMMM-dd',
			//		required: false
			//	},
			//	validation: {
			//		show: true
			//	}
			//},
			{
				className: 'col-md-12',
				key: 'user.email',
				type: 'input',
				validators: {
					EmailAddress: {
						expression: function ($viewValue, $modelValue) {
							var value = $modelValue || $viewValue;
							return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
						},
						message: '$viewValue + $translate.instant("NO_VALID_EMAIL")'
					}
				},
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('EMAIL'),
					placeholder: $translate.instant('EMAIL_1')
				},
				validation: {
					show: true,
					messages: {
						required: function ($viewValue, $modelValue, scope) {
							return scope.to.label + ' is required';
						}
					}
				}
			},
			{
				className: 'col-md-12',
				key: 'user.password',
				type: 'input',
				templateOptions: {
					type: 'password',
					required: true,
					label: $translate.instant('PASSWORD'),
					placeholder: $translate.instant('PASSWORD_1')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'user.type',
				type: 'select',
				templateOptions: {
					required: true,
					label: $translate.instant('DOC_TYPE'),
					placeholder: $translate.instant('DOC_TYPE'),
					options: []
				},
				validation: {
					show: true
				}
			}
		];
		return arr;
	})

	.service('org_fields', function ($translate) {
		var arr = [
			{
				className: 'col-md-12',
				key: 'user.email',
				type: 'input',
				validators: {
					EmailAddress: {
						expression: function ($viewValue, $modelValue) {
							var value = $modelValue || $viewValue;
							return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
						},
						message: '$translate.instant("NO_VALID_EMAIL")'
					}
				},
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('EMAIL'),
					placeholder: $translate.instant('EMAIL_1')
				},
				validation: {
					show: true,
					messages: {
						required: function ($viewValue, $modelValue, scope) {
							return scope.to.label + ' is required';
						}
					}
				}
			},
			{
				className: 'col-md-12',
				key: 'user.password',
				type: 'input',
				templateOptions: {
					type: 'password',
					required: true,
					label: $translate.instant('PASSWORD'),
					placeholder: $translate.instant('PASSWORD_1')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'org.fullname',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('ORG_NAME'),
					placeholder: $translate.instant('ORG_NAME_FULL')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'org.www',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('WEBSITE'),
					placeholder: $translate.instant('WEBSITE_1')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'org.address',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('ADDRESS'),
					placeholder: $translate.instant('ORG_ADDRESS')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'org.type',
				type: 'select',
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('ORG_TYPE'),
					placeholder: $translate.instant('ORG_TYPE'),
					options: []
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'user.firstName',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('FIRST_NAME'),
					placeholder: $translate.instant('USER_NAME')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'user.lastName',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('LAST_NAME'),
					placeholder: $translate.instant('ENTER_LAST_NAME')
				},
				validation: {
					show: true
				}
			}
		];
		return arr;
	})

	.service('settings_fields', function ($translate) {
		var arr = [
			{
				className: 'col-md-12',
				key: 'firstName',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('FIRST_NAME'),
					placeholder: $translate.instant('FIRST_NAME')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'lastName',
				type: 'input',
				templateOptions: {
					type: 'text',
					required: false,
					label: $translate.instant('LAST_NAME'),
					placeholder: $translate.instant('LAST_NAME')
				},
				validation: {
					show: true
				}
			},
			{
				className: 'col-md-12',
				key: 'birth',
				type: 'datepicker',
				templateOptions: {
					type: 'text',
					label: $translate.instant('BIRTH_DATE'),
					datepickerPopup: 'yyyy-MMMM-dd'
				}
			},
			{
				className: 'col-md-12',
				key: 'email',
				type: 'input',
				validators: {
					EmailAddress: {
						expression: function ($viewValue, $modelValue) {
							var value = $modelValue || $viewValue;
							return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
						},
						message: '$viewValue + $translate.instant("NO_VALID_EMAIL")'
					}
				},
				templateOptions: {
					type: 'text',
					required: true,
					label: $translate.instant('EMAIL'),
					placeholder: $translate.instant('EMAIL_1')
				},
				validation: {
					show: true,
					messages: {
						required: function ($viewValue, $modelValue, scope) {
							return scope.to.label + ' is required';
						}
					}
				}
			},
			{
				className: 'col-md-12',
				key: 'typeExp',
				type: 'select',
				templateOptions: {
					required: false,
					label: $translate.instant('TYPE_EXPORT'),
					placeholder: $translate.instant('TYPE_EXPORT'),
					options: [
						{name: $translate.instant('PDF'), value: 'PDF'},
						{name: $translate.instant('HTML'), value: 'HTML'}
					]
				},
				validation: {
					show: true
				}
			}
		];
		return arr;

	});

