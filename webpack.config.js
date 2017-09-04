var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
        console: false,
        global: false,
        process: false,
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
            {from: 'storm/server/views', to: 'storm/server/views'},
            {from: 'accounting/server/views', to: 'accounting/server/views'},
            {from: 'accounting/reporting/files', to: 'accounting/reporting/files'},
            {from: 'admin/admin.ejs', to: 'admin'},
            {from: 'invoice/invoice.ejs', to: 'invoice'},
            {from: 'third-party/index.ejs', to: 'third-party'}
        ])
        /* new webpack.BannerPlugin('require("source-map-support").install();',
             { raw: true, entryOnly: false })*/

    ]
}