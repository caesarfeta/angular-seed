define([ 
'angular',
'./atMoney'
],
function( 
  angular,
  at ){
  'use strict';
  return angular.module( 'atMoney',[])
  .factory( 'atBudget',[
    function(){
      return at.budget
    }
  ])
  .factory( 'atStream', [
    function(){
      return at.stream
    }
  ])
  .factory( 'atMoney',[
    function(){
      return at.money
    }
  ])
  .factory( 'pieChart',[
    function(){
      return at.pieChart
    }
  ])
  .factory( 'barComp',[
    function(){
      return at.barComp
    }
  ])
  .service( 'taxRates',[
    function(){
      return at.taxRates
    }
  ])
  .service( 'myBudget',[
    function(){
      return at.myBudget
    }
  ])
})