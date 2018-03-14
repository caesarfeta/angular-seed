define([
'lodash',
'../matrix/charMatrix'
],
function(
  _,
  charMatrix ){
    
  return function( scene ){
    return [
      //[
      //  '   ###',
      //  ' #######',
      //  '#########',
      //  '#  ###  #',
      //  '#########',
      //  '  #   #  ',
      //  ' # ### # ',
      //  '#       #',
      //  '1FC0D9'
      //],
      //[
      //  '   ###',
      //  ' #######',
      //  '#########',
      //  '#  ###  #',
      //  '#########',
      //  ' # ### # ',
      //  ' # ### # ',
      //  '  #####  ',
      //  '8CC537'
      //],
      //[
      //  '  #    #  ',
      //  '   #  #   ',
      //  '  ######  ',
      //  ' ## ## ## ',
      //  '##########',
      //  '# ###### #',
      //  '   #  #   ',
      //  '  #    #  ',
      //  '8CC537'
      //],
      //[
      //  '  #  #  ',
      //  '   ##   ',
      //  '# #### #',
      //  '## ## ##',
      //  '########',
      //  '# #### #',
      //  '#  ##  #',
      //  '##    ##',
      //  'BB9562'
      //],
      //[
      //  '  #    #  ',
      //  '#  #  #  #',
      //  '# ###### #',
      //  '### ## ###',
      //  '### ## ###',
      //  ' ######## ',
      //  ' # #  # # ',
      //  '##      ##',
      //  '8CC537'
      //],
      //[
      //  '   #  #  ',
      //  '  ######  ',
      //  ' ######## ',
      //  '### ## ###',
      //  '# ###### #',
      //  '# ###### #',
      //  '   #  #   ',
      //  '  ##  ##  ',
      //  '8F118A'
      //],
      //[
      //  '  #   #  ',
      //  ' ####### ',
      //  '##  #  ##',
      //  '#########',
      //  '#########',
      //  '  # # # #',
      //  ' # # # # ',
      //  'ED0C19'
      //],
      //[
      //  '   ##   ',
      //  '  ####  ',
      //  ' ###### ',
      //  '## ## ##',
      //  '########',
      //  '  #  #  ',
      //  ' # ## # ',
      //  '# #  # #',
      //  '2AB242'
      //],
      //[
      //  '     #######     ',
      //  '   ###########   ',
      //  '  #############  ',
      //  ' ## # # # # # ## ',
      //  '#################',
      //  '   ### ### ###   ',
      //  '    #       #    ',
      //  'FEDF32'
      //],
      //[
      //  '  #  #  ',
      //  '   ##   ',
      //  '# #### #',
      //  '## ## ##',
      //  '########',
      //  '# #### #',
      //  '  #  #  ',
      //  ' ##  ## ',
      //  '0F6DBA'
      //],
      //[
      //  '  ####  ',
      //  ' ###### ',
      //  '## ## ##',
      //  '########',
      //  '  ####  ',
      //  ' # ## # ',
      //  '#      #',
      //  'EC1689'
      //],
      [
        '    #    ',
        ' ####### ',
        ' ####### ',
        '#########',
        'EBEDEC'
      ]
    ].map(
      function( art ){
        var color = '#' + art.pop()
        return new charMatrix({
          scene: scene,
          color: color,
          matrix: art
        })
      }
    )
  }
})