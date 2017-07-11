/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayGroup_expandable
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.22 19:38:18
 * @version 2017.05.22 19:38:18
 *
 * $Date: 2017-05-30 19:36:59 +0300 (Вт, 30 май 2017) $
 * $Id: ReportDisplayGroup_expandable.js 8449 2017-05-30 16:36:59Z miheev $
 *
 */

modules.define('ReportDisplayGroup', [
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
    ReportDisplayGroup) {

/**
 *
 * @exports
 * @class ReportDisplayGroup_expandable
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

var ReportDisplayGroup_expandable = /** @lends ReportDisplayGroup_expandable.prototype */ {

    /** _getDefaultParams ** {{{ */
    _getDefaultParams : function () {
        return {
            animationTime : 400,
        };
    },/*}}}*/

    /** expandAction ** {{{ */
    expandAction : function (event, data) {

        var ReportDisplayGroup_expandable = this,
            that = this,

            // Раскрываемый элемент
            DetailsElem = this._elem('Details'),

            // Раскрываемый элемент
            ContentElem = this._elem('DetailsContent'),

            // ??? Инвертируем, т.к. событие возникает до изменения состояния кнопки
            isExpanded = !this.params.expandButton.getMod('checked')

            // toggleFunc = isExpanded ? DetailsElem.slideDown : DetailsElem.slideUp
        ;

        var setHeight = ( isExpanded ) ? ContentElem.domElem.outerHeight() : 0;
        DetailsElem.domElem.css('max-height', setHeight+'px');

        this.setMod('expanded', isExpanded);

        // // TODO: Вынести в onSetMod?
        // toggleFunc.call(DetailsElem, this.params.animationTime);

    },/*}}}*/

    /** _actions() ** {{{ Действия пользователя и обработка событий */
    _actions : function () {

        var ReportDisplayGroup_expandable = this;

        this.__base.apply(this, arguments);

        this.params.expandButton = this.findChildElem('TitleExpand').findChildBlock({ block : BEMDOM.entity('button'), modName : 'id', modVal : 'Expand' });
        if ( this.params.expandButton && this.expandAction ) {
            this._domEvents(this.params.expandButton.domElem).on('click', this.expandAction.bind(this));
        }

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportDisplayGroup_expandable = this;

        this.__base.apply(this, arguments);

        this._actions();

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (expanded) ** {{{ Раскрытый блок */
        expanded : {

            /** '*' ** {{{ */
            '*' : function (modName, modVal) {
                this.Stat && this.Stat.setMod(modName, modVal);
            },/*}}}*/

        },/*}}}*/

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {

                this._onInited();

            }

        },/*}}}*/

    },/*}}}*/

};

provide(ReportDisplayGroup.declMod({ modName : 'expandable', modVal : true }, ReportDisplayGroup_expandable)); // provide

}); // module


