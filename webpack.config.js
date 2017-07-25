var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var JavaScriptObfuscator = require('webpack-obfuscator');


var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    node: {
        __dirname: true
    },
    entry: './index.js',
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    externals: nodeModules,
    plugins: [
        /*new JavaScriptObfuscator ({
            rotateUnicodeArray: true
        }, ['excluded_bundle_name.js']),
        new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false })*/

    ]
}