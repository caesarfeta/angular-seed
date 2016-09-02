define([],
/*
    
    var vizTest = require('lib/viz/vizTest');
    var switch = vizTest();
    switch.on;
    switch.toggle();
    
*/
function(){
    var vizTest = function(){
        this.on = false;
    }
    vizTest.prototype.toggle = function(){ this.on = !this.on; return this.on }
    return vizTest
});