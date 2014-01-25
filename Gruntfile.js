/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        nodePort: 3000,
        public: "public",
        appJs: "<%= public %>/assetmanager/js",
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        nodemon: {
            dev: {
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
                unused: 'vars',
                boss: true,
                eqnull: true,
                strict: false,
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
            pub: {
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
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('target', 'Set the deploy target', function(value){
        process.env.NODE_ENV = value;
    });

    grunt.registerTask('build', [
        'clean:start',
        'jshint:pub',
        //'nodeunit',
        'concat',
        'uglify',
        'clean:finish'
    ]);

    grunt.registerTask('dev', [
        'target:development',
        'nodemon:dev'
    ]);

    grunt.registerTask('debug', [
        'target:development',
        'nodemon:debug'
    ]);

    grunt.registerTask('prod', [
        'target:production',
        'nodemon:dev'
    ]);

    grunt.registerTask('default', [
        'dev'
    ]);
};


