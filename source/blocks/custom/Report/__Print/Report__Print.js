/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Print
 * @overview Блок-функционал для печати отчётов..
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date : 2017-06-02 18:07:27 +0300 (Пт, 02 июн 2017) $
 * $Id : Report__Print.js 8480 2017-06-02 15:07:27Z miheev $
 *
*/

modules.define('Report__Print', [
    'ReportPrintBody',
    'ReportPrint',
    // 'PrintReport',
    'requestor',
    'popup_controller',
    'vow',
    'i-bem-dom',
    'project',
    'jquery',
],
function(provide,
    ReportPrintBody,
    ReportPrint,
    // PrintReport,
    requestor,
    popup_controller,
    vow,
    BEMDOM,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Print
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

var __Print = /** @lends Report__Print.prototype */ {

    /** _getDefaultParams ** {{{ */
    _getDefaultParams : function () {
        return {

            loaderTimeout : 10000, // Максимальное время ожидания
            listenerInterval : 250, // Период опроса загрузки стилей

        };
    },/*}}}*/

    /** getPrintableHTML(NEW) ** {{{ Подготовить html для печати отчёта
     * TODO : Вынести в Report__Show?
     * См. блок `ReportPrint`, метод `printReportAction`.
     * @returns {String} HTML
     */
    getPrintableHTML : function () {

        var Report__Print = this,
            Report = this.Report,

            // Получаем экспотрные данные
            exportedData = Report.Modules.Data.exportData({ print : true }),

            // Общий шаблон для показа отчётов
            bemjson = [
                {
                    block : 'ReportPrint',
                    content : exportedData,
                },
            ],

            // Генерим html
            html = BEMHTML.apply(bemjson)

        ;

        return html;

    },/*}}}*/

    /** testProperty ** {{{ Проверяем наличие и соответствие значению свойство набора стилей dom-элемента
     * @param {DOM} dom - Узел dom.
     * @param {String} [selector] - CSS селектор, по которому выбираем подэлемент для сравнения.
     * @param {String} propName - Имя сравниваемого свойства.
     * @param {String} startsWith - Значение с которого должно начинаться свойство.
     * @returns {Boolean}
     */
    testProperty : function (dom, selector, propName, startsWith) {
        var
            testElem = ( selector ) ? $(dom).find(selector) : $(dom),
            propValue = testElem[0] && testElem[0].currentStyle && testElem[0].currentStyle[propName] || testElem.css(propName),
            isPropChanged = String(propValue).startsWith(startsWith)
        ;
        return isPropChanged;
    },/*}}}*/

    /** checkStylesLoading ** {{{ */
    checkStylesLoading : function () {

        var Report__Print = this,
            params = this.params,
            Report = this.Report,

            // ВНИМАНИЕ:
            // Загрузку определяем по установке `margin=0*` для `body` и `padding=20*` для `.ReportPrint`.
            // Может не срабатывать для к.-то браузеров или при изменении общих css-свойств проекта
            isTimeoutExceeded = ( ( Date.now() - params.loaderStarted ) > params.loaderTimeout ),     // Превышен ли интервал
            testBody = this.testProperty(params.popupBody, null, 'margin', '0'),
            testReportPrint = this.testProperty(params.popupBody, '.ReportPrint', 'padding', '20'), // NEW
            isPropChanged = testBody && testReportPrint

        ;

        // Устанавливаем флаг, удаляем таймер и показываем диалог печати
        if ( isPropChanged || isTimeoutExceeded ) {

            // Таймер
            if ( params.loadListener ) {
                clearInterval(params.loadListener);
                delete params.loadListener;
            }

            // Блоки в окне печати
            var ReportPrintBodyBlock = $(params.popupBody).bem(ReportPrintBody); // NEW
            var ReportPrintBlock = ReportPrintBodyBlock.findChildBlock(ReportPrint); // NEW
            ReportPrintBodyBlock.params.popupWindow = params.popupWindow;
            ReportPrintBodyBlock.setMod('ready');
            ReportPrintBodyBlock.setMod('canClose', isPropChanged);
            ReportPrintBodyBlock.showPrintDialog();

        }

    },/*}}}*/

    /** printReportAction ** {{{ Действие на кнопку "Печатать отчёт"
     * @param {Event} e -- Событие с кнопки
     * @param {Object} e.target -- DOM-объект кнопки
     * Смотрим:
     * - mod : Report_report_absent
     */
    printReportAction : function (e) {

        var Report__Print = this,
            params = this.params,
            Report = this.Report,

            // reportState = this.getMod('reportData'),
            // targetButton = e.target,

            // Положение окна печати
            winWidth = Math.round(screen.width / 1.5),
            winHeight = Math.round(screen.height / 1.5),
            winLeft = Math.round((screen.width - winWidth) / 2),
            winTop = Math.round((screen.height - winHeight) / 2),

            // Параметры окна печати
            popupOptions = {
                toolbar : 'no',
                location : 'no',
                // directories : 'no',
                // status : 'no',
                menubar : 'no',
                scrollbars : 'yes',
                resizable : 'yes',
                // fullscreen : 'yes',
                width : winWidth,
                height : winHeight,
                left : winLeft,
                top : winTop,
            },

            // Параметры в строку для `window.open`
            optionsStr = Object.keys(popupOptions).map(function (key) {
                return key + '=' + popupOptions[key];
            }).join(','),

            // Создаём окно
            popupWindow = window.open('', 'ReportPrint', optionsStr),

            // Элементы страницы
            popupHead = popupWindow && popupWindow.document.getElementsByTagName('head')[0],
            popupBody = popupWindow && popupWindow.document.body

        ;

        if ( popupWindow ) {

            $(popupBody).addClass('ReportPrintBody');
            $(popupBody).css('overflow', 'hidden');

            // Устанавливаем заголовок
            popupWindow.document.title = Report.params.reportTitle; // 'Печать отчёта';

            // Устанавливаем контент для печати
            popupWindow.document.body.innerHTML = this.getPrintableHTML();
            // TODO : Можно предварительно показывать индикатор загрузки...

            // Параметры окна печати
            params.popupBody = popupBody;
            params.popupWindow = popupWindow;
            params.loaderStarted = Date.now(); // Время старта загрузки стилей (см. ниже)
            // Ждём загрузки/подключения стилей
            params.loadListener = setInterval(this.checkStylesLoading.bind(this), params.listenerInterval);

            // Проверка на всякий случай -- если окно уже было инициализировано (не закрыто с прошлого раза)
            if ( !$(popupBody).hasClass('ReportPrintBody_cssIinited') ) {
                $(popupBody).addClass('ReportPrintBody_cssInited');
                // Добавляем стили с текущей страницы...
                $('link[rel=stylesheet]').map(function () {
                    // Только общие или для отчётов
                    // if ( this.href && ( this.href.includes('/App.styles.css') || this.href.includes('/Report.styles.css') ) ) {
                    var result = $(popupHead).append('<link rel="stylesheet" type="text/css" href="' + this.href + '" />');
                    // }
                });
            }

        }

        return false;

    },/*}}}*/

    // ***

    /** __error ** {{{ Обработка внутренней ошибки
     * @param {Object|*} error - Ошибка
     * @param {String} [methodName] - Имя метода, вызвавшего ошибку. Если не укзан, пробуем определить через `callee.caller`.
     * @returns {Promise} - reject-промис с ошибкой.
     *
     * Вывод сообщения о вызове (модуль, метод) в консоль, останавливает
     * выполнение (debugger), добавляет информацию о вызове в ошибку (если
     * объект), возвращает проваленный (rejected) промис с ошибкой.
     */
    __error : function (error, methodName) {

        methodName = methodName || ( arguments.callee && arguments.callee.caller && arguments.callee.caller.name ) || '(anonymous)'; // jshint ignore:line

        var errorId = __module.name + ':' + methodName;

        console.error( errorId, error );
        /*DEBUG*//*jshint -W087*/debugger;

        ( !Array.isArray(error) && typeof error !== 'object' ) || ( error = {error : error} );
        ( error && !Array.isArray(error) ) && ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Print = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Print = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Print', __Print)); // provide

}); // module

