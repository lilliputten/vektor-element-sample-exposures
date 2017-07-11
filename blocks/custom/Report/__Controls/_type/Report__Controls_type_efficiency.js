/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Controls_type_efficiency
 * @overview Расширение модуля обработки полученных данных отчёта (efficiency)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-06-02 17:43:07 +0300 (Пт, 02 июн 2017) $
 * $Id: Report__Controls_type_efficiency.js 8479 2017-06-02 14:43:07Z miheev $
 *
 */

modules.define('Report__Controls', [
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
    __Controls) {

/**
 *
 * @exports
 * @class Report__Controls_type_efficiency
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

var __Controls_type_efficiency = /** @lends Report__Controls_type_efficiency.prototype */ {

    // Переопределяемые методы для отчёта efficiency...

    // /** getBoxActionMainFiltersContent ** {{{ */
    // getBoxActionMainFiltersContent : function () {
    //
    //     return vow.cast( this.__base.apply(this, arguments) )
    //         .then(function(content){
    //             Array.isArray(content) || ( content = [content] );
    //             content.push({ block : 'xexe', content : 'xexe conntent' });
    //             return content;
    //         })
    //     ;
    //
    // },/*}}}*/

};

provide(__Controls.declMod({ modName : 'type', modVal : 'efficiency' }, __Controls_type_efficiency)); // provide

}); // module


