({
    baseUrl: "../app",
	mainConfigFile: '../app/require-build.js',
    name: "require-build",
    out: "../app/app.min.js",
	preserveLicenseComments: false,
    paths: {
        requireLib: "../app/bower_components/requirejs/require"
    },
	include: 'requireLib'
})