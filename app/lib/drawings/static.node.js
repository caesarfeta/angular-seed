// load shit

var template = require( 'html-template' );
var fs = require( 'fs' );
var crypto = require('crypto');
var rimraf = require('rimraf');
var json2html = require('node-json2html');

// config shit

var dir = '../../static/drawing';
rimraf( dir, function(){});
if ( !fs.existsSync( dir )){
  fs.mkdirSync( dir );
}

// template

function makeHtml( json, i ){
  
  var config = json[ i ]
  
  // next and previous
  
  // create id from filenames
  
  config.id = crypto.createHmac('sha256', 'abc')
                 .update( config.files.join('') )
                 .digest('hex');
                 
  transform = {
    "<>":"div",
    "html": [
      "${ id } ${ label } ${ description} ${ medium } ${ date } ${ files }"
    ].join('')
  };
  
  // build the html
  
  fs.writeFile(
    dir + '/' + config.id + '.html',
    json2html.transform( config, transform )
  )
}

// load JSON file

var json = JSON.parse( fs.readFileSync( "drawings.json" ));
for ( var i in json ){
  makeHtml( json, i )
}