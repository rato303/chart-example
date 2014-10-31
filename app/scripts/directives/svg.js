'use strict';

angular.module('chartExampleApp')
.directive('svgX', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgX', function(x) {
			element.attr('x', x);
		});
	};
})
.directive('svgY', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgY', function(y) {
			element.attr('y', y);
		});
	};
})
.directive('svgX1', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgX1', function(x1) {
			element.attr('x1', x1);
		});
	};
})
.directive('svgX2', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgX2', function(x2) {
			element.attr('x2', x2);
		});
	};
})
.directive('svgY1', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgY1', function(y1) {
			element.attr('y1', y1);
		});
	};
})
.directive('svgY2', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgY2', function(y2) {
			element.attr('y2', y2);
		});
	};
})
.directive('svgWidth', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgWidth', function(width) {
			element.attr('width', width);
		});
	};
})
.directive('svgHeight', function() {
	return function(scope, element, attrs) {
		attrs.$observe('svgHeight', function(height) {
			element.attr('height', height);
		});
	};
})
.directive('svgStyle', function() {
  return function(scope, element, attrs) {
    attrs.$observe('svgStyle', function(style) {
      //if (angular.isUndefined(style)) { return ;}

      var styleMap = angular.fromJson(style);
      var styleString = '';
      var first = true;
      for (var key in styleMap) {
        if (first) {
          first = false;
        } else {
          styleString += ' ';
        }
        styleString += key + ': ' + styleMap[key]; + ';'
      }
      element.attr('style', styleString);
    });
  };
})
;
