// finds test files for karma

var baseUrl = null;
if( window.__karma__ ){
  baseUrl = '/base';
  var allTestFiles = [];
  var TEST_REGEXP = /spec\.js$/;
  var pathToModule = function( path ){
    return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
  };
  
  Object.keys( window.__karma__.files ).forEach(
    function( file ){
      if ( TEST_REGEXP.test(file) ){
        
        // Normalize paths to RequireJS module names.
        
        allTestFiles.push( pathToModule( file ));
      }
    }
  );
}
// main config for 3rd party dependencies

require.config({
  paths: {
    jquery: 'bower_components/jquery/dist/jquery',
    jqueryUi: 'bower_components/jquery-ui/jquery-ui.min',
    angular: 'bower_components/angular/angular',
    angularRoute: 'bower_components/angular-route/angular-route',
    angularMocks: 'bower_components/angular-mocks/angular-mocks',
    bootstrap: 'bower_components/angular-bootstrap/ui-bootstrap.min',
    'colorpicker.module': 'bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min',
    text: 'bower_components/requirejs-text/text',
    d3: 'bower_components/d3/d3',
    topojson: 'bower_components/topojson/topojson',
    threejs: 'bower_components/threejs/build/three',
    'THREE.TrackballControls': 'bower_components/threejs/examples/js/controls/TrackballControls',
    'THREE.OrthographicTrackballControls': 'bower_components/threejs/examples/js/controls/OrthographicTrackballControls',
    stats: 'bower_components/Physijs/examples/js/stats',
    lodash: 'bower_components/lodash/dist/lodash',
    'color-thief': 'bower_components/color-thief/src/color-thief',
    'dat.gui': 'bower_components/dat.gui/dat.gui.min',
    tinycolor: 'bower_components/tinycolor/dist/tinycolor-min',
    timbre: 'bower_components/timbre/timbre.dev',
    'lazy-image': 'bower_components/ng-directive-lazy-image/release/lazy-image.min'
  },
  shim: {
    angular: {
      deps:['jquery'],
      exports: 'angular'
    },
    'color-thief': {
      exports: 'ColorLib'
    },
    'dat.gui': {
      exports: 'dat'
    },
    angularRoute: ['angular'],
    angularMocks: {
      deps:['angular'],
      exports:'angular.mock'
    },
    bootstrap: {
      deps:['angular']
    },
    'colorpicker.module': {
      deps:['bootstrap']
    },
    topojson: {
      exports: 'topojson'
    },
    threejs: {
      exports: 'THREE'
    },
    'THREE.TrackballControls': {
      deps:['threejs']
    },
    'THREE.OrthographicTrackballControls': {
      deps:['threejs']
    },
    stats: {
      exports: 'Stats'
    },
    lodash: {
      exports: 'lodash' 
    },
    tinycolor: {
      exports: 'tinycolor' 
    },
    jqueryUi: {
      deps: ['jquery']
    },
    'lazy-image': {
      deps: ['angular']
    }
  },
  priority: [ "angular" ],
  deps: window.__karma__ ? allTestFiles : [],
  callback: window.__karma__ ? window.__karma__.start : null,
  baseUrl: window.__karma__ ? '/base/app' : '',
});
require(['app']);