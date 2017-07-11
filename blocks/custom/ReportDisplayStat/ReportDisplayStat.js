/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayStat
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.05 17:19:20
 * @version 2017.06.05 17:19:20
 *
 * $Date: 2017-06-06 15:15:36 +0300 (Вт, 06 июн 2017) $
 * $Id: ReportDisplayStat.js 8547 2017-06-06 12:15:36Z miheev $
 *
 */

modules.define('ReportDisplayStat', [
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
    __BASE) {

/**
 *
 * @exports
 * @class ReportDisplayStat
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

var ReportDisplayStat = /** @lends ReportDisplayStat.prototype */ {

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
                var ItemContent = Item._elem('ItemContent');
                return {
                    elem : 'Item',
                    id : Item.params.id,
                    title : Item.params.title,
                    val : ItemContent.domElem.html(),
                };
            })
        ;
    },/*}}}*/

    /** isVisibleItem ** {{{ */
    isVisibleItem : function (Item) {
        return Item && !Item.getMod('print') && !Item.getMod('export') && !Item.getMod('hidden');
    },/*}}}*/

    /** visibleItems ** {{{ Количество видимых элементов  */
    visibleItems : function () {
        return this.findChildElems('Item')
            .filter(this.isVisibleItem, this)
        ;
    },/*}}}*/

    /** visibleItemsCount ** {{{ Количество видимых элементов  */
    visibleItemsCount : function () {
        return this.visibleItems().size();
    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportDisplayStat = this;

        this.visibleItemsCount() || this.setMod('hidden');

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {

                var ReportDisplayStat = this,
                    that = this,
                    params = this.params,
                    undef
                ;

                this._onInited();

            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declBlock(this.name, ReportDisplayStat)); // provide

}); // module

