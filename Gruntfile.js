module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: [
          'lib/*.js',
          'lib/interfaces/*.js',
          'lib/types/*.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['lib/**/*.js', 'test/*-tests.js']
    },

    qunit: {
      options: {
        timeout: 20000
      },
      all: {
        options: {
          urls: ['http://localhost:8000/test/index.html']
        }
      }
    },

    connect: {
      server: {
        port: 8000,
        base: '.'
      }
    },

    jsbeautifier: {
      files: ['lib/*.js', 'lib/**/*.js', 'test/*-tests.js']
    },

    jsdoc : {
        dist : {
            src: ['lib/**/*.js', 'test/*.js'], 
            options: {
                destination: 'doc'
            }
        }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('tidy', ['jsbeautifier', 'jshint']);
  grunt.registerTask('default', ['jsbeautifier', 'jshint', 'test', 'uglify']);

};