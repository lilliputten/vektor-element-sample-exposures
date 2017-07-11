/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module ReportPrintBody
 * @overview __INFO__
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.02 19:21:03
 * @version 2017.06.02 19:21:03
 *
 * $Date: 2017-06-08 17:07:00 +0300 (Чт, 08 июн 2017) $
 * $Id: ReportPrintBody.js 8576 2017-06-08 14:07:00Z miheev $
 *
 */

modules.define('ReportPrintBody', [
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
 *
 * @exports
 * @class ReportPrintBody
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

var ReportPrintBody = /** @lends ReportPrintBody.prototype */ {

    /** showPrintDialog ** {{{ Показать диалог печати */
    showPrintDialog : function () {

        var
            that = this,
            popupWindow = this.params.popupWindow || window,
            Holder = this._elem('Holder')
        ;

        // Запускаем печать
        if ( !project.config.DEBUG || project.config.LOCAL_NGINX ) {

            // Задержка в расчёте на анимацию скрытия заставки
            setTimeout(function(){

                BEMDOM.destruct(Holder.domElem);

                popupWindow.print();

                // Если стили подключены, закрываем окно (???)
                if ( that.hasMod('canClose') ) {

                    // Иначе оставляем открытым.
                    // Пользователю предоставляется закрыть самому --
                    // что-то пошло не так, пусть разбирается сам.
                    popupWindow.close();

                }
            }, 300);

        }

    },/*}}}*/

    /** _onInited() ** {{{ Инициализируем блок */
    _onInited : function () {

        var ReportPrintBody = this,
            undef
        ;

        // this.setMod('ready');

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

provide(BEMDOM.declBlock(this.name, ReportPrintBody)); // provide

}); // module

