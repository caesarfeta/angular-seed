// load shit

var template = require( 'html-template' );
var fs = require( 'fs' );
var crypto = require('crypto');
var rimraf = require('rimraf');
var markdown = require('markdown').markdown;
var json2html = require('node-json2html');

// config shit

var dir = '../../static/story';

// cleanup

rimraf( dir, function(){
  
  // create drawing directory
  
  if ( !fs.existsSync( dir )){
    fs.mkdirSync( dir );
  }
  // load JSON and template it out
  
  var json = JSON.parse( fs.readFileSync( "stories.json" ));
  
  for ( var i in json ){
    makeHtml( json, i )
  }
});

// template

function makeHtml( json, i ){
  i = parseInt( i )
  var config = json[ i ];
  config.id = config.file.replace(/\.md/, '' )
  var story = markdown.toHTML( fs.readFileSync( "md/" + config.file, 'utf8' ))
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
    
    '<body class="static-story">',
      '<div class="container">',
        '<div class="row">',
          '<div class="cols3"></div>',
          '<div class="cols4 story">',
            story,
          '</div>',
          '<div class="cols3"></div>',
        '</div>',
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