module.exports = function(grunt) {
    'use strict';
    // TODO: These are the same right now, but will change.
    var testTasks = ['gitinfo', 'copy', 'less', 'lesslint', 'jsbeautifier', 'eslint:vms', 'concat', 'uglify', 'karma:jenkins'];
    var devTasks = ['gitinfo', 'copy', 'less', 'lesslint', 'jsbeautifier', 'eslint:vms', 'concat', 'uglify', 'karma:unit'];
    var prodTasks = ['gitinfo', 'copy', 'less', 'lesslint', 'jsbeautifier', 'eslint:vms', 'concat', 'uglify'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //
        // TESTING
        //

        karma: {
            options: {
                reporters: ['spec'],
                frameworks: ['jasmine'],
                browsers: ['PhantomJS'],
                singleRun: true,
                log: true,
                logLevel: 'OFF',
                client: {
                    captureConsole: false
                },
                files: [
                    'libs/jquery.min.js',
                    'libs/angular.min.js',
                    'libs/angular-*.min.js',
                    'libs/angular-mocks.js',
                    'libs/*.min.js',
                    'libs/sps/*.min.js',
                    'app/js/*.js',
                    'app/js/**/*.js',
                ]
            },
            unit: {},
            htmlCoverage: {
                reporters: ['coverage', 'spec'],
                preprocessors: {
                    'app/js/app.!(test.)js': ['coverage'],
                    'app/js/**/!(*test).js': ['coverage'],
                },
                coverageReporter: {
                    type: 'html',
                    dir: '.',
                },
            },

            jenkins: {
                reporters: ['coverage', 'junit', 'spec'],
                colors: false,
                preprocessors: {
                    'app/js/app.!(test.)js': ['coverage'],
                    'app/js/**/!(*test).js': ['coverage'],
                },
                coverageReporter: {
                    type: 'cobertura',
                    dir: '.',
                },
                junitReporter: {
                    outputFile: '../test-results.xml'
                },
            }
        },
        sonarRunner: {
            analysis: {
                options: {
                    sonar: {
                        host: {
                            url: 'http://sonarqube.ss-prod.us-east-1.schl.local'
                        },
                        //login: 'sonar-user-name',
                        //password: 'sonar-user-password',
                        projectKey: 'vms-gui',
                        projectName: 'Scholastic Volunteer Manager GUI',
                        projectVersion: '1.0.0',
                        sources: ['app'].join(','),
                        language: 'js',
                        sourceEncoding: 'UTF-8'
                    }
                }
            }
        },

        //
        // COMMON
        //

        watch: {
            // NOTE: Try to keep these tasks in: ['prettify', 'lint', 'build'] order
            resources: {
                files: ['index.html', 'favicon.ico', 'robots.txt', 'include/**', 'images/**', 'resources/**', 'fonts/**', 'partials/**', 'lib/**'],
                tasks: ['copy'],
                options: {
                    spawn: true
                }
            },
            less: {
                files: ['app/less/*.less', 'libs/select2.css', 'app/style/*.css', '!style/*.min.css'],
                tasks: ['jsbeautifier:less', 'lesslint', 'less'],
                options: {
                    spawn: true
                }
            },
            js: {
                files: ['Gruntfile.js', 'app/js/app.js', 'app/js/**/*.js', '!app/js/app.test.js', '!app/js/**/*.test.js', 'libs/janrain.js', 'libs/sps/applyEnv.js', 'libs/env2.js', 'libs/select2.js', 'libs/myaccount.js', 'dist/scripts/scripts.js'],
                tasks: ['gitinfo', 'jsbeautifier:js', 'eslint:vms', 'concat', 'uglify'],
                options: {
                    spawn: true
                }
            },
            html: {
                files: ['index.html', 'partials/*.html'],
                tasks: ['jsbeautifier:html' /*'htmlmin'*/ ],
                options: {
                    spawn: true
                }
            },
            unit: {
                files: ['app/js/app.test.js', 'app/js/**/*.test.js'],
                tasks: ['jsbeautifier:js', 'karma:unit'],
                options: {
                    spawn: true
                }
            }

        },
        clean: ['dist/'],
        gitinfo: {},
        copy: {
            target: {
                files: [{
                    expand: true,
                    src: ['index.html', 'robots.txt', 'favicon.ico', 'include/**', 'images/**', 'resources/**', 'fonts/**', 'partials/**', 'libs/**'],
                    dest: 'dist/'
                }],
            },
        },

        jsbeautifier: {
            options: {
                css: {
                    fileTypes: [".less"],
                    //indentSize: 2,
                },
                html: {
                    //indentSize: 2,
                    //unformatted: ["a", "sub", "sup", "b", "i", "u"],
                },
                js: {
                    //indentSize: 2,
                },
            },
            less: [
                'app/less/**/*.less',
            ],
            js: [
                'Gruntfile.js',
                'app/js/app.js',
                'app/js/**/*.js',
            ],
            html: [
                'partials/404.html',
                'partials/shingle.html',
                'partials/admin-*.html',
                'partials/contacts-*.html',
                'partials/outlook-*.html',
                // NOTE: Disabled until more testing is done.
                //'partials/sps-*.html',
                //'partials/signupsheet-*.html',
                //'partials/*.html',
            ],
        },


        //
        // LESS
        //
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['app/js/app.js', 'app/js/**/*.js', '!app/js/app.test.js', '!app/js/**/*.test.js'],
                dest: 'dist/scripts/scripts.js'
            }
        },
        less: {
            options: {
                strictUnits: true,
                compress: true,
                sourceMap: true,
            },
            target: {
                files: {
                    'dist/style/style.min.css': 'app/less/*.less',
                    'dist/style/login_myaccount.min.css': 'app/style/login_myaccount.css',
                    'dist/style/mainLogin.min.css': 'app/style/mainLogin.css',
                    'dist/style/addevent.min.css': 'app/style/addevent.css',
                    'dist/style/login_styles.min.css': 'app/style/login_styles.css',
                    'dist/style/myaccount.min.css': 'app/style/myaccount.css',
                    'dist/style/resetPassword.min.css': 'app/style/resetPassword.css',
                    'dist/style/sps-myaccount-pwd.min.css': 'app/style/sps-myaccount-pwd.css',
                    'dist/style/styles.min.css': 'app/style/styles.css',
                    'dist/libs/select2.min.css': 'libs/select2.css',
                    'dist/style/myscholastic-int-core.min.css': 'libs/sps/css/myscholastic-int-core.css',
                }
            },
        },
        lesslint: {
            // NOTE: Get the two at the end working eventually!
            src: ['app/less/*.less', 'app/style/*.css', '!app/style/*.min.css', '!app/style/mainLogin.css', '!app/style/login_myaccount.css'],
            options: {
                csslint: {
                    // NOTE: Potential rules: https://www.npmjs.com/package/grunt-contrib-csslint
                    // Right now the less is not following many of these rules, each one will
                    // have to be turned on one by one to fix the issues.
                    'important': false,
                    'adjoining-classes': false,
                    'known-properties': true,
                    'box-sizing': false,
                    'box-model': false,
                    'overqualified-elements': false,
                    'display-property-grouping': false,
                    'bulletproof-font-face': false,
                    'compatible-vendor-prefixes': true,
                    'regex-selectors': true,
                    'errors': false,
                    'duplicate-background-images': false,
                    'duplicate-properties': false,
                    'empty-rules': false,
                    'selector-max-approaching': false,
                    'gradients': false,
                    'fallback-colors': false,
                    'font-sizes': false,
                    'font-faces': false,
                    'floats': false,
                    'star-property-hack': false,
                    'outline-none': false,
                    'import': false,
                    'ids': false,
                    'underscore-property-hack': false,
                    'rules-count': false,
                    'qualified-headings': false,
                    'selector-max': false,
                    'shorthand': false,
                    'text-indent': false,
                    'unique-headings': false,
                    'universal-selector': false,
                    'unqualified-attributes': true,
                    'vendor-prefix': true,
                    'order-alphabetical': false,
                    'zero-units': true,
                }
            }
        },

        //
        // HTML
        //

        // NOTE: Not used right now
        // NOTE: To use this, we would have to move ./partials to ./app (git mv partials/ app/).
        //       And fix the associated scripts here
        // NOTE: We would also have to test this a lot! It could break weird things.
        htmlmin: {
            options: {
                lint: true,
                removeComments: true,
                removeRedundantAttributes: true,
                decodeEntities: true,
                sortAttributes: true,
                sortClassName: true,
                collapseWhitespace: true
            },
            dist: {
                files: {
                    "dist/index.html": "index.html"
                },
                expand: true,
                cwd: './',
                src: 'app/partials/*.html',
                dest: 'dist/partials/'
            }
        },

        //
        // JS
        //

        uglify: {
            target: {
                files: {
                    'dist/scripts/script.min.js': 'dist/scripts/scripts.js',
                    'dist/libs/angular-select2.min.js': 'libs/angular-select2.js',
                    'dist/libs/sps/applyEnv.min.js': 'libs/sps/applyEnv.js',
                    'dist/libs/env2.min.js': 'libs/env2.js',
                    'dist/libs/myaccount.min.js': 'libs/myaccount.js',
                    'dist/libs/select2.min.js': 'libs/select2.js',
                },
            },
            options: {
                banner: '/*(C) Scholastic Corp. <%=grunt.template.date("yyyy")%> http://www.scholastic.com [<%= gitinfo.local.branch.current.shortSHA %>] */',
                sourceMap: true,
                compress: {
                    drop_console: true
                }
            },
        },
        eslint: {
            vms: {
                src: ['Gruntfile.js', 'app/js/app.js', 'app/js/**/*.js'],
                options: {
                    configFile: ".eslintrc.json"
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-sonar-runner');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-gitinfo');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-lesslint");
    grunt.loadNpmTasks("grunt-karma");


    grunt.registerTask('test', testTasks);
    grunt.registerTask('dev', devTasks);
    grunt.registerTask('prod', prodTasks);
    grunt.registerTask('default', ['dev', 'watch']);
};
