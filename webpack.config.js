var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var JavaScriptObfuscator = require('webpack-obfuscator');


var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    node: {
        console: true,
        global: false,
        process: true,
        Buffer: false,
        __filename: true,
        __dirname: true
    },
    devtool: 'sourcemap',
    entry: './index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'dest'),
        filename: 'app.js'
    },
    externals: nodeModules,
    plugins: [
        new JavaScriptObfuscator({rotateUnicodeArray: true}, ['excluded_bundle_name.js']),
        new CopyWebpackPlugin([
            {from: 'package.json', to: 'package.json'},
            {from: 'config/dedicated', to: ''},
            {from: 'database/migrations', to: 'migrations'},
            {from: 'shared/enums.js', to: ''},
            {from: 'shared/utilities/array.prototypes.js', to: ''},
            {from: 'storm/server/views/index.ejs', to: 'storm/server/templates'},
            {from: 'storm/server/templates', to: 'storm/server/templates'},
            {from: 'accounting/server/views', to: 'accounting/server/views'},
            {from: 'accounting/server/templates', to: 'accounting/server/templates'},
            {from: 'accounting/reporting/files', to: 'accounting/reporting/files'},
            {from: 'admin/admin.ejs', to: 'admin'},
            {from: 'invoice/invoice.ejs', to: 'invoice'},
            {from: 'third-party/index.ejs', to: 'third-party'},
            {from: 'public', to: 'public'}
        ])
    ]
};