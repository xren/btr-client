'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('matchmodule').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        express: {
            options: {
                args: ['--debug']
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            }
        }
    });

    grunt.registerTask('server', function () {
        grunt.task.run([
            'express'
        ]);
    });
    grunt.registerTask('default', ['server']);
};