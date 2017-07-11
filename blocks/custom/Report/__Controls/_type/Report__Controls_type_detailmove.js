/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Controls_type_detailmove
 * @overview Расширение модуля обработки полученных данных отчёта (detailmove)
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.10, 16:42
 * @version 2017.05.10, 16:42
 *
 * $Date: 2017-06-02 17:43:07 +0300 (Пт, 02 июн 2017) $
 * $Id: Report__Controls_type_detailmove.js 8479 2017-06-02 14:43:07Z miheev $
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
 * @class Report__Controls_type_detailmove
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

var __Controls_type_detailmove = /** @lends Report__Controls_type_detailmove.prototype */ {

    // Переопределяемые методы для отчёта detailmove...

};

provide(__Controls.declMod({ modName : 'type', modVal : 'detailmove' }, __Controls_type_detailmove)); // provide

}); // module


