// load shit

var template = require( 'html-template' );
var fs = require( 'fs' );
var crypto = require('crypto');
var rimraf = require('rimraf');
var json2html = require('node-json2html');

// config shit

var dir = '../../static/drawing';

// cleanup

rimraf( dir, function(){
  
  // create drawing directory
  
  if ( !fs.existsSync( dir )){
    fs.mkdirSync( dir );
  }
  // load JSON and template it out

  var json = JSON.parse( fs.readFileSync( "drawings.json" ));
  for ( var i in json ){
    makeHtml( json, i )
  }
});

// template

function makeHtml( json, i ){
  
  var config = json[ i ];
  
  // next and previous
  
  // create id from filenames
  
  config.id = crypto.createHmac('sha256', 'abc')
                 .update( config.files.join('') )
                 .digest('hex');
  
  config.imgs = config.files.map( function( src ){
    return '<img src="../../lib/drawings/img/' + src + '" />'
  })
  
  config.html = [
    '<body>',
      '<h1>' + config.label + '</h1>',
      config.imgs,
      '<p>' + config.description + '</p>',
      '<p>' + config.medium + '</p>',
    '</body>'
  ].join('')
  
  // build the html
  
  fs.writeFile(
    dir + '/' + config.id + '.html',
    json2html.transform( config, {
      '<>':'html',
      'html': '${html}'
    })
  )
}