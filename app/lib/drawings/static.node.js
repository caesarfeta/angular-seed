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
  
  var json = JSON.parse( fs.readFileSync( "drawings.json" )).map( function( item ){
    item.id = crypto.createHmac('sha1', 'abc')
                    .update( item.files.join('') )
                    .digest('hex')
                    .substring( 0, 10 );
    return item
  });
  
  for ( var i in json ){
    makeHtml( json, i )
  }
});

// template

function makeHtml( json, i ){
  i = parseInt( i )
  var config = json[ i ];
  var prev = ( i > 0 ) ? json[ i - 1 ].id: undefined;
  var next = ( i+1 <= json.length-1 ) ? json[ i + 1 ].id : undefined;
  config.imgs = config.files.map( function( src ){
    return '<img src="../../lib/drawings/img/' + src + '" />'
  })
  config.html = [
    
    '<head>',
      
      // stylesheet
      
      '<link rel="stylesheet" href="../../app.css" />',
      
      // analytics
      
      "<script>",
        "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
        "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),",
        "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)",
        "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');",
        "ga('create', 'UA-42372677-1', 'adamtavares.com');",
        "ga('send', 'pageview');",
      "</script>",
    
    '</head>',
    
    '<body>',
      '<div class="static-drawing">',
        
        // previous / ad / next
        
        '<table>',
          '<tr>',
            '<td>',
              ( !!prev ) ? '<a class="pull-right btn secondary" href="' + prev + '.html">&lt;&lt; Back</a>' : '',
            '</td>',
            '<td>',
              '<span>ad</span>',
            '</td>',
            '<td>',
              ( !!next ) ? '<a class="pull-left btn secondary" href="'+ next +'.html">Next &gt;&gt;</a>': '',
            '</td>',
          '</tr>',
        '</table>',
        
        // content
        
        '<h1>' + config.label + '</h1>',
        '<p>' + config.description + '</p>',
        '<p>' + config.medium + ', ' + config.date + '</p>',
        config.imgs,
        
      '</div>',
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