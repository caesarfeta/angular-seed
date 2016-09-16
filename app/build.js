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
        'dat.gui': 'bower_components/threejs/examples/js/libs/dat.gui.min',
        tinycolor: 'bower_components/tinycolor/dist/tinycolor-min'
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
        }
    },
});
require(['app']);