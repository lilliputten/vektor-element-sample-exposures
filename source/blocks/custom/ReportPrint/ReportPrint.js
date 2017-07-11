/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportPrint
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.02 19:21:03
 * @version 2017.06.02 19:21:03
 *
 * $Date: 2017-06-06 15:15:36 +0300 (Вт, 06 июн 2017) $
 * $Id: ReportPrint.js 8547 2017-06-06 12:15:36Z miheev $
 *
 */

modules.define('ReportPrint', [
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
    __BASE) {

/**
 *
 * @exports
 * @class ReportPrint
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

var ReportPrint = /** @lends ReportPrint.prototype */ {

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportPrint = this,
            undef
        ;

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {

                this._onInited();

            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declBlock(this.name, ReportPrint)); // provide

}); // module

