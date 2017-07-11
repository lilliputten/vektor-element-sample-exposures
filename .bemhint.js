// $Date: 2017-06-27 12:10:51 +0300 (Вт, 27 июн 2017) $
// $Id: .bemhint.js 8640 2017-06-27 09:10:51Z miheev $
module.exports = {

    // list of the folder names which represent redefinition levels (folders with blocks)
    levels: [
        'root',
        'shared',
        'controllers',
        'interface',

        'custom',
        'design',
        'helpers',
        'layout',
        'libs',
        'loaders',
        'pages',
        'test',
    ],

    // paths which will be ignored during the validation
    excludePaths: [
        '**/00*',
        '**/*.+(zip|swp|bak|gif|jpg|png|svg|md|diff)',
        '**/*+(~|_|00)',
        // 'blocks',
        // 'blocks/**/*.+(~|_)',
        'pages/**/*.+(map|js|json|htm|html|css|~)',
        'core',
        'templates',
        '*.specs',
        'fake-data/**',
        '!UNUSED',
        'node_modules',
        'libs',
    ],

    // list of available plugins (node module names relatively to config file path)
    plugins: {
        'bemhint-css-naming': true,
        // 'bemhint-fs-naming': true,
        'bemhint-deps-specification': true,
        'bemhint-plugins-jshint': {
            techs: {
                // '*': {
                //     // правила jshint для всех технологий
                // },

                'bemhtml': {
                    camelcase: false,
                    unused: false,
                    laxbreak: true,
                    expr: true,
                    boss: true,
                },

                'deps.js': {
                    camelcase: false,
                    unused: false,
                    laxbreak: true,
                    expr: true,
                    boss: true,
                    asi: true,
                },

                'js': {
                    camelcase: false,
                    unused: false,
                    laxbreak: true,
                    expr: true,
                    boss: true,
                },

                'styl|css': false, // не проверять технологию `css`
            },
        },
    },

};
