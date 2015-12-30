module.exports = function( grunt ){
	grunt.initConfig({
		
		// running `grunt less` will compile once
		
		less: {
			development: {
				options: {
					paths: ["app"],
					yuicompress: true
				},
				files: {
					"./app/app.css": "./app/app.less"
				}
			}
		},
	
		// running `grunt watch` will watch for changes
	
		watch: {
			files: "./app/**/*.less",
			tasks: [ "less" ]
		}
	});
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
};