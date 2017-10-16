define([
'./module'
], 
function( module ){
  module
  .service( 'texturizerOptions', [
    function(){
      return [
        {
          id: 'bowtie edge',
          renderer: 'texturizer-ireg-poly',
          unit: 100,
          x: 10,
          y: 10,
          path: [
            [ 0, 0.75 ],
            [ 280, 1 ],
            [ 80, 0.75 ],
            [ 80, 1 ]
          ]
        },
        {
          id: 'bowtie',
          renderer: 'texturizer-ireg-poly',
          unit: 100,
          x: 10,
          y: 10,
          path: [
            [ 160, 1 ],
            [ 200, 1 ],
            [ 80, 0.75 ],
            [ 80, 1 ],
            [ 200, 1 ],
            [ 80, 0.75 ]
          ]
        },
        {
          id: 'wobble spiral',
          renderer: 'texturizer-spiral',
          origin: {
            x: 400,
            y: 400
          },
          revolutions: 40,
          pointCount: 1024,
          clockwise: false,
          padding: 6
        },
        {
          id: 'box',
          renderer: 'texturizer-box',
          width: 6,
          height: 3,
          depth: 3,
          thickness: 0.25
        },
        {
          id: 'pentagon tile 1',
          renderer: 'texturizer-ireg-poly',
          x: 10,
          y: 10,
          notch: true,
          notchHeight: 12,
          path: [
            [ 60, .5 ],
            [ 135, 0.9659258262890684 ],
            [ 105, .5 ],
            [ 90, .5 ],
            [ 150, 1 ]
          ],
          unit: 200
        },
        {
          id: 'spiral flower',
          renderer: 'texturizer-spiral',
          mutator: {
            type: 'flower',
            petals: 5,
            amplitude: 0.5
          },
          origin: {
            x: 350,
            y: 400
          },
          revolutions: 20,
          pointCount: 4096,
          clockwise: false,
          padding: 15
        },
        {
          id: 'spiral',
          renderer: 'texturizer-spiral',
          origin: {
            x:100,
            y:100
          },
          revolutions: 20,
          pointCount: 2048,
          clockwise: false,
          padding: 4
        },
        {
          id: 'quick hinge',
          renderer: 'texturizer-stacked-bars',
          total: 10,
          height: 300,
          width: 0,
          hSpace: 3,
          vSpace: 5,
          chunk: [
            [ 3, 0.25 ],
            [ 3, 0.75 ]
          ]
        },
        {
          id: 'explode',
          renderer: 'texturizer-explode',
          explosions: [
            {
              x: 0,
              y: 0,
              total: 100,
              r: [ 200, 300 ],
              width: 1
            },
            {
              x: 100,
              y: 100,
              total: 50,
              r: [ 100, 200 ],
              width: 1
            },
            {
              x: 250,
              y: 250,
              total: 100,
              r: [ 50, 175 ],
              width: 1
            }
          ]
        },
        {
          id: 'arcs',
          renderer: 'texturizer-arcs',
          x: 0,
          y: 0,
          r: 30,
          width: 5
        },
        {
          id: 'bullseye',
          renderer: 'texturizer-bullseye',
          circles: [
            {
              total: 20,
              width: 1,
              space: 20,
              x: 400,
              y: 400
            }
          ]
        },
        {
          id: 'slim bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 100,
          width: 2,
          hSpace: 2,
          vSpace: 5,
          chunk: [ 1, 2, 3 ]
        },
        {
          id: 'chunky bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 300,
          width: 10,
          hSpace: 2,
          vSpace: 5,
          chunk: [ 2, 1 ]
        },
        {
          id: 'offset bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 300,
          width: 5,
          hSpace: 2,
          vSpace: 5,
          chunk: [
            [ 1, 0.1 ],
            [ 1, 0.5 ],
            [ 1, 0.25 ],
            [ 1, 0.75 ],
            [ 1, 0.9 ]
          ]
        },
        {
          id: 'regular polygons',
          renderer: 'texturizer_reg_poly',
          sideLength: 100,
          nSides: [ 3, 4, 5, 6, 8 ]
        },
        {
          id: 'regular polygons notch',
          renderer: 'texturizer_reg_poly',
          sideLength: 100,
          notch: true,
          nSides: [ 3, 4, 5, 6, 8 ]
        },
        {
          id: '1/8" plywood cube side',
          renderer: 'texturizer_reg_poly',
          sideLength: 100,
          notch: true,
          notchHeight: 12, // 1/8 * 96
          nSides: [ 4 ]
        },
        {
          id: 'sine wave',
          renderer: 'texturizer-sine-wave',
          waves: [
            {
              frequency: 10,
              total: 100,
              width: 400,
              unit: 2,
              space: 15,
              amplitude: 50
            }
          ]
        },
        {
          id: 'sine waves',
          renderer: 'texturizer-sine-wave',
          waves: [
            {
              frequency: 10,
              total: 100,
              width: 800,
              unit: 2,
              space: 15,
              amplitude: 50
            },
            {
              frequency: 50,
              total: 50,
              width: 800,
              unit: 2,
              space: 60,
              amplitude: 80
            }
          ]
        }
      ]
    }
  ])
})