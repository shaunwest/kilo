/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        public: "public",
        appJs: "app/js",
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        watch: {
          scripts: {
            files: [
              '<%= appJs %>/**/*.js'
            ],
            tasks: ['concat'],
            options: {
              spawn: false,
              livereload: true
            }
          }
        },
        clean: {
            start: {
                src: ["<%= uglify.dist.dest %>"]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: [
                  '<%= appJs %>/polyfill/**/*.js',
                  '<%= appJs %>/core.js',
                  '<%= appJs %>/core/**/*.js',
                  '<%= appJs %>/config/**/*.js',
                  '<%= appJs %>/async/**/*.js',
                  '<%= appJs %>/transform/**/*.js',
                  '<%= appJs %>/canvas/**/*.js',
                  '<%= appJs %>/sprite/**/*.js',
                  '<%= appJs %>/editor/**/*.js'
                ],
                dest: '<%= public %>/js/<%= pkg.name %>.js'
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
                latedef: 'nofunc',
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                strict: true,
                devel: true,        // don't worry about console
                browser: true,
                globals: {
                    jQuery: true,
                    $: true
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
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('target', 'Set the deploy target', function(value){
      process.env.NODE_ENV = value;
    });

    grunt.registerTask('build', [
      'jshint:public',
      'concat',
      'uglify'
    ]);

    grunt.registerTask('dev', [
      'target:development',
      'build'
    ]);

    grunt.registerTask('prod', [
      'target:production',
      'build'
    ]);

    grunt.registerTask('default', [
      'dev'
    ]);
};
