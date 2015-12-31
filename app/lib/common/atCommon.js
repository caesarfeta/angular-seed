'use strict';

define([
'angular',
'jquery'
], 
function( angular, $ ){
	
	angular.module('atCommon',[])
	
	// run function on input enter
	
	.directive('ngEnter', function(){
		return function( scope, elem, attrs ){
			elem.bind( "keydown keypress", function( e ){
				if ( e.which === 13 ){
					
					// if shift key is pressed exit
					
					if ( e.shiftKey ){ return }
					
					scope.$apply(
						function(){
							scope.$eval( attrs.ngEnter );
						}
					);
					e.preventDefault();
				}
			})
		}
	})
	
	
	// shrink a resource link
	
	.filter('shrinkLink', function(){
		return function( input ){
			if ( input == undefined ){ return '...' }
			if ( input.indexOf( 'http' ) == 0 ){
				return input.substr( input.lastIndexOf('/') + 1 )
			}
			return input
		}
	})
	
	
	// spin service
	
	.service( 'spinSvc', [
		'spinItem',
		function( spinItem ){
			var self = this;
			self.ids = {};
			
			// build the spinItem
			// if it doesn't exist currently
			
			self.register = function( id ){
				if ( ! ( id in self.ids )){
					self.ids[ id ] = new spinItem();
				}
				return self.ids[ id ]
			};

			self.ready = function( id ){
				return id in self.ids
			}
		}
	])
	
	.factory( 'spinItem', [
		'$timeout',
		function( $timeout ){
			var wait = .5;
			var spinItem = function(){
				this.skip = false;
				this.elem = undefined;
				this.show = false;
			};

			spinItem.prototype.off = function( secs ){
				var self = this;
				self.skip = false;
				secs = ( secs == undefined ) ? wait : secs;
				$timeout(
					function(){
						if ( !self.skip ){
							$( self.elem ).hide();
							self.show = false;
						}
					},
					secs*1000
				);
			};

			spinItem.prototype.on = function(){
				var self = this;
				self.skip = true;
				self.show = true;
				if ( self.elem != undefined ){
					$( self.elem ).show();
				}
			};

			spinItem.prototype.setElem = function( elem ){
				var self = this;
				self.elem = elem;
				if ( self.show == true ){
					self.on();
				}
				else {
					self.off( 0 );
				}
			};

			return spinItem;
		}
	])
	
	.directive( 'spinner', [
		'spinSvc',
		function( spinSvc ){
			return {
				template: '<span><img src="assets/img/spin.gif"></span>',
				replace: true,
				scope: {
					spinId: '@'
				},
				link: function( scope, elem ){
	
					// watch for spinSvc registration
					
					var unbind = scope.$watch(
						function(){ return spinSvc.ready( scope.spinId )},
						function( n, o ){
							if ( n == undefined ){ return }
							if ( n === true ){
								start();
								unbind();
							}
						}
					);
					
					// start
					
					function start(){
						scope.spin = spinSvc.ids[ scope.spinId ];
						scope.spin.setElem( elem );
					}
				}
			}
		}
	])
	
	.service( 'worldFacts', [
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