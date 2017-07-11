<?php
/**
 * $Date: 2017-07-10 13:15:22 +0300 (Пн, 10 июл 2017) $
 * $Id: tcm_Reports_objvisitdetail.php 8718 2017-07-10 10:15:22Z miheev $
 *
 * @overview Запрос отчета по посещению объектов детально
 *
 * Описание программного интерфейса
 * --------------------------------
 * - WEB_TINTS/_docs/KupolClient/Запрос отчета по посещению объектов детально.doc
 *
 * Параметры
 * ---------
 * op=objvisitdetail
 * userID=5 – ID пользователя, от имени которого производится запрос
 * list=12,13 – список контролируемых объектов (должен быть выбран только один объект)
 * BeginTime – время начала отчетного периода
 * EndTime – время конца отчетного периода
 * listobject – список объектов (словарь `Object`)
 * radius – радиус захвата (метры)
 *
 * Страницы
 * --------
 * - [nginx+enb](http://localhost:5590/WEB_TINTS/core/App.html?useSockets=false#tcm_Reports_objvisitdetail)
 * - [youcomp](http://youcomp.geyser.ru:5590/WEB_TINTS/release/core/App.html#tcm_Reports_objvisitdetail)
 *
 * Данные
 * ------
 * - 'Object' => array('userID' => true, 'type' => 'dict', 'lifetime' => 'long'), // Список пользовательских объектов
 *
 * Значения параметров для тестирования отчёта
 * -------------------------------------------
 * КО: вво-2506
 * Начало периода: 2017.06.11
 * Конец периода: 2017.06.20
 * Объекты: линия старта этапа (КТ Этапа 1)
 *
 */
$pageId = getPageId(__FILE__);
$reportId = getReportId(__FILE__);
createReportPage($pageId, $reportId, 'ТЦМ: Отчет о посещении объектов (детально)');
// createReportPage($pageId, 'milage', 'ТЦМ: Отчет о посещение объектов');
