'use strict';

/**
 * @ngdoc function
 * @name chartExampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the chartExampleApp
 */
angular.module('chartExampleApp')
.controller('MainCtrl',
	['$scope',
		function ($scope) {

			// チャート全体の幅
			var _chartWidth = 1500;
			$scope.chartWidth = _chartWidth;

			// チャート全体の高さ
			var _chartHeigth = 3020;
			$scope.chartHeight = _chartHeigth;

			// 時間テキストのy軸
			var _headerLabelY = 14;
			$scope.headerLabelY = _headerLabelY;

			// 時間ヘッダの高さ
			var _headerHeight = 20;
			$scope.headerHeight = _headerHeight;

			// 1メモリの幅
			var _minuteWidth = 15;
			$scope.minuteWidth = _minuteWidth;

			// 1時間の分割量
			var hourSplitCount = 4;

			// 1予約分の高さ
			var _reservationHeight = 30;
			$scope.reservationHeight = _reservationHeight;

			// 波線の数
			var _lineItems = new Array();
			for (var i = 1; i < 100; i++) {	// TODO なんで96じゃんくて100なのか？計算式を求める
				_lineItems.push({'x': i * _minuteWidth});
			}
			$scope.lineItems = _lineItems;

			// 時間の数
			var _headerItems = new Array();
			for (var i = 0; i <= 24; i++) {
				var label = ('00' + i).slice(-2) + ':00';
				var x = (i * _minuteWidth * hourSplitCount);
				var width = ((i + 1) * _minuteWidth * hourSplitCount);
				_headerItems.push({
					'x': x,
					'width': width,
					'labelX': x + _minuteWidth,
					'label': label
				});
			}
			$scope.headerItems = _headerItems;

			// 卓の数
			var _tableItems = new Array();
			for (var i = 0; i < 100; i++) {
				_tableItems.push({
					'y': i * 30 + $scope.headerHeight,
					'tableNo': i,
				});
			}
			$scope.tableItems = _tableItems;

			// 描画モード
			$scope.drawMode = false;

			// 描画開始セル座標
			$scope.selectStartItem = {
				'x': null,
				'y': null
			};

			// 予約情報
			$scope.reservationItems = [];

			$scope.startSelect = function (event) {
				console.log('startSelect');
				// console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
				$scope.drawMode = true;
				$scope.drawCell(event.offsetX, event.offsetY, $scope.selectStartItem);
			};

			$scope.endSelect = function(event) {
				console.log('endSelect');
				//console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
				$scope.drawMode = false;
				// alert('x[' + $scope.selectStartItem.x + '] y[' + $scope.selectStartItem.y + ']');
				$scope.drawCell(event.offsetX, event.offsetY, $scope.selectStartItem);
			};

			// TODO メソッド名はリファクタリング対象
			$scope.over = function(event) {
				console.log('over');
				//console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
				if ( ! $scope.drawMode) { return; }
				$scope.drawCell(event.offsetX, event.offsetY, $scope.selectStartItem);
			};

			// TODO メソッド名はリファクタリング対象
			$scope.enter = function(event) {
				//console.log('enter');
				//console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
			}

			// TODO メソッド名はリファクタリング対象
			$scope.leave = function(event) {
				//console.log('leave');
				//console.log('offsetX[' + event.offsetX + '] offsetY[' + event.offsetY + ']');
			};

			$scope.drawCell = function(offsetX, offsetY, saveItem) {
				if ( ! $scope.drawMode) { return; }
				var tableWidth = 0;	// TODO 左に表示する卓情報の幅
				var absoluteX = offsetX - tableWidth;
				var absoluteY = offsetY - $scope.headerHeight;

				var drawRectX = offsetX == 0 ? 0 : Math.floor(offsetX / $scope.minuteWidth) * $scope.minuteWidth;
				var drawRectY = absoluteY == 0 ? 0 : Math.floor(absoluteY / $scope.reservationHeight) * $scope.reservationHeight + $scope.headerHeight;
				var drawRectWidth = /*drawRectX + */$scope.minuteWidth;
				var drawRectHeight = drawRectY + $scope.reservationHeight;

				saveItem.x = drawRectX;
				saveItem.y = drawRectY;

				console.log('drawRextX[' + drawRectX + '] drawRectY[' + drawRectY + '] drawRectWidth[' + drawRectWidth + '] drawRectHeight[' + drawRectHeight + ']');
				// TODO 何故かoffsetYはヘッダぶんがプラスされている、おそらく左側に卓情報を表示したい場合それもプラスされるはず
				$scope.reservationItems.push({
					'x': drawRectX,
					'y': drawRectY,
					'width': drawRectWidth,
					'height': drawRectHeight,
					'fill': 'pink',
					'opacity': 0.9
				});
				// TODO reservationItemsとng-repeatで配列にぶち込む？
			};

		}
	]
)
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
;