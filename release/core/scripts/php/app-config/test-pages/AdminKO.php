<?php

/**
 *
 * @overview Страница AdminKO.
 *
 * Шаблон грузится из автоматически генерируемого файла
 * `.../js/bem-pages-bemjson/AdminKO.json`.
 *
 * @author lilliputten
 * @since 2016.08.16, 12:11
 * @version 2016.08.16, 12:11
 *
 * $Date: 2017-03-06 22:10:55 +0300 (Пн, 06 мар 2017) $
 * $Id: AdminKO.php 7464 2017-03-06 19:10:55Z miheev $
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

$_CONSTANTS['appdata']['pages']['AdminKO'] = [
    'title' => 'Администрирование КО',
    'required' => [
        'dicts' => [
            // 'objTypes',
            // 'objTypesBrief',
            // 'objTypesCodes',
            // 'ControlArea',
            // 'CarType',
            // 'CarModel',
        ],
        'assets' => [
            [ 'type' => 'package', 'kind' => 'styles.css', 'name' => 'AdminKO' ],
            [ 'type' => 'package', 'kind' => 'bemhtml.js', 'name' => 'AdminKO' ],
            [ 'type' => 'package', 'kind' => 'browser.js', 'name' => 'AdminKO' ],
            [ 'type' => 'data', 'url' => '{{bemjson}}AdminKO.json' ],
            // [ 'type' => 'script', 'url' => 'js/bem-test/test.js' ],
            // [ 'type' => 'style', 'url' => 'css/bem-test/test.css' ],
        ],
    ],
    'open' => [
        'bemhtml' => 'data:{{bemjson}}AdminKO.json',
    ]
];

