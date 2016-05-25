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