/**
 * Module dependencies.
 */

var path = require('path'),
    Compiler = require('../src/Compiler');

/*
 * Export grunt task
 */

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('dot', 'prepares and combines any type of template into a script include', function () {
        var options = this.options();
        options.gruntRoot = path.dirname(grunt.file.findup('Gruntfile.js')) + '/';
        options.templateSettings = {
            evaluate:    /\{\{([\s\S]+?)\}\}/g,
            interpolate: /\{\{=([\s\S]+?)\}\}/g,
            encode:      /\{\{!([\s\S]+?)\}\}/g,
            use:         /\{\{#([\s\S]+?)\}\}/g,
            define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
            conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
            iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
            varname: 'it, op',
            strip: true,
            append: true,
            selfcontained: false
        };

        this.files.forEach(function (file) {
            var compiler, src, existingSrcFiles;

            existingSrcFiles = file.src.filter(function (_file) {
                return grunt.file.exists(_file);
            });

            //Write joined contents to destination filepath
            compiler = new Compiler(options);
            src = compiler.compileTemplates(existingSrcFiles);

            grunt.file.write(file.dest, src);
            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    });
};
