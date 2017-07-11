/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DBG, DEBUG, app, project */
/**
 * @module ReportDisplayTitleStat__Item
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.08 17:29:29
 * @version 2017.06.08 17:29:29
 *
 * $Date: 2017-06-09 19:46:24 +0300 (Пт, 09 июн 2017) $
 * $Id: ReportDisplayTitleStat__Item.js 8583 2017-06-09 16:46:24Z miheev $
 */

modules.define('ReportDisplayTitleStat__Item', [
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
 * @exports
 * @class ReportDisplayTitleStat__Item
 * @bem
 *
 * TODO
 * ====
 *
 * ОПИСАНИЕ
 * ========
 *
 */
var ReportDisplayTitleStat__Item = /** @lends ReportDisplayTitleStat__Item.prototype */ {

    /** setWidth ** {{{ */
    setWidth : function (width) {
        this.domElem.outerWidth(width);
    },/*}}}*/

    /** getWidth ** {{{ */
    getWidth : function () {
        var width = this.domElem.outerWidth();
        return width;
    },/*}}}*/

    /** _onInited() ** {{{ Инициализация блока */
    _onInited : function () {

        var ReportDisplayTitleStat_Item = this,
            params = this.params
        ;

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                this.__base.apply(this, arguments);
                this._onInited();
            }

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('ReportDisplayTitleStat', 'Item', ReportDisplayTitleStat__Item)); // provide

}); // module
