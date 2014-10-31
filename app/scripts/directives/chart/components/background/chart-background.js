'use strict';

/**
 * @ngdoc directive
 * @name chartExampleApp.directive:ChartCtrl
 * @description
 * # ChartCtrl
 */
angular.module('chartExampleApp')
  .directive('chartBackground', [function () {
    return {
      templateUrl: 'scripts/directives/chart/components/background/chart-background.html',
      restrict: 'E',
      replace: true,
      scope: {
        "chartWidth": "=",
        "chartHeight": "=",
        "tableItems": "=",
        "headerItems": "=",
        "tableCaptionWidth": "=",
        "hourSplitCount": "="
      },
      link: function postLink(scope) {

        scope.lineItems = [];

        for(var i = 0; i < scope.hourSplitCount; i++) {

          var width = 60 / scope.hourSplitCount;
          var x = i * width;

          scope.lineItems.push({
            "x": scope.tableCaptionWidth + x,
            "y2": scope.chartHeight,
            "width": width,
            "time": "00:00"
          });

        }

      }
    };

  }]);
