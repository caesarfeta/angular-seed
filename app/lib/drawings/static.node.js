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
  var page = Math.floor( i / 12 + 1  )
  config.html = [
    
    '<head>',
      
      // stylesheet
      
      '<link rel="stylesheet" href="../../app.css" />',
      
      // ads
      
      /*
      '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>',
      '<script>',
        '(adsbygoogle = window.adsbygoogle || []).push({',
          'google_ad_client: "ca-pub-7321645869905385",',
          'enable_page_level_ads: true',
        '});',
      '</script>',
      */
      
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
              ( !!prev ) ? '<a class="pull-right btn secondary" href="' + prev + '.html"><i class="fa fa-chevron-circle-left fa-3x"></i></a>' : '',
            '</td>',
            
            '<td>',
              '<a class="btn secondary pull-center" href="../../#/images/list/' + page  + '"><i class="fa fa-2x fa-th"></i></a>',
            '</td>',
            
            '<td>',
              ( !!next ) ? '<a class="pull-left btn secondary" href="'+ next +'.html"><i class="fa fa-chevron-circle-right fa-3x"></i></a>': '',
            '</td>',
          '</tr>',
        '</table>',
        
        // content
        
        '<h1>' + config.label + '</h1>',
        '<p>' + config.description + '</p>',
        config.imgs,
        '<p>' + config.medium + ', ' + config.date + '</p>',
        
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