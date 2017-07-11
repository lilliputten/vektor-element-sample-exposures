/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Data_type_objvisitdetail
 * @overview Расширение модуля обработки полученных данных отчёта (objvisitdetail)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.05 11:34:05
 * @version 2017.05.05, 20:08
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Data_type_objvisitdetail.js 8728 2017-07-10 16:23:49Z miheev $
 *
 */

modules.define('Report__Data', [
        'i-bem-dom',
        'vow',
        'project',
        'jquery',
    ],
    function(provide,
        BEMDOM,
        vow,
        project,
        $,
    __Data) {

/**
 *
 * @exports
 * @class Report__Data_type_objvisitdetail
 * @bem
 * @classdesc __INFO__
 *
 * TODO
 * ====
 *
 * ОПИСАНИЕ
 * ========
 *
 */

// Ссылка на описание модуля
var __module = this;

var __Data_type_objvisitdetail = /** @lends Report__Data_type_objvisitdetail.prototype */ {

    /** _getDefaultParams ** {{{ */
    _getDefaultParams : function () {

        var data = this.__base.apply(this, arguments);

        return data;

    },/*}}}*/

    /** calcTotalsForObject ** {{{ Рассчитываем суммарные значения для строки данных отчёта
     * @param {Object} objectTotals - Суммарные данные для текущего объекта
     * @param {Object} rowData - Подготовленные данные строки отчёта. Объект изменяется.
     * @param {Object} options - Параметры текущего объекта данных (см. описание в processReceivedDataItem)
     */
    calcTotalsForObject : function (objectTotals, rowData, options) {

        var
            Report__Data = this,
            Report = this.Report
        ;

        // Вызываем родительский метод
        this.__base.apply(this, arguments);

        // Считаем количество посещений
        if ( !rowData.count ) {
            rowData.count = 1;
        }
        else {
            rowData.count++;
        }

        // Показываем ли статистику для этого объекта
        objectTotals.show = true;

    },/*}}}*/

    /** processReceivedDataItem ** {{{ Обработать один элемент данных отчёта (переопределение)
     * @param {Object} dataItem - Данные одной записи (периода; могут не содержать информации о КО -- IdMonObject)
     * Пример получаемых данных для данного отчёта (objvisitdetail):
     * ```
     * dataItem = {
     *     FirstTime : 1497333132000,
     *     IdMonObject : 5585,
     *     IdObject : 440,
     *     LastTime : 1497339975000,
     * }
     * ```
     */
    processReceivedDataItem : function (dataItem) {

        var Report__Data = this, // _type_objvisitdetail
            Report = this.Report,
            that = this,

            // Параметры записи отчёта (информация о КО)
            options = that.getReportItemOptions(dataItem)
        ;

        debugger;
        var data = this.__base.apply(this, arguments);

        return data;

    },/*}}}*/

};

provide(__Data.declMod({ modName : 'type', modVal : 'objvisitdetail' }, __Data_type_objvisitdetail)); // provide

}); // module


