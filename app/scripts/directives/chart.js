'use strict';

/**
 * @ngdoc directive
 * @name chartExampleApp.directive:ChartCtrl
 * @description
 * # ChartCtrl
 */
angular.module('chartExampleApp')
	.controller('ChartCtrl', ['$scope', '$modal', function ChartCtrl($scope, $modal) {
		
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
			
			// 時間ヘッダの縦位置
			$scope.headerY = 0;

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
			
			// Drag & Drop モード
			$scope.ddMode = false;

			// 描画中のセル情報
			$scope.drawingCellItem = null;
			
			// Drag & Drop 開始セル情報
			$scope.ddStartItem = {
				'x': null,
				'y': null
			};

			// 予約情報
			$scope.reservationItems = [];

			/**
			 * 予約情報の選択を開始します。
			 *
			 * @param event mouse-downイベント
			 *
			 */
			$scope.startSelect = function (event) {
				console.log('startSelect');
				$scope.drawMode = true;
				$scope.drawingCellItem = $scope.createCellItem(event.offsetX, event.offsetY);
			};

			/**
			 * 予約情報の選択を終了します。
			 *
			 * @param event mouse-upイベント
			 *
			 */
			$scope.endSelect = function(event) {
				console.log('endSelect');
				
				if ($scope.drawMode) {
					$scope.drawMode = false;
					
					$modal.open({
						templateUrl: 'views/reservation-dialog.html'
					});
					
				}
				
				if ($scope.ddMode) {
					$scope.ddMode = false;
				}

			};

			// TODO メソッド名はリファクタリング対象
			$scope.over = function(event) {
				console.log('over');
				if ($scope.drawMode) {
					$scope.updateCellItem($scope.drawingCellItem, event.offsetX, event.offsetY);
				}
				
				if ($scope.ddMode) {
					$scope.ddUpdateCellItem($scope.drawingCellItem, event.offsetX, event.offsetY);
				}
				
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
			
			$scope.reservationMouseDown = function(event, cellItem) {
				console.log('reservationMouseDown');
				$scope.ddMode = true;
				$scope.ddStartItem.x = $scope.getDrawRectX(event.offsetX);
				$scope.ddStartItem.y = $scope.getDrawRectY(event.offsetY);
				console.log('$scope.ddStartItem.x[' + $scope.ddStartItem.x +
							']$scope.ddStartItem.y[' + $scope.ddStartItem.y +
							']');
				$scope.drawingCellItem = cellItem;
			};

			/**
			 * 新しいセル情報を生成します。
			 * 
			 * @param offsetX イベント発生時のX座標
			 *
			 * @param offsetY イベント発生時のY座標
			 *
			 */
			$scope.createCellItem = function(offsetX, offsetY) {
				var drawRectX = $scope.getDrawRectX(offsetX);
				var drawRectY = $scope.getDrawRectY(offsetY);
				var drawRectWidth = $scope.minuteWidth;
				var drawRectHeight = $scope.reservationHeight;
				
				console.log('drawRextX[' + drawRectX + '] drawRectY[' + drawRectY + '] drawRectWidth[' + drawRectWidth + '] drawRectHeight[' + drawRectHeight + ']');
				// TODO 何故かoffsetYはヘッダぶんがプラスされている、おそらく左側に卓情報を表示したい場合それもプラスされるはず
				
				var newCellItem = {
					'x': drawRectX,
					'y': drawRectY,
					'width': drawRectWidth,
					'height': drawRectHeight,
					'fill': 'pink',
					'opacity': 0.9
				};
				
				$scope.reservationItems.push(newCellItem);
				
				return newCellItem;
			};
			
			/**
			 * セル情報を更新します。
			 *
			 * @param drawingCellItem 描画中のセル情報
			 *
			 * @param offsetX イベント発生時のX座標
			 *
			 * @param offsetY イベント発生時のY座標
			 *
			 */
			$scope.updateCellItem = function(drawingCellItem, offsetX, offsetY) {
				// TODO 左にひっぱった場合の対応が未実装
				
				var newRectWidth = ($scope.getDrawRectX(offsetX) + $scope.minuteWidth) - drawingCellItem.x;
				var newRectHeight = ($scope.getDrawRectY(offsetY) + $scope.reservationHeight) - drawingCellItem.y;
				drawingCellItem.width = newRectWidth;
				drawingCellItem.height = newRectHeight;

			};
			
			/**
			 * Drag & Drop 中のセル情報を更新します。
			 *
			 * @param targetCellItem Drag & Drop中のセル情報
			 *
			 * @param offsetX イベント発生時のX座標
			 *
			 * @param offsetY イベント発生時のY座標
			 */
			$scope.ddUpdateCellItem = function(targetCellItem, offsetX, offsetY) {
				var afterX = $scope.getDrawRectX(offsetX);
				var afterY = $scope.getDrawRectY(offsetY);
				var newX = targetCellItem.x - ($scope.ddStartItem.x - afterX);
				var newY = targetCellItem.y - ($scope.ddStartItem.y - afterY);

				targetCellItem.x = newX;
				targetCellItem.y = newY;
				$scope.ddStartItem.x = afterX;
				$scope.ddStartItem.y = afterY;
			};
			
			$scope.getDrawRectX = function(offsetX) {
				//var tableWidth = 0;	// TODO 左に表示する卓情報の幅
				// var absoluteX = offsetX - tableWidth;
				return offsetX == 0 ? 0 : Math.floor(offsetX / $scope.minuteWidth) * $scope.minuteWidth;
			};
			
			$scope.getDrawRectY = function(offsetY) {
				var absoluteY = offsetY - $scope.headerHeight;
				return absoluteY == 0 ? 0 : Math.floor(absoluteY / $scope.reservationHeight) * $scope.reservationHeight + $scope.headerHeight;
			};
					
	}])
	.directive('chart', function () {
		return {
			templateUrl: 'scripts/directives/chart.html',
			restrict: 'E',
			controller: 'ChartCtrl',
			link: function postLink(scope, element, attrs, ctrls) {
				
			}
		};
		
	});
