define([
'lodash',
'../matrix/charMatrix'
],
// remove meshes from scene
// add physics config

function(
  _,
  charMatrix ){
  return function( scene ){
    
    var sprite = function( config, scene ){
      var self = this
      var color = '#' + config.art.pop()
      self.id = config.id
      self.art = new charMatrix({
        scene: scene,
        color: color,
        matrix: config.art
      })
      self.init = config.init
      self.physics = config.physics
    }
    sprite.prototype.remove = function(){}
    
    return [
      {
        id: '',
        art: [
          '   ###',
          ' #######',
          '#########',
          '#  ###  #',
          '#########',
          '  #   #  ',
          ' # ### # ',
          '#       #',
          '1FC0D9'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '   ###',
          ' #######',
          '#########',
          '#  ###  #',
          '#########',
          ' # ### # ',
          ' # ### # ',
          '  #####  ',
          '8CC537'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  #    #  ',
          '   #  #   ',
          '  ######  ',
          ' ## ## ## ',
          '##########',
          '# ###### #',
          '   #  #   ',
          '  #    #  ',
          '8CC537'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  #  #  ',
          '   ##   ',
          '# #### #',
          '## ## ##',
          '########',
          '# #### #',
          '#  ##  #',
          '##    ##',
          'BB9562'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  #    #  ',
          '#  #  #  #',
          '# ###### #',
          '### ## ###',
          '### ## ###',
          ' ######## ',
          ' # #  # # ',
          '##      ##',
          '8CC537'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '   #  #  ',
          '  ######  ',
          ' ######## ',
          '### ## ###',
          '# ###### #',
          '# ###### #',
          '   #  #   ',
          '  ##  ##  ',
          '8F118A'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  #   #  ',
          ' ####### ',
          '##  #  ##',
          '#########',
          '#########',
          '  # # # #',
          ' # # # # ',
          'ED0C19'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '   ##   ',
          '  ####  ',
          ' ###### ',
          '## ## ##',
          '########',
          '  #  #  ',
          ' # ## # ',
          '# #  # #',
          '2AB242'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: 'yellow_ship',
        art: [
          '     #######     ',
          '   ###########   ',
          '  #############  ',
          ' ## # # # # # ## ',
          '#################',
          '   ### ### ###   ',
          '    #       #    ',
          'FEDF32'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){
          //self.art.explode()
        }
      },
      
      {
        id: '',
        art: [
          '  #  #  ',
          '   ##   ',
          '# #### #',
          '## ## ##',
          '########',
          '# #### #',
          '  #  #  ',
          ' ##  ## ',
          '0F6DBA'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  ####  ',
          ' ###### ',
          '## ## ##',
          '########',
          '  ####  ',
          ' # ## # ',
          '#      #',
          'EC1689'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '#',
          '#',
          'EBEDEC'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '    #    ',
          ' ####### ',
          ' ####### ',
          '#########',
          'EBEDEC'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          ' #   # ',
          '  ###  ',
          ' ##### ',
          ' # # # ',
          ' ##### ',
          '# # # #',
          '# # # #',
          'F45D1F'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '   ###   ',
          ' ####### ',
          '## ### ##',
          '#########',
          ' ##   ## ',
          '  #####  ',
          ' ##   ## ',
          '#       #',
          ' ##   ## ',
          'BF0C55'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '    #   ',
          '   ###   ',
          '  #####  ',
          ' ####### ',
          '##  #  ##',
          '#########',
          '  #####  ',
          ' #  #  # ',
          '#  # #  #',
          '46108F'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      },
      
      {
        id: '',
        art: [
          '  #   #  ',
          '#  ###  #',
          '# ##### #',
          '### # ###',
          ' ####### ',
          '  #   #  ',
          ' #     # ',
          '34968A'
        ],
        init: function( self, sprites ){},
        physics: function( self, player, sprites ){}
      }
      
    ].map(
      function( item ){
        return new sprite( item, scene )
      }
    )
  }
})