/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportDisplay
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.02 18:37:17
 * @version 2017.06.02 18:37:17
 *
 * $Date: 2017-06-22 15:21:55 +0300 (Чт, 22 июн 2017) $
 * $Id: ReportDisplay.js 8619 2017-06-22 12:21:55Z miheev $
 *
 */

modules.define('ReportDisplay', [
        'nicescroll',
        'i-bem-dom',
        'vow',
        'project',
        'jquery',
    ],
    function(provide,
        nicescroll,
        BEMDOM,
        vow,
        project,
        $,
    __BASE) {

/**
 *
 * @exports
 * @class ReportDisplay
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

var ReportDisplay = /** @lends ReportDisplay.prototype */ {

    /** exportData ** {{{ Экспортируем данные для печати/экспорта из объектов в созданном DOM
     * @returns {Object}
     */
    exportData : function (conditions) {

        var exportables = this.findChildBlocks(BEMDOM.entity('exportable'));

        var data = exportables
            .map(function(exportable){
                var providerType = exportable.getMod('provider'),
                    provider = providerType && exportable.findMixedBlock(BEMDOM.entity(providerType))
                ;
                return provider || exportable;
            })
            .map(function(provider){
                var data = provider;
                if ( provider && typeof provider === 'object' ) {
                    if ( typeof provider.exportData === 'function' ) {
                        data = provider.exportData(conditions);
                    }
                    else if ( provider.params && provider.params.export ) {
                        data = provider.params.export;
                    }
                }
                return data;
            })
            .filter(function(data){
                return data;
            })
        ;

        return data;

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportDisplay = this,
            that = this,
            params = this.params,
            undef
        ;

        // this._actions();

        // if ( !this.params.nicescroll ) {
        //     this.params.nicescroll = nicescroll.init(this);
        // }

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {

                var ReportDisplay = this,
                    that = this,
                    params = this.params,
                    undef
                ;

                this._onInited();

            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declBlock(this.name, ReportDisplay, /** @lends ReportDisplay */{

    // /** live() {{{ Lazy-инициализация.
    //  */
    // live : function() {
    //
    //     var ptp = this.prototype;
    //     // this.liveInitOnBlockInsideEvent('tree_toggle', 'menu-item', ptp._onTreeToggle);
    //
    //     return this.__base.apply(this, arguments);
    // }/*}}}*/

})); // provide

}); // module

