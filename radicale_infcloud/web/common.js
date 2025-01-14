/*
InfCloud - the open source CalDAV/CardDAV Web Client
Copyright (C) 2011-2015
    Jan Mate <jan.mate@inf-it.com>
    Andrej Lezo <andrej.lezo@inf-it.com>
    Matej Mihalik <matej.mihalik@inf-it.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

// Used to match XML element names with any namespace
jQuery.fn.filterNsNode=function(nameOrRegex)
{
	return this.filter(
		function()
		{
			if(nameOrRegex instanceof RegExp)
				return (this.nodeName.match(nameOrRegex) || this.nodeName.replace(RegExp('^[^:]+:',''),'').match(nameOrRegex));
			else
				return (this.nodeName===nameOrRegex || this.nodeName.replace(RegExp('^[^:]+:',''),'')===nameOrRegex);
		}
	);
};

// Escape jQuery selector
function jqueryEscapeSelector(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).toString().replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g,'\\$1');
}

// Generate random string (UID)
function generateUID()
{
	uidChars='0123456789abcdefghijklmnopqrstuvwxyz';
	UID='';
	for(i=0;i<32;i++)
	{
		if(i==8 || i==12 || i==16 || i==20) UID+='-';
		UID+=uidChars.charAt(Math.floor(Math.random()*(uidChars.length-1)));
	}
	return UID;
}


// IE compatibility
if (typeof window.btoa=='undefined' && typeof base64.encode!='undefined') window.btoa=base64.encode;

// Create Basic auth string (for HTTP header)
function basicAuth(user, password)
{
	var tok=user+':'+password;
	var hash=btoa(tok);
	return 'Basic '+hash;
}

// multiply regex replace {'regex': value, 'regex': value}
String.prototype.multiReplace=function(hash)
{
	var str=this, key;
	for(key in hash)
		str=str.replace(new RegExp(key,'g'), hash[key]);
	return str;
};

// Used for sorting the contact and resource list ...
String.prototype.customCompare=function(stringB, alphabet, dir, caseSensitive)
{
	var stringA=this;

	if(alphabet==undefined || alphabet==null)
		return stringA.localeCompare(stringB);
	else
	{
		var pos=0,
		min=Math.min(stringA.length, stringB.length);
		dir=dir || 1;
		caseSensitive=caseSensitive || false;
		if(!caseSensitive)
		{
			stringA=stringA.toLowerCase();
			stringB=stringB.toLowerCase();
		}
		while(stringA.charAt(pos)===stringB.charAt(pos) && pos<min){pos++;}

		if(stringA.charAt(pos)=='')
			return -dir;
		else
		{
			var index1=alphabet.indexOf(stringA.charAt(pos));
			var index2=alphabet.indexOf(stringB.charAt(pos));

			if(index1==-1 || index2==-1)
				return stringA.localeCompare(stringB);
			else
				return (index1<index2 ? -dir : dir);
		}
	}
};

function customResourceCompare(objA, objB)
{
	return objA.displayValue.customCompare(objB.displayValue, globalSortAlphabet, 1, false);
}

function checkColorBrightness(hex)
{
	var R=parseInt(hex.substring(0, 2), 16);
	var G=parseInt(hex.substring(2, 4), 16);
	var B=parseInt(hex.substring(4, 6), 16);
	return Math.sqrt(0.241*R*R+0.691*G*G+0.068*B*B);
}

// Get unique values from array
Array.prototype.unique=function()
{
	var o={}, i, l=this.length, r=[];
	for(i=0;i<l;i++)
		o[this[i]]=this[i];
	for(i in o)
		r.push(o[i]);
	return r;
};

// Recursive replaceAll
String.prototype.replaceAll=function(stringToFind,stringToReplace)
{
	var temp=this;
	while(temp.indexOf(stringToFind)!=-1)
		temp=temp.replace(stringToFind,stringToReplace);
	return temp;
};

// Pad number with leading zeroes
Number.prototype.pad=function(size){
	var s=String(this);
	while(s.length<size)
		s='0'+s;
	return s;
};

// Case insensitive search for attributes
// Usage:	$('#selector').find(':attrCaseInsensitive(data-type,"'+typeList[i]+'")')
jQuery.expr[':'].attrCaseInsensitive=function(elem, index, match)
{
	var matchParams=match[3].split(','),
		attribute=matchParams[0].replace(/^\s*|\s*$/g,''),
		value=matchParams[1].replace(/^\s*"|"\s*$/g,'').toLowerCase();
	return jQuery(elem)['attr'](attribute)!=undefined && jQuery(elem)['attr'](attribute)==value;
};

// Capitalize given string
function capitalize(string)
{
	return string.charAt(0).toUpperCase()+string.slice(1).toLowerCase();
}
var timezoneKeys = new Array();
function populateTimezoneKeys()
{
	for(var i in timezones)
	timezoneKeys.push(i);

	timezoneKeys.push('0local');
	timezoneKeys.push('1UTC');

	timezoneKeys.sort();

	timezoneKeys[0] = timezoneKeys[0].substring(1);
	timezoneKeys[1] = timezoneKeys[1].substring(1);
	jQuery.extend(timezones,{'UTC':{}});
}

Date.prototype.getWeekNo=function()
{
	var today = this;
	Year = today.getFullYear();
	Month = today.getMonth();
	Day = today.getDate();
	now = Date.UTC(Year,Month,Day,0,0,0);
	var Firstday = new Date();
	Firstday.setYear(Year);
	Firstday.setMonth(0);
	Firstday.setDate(1);
	then = Date.UTC(Year,0,1,0,0,0);
	var Compensation = Firstday.getDay();
	if(((now-then)/86400000) > 3)
		NumberOfWeek =  Math.round((((now-then)/86400000)+Compensation)/7);
	else
	{
		if(Firstday.getDay()>4 || Firstday.getDay()==0)
		NumberOfWeek =  53;
	}
	return NumberOfWeek;
}

function zeroPad(n) {
	return (n < 10 ? '0' : '') + n;
}

var dateFormatters = {
	s	: function(d)	{return d.getSeconds() },
	ss	: function(d)	{return zeroPad(d.getSeconds())},
	m	: function(d)	{return d.getMinutes()},
	mm	: function(d)	{return zeroPad(d.getMinutes())},
	h	: function(d)	{return d.getHours() % 12 || 12},
	hh	: function(d)	{return zeroPad(d.getHours() % 12 || 12)},
	H	: function(d)	{return d.getHours()},
	HH	: function(d)	{return zeroPad(d.getHours())},
	d	: function(d)	{return d.getDate()},
	dd	: function(d)	{return zeroPad(d.getDate())},
	ddd	: function(d,o)	{return o.dayNamesShort[d.getDay()]},
	dddd: function(d,o)	{return o.dayNames[d.getDay()]},
	W	: function(d)	{return d.getWeekNo()},
	M	: function(d)	{return d.getMonth() + 1},
	MM	: function(d)	{return zeroPad(d.getMonth() + 1)},
	MMM	: function(d,o)	{return o.monthNamesShort[d.getMonth()]},
	MMMM: function(d,o)	{return o.monthNames[d.getMonth()]},
	yy	: function(d)	{return (d.getFullYear()+'').substring(2)},
	yyyy: function(d)	{return d.getFullYear()},
	t	: function(d)	{return d.getHours() < 12 ? 'a' : 'p'},
	tt	: function(d)	{return d.getHours() < 12 ? 'am' : 'pm'},
	T	: function(d)	{return d.getHours() < 12 ? 'A' : 'P'},
	TT	: function(d)	{return d.getHours() < 12 ? 'AM' : 'PM'},
	u	: function(d)	{return formatDates(d, null, "yyyy-MM-dd'T'HH:mm:ss'Z'")},
	S	: function(d)	{
		var date = d.getDate();
		if (date > 10 && date < 20) {
			return 'th';
		}
		return ['st', 'nd', 'rd'][date%10-1] || 'th';
	}
};


function formatDates(date1, date2, format, options) {
	options = options;
	var date = date1,
		otherDate = date2,
		i, len = format.length, c,
		i2, formatter,
		res = '';
	for (i=0; i<len; i++) {
		c = format.charAt(i);
		if (c == "'") {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == "'") {
					if (date) {
						if (i2 == i+1) {
							res += "'";
						}else{
							res += format.substring(i+1, i2);
						}
						i = i2;
					}
					break;
				}
			}
		}
		else if (c == '(') {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == ')') {
					var subres = formatDates(date, null, format.substring(i+1, i2), options);
					if (parseInt(subres.replace(/\D/, ''), 10)) {
						res += subres;
					}
					i = i2;
					break;
				}
			}
		}
		else if (c == '[') {
			for (i2=i+1; i2<len; i2++) {
				if (format.charAt(i2) == ']') {
					var subformat = format.substring(i+1, i2);
					var subres = formatDates(date, null, subformat, options);
					if (subres != formatDates(otherDate, null, subformat, options)) {
						res += subres;
					}
					i = i2;
					break;
				}
			}
		}
		else if (c == '{') {
			date = date2;
			otherDate = date1;
		}
		else if (c == '}') {
			date = date1;
			otherDate = date2;
		}
		else {
			for (i2=len; i2>i; i2--) {
				if (formatter = dateFormatters[format.substring(i, i2)]) {
					if (date) {
						res += formatter(date, options);
					}
					i = i2 - 1;
					break;
				}
			}
			if (i2 == i) {
				if (date) {
					res += c;
				}
			}
		}
	}
	return res;
};

// possible address field positions [fid] (value = text input, ?country?= country select input)
//  0: [              value              ]
//  1: [            ?country?            ]
//  2: [              value              ]
//  3: [              value              ]
//  4: [              value              ]
//  5: [    value    ]  6: [    value    ]
//  7: [    value    ]  8: [  ?country?  ]
//  9: [              value              ]
// 10: [              value              ]
// 11: [            ?country?            ] <- here is the country defined by default
// 12: [              value              ]
//
// address field in vCard has the following format: pobox;extaddr;street;locality;region;code;country
// only these can be used as 'data-addr-field' values
var addressTypes=null;
function localizeAddressTypes()
{
	addressTypes={
		'af':	[	'Afghanistan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'al':	[	'Albania',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'dz':	[	'Algeria',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ad':	[	'Andorra',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ao':	[	'Angola',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ag':	[	'Antigua and Barbuda',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ar':	[	'Argentina',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'am':	[	'Armenia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'au':	[	'Australia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressSuburb},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostal},
					{fid:  8, type: 'country'}
				],
		'at':	[	'Austria',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'az':	[	'Azerbaijan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bs':	[	'The Bahamas',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressIslandName},
					{fid: 11, type: 'country'}
				],
		'bh':	[	'Bahrain',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'bd':	[	'Bangladesh',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'bb':	[	'Barbados',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'by':	[	'Belarus',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'be':	[	'Belgium',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bz':	[	'Belize',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'bj':	[	'Benin',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bm':	[	'Bermuda',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'bt':	[	'Bhutan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bo':	[	'Bolivia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ba':	[	'Bosnia and Herzegovina',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bw':	[	'Botswana',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'br':	[	'Brazil',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  8, type: 'country'}
				],
		'bn':	[	'Brunei Darussalam',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'bg':	[	'Bulgaria',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bf':	[	'Burkina Faso',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'bi':	[	'Burundi',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'kh':	[	'Cambodia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'cm':	[	'Cameroon',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ca':	[	'Canada',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  8, type: 'country'}
				],
		'cv':	[	'Cape Verde',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ky':	[	'Cayman Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'cf':	[	'Central African Republic',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'td':	[	'Chad',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cl':	[	'Chile',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cn':	[	'China',
					{fid:  1, type: 'country'},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid: 10, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostal}
				],
		'tw':	[	'Taiwan',
					{fid:  1, type: 'country'},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid: 10, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostal}
			],
		'co':	[	'Colombia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'km':	[	'Comoros',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cd':	[	'Democratic Republic of the Congo',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'cg':	[	'Republic of the Congo',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cr':	[	'Costa Rica',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ci':	[	'Côte d’Ivoire',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'hr':	[	'Croatia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cu':	[	'Cuba',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cy':	[	'Cyprus',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'cz':	[	'Czech Republic',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'dk':	[	'Denmark',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'dj':	[	'Djibouti',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'dm':	[	'Dominica',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'do':	[	'Dominican Republic',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalDistrict},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ec':	[	'Ecuador',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  9, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'eg':	[	'Egypt',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrict},
					{fid:  9, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressGovernorate},
					{fid: 11, type: 'country'}
				],
		'sv':	[	'El Salvador',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDepartment},
					{fid: 11, type: 'country'}
				],
		'gq':	[	'Equatorial Guinea',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'er':	[	'Eritrea',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ee':	[	'Estonia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'et':	[	'Ethiopia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'fk':	[	'Falkland Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'fo':	[	'Faroe Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'fj':	[	'Fiji',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalDistrict},
					{fid:  9, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'fi':	[	'Finland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'fr':	[	'France',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'pf':	[	'French Polynesia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressIslandName},
					{fid:  8, type: 'country'}
				],
		'ga':	[	'Gabon',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gm':	[	'The Gambia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ge':	[	'Georgia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'de':	[	'Germany',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gh':	[	'Ghana',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gr':	[	'Greece',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gl':	[	'Greenland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalDistrict},
					{fid: 11, type: 'country'}
				],
		'gd':	[	'Grenada',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gp':	[	'Guadeloupe',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gt':	[	'Guatemala',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gn':	[	'Guinea',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gw':	[	'Guinea-Bissau',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gy':	[	'Guyana',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ht':	[	'Haiti',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'hn':	[	'Honduras',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDepartment},
					{fid:  8, type: 'country'}
				],
		'hk':	[	'Hong Kong',
					{fid:  1, type: 'country'},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrict},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
				],
		'hu':	[	'Hungary',
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid: 11, type: 'country'}
				],
		'is':	[	'Iceland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'in':	[	'India',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPinCode},
					{fid: 11, type: 'country'}
				],
		'id':	[	'Indonesia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ir':	[	'Iran',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'iq':	[	'Iraq',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ie':	[	'Ireland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressCounty},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  8, type: 'country'}
				],
		'im':	[	'Isle of Man',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'il':	[	'Israel',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'it':	[	'Italy',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  8, type: 'country'}
				],
		'jm':	[	'Jamaica',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'jp':	[	'Japan',
					{fid:  2, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressPrefecture},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCountyCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressFurtherDivisions},
					{fid: 11, type: 'country'}
				],
		'jo':	[	'Jordan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'kz':	[	'Kazakhstan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ke':	[	'Kenya',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ki':	[	'Kiribati',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressIslandName},
					{fid: 11, type: 'country'}
				],
		'kp':	[	'North Korea',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'kr':	[	'South Korea',
					{fid:  0, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  1, type: 'country'},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet}
				],
		'kw':	[	'Kuwait',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'kg':	[	'Kyrgyzstan',
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid: 11, type: 'country'}
				],
		'la':	[	'Laos',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'lv':	[	'Latvia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'lb':	[	'Lebanon',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ls':	[	'Lesotho',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'lr':	[	'Liberia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ly':	[	'Libya',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'li':	[	'Liechtenstein',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'lt':	[	'Lithuania',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'lu':	[	'Luxembourg',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mo':	[	'Macau',
					{fid:  1, type: 'country'},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrict},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
				],
		'mk':	[	'Macedonia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mg':	[	'Madagascar',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mw':	[	'Malawi',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'my':	[	'Malaysia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  8, type: 'country'}
				],
		'mv':	[	'Maldives',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ml':	[	'Mali',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mt':	[	'Malta',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'mh':	[	'Marshall Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mq':	[	'Martinique',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mr':	[	'Mauritania',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mu':	[	'Mauritius',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  4, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mx':	[	'Mexico',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  8, type: 'country'}
				],
		'fm':	[	'Micronesia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  8, type: 'country'}
				],
		'md':	[	'Moldova',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mc':	[	'Monaco',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mn':	[	'Mongolia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'me':	[	'Montenegro',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ma':	[	'Morocco',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mz':	[	'Mozambique',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'mm':	[	'Myanmar',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'na':	[	'Namibia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'nr':	[	'Nauru',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrict},
					{fid:  11, type: 'country'},
				],
		'np':	[	'Nepal',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'nl':	[	'Netherlands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'nc':	[	'New Caledonia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'nz':	[	'New Zealand',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressSuburb},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostal},
					{fid: 11, type: 'country'}
				],
		'ni':	[	'Nicaragua',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDepartment},
					{fid: 11, type: 'country'}
				],
		'ne':	[	'Niger',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ng':	[	'Nigeria',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid: 11, type: 'country'}
				],
		'no':	[	'Norway',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'om':	[	'Oman',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  4, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'pk':	[	'Pakistan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'pw':	[	'Palau',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  8, type: 'country'}
				],
		'ps':	[	'Palestinian Territories',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'pa':	[	'Panama',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  9, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'}
				],
		'pg':	[	'Papua New Guinea',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  8, type: 'country'}
				],
		'py':	[	'Paraguay',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'pe':	[	'Peru',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ph':	[	'Philippines',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrictSubdivision},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostCode},
					{fid:  7, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  8, type: 'country'}
				],
		'pl':	[	'Poland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'pt':	[	'Portugal',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'pr':	[	'Puerto Rico',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  8, type: 'country'}
				],
		'qa':	[	'Qatar',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		're':	[	'Réunion',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ro':	[	'Romania',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ru':	[	'Russia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCityRegion},
					{fid:  4, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid: 11, type: 'country'},
					{fid: 12, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode}
				],
		'rw':	[	'Rwanda',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'bl':	[	'Saint Barthélemy',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sh':	[	'Saint Helena',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'kn':	[	'Saint Kitts and Nevis',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressIslandName},
					{fid:  8, type: 'country'}
				],
		'lc':	[	'Saint Lucia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'mf':	[	'Saint Martin',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'vc':	[	'Saint Vincent and the Grenadines',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ws':	[	'Samoa',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sm':	[	'San Marino',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  8, type: 'country'}
				],
		'st':	[	'Sao Tome and Principe',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sa':	[	'Saudi Arabia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'sn':	[	'Senegal',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'rs':	[	'Serbia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sc':	[	'Seychelles',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sl':	[	'Sierra Leone',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sg':	[	'Singapore',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'sk':	[	'Slovak Republic',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'si':	[	'Slovenia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sb':	[	'Solomon Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'so':	[	'Somalia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressRegion},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  8, type: 'country'}
				],
		'za':	[	'South Africa',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  9, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'gs':	[	'South Georgia and South Sandwich Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'es':	[	'Spain',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  8, type: 'country'}
				],
		'lk':	[	'Sri Lanka',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'sd':	[	'Sudan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  4, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sr':	[	'Suriname',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalDistrict},
					{fid: 11, type: 'country'}
				],
		'sz':	[	'Swaziland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'se':	[	'Sweden',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ch':	[	'Switzerland',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'sy':	[	'Syria',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tw':	[	'Taiwan',
					{fid:  1, type: 'country'},
					{fid:  2, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressCountyCity},
					{fid:  4, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressTownshipDistrict},
					{fid:  9, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet}
				],
		'tj':	[	'Tajikistan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tz':	[	'Tanzania',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'th':	[	'Thailand',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrictSubdivision},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostCode},
					{fid: 11, type: 'country'}
				],
		'tl':	[	'Timor-Leste',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tg':	[	'Togo',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'to':	[	'Tonga',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tt':	[	'Trinidad and Tobago',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tn':	[	'Tunisia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tr':	[	'Turkey',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDistrict},
					{fid:  7, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  8, type: 'country'}
				],
		'tm':	[	'Turkmenistan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'tv':	[	'Tuvalu',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'vi':	[	'U.S. Virgin Islands',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  8, type: 'country'}
				],
		'ug':	[	'Uganda',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'ua':	[	'Ukraine',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ae':	[	'United Arab Emirates',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'gb':	[	'United Kingdom',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  4, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressCounty},
					{fid:  9, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostCode},
					{fid: 11, type: 'country'}
				],
		'us':	[	'United States',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  7, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressZip},
					{fid:  8, type: 'country'}
				],
		'uy':	[	'Uruguay',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressDepartment},
					{fid:  8, type: 'country'}
				],
		'uz':	[	'Uzbekistan',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'},
					{fid: 12, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode}
				],
		'vu':	[	'Vanuatu',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'va':	[	'Vatican',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		've':	[	'Venezuela',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  7, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressState},
					{fid:  8, type: 'country'}
				],
		'vn':	[	'Vietnam',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'region', placeholder: localization[globalInterfaceLanguage].pholderAddressProvince},
					{fid:  5, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid:  6, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid: 11, type: 'country'}
				],
		'ye':	[	'Yemen',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'zm':	[	'Zambia',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  5, type: 'input', 'data-addr-field': 'code', placeholder: localization[globalInterfaceLanguage].pholderAddressPostalCode},
					{fid:  6, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				],
		'zw':	[	'Zimbabwe',
					{fid:  2, type: 'input', 'data-addr-field': 'street', placeholder: localization[globalInterfaceLanguage].pholderAddressStreet},
					{fid:  3, type: 'input', 'data-addr-field': 'locality', placeholder: localization[globalInterfaceLanguage].pholderAddressCity},
					{fid: 11, type: 'country'}
				]
	};
}
function vObjectLineFolding(inputText)
{
	var outputText='';
	var maxLineOctetLength=75;
	var count=0;

	for(var i=0; inputText[i]!=undefined; i++)
	{
		var currentChar=inputText.charCodeAt(i);
		var nextChar=inputText.charCodeAt(i+1);
		if(currentChar==0x000D && nextChar==0x000A)
		{
			count=0;
			outputText+='\r\n';
			i++;
			continue;
		}

		var surrogatePair=false;
		if(currentChar<0x0080)
			var charNum=1;
		else if(currentChar<0x0800)
			var charNum=2;
		else if(currentChar<0xd800 || currentChar>=0xe000)
			var charNum=3;
		else
		{
			// surrogate pair
			// UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and splitting
			// the 20 bits of 0x0-0xFFFFF into two halves
			charNum=4;
			surrogatePair=true;
		}

		if(count>maxLineOctetLength-charNum)
		{
			outputText+='\r\n ';
			count=1;
		}
		outputText+=String.fromCharCode(currentChar);
		if(surrogatePair)
		{
			outputText+=String.fromCharCode(vCardText.charCodeAt(i+1));
			i++;
		}
		count+=charNum;
	}
	return outputText;
}

function rgbToHex(rgb)
{
	rgb=rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d*)?|(?:\.\d+)))?\)$/);
	function hex(x)
	{
		return ("0"+parseInt(x).toString(16)).slice(-2);
	}
	return "#"+hex(rgb[1])+hex(rgb[2])+hex(rgb[3]);
}

function hexToRgba(hex, transparency) {
	var bigint=parseInt(hex.substring(1), 16);
	var r=(bigint >> 16) & 255;
	var g=(bigint >> 8) & 255;
	var b=bigint & 255;

	return 'rgba('+r+','+g+','+b+','+transparency+')';
}

function rgbToRgba(rgb, transparency)
{
	rgb=rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d*)?|(?:\.\d+)))?\)$/);
	return 'rgba('+rgb[1]+','+rgb[2]+','+rgb[3]+','+transparency+')';
}

function dataGetChecked(resourceListSelector)
{
	var checkedArr=$(resourceListSelector).find('input[type=checkbox]:checked').not('.unloadCheck').filter('[data-id]').filter(function(){return this.indeterminate==false}).map(function(){return $(this).attr('data-id')}).get();

	for(i=checkedArr.length-1; i>=0; i--)
		if(checkedArr[i].match(new RegExp('[^/]$'))!=null && checkedArr.indexOf(checkedArr[i].replace(new RegExp('[^/]+$'), ''))!=-1)
			checkedArr.splice(i, 1);

	return checkedArr;
}

function resourceChBoxClick(obj, resourceListSelector, headerSelector, returnChecked)
{
	$(obj).parent().nextUntil(headerSelector).find('input[type=checkbox]:visible').prop('checked', $(obj).prop('checked')).prop('indeterminate', false);
	if(returnChecked)
		return dataGetChecked(resourceListSelector);
}

function collectionChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, groupSelector, returnChecked)
{
	if(collectionSelector.match('_item$'))
	{
		var tmp_coh=$(obj).parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find('input[type=checkbox]:visible');
	}
	else
	{
		var tmp_coh=$(obj).parent().parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find(collectionSelector).find('input[type=checkbox]:visible');
	}

	if(groupSelector!=null)
	{
		if($(obj).prop('checked')==false && $(obj).prop('indeterminate')==false && $(obj).attr('data-ind')=='false' &&
		$(obj).parent().next(groupSelector).height()>0/* note: ':visible' is not working! */)
		{
			$(obj).prop('indeterminate', true);
			$(obj).prop('checked', true);
			$(obj).attr('data-ind', 'true');
			tmp_coh.find('input[type=checkbox]:visible').prop('indeterminate', true).prop('checked', false);

			if(returnChecked)
				return dataGetChecked(resourceListSelector);
			return true;
		}
		else if($(obj).attr('data-ind')=='true')
			$(obj).attr('data-ind', 'false');

		$(obj).parent().next(groupSelector).find('input[type=checkbox]').prop('checked', $(obj).prop('checked'));
	}

	if(tmp_co_chbxs.length==tmp_co_chbxs.filter(':checked').length)
		tmp_coh.find('input[type=checkbox]:visible').prop('checked', true).prop('indeterminate', false);
	else if(tmp_co_chbxs.filter(':checked').length==0 && tmp_co_chbxs.filter(function(){return this.indeterminate==true}).length==0)
		tmp_coh.find('input[type=checkbox]:visible').prop('checked', false).prop('indeterminate', false);
	else
		tmp_coh.find('input[type=checkbox]:visible').prop('indeterminate', true).prop('checked', false);

	if(returnChecked)
		return dataGetChecked(resourceListSelector);
}

function groupChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, groupSelector, returnChecked)
{
	var tmp_cg=$(obj).closest(groupSelector);
	var tmp_cg_chbxs=tmp_cg.find('input[type=checkbox]:visible');
	var tmp_co_chbxs=tmp_cg.prev().find('input[type=checkbox]:visible');

	if(tmp_cg_chbxs.filter(':checked').length==0)
		tmp_co_chbxs.prop('checked', false).prop('indeterminate', false);
	else
		tmp_co_chbxs.prop('indeterminate', true).prop('checked', false);

	return collectionChBoxClick(tmp_co_chbxs, resourceListSelector, headerSelector, collectionSelector, null, returnChecked);
}

function loadResourceChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, resourceItemSelector)
{
	if(collectionSelector.match('_item$'))
	{
		var firstCollection=$(obj).parent().nextUntil(headerSelector).first();
		if($(obj).prop('checked'))
			$(obj).parent().nextUntil(headerSelector).addBack().removeClass('unloaded');
		else
			$(obj).parent().nextUntil(headerSelector).addBack().addClass('unloaded');
	}
	else
	{
		var firstCollection=$(obj).parent().nextUntil(headerSelector).first().find(collectionSelector);
		if($(obj).prop('checked'))
		{
			$(obj).parent().nextUntil(headerSelector).find(collectionSelector).removeClass('unloaded');
			$(obj).parent().removeClass('unloaded');
		}
		else
		{
			$(obj).parent().nextUntil(headerSelector).find(collectionSelector).addClass('unloaded');
			$(obj).parent().addClass('unloaded');
		}
	}

	$(resourceListSelector).find(headerSelector).find('.unloadCheckHeader:checked').prop('disabled',false);
	$(resourceListSelector).find(collectionSelector).find('.unloadCheck:checked').prop('disabled',false);
	if(!$(resourceListSelector).find(headerSelector).find('.unloadCheckHeader').filter(function(){return $(this).prop('checked') || $(this).prop('indeterminate');}).length)
	{
		$(obj).prop({'checked':false,'indeterminate':true});
		$(obj).parent().removeClass('unloaded');
		$(obj).parent().nextUntil(headerSelector).find('.unloadCheck').prop({'checked':false,'indeterminate':false});
		firstCollection.removeClass('unloaded').find('.unloadCheck').prop({'checked':true,'indeterminate':false,'disabled':true});
	}
	else
	{
		$(obj).parent().nextUntil(headerSelector).find('.unloadCheck').prop({'checked':$(obj).prop('checked'),'indeterminate':false});
		var checkedCollections=$(resourceListSelector).find(collectionSelector).find('.unloadCheck:checked');
		if(checkedCollections.length==1)
		{
			var collection=checkedCollections.parents(resourceItemSelector);
			if(!collection.prev().hasClass(resourceItemSelector.slice(1)) && !collection.next().hasClass(resourceItemSelector.slice(1)))
				collection.prev().find('.unloadCheckHeader').prop('disabled',true);
			checkedCollections.prop('disabled',true);
		}
	}
}

function loadCollectionChBoxClick(obj, resourceListSelector, headerSelector, collectionSelector, resourceItemSelector)
{
	if($(obj).prop('checked'))
		$(obj).parent().removeClass('unloaded');
	else
		$(obj).parent().addClass('unloaded');

	var checkedCollections=$(resourceListSelector).find(collectionSelector).find('.unloadCheck:checked');
	if(checkedCollections.length==1)
	{
		var collection=checkedCollections.parents(resourceItemSelector);
		if(!collection.prev().hasClass(resourceItemSelector.slice(1)) && !collection.next().hasClass(resourceItemSelector.slice(1)))
			collection.prev().find('.unloadCheckHeader').prop('disabled',true);
		checkedCollections.prop('disabled',true);
	}
	else
	{
		$(resourceListSelector).find(headerSelector).find('.unloadCheckHeader:checked').prop('disabled',false);
		checkedCollections.prop('disabled',false);
	}

	if(collectionSelector.match('_item$'))
	{
		var tmp_coh=$(obj).parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find('.unloadCheck');
	}
	else
	{
		var tmp_coh=$(obj).parent().parent().prevAll(headerSelector).first();
		var tmp_co_chbxs=tmp_coh.nextUntil(headerSelector).find(collectionSelector).find('.unloadCheck');
	}

	if(tmp_co_chbxs.length==tmp_co_chbxs.filter(':checked').length)
		tmp_coh.removeClass('unloaded').find('.unloadCheckHeader').prop('checked', true).prop('indeterminate', false);
	else if(tmp_co_chbxs.filter(':checked').length==0 && tmp_co_chbxs.filter(function(){return this.indeterminate==true}).length==0)
		tmp_coh.addClass('unloaded').find('.unloadCheckHeader').prop('checked', false).prop('indeterminate', false);
	else
		tmp_coh.removeClass('unloaded').find('.unloadCheckHeader').prop('indeterminate', true).prop('checked', false);
}

// Escape vCalendar value - RFC2426 (Section 2.4.2)
function vcalendarEscapeValue(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).replace(vCalendar.pre['escapeRex'],"\\$1").replace(vCalendar.pre['escapeRex2'],'\\n');
}

// Unescape vCalendar value - RFC2426 (Section 2.4.2)
function vcalendarUnescapeValue(inputValue)
{
	var outputValue='';

	if(inputValue!=undefined)
	{
		for(var i=0;i<inputValue.length;i++)
			if(inputValue[i]=='\\' && i+1<inputValue.length)
			{
				if(inputValue[++i]=='n')
					outputValue+='\n';
				else
					outputValue+=inputValue[i];
			}
			else
				outputValue+=inputValue[i];
	}
	return outputValue;
}

// Split parameters and remove double quotes from values (if parameter values are quoted)
function vcalendarSplitParam(inputValue)
{
	var result=vcalendarSplitValue(inputValue, ';');
	var index;

	for(var i=0;i<result.length;i++)
	{
		index=result[i].indexOf('=');
		if(index!=-1 && index+1<result[i].length && result[i][index+1]=='"' && result[i][result[i].length-1]=='"')
			result[i]=result[i].substring(0,index+1)+result[i].substring(index+2,result[i].length-1);
	}
	return result;
}

// Split string by separator (but not '\' escaped separator)
function vcalendarSplitValue(inputValue, inputDelimiter)
{
	var outputArray=new Array();
	var i=0;
	var j=0;

	for(i=0;i<inputValue.length;i++)
	{
		if(inputValue[i]==inputDelimiter)
		{
			if(outputArray[j]==undefined)
				outputArray[j]='';
			++j;
			continue;
		}
		outputArray[j]=(outputArray[j]==undefined ? '' : outputArray[j])+inputValue[i];
		if(inputValue[i]=='\\' && i+1<inputValue.length)
			outputArray[j]=outputArray[j]+inputValue[++i];
	}
	return outputArray;
}

function dateFormatJqToFc(input)
{
	return input.replaceAll('DD','dddd').replaceAll('D','ddd').replace(/(MM|M)/g, '$1MM').replaceAll('m','M').replace(/y/g,'yy');
}

// Escape vCard value - RFC2426 (Section 2.4.2)
function vcardEscapeValue(inputValue)
{
	return (inputValue==undefined ? '' : inputValue).replace(/(,|;|\\)/g,"\\$1").replace(/\n/g,'\\n');
}

// Unescape vCard value - RFC2426 (Section 2.4.2)
function vcardUnescapeValue(inputValue)
{
	var outputValue='';
	if(inputValue!=undefined)
	{
		for(var i=0;i<inputValue.length;i++)
			if(inputValue[i]=='\\' && i+1<inputValue.length)
			{
				if(inputValue[++i]=='n')
					outputValue+='\n';
				else
					outputValue+=inputValue[i];
			}
			else
				outputValue+=inputValue[i];
	}
	return outputValue;
}

// Split parameters and remove double quotes from values (if parameter values are quoted)
function vcardSplitParam(inputValue)
{
	var result=vcardSplitValue(inputValue, ';');
	var index;

	for(var i=0;i<result.length;i++)
	{
		index=result[i].indexOf('=');
		if(index!=-1 && index+1<result[i].length && result[i][index+1]=='"' && result[i][result[i].length-1]=='"')
			result[i]=result[i].substring(0,index+1)+result[i].substring(index+2,result[i].length-1);
	}

	return result;
}

// Split string by separator (but not '\' escaped separator)
function vcardSplitValue(inputValue, inputDelimiter)
{
	var outputArray=new Array(),
	i=0,j=0;

	for(i=0;i<inputValue.length;i++)
	{
		if(inputValue[i]==inputDelimiter)
		{
			if(outputArray[j]==undefined)
				outputArray[j]='';
			++j;
			continue;
		}
		outputArray[j]=(outputArray[j]==undefined ? '' : outputArray[j])+inputValue[i];

		if(inputValue[i]=='\\' && i+1<inputValue.length)
			outputArray[j]=outputArray[j]+inputValue[++i];
	}

	if(inputValue[inputValue.length-1]==inputDelimiter)
		outputArray[j]='';

	return outputArray;
}

// equivalent data types (multiply types and/or type combinations can represent the same thing)
// the vcard editor by default uses the "key" value as a type, but when this type is matched by
// by "value" regexp then the server specified type is used as default
var dataTypes=new Object();
dataTypes['address_type']={
	'work': RegExp('^work$'),
	'home': RegExp('^home$'),
	':_$!<other>!$_:': RegExp('^(?::_\\$!<other>!\\$_:|other)$')
};

dataTypes['address_type_store_as']={
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['phone_type']={
	'work': RegExp('^(?:voice,)?work$'),
	'home': RegExp('^home(?:,voice)?$'),
	'cell': RegExp('^cell(?:,voice)?$'),
	'cell,work': RegExp('^cell(?:,voice)?,work$'),
	'cell,home': RegExp('^cell,home(?:,voice)?$'),
	'main': RegExp('^main(?:,voice)?$'),
	'pager': RegExp('^pager$'),
	'fax': RegExp('^fax$'),
	'fax,work': RegExp('^fax,work$'),
	'fax,home': RegExp('^fax,home$'),
	'iphone': RegExp('^(?::_\\$!<iphone>!\\$_:|(?:cell,)?iphone(?:,voice)?)$'),
	'other': RegExp('^(?::_\\$!<other>!\\$_:|other)(?:,voice)?$')
};

dataTypes['phone_type_store_as']={
	'_$!<iphone>!$_':'_$!<iPhone>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['email_type']={
	'internet,work': RegExp('^internet,work$'),
	'home,internet': RegExp('^home,internet$'),
	':mobileme:,internet': RegExp('^(?::mobileme:,internet|internet,mobileme)$'),
	':_$!<other>!$_:,internet': RegExp('^(?::_\\$!<other>!\\$_:,internet|internet,other)$')
};

dataTypes['email_type_store_as']={
	'_$!<mobileme>!$_':'_$!<mobileMe>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['url_type']={
	'work': RegExp('^work$'),
	'home': RegExp('^home$'),
	':_$!<homepage>!$_:': RegExp('^(?::_\\$!<homepage>!\\$_:|homepage)$'),
	':_$!<other>!$_:': RegExp('^(?::_\\$!<other>!\\$_:|other)$')
};

dataTypes['url_type_store_as']={
	'_$!<homepage>!$_':'_$!<HomePage>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['date_type']={
	':_$!<anniversary>!$_:': RegExp('^:_\\$!<anniversary>!\\$_:$'),
	':_$!<other>!$_:': RegExp('^:_\\$!<other>!\\$_:$')
};

dataTypes['date_store_as']={
	'_$!<anniversary>!$_':'_$!<Anniversary>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['person_type']={
	':_$!<father>!$_:': RegExp('^:_\\$!<father>!\\$_:$'),
	':_$!<mother>!$_:': RegExp('^:_\\$!<mother>!\\$_:$'),
	':_$!<parent>!$_:': RegExp('^:_\\$!<parent>!\\$_:$'),
	':_$!<brother>!$_:': RegExp('^:_\\$!<brother>!\\$_:$'),
	':_$!<sister>!$_:': RegExp('^:_\\$!<sister>!\\$_:$'),
	':_$!<child>!$_:': RegExp('^:_\\$!<child>!\\$_:$'),
	':_$!<friend>!$_:': RegExp('^:_\\$!<friend>!\\$_:$'),
	':_$!<spouse>!$_:': RegExp('^:_\\$!<spouse>!\\$_:$'),
	':_$!<partner>!$_:': RegExp('^:_\\$!<partner>!\\$_:$'),
	':_$!<assistant>!$_:': RegExp('^:_\\$!<assistant>!\\$_:$'),
	':_$!<manager>!$_:': RegExp('^:_\\$!<manager>!\\$_:$'),
	':_$!<other>!$_:': RegExp('^:_\\$!<other>!\\$_:$')
};

dataTypes['person_type_store_as']={
	'_$!<manager>!$_':'_$!<Manager>!$_',
	'_$!<assistant>!$_':'_$!<Assistant>!$_',
	'_$!<father>!$_':'_$!<Father>!$_',
	'_$!<mother>!$_':'_$!<Mother>!$_',
	'_$!<parent>!$_':'_$!<Parent>!$_',
	'_$!<brother>!$_':'_$!<Brother>!$_',
	'_$!<sister>!$_':'_$!<Sister>!$_',
	'_$!<child>!$_':'_$!<Child>!$_',
	'_$!<friend>!$_':'_$!<Friend>!$_',
	'_$!<spouse>!$_':'_$!<Spouse>!$_',
	'_$!<partner>!$_':'_$!<Partner>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['im_type']={
	'work': RegExp('^work$'),
	'home': RegExp('^home$'),
	':mobileme:': RegExp('^(?::mobileme:|mobileme)$'),
	':_$!<other>!$_:': RegExp('^(?::_\\$!<other>!\\$_:|other)$')
};

dataTypes['im_type_store_as']={
	'_$!<mobileme>!$_':'_$!<mobileMe>!$_',
	'_$!<other>!$_':'_$!<Other>!$_'
};

dataTypes['im_service_type_store_as']={
	'aim':'AIM',
	'icq':'ICQ',
	'irc':'IRC',
	'jabber':'Jabber',
	'msn':'MSN',
	'yahoo':'Yahoo',
	'facebook':'Facebook',
	'gadugadu':'GaduGadu',
	'googletalk':'GoogleTalk',
	'qq':'QQ',
	'skype':'Skype'
};

dataTypes['profile_type']={
	'twitter': RegExp('^twitter$'),
	'facebook': RegExp('^facebook$'),
	'flickr': RegExp('^flickr$'),
	'linkedin': RegExp('^linkedin$'),
	'myspace': RegExp('^myspace$'),
	'sinaweibo': RegExp('^sinaweibo$')
};

dataTypes['profile_type_store_as']={};
