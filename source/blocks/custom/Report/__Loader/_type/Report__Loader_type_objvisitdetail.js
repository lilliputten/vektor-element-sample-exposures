/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, modules, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Loader_type_objvisitdetail
 * @overview Расширение модуля обработки полученных данных отчёта (objvisitdetail)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-07-10 19:23:49 +0300 (Пн, 10 июл 2017) $
 * $Id: Report__Loader_type_objvisitdetail.js 8728 2017-07-10 16:23:49Z miheev $
 *
 */

modules.define('Report__Loader', [
        'i-bem-dom',
        'vow',
        'objects',
        'project',
        'jquery',
    ],
    function(provide,
        BEMDOM,
        vow,
        objects,
        project,
        $,
    __Loader) {

/**
 *
 * @exports
 * @class Report__Loader_type_objvisitdetail
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

var isArray = Array.isArray;
var isEmpty = objects.isEmpty;

var __Loader_type_objvisitdetail = /** @lends Report__Loader_type_objvisitdetail.prototype */ {

    // Переопределяемые методы для отчёта objvisitdetail...

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
        receivedData
            .map(function(data){

                // Извлекаем пакет данных (если отсутствует, то null)
                return data.List;

            }, this)
            // Пропускаем, если данные пусты
            .filter(function(data) { return isArray(data) && data.length; })
            .map(function(data){

                // Вызываем переопределяемый метод
                this.__base.call(this, data, dataInfo);

            }, this)
        ;

    },/*}}}*/

};

provide(__Loader.declMod({ modName : 'type', modVal : 'objvisitdetail' }, __Loader_type_objvisitdetail)); // provide

}); // module


