// load shit

var template = require( 'html-template' );
var fs = require( 'fs' );
var crypto = require('crypto');
var rimraf = require('rimraf');

// config shit

var dir = '../../static/drawing';
rimraf( dir, function(){});
if ( !fs.existsSync( dir )){
  fs.mkdirSync( dir );
}

// template

function makeHtml( config ){
  
  // create id from filenames
  
  var id = crypto.createHmac('sha256', 'abc')
                 .update( config.files.join('') )
                 .digest('hex');
  
  fs.writeFile( dir + '/' + id + '.html', JSON.stringify( config ))
}

// load JSON file

var json = JSON.parse( fs.readFileSync( "drawings.json" ));
for ( var i in json ){
  makeHtml( json[i] )
}

// templating

/*
var html = template();
var skills = html.template( 'skill' );
fs.createReadStream( __dirname + '/static.html.tmpl' )
    .pipe( html )
    .pipe( process.stdout );
skills.write({
    '[key=name]': 'macaroni pictures',
    '[key=level]': '40%'
});
skills.write({
    '[key=name]': 'quilting',
    '[key=level]': '5000%'
});
skills.write({
    '[key=name]': 'blinky lights',
    '[key=level]': '50%'
});
skills.end();
*/