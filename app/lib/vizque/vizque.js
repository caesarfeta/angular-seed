define([
'angular'
], 
function(){
  return angular.module( 'vizque', [])
  .service( 'vizque', function(){
    var self = this
    self.list = [
      {
        url: '/app/lib/vizque/svg/mad_misfits.svg',
        desc: 'Danzig E Neumann'
      }
    ]
    return self
  })
  .directive( 'vizque', [
    function(){
      return {
        scope: true,
        template: [
          
          '<h1>vizque</h1>',
          '<div vizque-canvas></div>',
          '<div vizque-library></div>',
          '<div vizque-sizes></div>',
          
        ].join(' '),
        link: function( scope ){
          console.log( scope.vizque )
        }
      }
    }
  ])
  .directive( 'vizqueCanvas', function(){
    return {
      scope: true,
      template: [
        
        '<div>canvas</div>'
        
      ].join(' ')
    }
  })
  .directive( 'vizqueLibrary', function(){
    return {
      scope: true,
      template: [
        
        '<div>',
          '<div ng-repeat="item in vizque.list">',
            '<img ng-src="{{ item.url }}" alt="{{ item.desc }}">',
            '<div>{{ item.desc }}</div>',
          '</div>',
        '</div>'
        
      ].join(' ')
    }
  })
  .directive( 'vizqueSizes', function(){
    return {
      scope: true,
      template: [
        
        '<div>sizes</div>'
        
      ].join(' ')
    }
  })
})