/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Loader_type_efficiency
 * @overview Расширение модуля обработки полученных данных отчёта (efficiency)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Loader_type_efficiency.js 8728 2017-07-10 16:23:49Z miheev $
 *
 */

modules.define('Report__Loader', [
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
    __Loader) {

/**
 *
 * @exports
 * @class Report__Loader_type_efficiency
 * @bem
 * @classdesc __INFO__
 *
 * TODO
 * ====
 *
 * ОПИСАНИЕ
 * ========
 *
 * См. WEB_TINTS/_docs/KupolClient/Запрос отчета о работоспособности НАП.doc
 *
 */

// Ссылка на описание модуля
var __module = this;

var __Loader_type_efficiency = /** @lends Report__Loader_type_efficiency.prototype */ {

    // Переопределяемые методы для отчёта efficiency...

    /** receiveReportDataPart ** {{{ Принимаем часть данных отчёта
     * @param {Object} receivedData - Данные отчёта (частичные или полные).
     * @param {Object} [dataInfo] - "Сырые" данные ответа от сервера.
     *
     * Данные приезжают не в самом пакете данных (resp), а во вложенной структуре `DetailResult`.
     * Там же может содержаться фрагмент обобщённых данных `CommonResult`.
     * Данные могут быть единичным объектом (для асинхронной передачи) или массивом объектов (для синхронного режима).
     *
     */
    receiveReportDataPart : function (receivedData, dataInfo) {

        var
            Report__Loader = this,
            Report = this.Report,
            that = this,

            reportData = Report.params.reportData
        ;

        // Унифицируем до массива (в sync-режиме возвращается массив)
        Array.isArray(receivedData) || ( receivedData = [receivedData] );

        // Проходим по массиву
        receivedData.map(function(data){

            // Сохраняем обобщённую информацию (для totals).
            // Считаем, что CommonResult приходит только один раз, иначе перезаписываем.
            if ( data.CommonResult ) {
                // reportData.CommonResult = data.CommonResult; // не сохраняем???
                Report.Modules.Data.assignCommonTotals(data.CommonResult);
            }

            // Извлекаем пакет данных (если отсутствует, то null)
            data = data.DetailResult;

            // Вызываем переопределяемый метод
            that.__base.call(that, data, dataInfo);

        });

    },/*}}}*/

};

provide(__Loader.declMod({ modName : 'type', modVal : 'efficiency' }, __Loader_type_efficiency)); // provide

}); // module


