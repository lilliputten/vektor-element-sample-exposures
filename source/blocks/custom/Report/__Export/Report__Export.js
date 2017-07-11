/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger, BEMHTML, DEBUG, DBG, app, project */
/**
 *
 * @module Report__Export
 * @overview Блок-функционал для экспорта отчёта и статистики.
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.02 15:47:12
 * @version 2017.05.03, 21:37
 *
 * $Date: 2017-07-07 14:52:50 +0300 (Пт, 07 июл 2017) $
 * $Id: Report__Export.js 8705 2017-07-07 11:52:50Z miheev $
 *
*/

modules.define('Report__Export', [
    'FileSaver',
    // 'WordExport',
    // 'loader_type_js',
    'loader_type_libs',
    'requestor',
    'popup_controller',
    'vow',
    'i-bem-dom',
    'objects',
    'project',
    'jquery',
],
function(provide,
    FileSaver,
    // WordExport,
    // jsLoader,
    libsLoader,
    requestor,
    popup_controller,
    vow,
    BEMDOM,
    objects,
    project,
    $,
__BASE) {

/**
 *
 * @exports
 * @class Report__Export
 * @bem
 * @classdesc __INFO__
 *
 * TODO
 * ====
 *
 * 2017.06.29, 16:47 -- Вынести создание pdf в отдельный модуль.
 *
 * ОПИСАНИЕ
 * ========
 *
 */

// Ссылка на описание модуля
var __module = this;

var __Export = /** @lends Report__Export.prototype */ {

    /** getPdfElemGroupStat ** {{{ Подготовить блок статистики для pdf
     * @param {Object[]} Stat - Список полей параметров статистики
     * @param {String} Stat.elem - const 'Item' (?) Тип элемента (пока только `Item`)
     * @param {String} Stat.id - Идентификатор параметра.
     * @param {String} Stat.title - Название.
     * @param {String|Number} Stat.val - Значение.
     * Пока исходим из того, что передаётся одномерный массив элементов с перечисленными выше свойствами.
     * @returns {Object}
     */
    getPdfElemGroupStat : function (Stat) {

        if ( Array.isArray(Stat) ) {
            return Stat.map(function(item){
                return {
                    text :  item.title + ':' + item.val,
                    marginTop: 2, // другие варианты не работают
                    marginBottom: 2, // другие варианты не работают
                    // ...
                };
            }, this);
        }

        // return 'Ошибка?'; // ???

    },/*}}}*/

    /** getPdfElemGroupTable ** {{{ Подготовить блок таблицы для pdf
     * @param {Object} Table
     * @param {String[]} Table.columns - Описания колонок таблицы
     * @param {String[][]} Table.rows - Данные строк таблицы
     * @returns {Object}
     */
    getPdfElemGroupTable : function (Table) {

        var columns = Table.columns,
            rows = Table.rows,
            body = [columns].concat(rows)
        ;

        return {
            table : {
                headerRows : 1,
                body : body,
            },
            layout: 'headerLineOnly'


        };

    },/*}}}*/

    /** getPdfGroup ** {{{ Подготовить блок группы данных для pdf
     * @returns {Object}
     */
    getPdfGroup : function (group) {

        var

            // Идентификатор
            groupId = group.id,

            // Опции
            mods = group.mods,

            // Статистика
            Stat = mods.showStat && group.Stat && this.getPdfElemGroupStat(group.Stat),
            // Таблица
            Table = mods.showTable && group.Table && this.getPdfElemGroupTable(group.Table),

            // Резльтат
            result = []
        ;

        // Добавляем статистику
        if ( Stat ) {
            result.push(Stat);
        }

        // Добавляем таблицу
        if ( Table ) {
            if ( mods.tableFirst ) {
                result.unshift(Table);
            }
            else {
                result.push(Table);
            }
        }

        // Заголовок группы
        if ( group.title && mods.showTitle ) {
            result.unshift({
                text :  group.title,
                fontSize:16,
                marginTop:5,
                marginBottom: 5,

                // ...
            });
        }

        return result;

    },/*}}}*/

    /** getPdfTitle ** {{{ Создать элемент заголовка отчёта
     * @param {String} elem - Объект описания заголовка
     * @param {String} elem.title - Текст заголовка
     * @return {Object}
     */
    getPdfTitle : function (elem) {

        return {
            text:  elem.content,
             fontSize: 20,
            // padding: 10,
            marginTop:10,
            marginBottom: 10,
            // pageBreak: 'after',
            // ...
        };

    },/*}}}*/

    /** getPdfItemContent ** {{{ Создать контент для каждого элемента описания отчёта
     * @param {Object} item - Элемент описания отчёта
     * @param {String} item.elem - Тип элемента отчёта (Title,Group)
     * @returns {Object}
     */
    getPdfItemContent : function (item, key) {

        // Заголовок
        if ( item.elem === 'Title' ) {
            return this.getPdfTitle(item);
        }
        else if ( item.elem === 'Group' ) {
            return this.getPdfGroup(item);
        }

        return item; // ??? возвращать путой объект, выкидывать ошибку?

    },/*}}}*/

    /** getPdfDocument ** {{{ Создать Pdf-документ
     * @param {Object[]} reportContent - список элементов описания отчёта
     * @returns {Object}
     */
    getPdfDocument : function (reportContent) {

        var Report__Export = this,
            Report = this.Report,

            // Контент отчёта
            docContent = reportContent.map(this.getPdfItemContent, this)
        ;


        // Полное описание отчёта для pdfmake
        var docInfo = {

            info: {
                title: Report.params.reportTitle,
                author: 'Вектор',
                subject: 'Theme',
                keywords: 'Ключевые слова'
            },

            pageSize: 'A4',
            pageOrientation: 'landscape', // 'portrait'
            pageMargins: [50, 50, 30, 60],

            /*
            header : function (currentPage, pageCount) {
                return {
                    text: currentPage.toString() + 'из' + pageCount,
                    alignment: 'right',
                    margin: [0, 30, 10, 50]
                };
            },
            */

            footer: [
                {
                    text: 'СОКБ Вектор',
                    alignment: 'center', // left right
                }
            ],

            content: docContent,
            // [
            //
            //     {
            //         text: 'ТЦМ: Отчет о пробеге за период ',
            //         fontSize: 26,
            //         padding: 10,
            //         margin: 10
            //         //pageBreak:'after'
            //     },
            //
            //     {
            //         text: 'Начало периода: ', //+ reportParams.BeginTimeStr
            //         fontSize: 16,
            //         padding: 10,
            //         margin: 10
            //
            //         //pageBreak:'after'
            //     },
            //
            //     {
            //         text: 'Конец периода: ', //+ reportParams.EndTimeStr
            //         fontSize: 16,
            //         padding: 10,
            //         margin: 10
            //         //pageBreak:'after'
            //     },
            //
            //     {
            //         table: {
            //             body: '???', // tableData,
            //             headerRows: 1,
            //         },
            //     },
            //
            //     {
            //         text: 'Общая статистика ',
            //         fontSize: 16,
            //         padding: 10,
            //         margin: 10,
            //         // pageBreak: 'after',
            //     },
            //     /*
            //     {
            //         table: {
            //             body: tableData,
            //             headerRows: 1,
            //         }
            //     },
            //     */
            //
            //     {
            //         text: 'Статистика по объектам ',
            //         fontSize: 16,
            //         padding: 10,
            //         margin: 10
            //             //pageBreak:'after'
            //     },
            //     /*
            //     {
            //         table: {
            //             body: tableData,
            //             headerRows: 1,
            //         }
            //     },
            //     */
            //
            // ],

            styles: {
                header: {
                    fontSize: 25,
                    bold: true,
                    alignment: 'right'
                }
            }
        };

        return docInfo;

    },/*}}}*/

    /** savePdfReport ** {{{ Сохраняем отчёт в PDF
     */
    savePdfReport : function () {

        try {

            var Report__Export = this,
                Report = this.Report,

                // Имя файла
                fileName = 'report-' + Report.params.reportType + '.pdf',

                // Получаем экспотрные данные
                exportedData = Report.Modules.Data.exportData({ export : true }),

                // docInfo = this.getPdfDocument(reportContent)
                docInfo = this.getPdfDocument(exportedData)

            ;

            return new vow.Promise(function (resolve, reject) {

                try {

                    if ( !window.pdfMake ) {
                        return reject({error: 'Отсутствует библиотека pdfmake!'});
                    }

                    window.pdfMake.createPdf(docInfo).download(fileName,
                        // Завершение создания отчёта
                        function __createReportDone() {
                            return resolve({status: 'Отчёт создан'});
                        },
                        // Опции (?)
                        {}
                    );

                }
                catch (error) {
                    console.error('savePdfReport error:', error);
                    /*DEBUG*//*jshint -W087*/debugger;
                    // app.error(error);
                    return reject(error);
                }

            });
        }
        catch (error) {
            console.error('savePdfReport error:', error);
            /*DEBUG*//*jshint -W087*/debugger;
            return vow.Promise.reject(error);
        }

    },/*}}}*/

    /** savePdfWrapper ** {{{ Подготавливаем окружение и обрабатываем ошибки сохранения pdf */
    savePdfWrapper : function () {

        var Report__Export = this,
            Report = this.Report,
            that = this,

            requiredLibs = project.config.libs.pdfmake.js,
            requiredLibsCacheTime = app.config.cache.lifetime_long

        ;

        // Предварительно убеждаемся в загруженности библиотек...

        // Вариант 1: По очереди:
        var promise = requiredLibs.reduce(function (promise, url) {
            return promise
                .then(function (data) {
                    return app.resolve_assets({url: url, expires: requiredLibsCacheTime});
                })
                ;
        }, vow.cast(null));
        // // Вариант 2: Все вместе:
        // var promise = app.resolve_assets(requiredLibs.map(function(url){
        //     return { url: url, expires: requiredLibsCacheTime };
        // }))

        promise

            // Ошибка загрузки ресурсов...
            .fail(function (error) {
                console.warn('showSaveDialog error:', error);
                /*DEBUG*//*jshint -W087*/debugger;
                ( Array.isArray(error) ? error : ( error = [error] ) )
                    .unshift('Ошибка загрузки библиотек для работы с pdf!');
                // Передаём ошибку дальше
                return vow.Promise.reject(error);
            })
            // Успешное завершение
            .then(function (data) {
                return that.savePdfReport(data);
            })
            // Финальная ошибка создания pdf
            .fail(function (error) {
                console.warn('showSaveDialog error:', error);
                /*DEBUG*//*jshint -W087*/debugger;
                ( Array.isArray(error) ? error : ( error = [error] ) )
                    .unshift('Невозможно создать pdf файл!');
                popup_controller.errorbox(error, 'Ошибка создания PDF');
            })
        ;

        return promise;

    },/*}}}*/

    /** saveRtfReport ** {{{ Сохраняем отчёт как RTF
     */
    saveRtfReport : function () {

        var Report__Export = this,
            Report = this.Report,

            // Объект отчёта
            reportData = Report.params.reportData,

            // Получаем экспотрные данные
            exportedData = Report.Modules.Data.exportData({ export : true }),

            // Имя файла
            fileName = 'reportData-' + Report.params.reportType + '.rtf'
        ;

        // Запрашиваем модуль RTFReport (см. описание в `project.config.libs`),
        // формируем документ и сохраняем из браузера
        libsLoader.resolveLibModule('RTFReport')
            .then(function(RTFReport){
                // // DEBUG: Проверка отработки ошибок
                // return vow.Promise.reject({ status : 'testError', description : 'Пробная ошибка' });
                RTFReport.initDocument();
                RTFReport.processData(exportedData);
                return RTFReport.getDocument(true);
            })
            .then(function(data) {
                // Сохраняем файл
                // см. также -- https://github.com/jimmywarting/StreamSaver.js -- лучше использовать для больших поточных данных?
                var blob = new Blob([data], {
                    type: 'application/rtf',
                });
                FileSaver(blob, fileName);
            })
            .fail(function(error){
                console.error('RTFReport error:', error);
                /*DEBUG*//*jshint -W087*/debugger;
                popup_controller.errorbox(error, 'Ошибка создания RTF');
                // Report.error(error);
                // app.error(error);
                // return reject(error);
            })
        ;
    },/*}}}*/

    /** showSaveDialog ** {{{ Выбор вариантов сохранения
     */
    showSaveDialog : function (data) {

        var Report__Export = this,
            Report = this.Report,
            that = this,

            options = {
                // mode : 'form_padded',
                title: 'Выбор вариантов сохранения',
                buttons: [
                    'save',
                    'cancel',
                ],
                close_button: true, // Показывать кнопочку "Закрыть" (крестик)
                autodestroy: true, // Атоматически уничтожать окно после закрытия
                // noautoclose : true, // Не закрывать автоматически при нажатии на крестик, клике за пределами окна, нажатии `Escape`
            },
            selector_id = 'selector', // id селектора
            content = [
                {
                    block: 'radio-group',
                    name: selector_id,
                    mods: {theme: 'islands', size: 'm', id: selector_id},
                    val: 'PDF', // Активный элемент
                    options: [     // Значения списка элементов для выбора
                        {val: 'PDF', text: 'PDF'},
                        {val: 'RTF', text: 'RTF'},

                    ]
                },
            ],
            template = {
                block: 'popup_dialog',
                mix: [{elem: 'form_padded'}],
                options: options,
                content: content,
            },
            html = BEMHTML.apply(template),
            dialog_dom = BEMDOM.append(document.body, html),
            dialog = $(dialog_dom).bem(BEMDOM.entity('popup_dialog'))

        ;

        // Обработчик действий пользователя
        dialog.params.ask_callback = function (id, self) {
            // Если нажата кнопка "Выбрать"...
            if ( id === 'save' ) {
                // Находим наш контрол внутри диалогового окна
                var selector = self.findChildBlock({
                    block: BEMDOM.entity('radio-group'),
                    modName: 'id',
                    modVal: selector_id
                });
                // Получаем выбор пользователя
                var val = selector.getVal();
                // Варианты:
                switch (val) {
                    // Сохраняем PDF
                    case 'PDF':
                        that.savePdfWrapper();
                        break;
                    // Сохраняем RTF
                    case 'RTF':
                        // $('#Report').wordExport('Report'); // клиентское сохранение
                        that.saveRtfReport();
                        break;
                    // Ничего не выборано -- ругаемся...
                    case undefined:
                        popup_controller.infobox('Не выбран вариант сохранения!');
                        break;
                    // Неизвестный параметр. WTF?
                    default:
                        popup_controller.infobox('Ошибка! Неизвестное значение варианта сохранения: ' + val);
                }
            }
        };

        // Открываем окно. При закрытии окно уничтожается (см. параметр `autodestroy`).
        dialog.open();

    },/*}}}*/

    /** saveReportAction ** {{{ Действие на кнопку "Сохранить отчёт"
     * @param {Event} e -- Событие с кнопки
     * @param {Object} e.target -- DOM-объект кнопки
     * Смотрим:
     * - mod : Report_report_absent
     */
    saveReportAction : function (e) {

        this.showSaveDialog();

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

        ( !Array.isArray(error) && typeof error !== 'object' ) || ( error = {error: error} );
        ( error && !Array.isArray(error) ) && ( error.trace || ( error.trace = [] ) ).push(errorId);

        return vow.Promise.reject(error);

    },/*}}}*/

    /** _onInited ** {{{ Инициализируем блок */
    _onInited : function() {

        var Report__Export = this;

        // Получаем ссылку на родительский объект (на том же DOM-узле)
        this.Report = this.findParentBlock(BEMDOM.entity('Report'));

    },/*}}}*/

    /** onSetMod... ** {{{ События на установку модификаторов... */
    onSetMod : {

        /** (js:inited) ** {{{ Инициализация bem блока */
        js : {

            inited : function () {
                var Report__Export = this;
                this._onInited();
            },

        },/*}}}*/

    },/*}}}*/

};

provide(BEMDOM.declElem('Report', 'Export', __Export)); // provide

}); // module

