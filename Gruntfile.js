'use strict';

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('matchmodule').filter('grunt-*').forEach(grunt.loadNpmTasks);

    var allJS = [
        'lib/*.js',
        'lib/**/*.js'
    ];

    var feedJS = [
        // 'feed/**/*.*',
        // 'feed/*.*',
        'feed/**',
        'feed/**/**',
        'feed/**/**/*.*'
    ];
    
    grunt.initConfig({
        livereload: {
            port: 35730
        },
        regarde: {
            express: {
                files: allJS,
                tasks: ['express:dev']
            },
            feed: {
                files: feedJS,
                tasks: ['shell:notify-file-change']
            }
        },

        watch: {
            feeds: {
                files: feedJS,
                tasks: ['shell:notify-file-change']
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
        },
        shell: {
            'notify-file-change': {
                command: 'curl http://localhost:3000/api/v1/feeds/update/new'
            }
        }
    });

    grunt.registerTask('default', ['livereload-start', 'env:development', 'express:dev', 'regarde:express']);
    // grunt.event.on('regarde:file:added', function () {
    //     console.log('file added');
    // });

    // grunt.event.on('regarde:file:changed', function () {
    //     console.log('file changed');
    // });

};