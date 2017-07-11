/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayTitleStat_mode_header
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.09 15:34:32
 * @version 2017.06.09 15:34:32
 *
 * $Date: 2017-06-22 15:21:55 +0300 (Чт, 22 июн 2017) $
 * $Id: ReportDisplayTitleStat_mode_header.js 8619 2017-06-22 12:21:55Z miheev $
 *
 */

modules.define('ReportDisplayTitleStat', [
        'Report',
        'ReportDisplay',
        // 'ReportDisplayGroup',
        'i-bem-dom',
        'i-bem-dom__collection',
        'vow',
        'project',
        'jquery',
    ],
    function(provide,
        Report,
        ReportDisplay,
        // ReportDisplayGroup,
        BEMDOM,
        BemDomCollection,
        vow,
        project,
        $,
    ReportDisplayTitleStat) {

/**
 *
 * @exports
 * @class ReportDisplayTitleStat_mode_header
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
 * @class ReportDisplayTitleStat_mode_header
 * @bem
 *
 */
var ReportDisplayTitleStat_mode_header = /** @lends ReportDisplayTitleStat_mode_header.prototype */ {

    /** initItemWidth ** {{{ */
    initItemWidth : function (ItemOrId) {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params,

            isId = typeof ItemOrId === 'string',
            Item = isId ? this.getItemById(ItemOrId) : ItemOrId,
            id = isId ? ItemOrId : Item && Item.params && Item.params.id,

            width = Number( Item && Item.getWidth() ),
            setWidth = Math.max(params.minResizeWidth, width + 1) // ???
        ;

        // // NOTE:ALT:
        // params.siblings && params.siblings.map(function(titleStatBlock){
        //     titleStatBlock.setItemWidth(id, setWidth);
        // }, this);

        // NOTE:ALT:
        id && params.siblingItems[id] && params.siblingItems[id].map(function(Item){
            Item && Item.setWidth(setWidth);
        });

    },/*}}}*/

    /** initWidths ** {{{ */
    initWidths : function () {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        params.items && params.items.map(this.initItemWidth, this);

    },/*}}}*/

    /** siblingItemsOver ** {{{ Посвечиваем "колонку" -- все элементы с данным id у соседних/вложенных таблиц-заголовков */
    siblingItemsOver : function (id) {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        // params.siblingItems.__ALL__.delMod('hovered');
        id && params.siblingItems[id] && params.siblingItems[id].setMod('hovered');

    },/*}}}*/
    /** siblingItemsOut ** {{{ Отменяем подсвечивание "колонки" */
    siblingItemsOut : function (id) {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        id && params.siblingItems[id] && params.siblingItems[id].delMod('hovered');

    },/*}}}*/

    /** siblingItemsResizeStart ** {{{ Начинаем изменение ширины элемента для всех соседних/вложенных таблиц-заголовков */
    siblingItemsResizeStart : function (id) {


        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        // this.setMod('resize');
        params.siblings.setMod('resizing');
        params.siblings.setMod('resizingId', id);
        $('body').addClass('resizing-h');

        id && params.siblingItems[id] && params.siblingItems[id].setMod('resizing');

    },/*}}}*/
    /** siblingItemsResizeEnd ** {{{ Завершаем изменение ширины элемента для всех соседних/вложенных таблиц-заголовков */
    siblingItemsResizeEnd : function (id) {


        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        // this.delMod('resize');
        params.siblings.delMod('resizing');
        params.siblings.delMod('resizingId');
        $('body').removeClass('resizing-h');

        id && params.siblingItems[id] && params.siblingItems[id].delMod('resizing');

    },/*}}}*/
    /** siblingItemsResize ** {{{ Изменяем размер элемента для всех соседних/вложенных таблиц-заголовков */
    siblingItemsResize : function (id, width) {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        // id && params.siblingItems[id] && params.siblingItems[id].delMod('resizing');

        id && params.siblingItems[id] && params.siblingItems[id].map(function(Item){
            Item && Item.setWidth(width);
        });
    },/*}}}*/

    /** onReportScroll ** {{{ */
    onReportScroll : function (e) {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params,

            ReportTop = params.Report.domElem.offset().top,
            ReportDisplayTop = params.ReportDisplay.domElem.offset().top,
            ReportContainerTop = params.ReportContainer.domElem.offset().top,
            topOffset = ReportTop - ReportDisplayTop,

            undef
        ;

        params.ParentGroup.domElem.css( 'top', topOffset + 10 );

    },/*}}}*/

    /** initUserEvents ** {{{ */
    initUserEvents : function () {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params

        ;

        this.__base.apply(this, arguments);

        this._domEvents(params.ReportContainer).on('scroll', this.onReportScroll, this);

    },/*}}}*/

    /** _onInited() ** {{{ Инициализация блока */
    _onInited : function () {

        var ReportDisplayTitleStat_mode_header = this,
            params = this.params
        ;

        // Находим блок отчёта
        params.Report = this.findParentBlock(Report);
        params.ReportContainer = params.Report && params.Report.findChildElem('container');

        params.ParentGroup = this.findParentBlock(BEMDOM.entity('ReportDisplayGroup'));

        // Инициализация блока-родителя
        this.__base.apply(this, arguments);

        params.ReportDisplay.params.titleStatHeader = this;

        // Находим соседние/подчинённые блоки (ReportDisplayTitleStat)
        params.siblings = params.ReportDisplay.findChildBlocks(this.__self);

        // Создаём коллекции элементов (Item) по идентификаторам в соседних/подчинённых блоках (params.siblings)
        params.siblingItems = this.params.items.reduce(function(siblingItems, Item){
            var id = Item.params.id; // Item.getMod('id');
            if ( id ) {
                var Items = params.siblings.map(function(Sibling){
                    return Sibling.getItemById(id); // NOTE:ALT: Sibling.findChildElem({ elem : 'Item', modName : 'id', modVal : id });
                });
                siblingItems[id] = new BemDomCollection(Items);
                siblingItems.__ALL__ = siblingItems.__ALL__.concat(siblingItems[id]);
            }
            return siblingItems;
        }, { __ALL__ : new BemDomCollection() });

        this.initWidths();

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                this._onInited();
            }

        },/*}}}*/

    },/*}}}*/

};

provide(ReportDisplayTitleStat.declMod({ modName : 'mode', modVal : 'header' }, ReportDisplayTitleStat_mode_header)); // provide

}); // module
