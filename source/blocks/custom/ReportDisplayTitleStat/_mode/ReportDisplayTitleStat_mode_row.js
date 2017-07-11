/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayTitleStat_mode_row
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.09 15:34:32
 * @version 2017.06.09 15:34:32
 *
 * $Date: 2017-06-09 19:46:24 +0300 (Пт, 09 июн 2017) $
 * $Id: ReportDisplayTitleStat_mode_row.js 8583 2017-06-09 16:46:24Z miheev $
 *
 */

modules.define('ReportDisplayTitleStat', [
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
    ReportDisplayTitleStat) {

/**
 *
 * @exports
 * @class ReportDisplayTitleStat_mode_row
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

/**
 * @exports
 * @class ReportDisplayTitleStat_mode_row
 * @bem
 *
 */
var ReportDisplayTitleStat_mode_row = /** @lends ReportDisplayTitleStat_mode_row.prototype */ {

    /** exportableItems ** {{{ */
    exportableItems : function (conditions) {
        return this.findChildElems('Item')
            .filter(function(Item){
                return ( !Item.params.conditions || objects.isComprised(conditions, Item.params.conditions) );
            })
        ;
    },/*}}}*/

    /** exportData ** {{{ */
    exportData : function (conditions) {
        return this.exportableItems(conditions)
            .map(function(Item){
                var ItemText = Item._elem('Text');
                return {
                    elem : 'Item',
                    id : Item.params.id,
                    title : Item.params.title,
                    val : ItemText.domElem.html(),
                };
            })
        ;
    },/*}}}*/

    // /** _onInited() ** {{{ Инициализация блока */
    // _onInited : function () {
    //
    //     var ReportDisplayTitleStat_mode_row = this,
    //         undef
    //     ;
    //
    // },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        // /** (js:inited) ** {{{ Инициализация bem блока */
        // js : {
        //
        //     inited : function () {
        //         this.__base.apply(this, arguments);
        //         this._onInited();
        //     }
        //
        // },/*}}}*/

    },/*}}}*/

};

provide(ReportDisplayTitleStat.declMod({ modName : 'mode', modVal : 'row' }, ReportDisplayTitleStat_mode_row)); // provide

}); // module
