define([
'angular',
'lib/common/atCommon',
'lib/common/imgKit/imgKit'
], 
function( angular ){
	return angular.module( 'dbpedia',[ 
		'atCommon', 
		'imgKit' 
	])
})