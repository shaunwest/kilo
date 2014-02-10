/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        nodePort: 3000,
        public: "public",
        appJs: "<%= public %>/editor/js",
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        nodemon: {
            normal: {
                options: {
                    file: 'app.js',
                    nodeArgs: [],
                    env: {
                        PORT: '<%= nodePort %>'
                    }
                }
            },
            debug: {
                options: {
                    file: 'app.js',
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: '<%= nodePort %>'
                    }
                }
            }
        },
        clean: {
            start: {
                src: ["<%= uglify.dist.dest %>"]
            },
            finish: {
                dot: true,
                src: [".tmp"]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                    '<%= appJs %>/**/*.js'
                ],
                dest: '.tmp/<%= pkg.name %>.js'
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'public/css',
                    environment: 'production',
                    require: 'singularitygs',
                }
            },
            dev: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'public/css',
                    require: 'singularitygs',
                    watch: true
                }
            },
            build: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'public/css',
                    require: 'singularitygs',
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: '<%= public %>/js/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: 'vars',     // don't worry about functions
                boss: true,
                eqnull: true,
                strict: true,
                devel: true,        // don't worry about console
                globals: {
                    jQuery: true,
                    $: true,
                    angular: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            },
            public: {
                src: ['<%= appJs %>/**/*.js']
            }
        },
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            },
            compass: { // Not using this. Compass 'watch' option is faster.
                files: 'sass/**/*',
                tasks: ['compass:dev']
            }
        },
        concurrent: {
            dev: {
                tasks: ['compass:dev', 'nodemon:normal'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['compass:dev', 'nodemon:debug'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');


    grunt.registerTask('target', 'Set the deploy target', function(value){
        process.env.NODE_ENV = value;
    });

    grunt.registerTask('build', [
        'clean:start',
        'jshint:public',
        //'nodeunit',
        'compass:build',
        'concat',
        'uglify',
        'clean:finish'
    ]);

    grunt.registerTask('dev', [
        'target:development',
        'concurrent:dev'
    ]);

    grunt.registerTask('debug', [
        'target:development',
        'concurrent:debug'
    ]);

    grunt.registerTask('prod', [
        'target:production',
        'nodemon:normal'
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);
};


