/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplayGroup
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.22 16:50:22
 * @version 2017.05.22 16:50:22
 *
 * $Date: 2017-05-30 19:36:59 +0300 (Вт, 30 май 2017) $
 * $Id: ReportDisplayGroup.js 8449 2017-05-30 16:36:59Z miheev $
 *
 */

modules.define('ReportDisplayGroup', [
    'tableview',
    'ReportDisplayStat',
    'ReportDisplayTitleStat',
    'i-bem-dom',
    'vow',
    'objects',
    'project',
    'jquery',
],
function(provide,
    tableview,
    ReportDisplayStat,
    ReportDisplayTitleStat,
    BEMDOM,
    vow,
    objects,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class ReportDisplayGroup
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

var exportableEntities = [
    'Stat',
    'Table',
];

var exportableMods = [
    // 'hideIfEmpty',
    'showTitle',
    // 'expandable',
    // 'expanded',
    'showStat',
    'showTable',
    'tableFirst',
];

var ReportDisplayGroup = /** @lends ReportDisplayGroup.prototype */ {

    /** exportData ** {{{ */
    exportData : function (conditions) {

        var data = {
            elem : 'Group',
        };

        if ( this.params.id ) {
            data.id = this.params.id;
        }

        if ( this.params.title ) {
            data.title = this.params.title;
        }

        var mods = exportableMods.reduce(function(mods, id){
            if ( this.hasMod(id) ) {
                mods[id] = this.getMod(id);
            }
            return mods;
        }.bind(this), {});
        if ( !objects.isEmpty(mods) ) {
            data.mods = mods;
        }

        var entriesData = exportableEntities.reduce(function(entriesData, what){
            if ( this[what] && typeof this[what].exportData === 'function' ) {
                var thisData = this[what].exportData(conditions);
                if ( !objects.isEmpty(thisData) ) {
                    entriesData[what] = thisData;
                }
            }
            return entriesData;
        }.bind(this), {});
        if ( !objects.isEmpty(entriesData) ) {
            Object.assign(data, entriesData);
            return data;
        }
        else if ( !this.getMod('hideIfEmpty') ) {
            return data;
        }

        // else return undefined!

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportDisplayGroup = this;

        this.Table = this.findChildBlock(tableview); // ReportDisplayTable),
        this.Stat = this.findChildBlock(ReportDisplayStat) || this.findChildBlock(ReportDisplayTitleStat);

        // Если содержатся только скрытые элементы, то прячем саму группу
        var onlyHidden = exportableEntities.reduce(function(onlyHidden, what){
            return ( onlyHidden && ( !this[what] || this[what].getMod('hidden') ) );
        }.bind(this), true);
        if ( onlyHidden ) {
            this.setMod('hidden');
        }

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

provide(BEMDOM.declBlock(this.name, ReportDisplayGroup)); // provide

}); // module

