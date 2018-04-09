module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            views:      'source/views/',
            styles:     'source/sass/',
            imgs:       'source/images/',
            js:         'source/js/',
            public:     'public/'
        },
        clean: {
            images: ['public/images/*'],
            js: ['public/js/*'],
        },
        pug: {
            compile: {
                options: {
                    client: false,
                    pretty: true
                },
                files: [{
                    cwd: "<%= meta.views %>",
                    src: ["*.pug", "!*-bk.pug"],
                    dest: "public",
                    ext: ".html",
                    expand: true
                }]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: "<%= meta.styles %>",
                    cssDir: '<%= meta.public %>css',
                    environment: 'production',
                    // outputStyle: 'expanded',
                    outputStyle: 'compressed',
                    sourcemap: true,
                    force: true
                }
            }
        },
        cssmin: {
            options: {
                advanced: false,
                keepBreaks: false,
                keepSpecialComments: 0
            },
            compress: {
                files: [{
                    '<%= meta.public %>css/plugins.min.css': 'source/css/*.css',
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.imgs %>',
                    src: ['**/*.{png,gif,jpg,jepg,svg,pdf}', '!*-bk/*.{png,gif,jpg,jepg,svg,pdf}'],
                    dest: '<%= meta.public %>images',
                    filter: 'isFile',
                    flatten: false
                }, {
                   /*  expand: true,
                    src: '<%= meta.styles %>style.min.css',
                    dest: '<%= meta.public %>css',
                    flatten: true
                }, { */
                    expand: true,
                    src: 'source/fonts/*',
                    dest: '<%= meta.public %>fonts',
                    flatten: true
                }]
            }
        },
        uglify: {
            options: {
                compress: true,
                beautify: false,
                // preserveComments: 'all'
            },
            dist: {
                files: [{
                   "public/js/plugins.min.js": ['source/js/libs/jquery-2.2.5.min.js', 'source/js/libs/popper.js', 'source/js/libs/bootstrapv4.min.js' , 'source/js/libs/jquery.plugin.min.js', 'source/js/libs/*.js']
                }]
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'source/images/',
                    src: ['**/*.{png,jpg,jepg,gif,svg}', '!**/*.hi-res.{png,jpg,jepg,gif,svg}', '!*-bk/*.{png,gif,jpg,jepg,svg}'],
                    dest: 'public/images/'
                }]
            }
        },
        browserify: {
            dist: {
                files: {
                    'public/js/main.js': 'source/js/main.es6.js'
                },
                options: {
                    transform: [['babelify', { presets: "es2015" }]],
                    browserifyOptions: {
                        debug: true
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3008,
                    hostname: '*',
                    base: {
                        path: 'public/',
                        options: {
                            index: 'index.html',
                            maxAge: 300000
                        }
                    }
                }
            }
        },
        watch: [{
            files: "source/sass/**",
            tasks: ["compass"]
        }, {
            files: "source/views/**",
            tasks: ["pug"]
        }, {
            files: "source/js/libs/*",
            tasks: ["uglify"]
        }, {
            files: "source/js/*.es6.js",
            tasks: ["browserify"]
        },{
            files: ["source/images/**", "source/fonts/*", "source/pdf/*"],
            tasks: ["copy"]
        }],
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'public/**/*.*',
                        'public/*.*'
                    ]
                },
                options: {
                    watchTask: true,
                    open: true,
                    server: './public/'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    grunt.registerTask('default', ['clean', 'pug', 'compass', 'cssmin', 'browserify', 'uglify','copy', 'connect:server', 'browserSync', 'watch']);
    grunt.registerTask('test-release', ['connect:server', 'watch']);
};
