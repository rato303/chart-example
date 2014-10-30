'use strict';

/**
 * @ngdoc service
 * @name chartExampleApp.chartModel
 * @description
 * # chartModel
 * Factory in the chartExampleApp.
 */
angular.module('chartExampleApp')
  .factory('chartModel', function () {
    return {
      /** 時間テキストのy軸*/
      "headerLabelY": 14,
      /** 時間ヘッダの高さ */
      "headerHeight": 20,
      /** ヘッダの縦位置 */
      "headerY": 0,
      /** ヘッダの横位置 */
      "headerX": 0,
      /** 分の最小単位 */
      "minuteWidth": 15,
      /** 1時間の分割量 */
      "hourSplitCount": 4,
      /** 1予約分の高さ */
      "reservationHeight": 30,
      /** 時間ヘッダの配列 */
      "headerItems": [],
      /** 描画モード */
      "drawMode": false,
      /** Drag & Drop モード */
      "ddMode": false,
      /** 描画中のセル情報 */
      "drawingCellItem": null,
      /** Drag & Drop 開始セル情報 */
      "ddStartItem": {
        "x": 0,
        "y": 0
      },
      /** 卓ヘッダ情報 */
      "tableCaptionItems": [
        {'label': '卓人数', 'x': 0, 'width': 60},
        {'label': '種別', 'x': 60, 'width': 60},
        {'label': '卓名', 'x': 120, 'width': 60},
        {'label': '喫煙', 'x': 180, 'width': 60}
      ],
      /** 卓情報全体の幅 */
      "tableCaptionWidth": 240,
      /**
       * 時間ヘッダの配列を生成します。
       *
       * @param startTime チャート開始時刻
       *
       * @param endTime チャート終了時刻
       *
       * @returns {chartModel} 時間ヘッダ生成後のインスタンス
       */
      "createHeaderItems": function(startTime, endTime) {
        for (var i = startTime; i <= endTime; i++) {
          var label = ('00' + i).slice(-2) + ':00'; // TODO 0埋め関数を作成
          var x = (i * this.minuteWidth * this.hourSplitCount);
          var width = this.minuteWidth * this.hourSplitCount;
          this.headerItems.push({
            'x': x,
            'width': width,
            'labelX': x + this.minuteWidth,
            'label': label
          });
        }
        return this;
      },
      /**
       * 仮予約情報を生成します。
       *
       * @param event イベント
       *
       * @param moge
       *
       * @returns {number} 仮予約情報の配列
       */
      "createReservationItems": function(event, moge) {
        var startTime = this.drawingCellItem.startTime;
        var endTime = this.getEndTime(event.offsetX);
        var newReservationItems = [];

        for (var key in moge) {
          var newReservationItem = moge[key];
          newReservationItems.push({
            "startTime": startTime,
            "endTime": endTime,
            "y": newReservationItem.y,
            "takuNinzu": newReservationItem.takuNinzu,
            "shubetsu": newReservationItem.shubetsu,
            "takumei": newReservationItem.takumei,
            "kitsuen": newReservationItem.kitsuen
          });
        }
        return newReservationItems;
      },
      /**
       * 新しいセル情報を生成します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       *
       * @returns {Object} 新しいセル情報
       */
      "createCellItem": function(offsetX, offsetY) {
        var drawRectX = this.getDrawRectX(offsetX);
        var drawRectY = this.getDrawRectY(offsetY);
        var drawRectWidth = this.minuteWidth;
        var drawRectHeight = this.reservationHeight;

        var newCellItem = {
          'x': drawRectX,
          'y': drawRectY,
          'width': drawRectWidth,
          'height': drawRectHeight,
          'fill': 'pink',
          'opacity': 0.9,
          'startTime': this.getStartTime(offsetX)
        };

        return newCellItem;
      },
      /**
       * セル情報を更新します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       *
       */
      "updateCellItem": function(offsetX, offsetY) {
        // TODO 左にひっぱった場合の対応が未実装
        var newRectWidth = (this.getDrawRectX(offsetX) + this.minuteWidth) - this.drawingCellItem.x;
        var newRectHeight = (this.getDrawRectY(offsetY) + this.reservationHeight) - this.drawingCellItem.y;
        this.drawingCellItem.width = newRectWidth;
        this.drawingCellItem.height = newRectHeight;
      },
      /**
       * Drag & Drop 中のセル情報を更新します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @param offsetY イベント発生時のY座標
       */
      "ddUpdateCellItem": function(offsetX, offsetY) {
        if ( ! this.ddMode) { return }
        var afterX = this.getDrawRectX(offsetX);
        var afterY = this.getDrawRectY(offsetY);
        var newX = this.drawingCellItem.x - (this.ddStartItem.x - afterX);
        var newY = this.drawingCellItem.y - (this.ddStartItem.y - afterY);

        this.drawingCellItem.x = newX;
        this.drawingCellItem.y = newY;
        this.ddStartItem.x = afterX;
        this.ddStartItem.y = afterY;
      },
      /**
       * 描画を開始するX座標を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {number}
       */
      "getDrawRectX": function(offsetX) {
        return offsetX === 0 ? 0 : Math.floor((offsetX - this.tableCaptionWidth) / this.minuteWidth) * this.minuteWidth;
      },
      /**
       * 描画を開始するY座標を取得します。
       *
       * @param offsetY イベント発生時のY座標
       *
       * @returns {number}
       */
      "getDrawRectY": function(offsetY) {
        var absoluteY = offsetY - this.headerHeight;
        return absoluteY === 0 ? 0 : Math.floor(absoluteY / this.reservationHeight) * this.reservationHeight + this.headerHeight;
      },
      /**
       * 選択開始時刻を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {String}
       */
      "getStartTime": function(offsetX) {
        var startX = this.getDrawRectX(offsetX);
        return this.getTime(startX);
      },
      /**
       * 選択終了時刻を取得します。
       *
       * @param offsetX イベント発生時のX座標
       *
       * @returns {String}
       */
      "getEndTime": function(offsetX) {
        var endX = this.minuteWidth + this.getDrawRectX(offsetX);
        return this.getTime(endX);
      },
      /**
       * X座標に位置する時刻を取得します。
       *
       * @param targetX イベント発生時のX座標
       *
       * @returns {string}
       */
      "getTime": function(targetX) {
        var minuteCount = targetX / this.minuteWidth;
        var hour = Math.floor(minuteCount / this.hourSplitCount);
        var minute = minuteCount % this.hourSplitCount * this.minuteWidth;
        return ('00' + String(hour)).slice(-2) + ':' + ('00' + String(minute)).slice(-2);
      }
    };
  });
