module.exports = function( grunt ){
	grunt.initConfig({
		
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
		
		// run requirejs
		
		requirejs: {
			compile: {
				options: {
					baseUrl: "./app",
					mainConfigFile: './app/require-build.js',
					name: "require-build",
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
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
};