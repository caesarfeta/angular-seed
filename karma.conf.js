module.exports = function( config ){
  console.log( process.env )
  config.set({
    basePath : './',
    files : [
      { pattern: 'app/bower_components/**/*.js', included: false },
      { pattern: 'app/lib/**/*.js', included: false },
      { pattern: 'app/bower_tests/**/*.js', included: false },
      { pattern: 'app/app.js', included: false },
      'app/main.js'
    ],
    autoWatch : true,
    frameworks: [
      'jasmine',
      'requirejs'
    ],
    browsers : [
      'PhantomJS',
      'Chrome'
    ],
    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-requirejs',
      'karma-phantomjs-launcher'
    ],
    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    client: {
      captureConsole: true,
      args: [
        process.env[ 'KARMA_REGEX' ] != null ? process.env[ 'KARMA_REGEX' ] : 'spec\.js$'
      ]
    }
  })
}
