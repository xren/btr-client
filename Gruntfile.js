'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('matchmodule').filter('grunt-*').forEach(grunt.loadNpmTasks);

    var allJS = [
        'lib/*.js',
        'lib/**/*.js'
    ];
    
    grunt.initConfig({
        livereload: {
            port: 35730
        },
        regarde: {
            express: {
                files: allJS,
                tasks: ['express:dev']
            }
        },
        express: {
            options: {
                args: ['--debug']
            },
            dev: {
                options: {
                    script: './server.js'
                }
            }
        },
        env: {
            development: {
                src: 'development.json'
            }
        }
    });

    grunt.registerTask('default', ['livereload-start', 'env:development', 'express:dev', 'regarde']);
};