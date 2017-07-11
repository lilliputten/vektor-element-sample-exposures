<?php

/**
 *
 * @overview Страница Test1.
 *
 * @author lilliputten
 * @since 2016.08.16, 12:11
 * @version 2016.08.16, 12:11
 *
 * $Date: 2017-05-03 14:04:57 +0300 (Ср, 03 май 2017) $
 * $Id: Test.php 8248 2017-05-03 11:04:57Z miheev $
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

$_CONSTANTS['appdata']['pages']['Test'] = [
    'title' => 'Тестовая страница',
    // 'setPageReadyWaiter' => true, // Страница должна выполнить waiter.finish('app_page_ready')
    'required' => [
        'dicts' => [
            // 'objTypes',
            // 'objTypesBrief',
            // 'ControlArea',
            // 'CarType',
            // 'CarModel',
        ],
        'assets' => [
            // [ 'type' => 'package', 'kind' => 'css', 'name' => 'Test' ],
            // [ 'type' => 'package', 'kind' => 'bemhtml.js', 'name' => 'Test' ],
            // [ 'type' => 'package', 'kind' => 'browser.js', 'name' => 'Test' ],
            [ 'type' => 'data', 'url' => '{{bemjson}}Test.json' ],
            // [ 'type' => 'script', 'url' => 'js/bem-test/test.js' ], // id -- 'script:bem-test/test.js'
            // [ 'type' => 'style', 'url' => 'css/bem-test/test.css' ], // id -- 'style:css/bem-test/test.css'
        ],
    ],
    'open' => [
        'bemhtml' => 'data:{{bemjson}}Test.json',
        /*
        'bemhtml' => [
            [
                'block' => 'test1',
                'content' => [
                    'Контент из описания страницы (config_app.php).',
                    // '<script src="/static/js/bem-test/test.browser.js"></script>',
                ],
            ],
        ],
        */
    ],
];

