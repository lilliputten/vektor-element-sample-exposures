/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayTitleStat
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.08 17:29:00
 * @version 2017.06.08 17:29:00
 *
 * $Date: 2017-06-14 13:51:11 +0300 (Ср, 14 июн 2017) $
 * $Id: ReportDisplayTitleStat.js 8591 2017-06-14 10:51:11Z miheev $
 *
 */

modules.define('ReportDisplayTitleStat', [
        'ReportDisplay',
        // 'Report',
        'i-bem-dom',
        'vow',
        'project',
        'objects',
        'jquery',
    ],
    function(provide,
        ReportDisplay,
        // Report,
        BEMDOM,
        vow,
        project,
        objects,
        $,
    __BASE) {

/**
 *
 * @exports
 * @class ReportDisplayTitleStat
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

var ReportDisplayTitleStat = /** @lends ReportDisplayTitleStat.prototype */ {

    /** _getDefaultParams ** {{{ */
    _getDefaultParams : function () {
        return {
            minResizeWidth : 50,
        };
    },/*}}}*/

    /** setItemWidth ** {{{ */
    setItemWidth : function (id, width) {

        var Item = this.params.itemsIndex[id];

        Item && Item.setWidth(width);

    },/*}}}*/

    /** getItemById ** {{{ */
    getItemById : function (id) {
        return this.params.itemsIndex[id];
    },/*}}}*/

    /** getTitleStatHeader ** {{{ Возвращаем кешированный ведущий блок (params.ReportDisplay.params.titleStatHeader) */
    getTitleStatHeader : function () {

        var ReportDisplayTitleStat = this,
            params = this.params
        ;

        if ( !params.titleStatHeader ) {
            params.titleStatHeader = params.ReportDisplay && params.ReportDisplay.params.titleStatHeader || {};
        }

        return params.titleStatHeader;

    },/*}}}*/

    /** itemOver ** {{{ */
    itemOver : function (e) {

        var
            titleStatHeader = this.getTitleStatHeader(),

            Item = e.bemTarget,
            id = Item && Item.params.id // Item.getMod('id')
        ;

        id && titleStatHeader.siblingItemsOver && titleStatHeader.siblingItemsOver(id);

    },/*}}}*/
    /** itemOut ** {{{ */
    itemOut : function (e) {

        var
            titleStatHeader = this.getTitleStatHeader(),

            Item = e.bemTarget,
            id = Item && Item.params.id // Item.getMod('id')
        ;

        id && titleStatHeader.siblingItemsOut && titleStatHeader.siblingItemsOut(id);

    },/*}}}*/
    /** itemResizeStart ** {{{ */
    itemResizeStart : function (e) {

        var
            titleStatHeader = this.getTitleStatHeader(),

            left = e.clientX,

            Delim = e.bemTarget,
            Item = Delim.findParentElem('Item'),

            id = Item && Item.params.id, // Item.getMod('id'),

            // Delim = Item.findChildElem('Delim'),
            delimLeft = Number ( Delim && Delim.domElem.offset().left ),
            delimWidth = Number ( Delim && Delim.domElem.outerWidth() ),

            // Расстояние от клика до правого края элемента (позже прибавляем к положению мыши)
            clickOffset = delimWidth - ( left - delimLeft ),

            undef
        ;

        // DBG( 'itemResizeStart', id, clickOffset, left, delimLeft, delimWidth );

        if ( id ) {

            titleStatHeader.siblingItemsResizeStart && titleStatHeader.siblingItemsResizeStart(id);

            // this.setMod('resizing', true);
            // this.setMod('resizingId', id);

            this.params.resizingItem = Item;
            this.params.resizingItemId = id;
            this.params.resizingClickOffset = clickOffset;

            this._domEvents(BEMDOM.doc).on('mousemove', this.itemResize, this);
            this._domEvents(BEMDOM.doc).on('mouseup', this.itemResizeEnd, this);

        }

    },/*}}}*/
    /** itemResizeEnd ** {{{ */
    itemResizeEnd : function (e) {

        var
            titleStatHeader = this.getTitleStatHeader(),

            id = this.params.resizingItemId // this.getMod('resizingId')
        ;

        if ( id ) {

            titleStatHeader.siblingItemsResizeEnd && titleStatHeader.siblingItemsResizeEnd(id);

            // this.delMod('resizing');
            // this.delMod('resizingId');

            delete this.params.resizingItem;
            delete this.params.resizingItemId;
            delete this.params.resizingClickOffset;

            this._domEvents(BEMDOM.doc).un('mousemove', this.itemResize, this);
            this._domEvents(BEMDOM.doc).un('mouseup', this.itemResizeEnd, this);

        }

    },/*}}}*/
    /** itemResize ** {{{ */
    itemResize : function (e) {

        var
            titleStatHeader = this.getTitleStatHeader(),

            id = this.params.resizingItemId,
            Item = this.params.resizingItem,
            itemLeft = Number ( Item && Item.domElem.offset().left ),

            left = e.clientX + this.params.resizingClickOffset,
            width = left - itemLeft,

            undef
        ;

        if ( width < this.params.minResizeWidth ) {
            width = this.params.minResizeWidth;
        }

        titleStatHeader.siblingItemsResize && titleStatHeader.siblingItemsResize(id, width);

    },/*}}}*/

    /** initUserEvents ** {{{ */
    initUserEvents : function () {

        var ReportDisplayTitleStat = this,
            params = this.params
        ;

        // Подсвечиваем "колонку"
        this._domEvents(params.items).on('mouseover', this.itemOver, this);
        this._domEvents(params.items).on('mouseout', this.itemOut, this);

        // Изменяем ширину "колонки" -- перетаскивание за разделитель (Delim)
        this._domEvents(this.findChildElems('Delim')).on('mousedown', this.itemResizeStart, this);

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportDisplayTitleStat = this,
            params = this.params
        ;

        // Находим блок-контейнер (ReportDisplay)
        params.ReportDisplay = this.findParentBlock(ReportDisplay);


        // Находим внутренние элементы (Item)
        params.items = this.findChildElems('Item');

        // ...И создаём индекс элементов
        params.itemsIndex = params.items.reduce(function(index, Item){
            var id = Item.params.id;
            index[id] = Item;
            return index;
        }, {});

        // События на действия пользователя
        this.initUserEvents();

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

provide(BEMDOM.declBlock(this.name, ReportDisplayTitleStat)); // provide

}); // module

