/**
 * @license ng-bs-daterangepicker-plus v0.1.0
 * (c) 2013 Konstantin Yakushev http://github.com/kojoru/ng-bs-daterangepicker
 * Originally by Luis Farzati
 * License: MIT
 */
(function (angular) {
'use strict';

angular.module('ngBootstrap', []).directive('ngDaterange', ['$compile', '$parse', function ($compile, $parse) {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function ($scope, $element, $attributes, ngModel) {
			var options = {};
			options.format = $attributes.format || 'YYYY-MM-DD';
			options.separator = $attributes.separator || ' - ';
			options.minDate = $attributes.minDate && moment($attributes.minDate);
			options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
			options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
			options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
			options.locale = $attributes.locale && $parse($attributes.locale)($scope);
            options.opens = $attributes.opens || 'right';

			function format(date) {
				return date.format(options.format);
			}

			function formatted(dates) {
				return [format(dates.startDate), format(dates.endDate)].join(options.separator);
			}

			ngModel.$formatters.unshift(function (modelValue) {
				if (!modelValue) return '';
				return modelValue;
			});

			ngModel.$parsers.unshift(function (viewValue) {
				return viewValue;
			});

			$scope.$watch($attributes.ngModel, function (modelValue) {
				if (!modelValue || (!modelValue.startDate)) {
					ngModel.$setViewValue({ startDate: moment().startOf('day').toDate(), endDate: moment().startOf('day').toDate() });
					return;
				}
				$element.data('daterangepicker').setStartDate(modelValue.startDate);
				$element.data('daterangepicker').setEndDate(modelValue.endDate);
			});

			$element.daterangepicker(options, function(start, end) {
				$scope.$apply(function () {
                    ngModel.$setViewValue({ startDate: start.startOf('day'), endDate: end.endOf('day')});
				});
			});			
		}
	};
}]);

})(angular);
