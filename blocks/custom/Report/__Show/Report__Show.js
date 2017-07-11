/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Show
 * @overview Блок-функционал для показа отчёта и статистики.
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-06-22 15:21:55 +0300 (Чт, 22 июн 2017) $
 * $Id: Report__Show.js 8619 2017-06-22 12:21:55Z miheev $
 *
 */

modules.define('Report__Show', [
    'next-tick',
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
    nextTick,
    vow,
    BEMDOM,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Show
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

var __Show = /** @lends Report__Show.prototype */ {

    /** updateReportDone() ** {{{ Завершаем вывод отчёта
     * Вызывается из Report__Controls:applyReportProcess.
     */
    updateReportDone : function () {

        var Report__Show = this,
            Report = this.Report
        ;

        try {

            // Модификаторы
            Report.setMod('report_absent', false);
            Report.setMod('report_created', true);

        }
        catch (error) {
            console.error(error);
            /*DEBUG*//*jshint -W087*/debugger;
            app.error(error);
        }

    },/*}}}*/

    // ***

    /** __error ** {{{ Обработка внутренней ошибки
     * @param {Object|*} error - Ошибка
     * @param {String} [methodName] - Имя метода, вызвавшего ошибку. Если не укзан, пробуем определить через `callee.caller`.
     * @returns {Promise} - reject-промис с ошибкой.
     *
     * Вывод сообщения о вызове (модуль, метод) в консоль, останавливает
     * выполнение (debugger), добавляет информацию о вызове в ошибку (если
     * объект), возвращает проваленный (rejected) промис с ошибкой.
     */
    __error : function (error, methodName) {

        methodName = methodName || ( arguments.callee && arguments.callee.caller && arguments.callee.caller.name ) || '(anonymous)'; // jshint ignore:line

        var errorId = __module.name + ':' + methodName;

        console.error( errorId, error );
        /*DEBUG*//*jshint -W087*/debugger;

        ( !Array.isArray(error) && typeof error !== 'object' ) || ( error = {error: error} );
        ( error && !Array.isArray(error) ) && ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Show = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Show = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Show', __Show)); // provide

}); // module

