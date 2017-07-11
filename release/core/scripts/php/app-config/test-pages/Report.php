<?php

/**
 *
 * @overview Страница создания отчётов
 *
 * $Date: 2017-03-06 22:10:55 +0300 (Пн, 06 мар 2017) $
 * $Id: AdminKO.php 7464 2017-03-06 19:10:55Z miheev $
 *
 */

$_CONSTANTS['appdata']['pages']['Report'] = [
    'setPageReadyWaiter' => true, // Ждать от страницы сигнала о завершении: `waiter.finish('pageReady')`
    'title' => 'Отчёт',
    'data' => [
        'reportType' => 'detailmove',
    ],
    'required' => [
        'dicts' => [
            // 'objTypes',
            // 'objTypesBrief',
            // // 'ControlArea',
            // 'CarType',
            // // 'CarModel',
        ],
        'assets' => [
            [ 'type' => 'package', 'kind' => 'styles.css', 'name' => 'Report' ],
            [ 'type' => 'package', 'kind' => 'bemhtml.js', 'name' => 'Report' ],
            [ 'type' => 'package', 'kind' => 'browser.js', 'name' => 'Report' ],
            [ 'type' => 'data', 'url' => '{{bemjson}}Report.json' ],

            // // Подключаются внешние скрипты
            // [ 'type' => 'script', 'url' => '{{libsUrl}}pdfmake/build/pdfmake.min.js' ], // сохранение в пдф
            // [ 'type' => 'script', 'url' => '{{libsUrl}}pdfmake/build/vfs_fonts.js' ],
            //
            // [ 'type' => 'script', 'url' => '{{libsUrl}}file-saver/FileSaver.js' ], // сохранение в док
            // [ 'type' => 'script', 'url' => '{{libsUrl}}jQuery-Word-Export/jquery.wordexport.js' ],

            // [ 'type' => 'script', 'url' => '{{appcore}}js/script.js' ],
            // [ 'type' => 'script', 'url' => '{{appcore}}js/element-reports.js' ],   //старый отчет

        ],
    ],
    'open' => [
        'bemhtml' => 'data:{{bemjson}}Report.json',
    ],
];
