async = require("async");

module.exports = function(grunt) {

  // Add the grunt-mocha-test tasks.
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    clean: {
      tests: {
        src: ['test/all-tests.js', 'test/single-test.js']
      }
    },

    typescript: {
      lib: {
        src: ['lib/tsmc.ts', 'lib/**/*.ts', "!lib/**/*.d.ts"],
        dest: 'lib/tsmc.js',
        options: {
          //module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          base_path: './',
          //sourcemap: true,
          //fullSourceMapPath: true,
          //declaration: true,
          removeComments: false
        }
      },
      tests: {
        src: ['test/**/*.spec.ts', "!test/_sample.spec.ts"],
        dest: 'test/all-tests.js',
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          //base_path: 'tests/',
          //sourcemap: true,
          //fullSourceMapPath: true,
          //declaration: true,
        }
      },

      // a template for compiling only one test
      test: {
        src: 'test/**/TARGET.spec.ts',
        dest: 'test/single-test.js',
        options: {
          module: 'commonjs', //or commonjs
          target: 'es5', //or es3
          //base_path: 'tests/',
          //sourcemap: true,
          //fullSourceMapPath: true,
          //declaration: true,
        }
      }
    },

    // Configure a mochaTest task
    mochaTest: {
      all: {
        options: {
          reporter: 'spec'
        },
        src: ['test/all-tests.js']
      },
      single: {
        options: {
          reporter: 'spec'
        },
        src: ['test/single-test.js']
      }
    }
  });

  grunt.registerTask('docs', function() {
    var tsdoc = require('./tsdoc/src/TSDoc');
    var done = this.async();
    var onJSDoc = tsdoc.onJSDoc;

    tsdoc.onJSDoc = function(error, stdout, stderr) {
      onJSDoc(error, stdout, stderr);
      done();
    };

    tsdoc.cmd();
  });

  grunt.registerTask('compile', ['typescript:lib']);

  grunt.registerTask('tests', ['typescript:tests', 'mochaTest:all', 'clean:tests']);

  grunt.registerTask('test', function(target) {

    console.log(target);
    grunt.config('typescript.test.src', grunt.config('typescript.test.src').replace('TARGET', target));

    grunt.task.run(['typescript:test', 'mochaTest:single', 'clean:tests']);
  });

  grunt.registerTask('default', ['compile', 'tests', 'docs']);

};
