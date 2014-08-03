/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      // Metadata.
      public: "public",
      coreJs: "jack2d/js",
      editorJs: "jack2d-editor/js",
      platformerJs: "jack2d-platformer/js",
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
            '<%= coreJs %>/**/*.js',
            '<%= editorJs %>/**/*.js',
            '<%= platformerJs %>/**/*.js'
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
            '<%= coreJs %>/polyfill/**/*.js',
            '<%= coreJs %>/core.js',
            '<%= coreJs %>/core/**/*.js',
            '<%= coreJs %>/config/**/*.js',
            '<%= coreJs %>/async/**/*.js',
            '<%= coreJs %>/collision/**/*.js',
            '<%= coreJs %>/convert/**/*.js',
            '<%= coreJs %>/sprite/**/*.js',
            '<%= coreJs %>/ui/**/*.js',
            '<%= coreJs %>/physics-platformer/**/*.js'
          ],
          dest: '<%= public %>/js/<%= pkg.name %>.js'
        },
        distEditor: {
          src: [
            '<%= editorJs %>/**/*.js'
          ],
          dest: '<%= public %>/js/jack2d-editor.js'
        },
        distPlatformer: {
          src: [
            '<%= platformerJs %>/**/*.js'
          ],
          dest: '<%= public %>/js/jack2d-platformer.js'
        }
      },
      uglify: {
        options: {
          banner: '<%= banner %>'
        },
        dist: {
          src: '<%= concat.dist.dest %>',
          dest: '<%= public %>/js/<%= pkg.name %>.min.js'
        },
        distEditor: {
          src: '<%= concat.distEditor.dest %>',
          dest: '<%= public %>/js/jack2d-editor.min.js'
        },
        distPlatformer: {
          src: '<%= concat.distPlatformer.dest %>',
          dest: '<%= public %>/js/jack2d-platformer.min.js'
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
          src: [
            '<%= coreJs %>/**/*.js',
            '<%= editorJs %>/**/*.js',
            '<%= platformerJs %>/**/*.js'
          ]
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
      //'jshint:public',
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
