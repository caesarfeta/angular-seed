'use strict';

define([
'angular',
'jquery',
'd3',
'topojson',
'lib/common/atCommon'
], 
function( 
	angular, 
	$, 
	d3, 
	topojson ){
	
	angular.module('atMaps',[ 'atCommon' ])
		
	.directive( 'atMapOverlay', [
		function(){}
	])
	
	.factory( 'mapOverlay', [
		function(){
			var mapOverlay = function(){}
			return mapOverlay
		}
	])
	
	
	// draw a world map
	
	.directive( 'atWorldMap', [
		'atGen',
		function( atGen ){ return {
			replace: true,
			template: '<div></div>',
			scope: {
				country: '@'
			},
			link: function( scope, elem ){
				
				// default config
				
				var width = 400;
				var height = 260;

				var projection = d3.geo.mercator()
				.center([ 0, 0 ])
				.scale( 50 )
				.translate([ 200, 150 ])
				.rotate([ -10, 0 ]);
				
				// generate guid for d3
				
				var elemId = atGen.elemId();
				$( elem ).attr( 'id', elemId );
				$( elem ).attr( 'class', 'at-world-map' );
				var selectId = function(){
					return '#' + elemId;
				}
				
				// build the svg canvas

				var svg = d3.select( selectId() )
					.append( 'svg' )
					.attr( 'width', width )
					.attr( 'height', height );

				var path = d3.geo.path()
					.projection( projection );

				var g = svg.append( 'g' );

				// load and display the world
				
				d3.json( 'assets/json/world-110m2.json', 
					function( error, topology ){
						g.selectAll( 'path' )
						.data(
							topojson.feature( topology, topology.objects.countries ).features
						)
						.enter()
						.append( 'path' )
						.attr( 'd', path )
					}
				);
				
				// highlight the country
				// scope.country
			}
		}}
	])
	
	.service( 'atWorldMapSvc', [
		function(){}
	])
	
	.service( 'atWorldFacts', [
		function(){
			var self = this;
			self.countries = {};
			self.countries.data = {
				af: 'Afghanistan',
				al: 'Albania',
				dz: 'Algeria',
				as: 'American Samoa',
				ad: 'Andorra',
				ao: 'Angola',
				ai: 'Anguilla',
				aq: 'Antarctica',
				ag: 'Antigua and Barbuda',
				ar: 'Argentina',
				am: 'Armenia',
				aw: 'Aruba',
				au: 'Australia',
				at: 'Austria',
				az: 'Azerbaijan',
				bx: 'Bahamas',
				bh: 'Bahrain',
				bd: 'Bangladesh',
				bb: 'Barbados',
				by: 'Belarus',
				be: 'Belgium',
				bz: 'Belize',
				bj: 'Benin',
				bm: 'Bermuda',
				bt: 'Bhutan',
				bo: 'Bolivia',
				ba: 'Bosnia and Herzegovina',
				bw: 'Botswana',
				br: 'Brazil',
				io: 'British Indian Ocean Territory',
				vg: 'British Virgin Islands',
				bn: 'Brunei',
				bg: 'Bulgaria',
				bf: 'Burkina Faso',
				bi: 'Burundi',
				kh: 'Cambodia',
				cm: 'Cameroon',
				ca: 'Canada',
				cv: 'Cape Verde',
				ky: 'Cayman Islands',
				cf: 'Central African Republic',
				td: 'Chad',
				cl: 'Chile',
				cn: 'China',
				cx: 'Christmas Island',
				cc: 'Cocos Islands',
				co: 'Colombia',
				km :'Comoros',
				ck: 'Cook Islands',
				cr: 'Costa Rica',
				hr: 'Croatia',
				cu: 'Cuba',
				cy: 'Cyprus',
				cz: 'Czech Republic',
				cd: 'Democratic Republic of the Congo',
				dk: 'Denmark',
				dj: 'Djibouti',
				dm: 'Dominica',
				do: 'Dominican Republic',
				tl: 'East Timor',
				ec: 'Ecuador',
				eg: 'Egypt',
				sv: 'El Salvador',
				gq: 'Equatorial Guinea',
				er: 'Eritrea',
				ee: 'Estonia',
				et: 'Ethiopia',
				fk: 'Falkland Islands',
				fo: 'Faroe Islands',
				fj: 'Fiji',
				fi: 'Finland',
				fr: 'France',
				pf: 'French Polynesia',
				ga: 'Gabon',
				gm: 'Gambia',
				ge: 'Georgia',
				de: 'Germany',
				gh: 'Ghana',
				gi: 'Gibraltar',
				gr: 'Greece',
				gl: 'Greenland',
				gd: 'Grenada',
				gu: 'Guam',
				gt: 'Guatemala',
				gn: 'Guinea',
				gw: 'Guinea-Bissau',
				gy: 'Guyana',
				ht: 'Haiti',
				hn: 'Honduras',
				hk: 'Hong Kong',
				hu: 'Hungary',
				is: 'Iceland',
				in: 'India',
				id: 'Indonesia',
				ir: 'Iran',
				iq: 'Iraq',
				ie: 'Ireland',
				im: 'Isle of Man',
				il: 'Israel',
				it: 'Italy',
				ci: 'Ivory Coast',
				jm: 'Jamaica',
				jp: 'Japan',
				je: 'Jersey',
				jo: 'Jordan',
				kz: 'Kazakhstan',
				ke: 'Kenya',
				ki: 'Kiribati',
				kw: 'Kuwait',
				kg: 'Kyrgyzstan',
				la: 'Laos',
				lv: 'Latvia',
				lb: 'Lebanon',
				ls: 'Lesotho',
				lr: 'Liberia',
				lY: 'Libya',
				li: 'Liechtenstein',
				lt: 'Lithuania',
				lu: 'Luxembourg',
				mo: 'Macao',
				mk: 'Macedonia',
				mg: 'Madagascar',
				mw: 'Malawi',
				my: 'Malaysia',
				mv: 'Maldives',
				ml: 'Mali',
				mt: 'Malta',
				mh: 'Marshall Islands',
				mr: 'Mauritania',
				mu: 'Mauritius',
				yt: 'Mayotte',
				mx: 'Mexico',
				fm: 'Micronesia',
				md: 'Moldova',
				mc: 'Monaco',
				mn: 'Mongolia',
				me: 'Montenegro',
				ms: 'Montserrat',
				ma: 'Morocco',
				mz: 'Mozambique',
				mm: 'Myanmar',
				na: 'Namibia',
				nr: 'Nauru',
				np: 'Nepal',
				nl: 'Netherlands',
				an: 'Netherlands Antilles',
				nc: 'New Caledonia',
				nz: 'New Zealand',
				ni: 'Nicaragua',
				ne: 'Niger',
				ng: 'Nigeria',
				nu: 'Niue',
				kp: 'North Korea',
				mp: 'Northern Mariana Islands',
				no: 'Norway',
				om: 'Oman',
				pk: 'Pakistan',
				pw: 'Palau',
				pa: 'Panama',
				pg: 'Papua New Guinea',
				py: 'Paraguay',
				pe: 'Peru',
				ph: 'Philippines',
				pn: 'Pitcairn',
				pl: 'Poland',
				pt: 'Portugal',
				pr: 'Puerto Rico',
				qa: 'Qatar',
				cg: 'Republic of the Congo',
				ro: 'Romania',
				ru: 'Russia',
				rw: 'Rwanda',
				bl: 'Saint Barthelemy',
				sh: 'Saint Helena',
				kn: 'Saint Kitts and Nevis',
				lc: 'Saint Lucia',
				mf: 'Saint Martin',
				pm: 'Saint Pierre and Miquelon',
				vc: 'Saint Vincent and the Grenadines',
				ws: 'Samoa',
				sm: 'San Marino',
				st: 'Sao Tome and Principe',
				sa: 'Saudi Arabia',
				sn: 'Senegal',
				rs: 'Serbia',
				sc: 'Seychelles',
				sl: 'Sierra Leone',
				sg: 'Singapore',
				sk: 'Slovakia',
				si: 'Slovenia',
				sb: 'Solomon Islands',
				so: 'Somalia',
				za: 'South Africa',
				gs: 'South Georgia and the South Sandwich Islands',
				kr: 'South Korea',
				es: 'Spain',
				lk: 'Sri Lanka',
				sd: 'Sudan',
				sr: 'Suriname',
				sj: 'Svalbard and Jan Mayen',
				sz: 'Swaziland',
				se: 'Sweden',
				ch: 'Switzerland',
				sy: 'Syria',
				tw: 'Taiwan',
				tj: 'Tajikistan',
				tz: 'Tanzania',
				th: 'Thailand',
				tg: 'Togo',
				tk: 'Tokelau',
				to: 'Tonga',
				tt: 'Trinidad and Tobago',
				tn: 'Tunisia',
				tr: 'Turkey',
				tm: 'Turkmenistan',
				tc: 'Turks and Caicos Islands',
				tv: 'Tuvalu',
				vi: 'U.S. Virgin Islands',
				ug: 'Uganda',
				ua: 'Ukraine',
				ae: 'United Arab Emirates',
				gb: 'United Kingdom',
				us: 'United States',
				uy: 'Uruguay',
				uz: 'Uzbekistan',
				vu: 'Vanuatu',
				va: 'Vatican',
				ve: 'Venezuela',
				vn: 'Vietnam',
				wf: 'Wallis and Futuna',
				eh: 'Western Sahara',
				ye: 'Yemen',
				zm: 'Zambia',
				zw: 'Zimbabwe'
			}
		}
	])
});