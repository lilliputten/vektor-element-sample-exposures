<?php

/**
 *
 * @overview Описание меню приложения
 * @author lilliputten
 * @since 2016.08.04
 * @version 2017.04.05, 21:09
 *
 * $Date: 2017-07-10 13:07:32 +0300 (Пн, 10 июл 2017) $
 * $Id: appmenu.php 8717 2017-07-10 10:07:32Z miheev $
 *
 * TODO
 * ====
 *
 * NOTES
 * =====
 *
 * ОПИСАНИЕ
 * ========
 *
 */

$_CONSTANTS['appdata']['menuRubrics'] = [
    [ 'id' => 'tcm', 'name' => 'ТСМ'/* , 'defaultPage' => 'default_page' */ ],
    [ 'id' => 'dc', 'name' => 'ЦОД' ],
    [ 'id' => 'umto', 'name' => 'УМТО' ],
];

$_CONSTANTS['appdata']['menu'] = [
    'tcm' => [/*{{{*/

        [ 'title' => 'Мониторинг', 'content' => [
            [ 'title' => 'КО', 'id' => 'tcm_Monitoring_KO' ],
            [ 'title' => 'Задания', 'id' => 'tcm_Monitoring_Tasks' ],
            [ 'title' => 'Маршруты', 'id' => 'tcm_Monitoring_Routes' ],
            [ 'title' => 'Сообщения', 'id' => 'tcm_Monitoring_Messages' ],
        ] ],
        [ 'title' => 'Планирование', 'content' => [
            [ 'title' => 'Задания', 'id' => 'tcm_Planning_Tasks' ],
            [ 'title' => 'Маршруты', 'id' => 'tcm_Planning_Routes' ],
            [ 'title' => 'Зоны', 'id' => 'tcm_Planning_Zones' ],
            [ 'title' => 'Задание по маршруту', 'id' => 'tcm_Planning_TasksRoute' ],
            [ 'title' => 'Задание по посещению объектов', 'id' => 'tcm_Planning_TaskVisitObjects' ],
            [ 'title' => 'Группы КО', 'id' => 'tcm_Planning_KOGroups' ],
            [ 'title' => 'Группы объектов', 'id' => 'tcm_Planning_ObjectGroups' ],
        ] ],
        [ 'title' => 'Отчеты', 'content' => [
            [ 'title' => 'Оперативные', 'content' => [
                [ 'title' => 'Пробег за период (В РАБОТЕ)', 'id' => 'tcm_Reports_milage' ],
                // [ 'title' => 'Пробег за период (FAKE)', 'id' => 'tcm_Reports_Operational_PeriodMileage_FAKE' ],
                [ 'title' => 'История перемещения КО', 'id' => 'tcm_Reports_Operational_KOTransfer' ],
                [ 'title' => 'Посещение объектов (детально) (В РАБОТЕ)', 'id' => 'tcm_Reports_objvisitdetail' ],
                // [ 'title' => 'Посещение объектов', 'id' => 'tcm_Reports_Operational_ObjectsVisit' ],
                [ 'title' => 'Посещение зон контроля', 'id' => 'tcm_Reports_Operational_Zones' ],
                [ 'title' => 'Состояния КО', 'id' => 'tcm_Reports_Operational_KOStates' ],
                [ 'title' => 'Работоспособность НАП (В РАБОТЕ)', 'id' => 'tcm_Reports_efficiency' ],
            ] ],
            [ 'title' => 'Сводные', 'content' => [
                [ 'title' => 'Периоды движения (В РАБОТЕ)', 'id' => 'tcm_Reports_detailmove' ],
                [ 'title' => 'Посещение объектов', 'id' => 'tcm_Reports_Consolidated_ObjectsVisit' ],
                [ 'title' => 'Проблемы с КО', 'id' => 'tcm_Reports_Consolidated_KOProblems' ],
                [ 'title' => 'По КО/группе КО', 'id' => 'tcm_Reports_Consolidated_KO' ],
                [ 'title' => 'По заданиям', 'id' => 'tcm_Reports_Consolidated_Tasks' ],
                [ 'title' => 'Состояния КО', 'id' => 'tcm_Reports_Consolidated_States' ],
                [ 'title' => 'Передача данных ТЦМ–ЦОД', 'id' => 'tcm_Reports_Consolidated_DataTransfer' ],
            ] ],
        ] ],
        [ 'title' => 'Настройки', 'content' => [
            [ 'title' => 'Сообщения', 'id' => 'tcm_Settings_Messages' ],
            [ 'title' => 'Пользовательские состояния КО', 'id' => 'tcm_Settings_UserKOStates' ],
        ] ],

        /*{{{ СТАРОЕ МЕНЮ * /
        [ 'title' => 'Мониторинг*', 'content' => [
            [ 'title' => 'КО, колонны, группы', 'url' => 'element-tcm/TCMMonitoring/SpisokKO0Mapdesktop' ],
            [ 'title' => 'Задачи', 'url' => 'element-tcm/TCMMonitoring/ListMonZadachidesktop' ],
            [ 'title' => '*КО расширенно', 'url' => 'element-tcm/TCMMonitoring/SpisokKOMap2Photodesktop' ],
            [ 'title' => 'Проблемы', 'url' => 'element-tcm/TCMMonitoring/ListProbldesktop' ],
        ] ],
        [ 'title' => 'Планирование*', 'content' => [
            [ 'title' => 'Задачи', 'url' => 'element-tcm/TCMPlanning/ListZadachidesktop' ],
            [ 'title' => 'Зоны контроля', 'url' => 'element-tcm/TCMPlanning/ListZKMapdesktop' ],
            [ 'title' => 'Маршруты', 'url' => 'element-tcm/TCMPlanning/ListMarshrutMapdesktop' ],
            [ 'title' => 'Объекты', 'url' => 'element-tcm/TCMPlanning/ListObjectsdesktop' ],
        ] ],
        [ 'title' => 'Аналитика*', 'content' => [
            // [ 'title' => 'Отчёты (REAL)', 'id' => 'OtchetList' ],
            // [ 'title' => 'Отчёты (raw, старый)', 'id' => 'OtchetListRaw' ],
            [ 'title' => 'Отчёты (*)', 'url' => 'element-tcm/TCMAnalytics/OtchetListdesktop' ],
        ] ],
        [ 'title' => 'Администрирование*', 'content' => [
            [ 'title' => 'КО (REAL)', 'id' => 'AdminKO' ],
            [ 'title' => 'КО (*)', 'id' => 'AdminOld' ], // Старое, для сравнения
            [ 'title' => 'ТС', 'url' => 'element-tcm/TCMAdministration/AdminTSpdesktop' ],
            [ 'title' => '*ЛС', 'url' => 'element-tcm/TCMAdministration/AdminLSpdesktop' ],
            [ 'title' => '*НАП', 'url' => 'element-tcm/TCMAdministration/AdminNAPdesktop' ],
            [ 'title' => 'ЦОД', 'url' => 'element-tcm/TCMAdministration/AdminDCldesktop' ],
            [ 'title' => 'Учетные записи', 'url' => 'element-tcm/TCMAdministration/AdminUchZaplsdesktop' ],
        ] ],
        / *}}}*/

    ],/*}}}*/
    'dc' => [/*{{{*/

        [ 'title' => 'Мониторинг', 'content' => [
            [ 'id' => 'dc_Monitoring_KO', 'title' => 'КО' ],
            [ 'id' => 'dc_Monitoring_Tasks', 'title' => 'Задания' ],
            [ 'id' => 'dc_Monitoring_Routes', 'title' => 'Маршруты' ],
            [ 'id' => 'dc_Monitoring_Messages', 'title' => 'Сообщения' ],
        ] ],
        [ 'title' => 'Отчеты', 'content' => [
            [ 'title' => 'Сводные', 'content' => [
                [ 'id' => 'dc_Reports_Consolidated_TasksStates', 'title' => 'Состояние выполнения задач' ],
                [ 'id' => 'dc_Reports_Consolidated_KOProblems', 'title' => 'Проблемы с КО' ],
                [ 'id' => 'dc_Reports_Consolidated_DivisionsUtilization', 'title' => 'Загруженность подразделений' ],
                [ 'id' => 'dc_Reports_Consolidated_ResourcesUtilisation', 'title' => 'Загруженность средств' ],
                [ 'id' => 'dc_Reports_Consolidated_Violations', 'title' => 'Нарушения' ],
            ] ],
        ] ],
        [ 'title' => 'Настройки', 'content' => [
            [ 'id' => 'dc_Settings_Messages', 'title' => 'Сообщения' ],
            [ 'id' => 'dc_Settings_UserKOStates', 'title' => 'Пользовательские состояния КО' ],
        ] ],

        /*{{{ СТАРОЕ МЕНЮ * /

        [ 'url' => 'element-dc/DCSummary/main', 'title' => 'Сводная*', 'content' => [
            [ 'url' => 'element-dc/DCSummary/main', 'title' => 'Графики' ],
            [ 'url' => 'element-dc/DCSummary/mainmap', 'title' => 'Карта' ],
        ] ],
        // [ 'url' => 'element-dc/DCTasks/ListZadachiRasdesktop', 'title' => 'Задачи*' ],
        // [ 'url' => 'element-dc/DCDivisions/ListPodrazddesktop', 'title' => 'Подразделения*' ],
        // [ 'url' => 'element-dc/DCProblems/ListProblemsdesktop', 'title' => 'Нарушения*' ],

        / *}}}*/

        /*{{{ ТЕСТЫ */
        [ 'title' => '(ТЕСТЫ)', 'content' => [
            [ 'id' => 'Test', 'title' => 'Тестовая страница' ],
            [ 'title' => 'Отчет', 'id' => 'Report' ],
        ] ],
        /*}}}*/

    ],/*}}}*/
    'umto' => [/*{{{*/

        /*{{{ СТАРОЕ МЕНЮ

        [ 'url' => 'element-umto/UMTOSummary/MonitoringMainSchemedesktop', 'title' => 'Главная (OLD)', 'content' => [
            [ 'url' => 'element-umto/UMTOSummary/MonitoringMainSchemedesktop', 'title' => 'Схема' ],
            [ 'url' => 'element-umto/UMTOSummary/MonitoringMainTabdesktop', 'title' => 'Таблица' ],
        ] ],
        [ 'url' => 'element-umto/UMTOCOD/MonitoringCODDiagndesktop', 'title' => 'ЦОД' ],
        [ 'url' => 'element-umto/UMTOTCM/ListTCMdesktop', 'title' => 'ТЦМ' ],
        [ 'url' => 'element-umto/UMTOVDC/ListVDCdesktop', 'title' => 'ВЦОД' ],
        [ 'url' => 'element-umto/UMTONAP/ListNAPdesktop', 'title' => 'НАП' ],

        }}}*/

        [ 'title' => 'Пользователи', 'content' => [
            [ 'id' => 'umto_Users_UsersDict', 'title' => 'Справочник пользователей' ],
            [ 'id' => 'umto_Users_Rights', 'title' => 'Права доступа' ],
            [ 'id' => 'umto_Users_Roles', 'title' => 'Роли' ],
            [ 'id' => 'umto_Users_Types', 'title' => 'Типы пользователей' ],
            [ 'id' => 'umto_Users_PostsDict', 'title' => 'Справочник должностей' ],
        ] ],
        [ 'title' => 'Объекты контроля', 'content' => [
            [ 'id' => 'AdminKO', 'title' => 'Контролируемые объекты (AdminKO)' ],
            [ 'id' => 'umto_Objects_KO', 'title' => 'Контролируемые объекты' ],
            [ 'id' => 'umto_Objects_TypesDict', 'title' => 'Справочник типов объектов контроля' ],
            [ 'id' => 'umto_Objects_TS', 'title' => 'ТС' ],
            [ 'id' => 'umto_Objects_DC', 'title' => 'ЦОД' ],
            [ 'id' => 'umto_Objects_Stationary', 'title' => 'Стационарные объекты' ],
            [ 'id' => 'umto_Objects_Convoy', 'title' => 'Колонны' ],
            [ 'id' => 'umto_Objects_NAP', 'title' => 'НАП' ],
        ] ],
        [ 'title' => 'Мониторинг', 'content' => [
            [ 'id' => 'umto_Monitoring_Objects', 'title' => 'Объекты мониторинга (ЦОД, ТЦМ, НАП, ВЦОД)' ],
            [ 'id' => 'umto_Monitoring_Data', 'title' => 'Данные НАП, ВЦОД' ],
        ] ],
        [ 'title' => 'Передача данных', 'content' => [
            [ 'id' => 'umto_Transmit_TCMCOD', 'title' => 'ТЦМ-ЦОД' ],
        ] ],
        [ 'title' => 'Управление ПО', 'content' => [
            [ 'id' => 'umto_Software_Versions', 'title' => 'Версии ПО' ],
            [ 'id' => 'umto_Software_Update', 'title' => 'Обновление ПО' ],
        ] ],
        [ 'title' => 'НСИ', 'content' => [
            [ 'id' => 'umto_Dicts_Commands', 'title' => 'Справочник органов управления ВВ МВД' ],
            [ 'id' => 'umto_Dicts_ProblemTypes', 'title' => 'Справочник типов проблем (сообщений)' ],
            [ 'id' => 'umto_Dicts_KOStates', 'title' => 'Справочник состояний КО' ],
            [ 'id' => 'umto_Dicts_IterableValues', 'title' => 'Справочник перечислимых значений' ],
            [ 'id' => 'umto_Dicts_TSModels', 'title' => 'Справочник моделей ТС' ],
            [ 'id' => 'umto_Dicts_DCTypes', 'title' => 'Справочник типов ЦОД' ],
            [ 'id' => 'umto_Dicts_NAPTypes', 'title' => 'Справочник типов НАП' ],
            [ 'id' => 'umto_Dicts_POTypes', 'title' => 'Справочник типов ПО' ],
            [ 'id' => 'umto_Dicts_TableTypes', 'title' => 'Справочник градуировочных таблиц' ],
            [ 'id' => 'umto_Dicts_MeasurerTypes', 'title' => 'Справочник типов измерительных устройств' ],
            [ 'id' => 'umto_Dicts_ParameterTypes', 'title' => 'Справочник типов контролируемых параметров' ],
            [ 'id' => 'umto_Dicts_ConditionTypes', 'title' => 'Справочник комбинаций условий' ],
        ] ],
        [ 'title' => 'Системные переменные', 'content' => [
            [ 'id' => 'umto_Variables_DataUpdate', 'title' => 'Обновление данных' ],
        ] ],

    ],/*}}}*/
];

// Утилиты для работы со страницами/меню
require_once 'apptools.php';

