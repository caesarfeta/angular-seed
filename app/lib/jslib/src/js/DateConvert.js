/**
 * Convert dates
 */
function DateConvert() {}

/**
 * Convert an Hijri year to a Gregorian year
 *
 * @param { Int } _h
 * @return { Int } Gregorian year.
 */
DateConvert.prototype.hijriToGreg = function( _h ) {
	return Math.round( _h-(_h/33)+622 );
}
DateConvert.prototype.toRoman = function( _h ) {
	return this.hijriToGreg( _h );
}

/**
 * Convert a Gregorian year to an Hijri year
 *
 * @param { Int } _g
 * @return { Int } Hijri year.
 */
DateConvert.prototype.gregToHijri = function( _g ) {
	return Math.round( _g-622+(_g-622)/32 );
}
DateConvert.prototype.toArabic = function( _h ) {
	return this.gregToHijri( _h );
}