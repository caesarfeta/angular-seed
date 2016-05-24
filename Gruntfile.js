module.exports = function( grunt ){
    grunt.initConfig({
        
        concat: {
            dist: {
                files: {
                    'app/main.js': [ 
                        'app/config/karma.snippet.js', 
                        'app/config/require.config.js', 
                        'app/config/karma.require.js', 
                        'app/config/require.close.js' 
                    ],
                    'app/build.js': [ 
                        'app/config/require.config.js', 
                        'app/config/require.close.js' 
                    ]
                }
            }
        },
        
        // running `grunt less` will compile once
        
        less: {
            development: {
                options: {
                    paths: ["app"],
                    yuicompress: true,
                    plugins: [require('less-plugin-glob')]
                },
                files: {
                    "./app/app.css": "./app/app.less"
                }
            }
        },
        
        // run karma tests
        
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            unit: {
                singleRun: true
            },
            continuous: {
                background: true
            }
        },
        
        // run requirejs
        
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./app",
                    mainConfigFile: './app/build.js',
                    name: "build",
                    out: "./app/app.min.js",
                    preserveLicenseComments: false,
                    paths: {
                        requireLib: "bower_components/requirejs/require"
                    },
                    include: 'requireLib'
                }
            }
        },
    
        // running `grunt watch` will watch for changes
    
        watch: {
            less: {
                files: "./app/**/*.less",
                tasks: [ "less" ]
            },
            requirejs: {
                files: "./app/lib/**/*.js",
                tasks: [ "requirejs" ]
            }
        }
    });
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-karma');
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
};