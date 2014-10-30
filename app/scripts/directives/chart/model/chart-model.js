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
        "x": null,
        "y": null
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
      }
    };
  });
