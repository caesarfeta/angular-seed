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
    threejs: 'bower_components/three.js/build/three',
    THREE: 'lib/THREE',
    'THREE.OBJExporter': 'bower_components/three.js/examples/js/exporters/OBJExporter',
    'THREE.OBJLoader': 'bower_components/three.js/examples/js/loaders/OBJLoader',
    'THREE.STLLoader': 'bower_components/three.js/examples/js/loaders/STLLoader',
    'THREE.MeshLine': 'lib/three.meshline/src/THREE.MeshLine',
    stats: 'bower_components/Physijs/examples/js/stats',
    lodash: 'bower_components/lodash/dist/lodash',
    'color-thief': 'bower_components/color-thief/src/color-thief',
    'dat.gui': 'bower_components/dat.gui/dat.gui.min',
    tinycolor: 'bower_components/tinycolor/dist/tinycolor-min',
    timbre: 'bower_components/timbre/timbre.dev',
    Masonry: 'lib/masonry.pkgd.min',
    outlayer: 'bower_components/outlayer'
  },
  shim: {
    angular: {
      deps:['jquery'],
      exports: 'angular'
    },
    Masonry: {
      deps:['jquery']
    },
    angularRoute: ['angular'],
    angularMocks: {
      deps:['angular'],
      exports:'angular.mock'
    },
    'color-thief': {
      exports: 'ColorLib'
    },
    'dat.gui': {
      exports: 'dat'
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
    'THREE.OBJExporter': {
      deps: ['THREE']
    },
    'THREE.OBJLoader': {
      deps: ['THREE']
    },
    'THREE.STLLoader': {
      deps: ['THREE']
    },
    'THREE.MeshLine': {
      deps: ['THREE']
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
    }
  },
});
require(['app']);