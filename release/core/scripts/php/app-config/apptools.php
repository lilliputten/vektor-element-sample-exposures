<?php

/**
 *
 * @overview Утилиты для работы с меню и списком страниц приложения.
 * @author lilliputten@yandex.ru
 * @since 2016.12.09, 12:38
 * @version 2017.05.03, 19:11
 *
 * $Id: apptools.php 8715 2017-07-10 10:02:22Z miheev $
 * $Date: 2017-07-10 13:02:22 +0300 (Пн, 10 июл 2017) $
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

if ( !function_exists('normalizePath') ) { // Функция может быть определена в config_constants
/** normalizePath() ** {{{ Нормализуем путь (убираем последовательности вида 'subpath/../')
 */
function normalizePath ($path) {

    while ( true ) {
        $oldPath = $path;
        $path = preg_replace('/[^\/]*\/\.\.\//', '', $path);
        if ( $path == $oldPath ) {
            break;
        }
    }

    return $path;
}/*}}}*/
}

/** getPageId(__FILE__) ** {{{ Получить идентификатор страницы по пути
 * @param {string} $file - Путь к файлу
 * @returns {string} $pageId - Идентификатор страницы
 */
function getPageId ($file) {

    return preg_replace('/^.*?(\w+)\.php$/', '$1', $file);

}/*}}}*/

/** getReportId(__FILE__) ** {{{ Получить идентификатор отчёта по пути (вида "pathname/{appId}_{smth}_{reportId}.php")
 * @param {string} $file - Путь к файлу
 * @returns {string} $reportId - Идентификатор отчёта
 */
function getReportId ($file) {

    $pageId = getPageId($file);

    return preg_replace('/^.*?([^_]+)$/', '$1', $pageId);

}/*}}}*/

/** createReportPage ** {{{ Создать описание страницы отчёта
 * @param {string} $pageId
 * @param {string} $reportType
 * @param {string} $pageTitle
 */
function createReportPage ($pageId, $reportType, $pageTitle) {

    global $_CONSTANTS;

    $_CONSTANTS['appdata']['pages'][$pageId] = [
        'setPageReadyWaiter' => true, // Ждать от страницы сигнала о завершении: `waiter.finish('pageReady')`
        'title' => $pageTitle,
        'data' => [
            'reportType' => $reportType, // ???
        ],
        'required' => [
            'dicts' => [
            ],
            'assets' => [
                // пакеты страницы:
                [ 'type' => 'package', 'kind' => 'styles.css', 'name' => 'Report' ],
                [ 'type' => 'package', 'kind' => 'bemhtml.js', 'name' => 'Report' ],
                [ 'type' => 'package', 'kind' => 'browser.js', 'name' => 'Report' ],
                [ 'type' => 'data', 'url' => '{{bemjson}}Report.json' ],
            ],
        ],
        'open' => [
            'bemhtml' => 'data:{{bemjson}}Report.json',
        ],
    ];

}/*}}}*/

/** createFakePage() ** {{{ Создать описание фейк-страницы
 * @param {string} $pageId
 * @param {string} $pageTitle
 * @param {string} $pageHtml
 */
function createFakePage ($pageId, $pageTitle, $pageHtml) {

    global $_CONSTANTS;

    $_CONSTANTS['appdata']['pages'][$pageId] = [
        'title' => $pageTitle,
        'required' => [
            'assets' => [
                // [ 'type' => 'package', 'kind' => 'css', 'name' => 'AdminKO' ],
                // [ 'type' => 'package', 'kind' => 'bemhtml.js', 'name' => 'AdminKO' ],
                // [ 'type' => 'package', 'kind' => 'browser.js', 'name' => 'AdminKO' ],
                // [ 'type' => 'data', 'url' => '{{bemjson}}AdminKO.json' ],

                [ 'type' => 'data', 'url' => $pageHtml ],
            ],
        ],
        'open' => [
            'html' => 'data:'.$pageHtml,
        ],
    ];

}/*}}}*/

/** getMenu() ** {{{ Создаём массив описания меню для сервера по входному общему описанию (См. appemenu.php)
 * @param {array} appmenu - Объект, описывающий уровень меню.
 * @returns {array}
 */
function &getMenu (&$appmenu, $level=0) {

    // Результирующее меню
    $menu = [];

    foreach ( $appmenu as $item ) {
        $result = [
            'menu' => true,
        ];
        if ( !empty($item['id']) ) {
            $result['controller'] = 'application';
            $result['action'] = $item['id'];
            $result['title'] = $item['id'];
        }
        if ( !empty($item['url']) ) {
            $result['root'] = $item['url'];
        }
        if ( !empty($item['title']) ) {
            $result['title'] = $item['title'];
        }

        if ( !empty($item['url']) ) {
            $result['root'] = $item['url'];
        }

        // Для промежуточного сохранения подменю
        $submenu = null;
        // Флаг: Добавить подменю
        $appendSubmenu = false;

        if ( array_key_exists('content', $item) ) {
            $submenu = &getMenu($item['content'], $level+1);
            if ( $level < 1 ) {
                $result['submenu'] = $submenu;
            }
            else {
                $appendSubmenu = true;
            }
        }

        // Добавляем подменю
        if ( $appendSubmenu ) {
            $menu = array_merge($menu, $submenu);
        }
        // ...или один пункт
        else {
            array_push($menu, $result);
        }

    }

    return $menu;

}/*}}}*/

/** getRubricMenu() ** {{{ Создаём меню для приложения (menuId) для использования в шаблонах сервера
 * См. WEB_TINTS/core/scripts/php/app/views/partials/nav.volt
 * Использует "глобальное" описание меню из `$_CONSTANTS['appdata']['menu']` (См. appmenu.php).
 * @param {string} $menuIdD:/Work/vektor
 * @returns {array}
 */
function getRubricMenu ($menuId) {
    global $_CONSTANTS;
    $appmenu = $_CONSTANTS['appdata']['menu'];
    return getMenu($appmenu[$menuId]);
}/*}}}*/

/** loadPagesFolder() ** {{{ Загружаем описания страниц из папки
 * @param {string} folder - Имя папки для сканирования
 */
function loadPagesFolder ($folder) {

    global $_CONSTANTS;

    // $folder = RELEASE_PATH.'/core/scripts/php/app/config/app/'.$folder;
    $folder = __DIR__.'/'.$folder;

    if ( !preg_match('/[\/\\\\]$/', $folder) ) {
        $folder .= '/';
    }

    $files = scandir( $folder );

    foreach ( $files as $file ) {
        if ( preg_match('/^[^\._].*.php$/', $file) ) {
            require_once $folder.$file;
        }
    }

}/*}}}*/

