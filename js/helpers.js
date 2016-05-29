/**********************************************************************************************
 *
 * Title: Helpers (set of defaults & reusable methods)
 * Last update: 27.08.2014
 *
 ***********************************************************************************************/

/* jshint strict: true */
/* global $:false, namespace:false */

'use strict';

/**
 * Avoid 'console' errors in browsers that lack a console.
 * Based on boilersplate
 */
(function() {
	var method, noop, methods, length, console;

	noop = function() {};
	methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	length = methods.length;
	console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
	console.log('Avoid `console` errors is ON');
}());

/**
 * General namespace function
 */
function namespace(namespaceString) {
	var parts, parent, currentPart, i, length;
	
	parts = namespaceString.split('.');
	parent = window;
	currentPart = '';
	for (i = 0, length = parts.length; i < length; i += 1) {
		currentPart = parts[i];
		parent[currentPart] = parent[currentPart] || {};
		parent = parent[currentPart];
	}
	return parent;
}



var enp = enp || {};
namespace('enp.APP.helpers');
enp.APP.helpers = {
	version: 'TAG 1.0 - last update 24.07.2014',

	/**
	 * equal height
	 * equalH('.elements', '#container', 'minWidth'); 1-required, 2-3-optional
	 */
	equalH: function(grp, cont, minwid) {
		var group, groupLength, tallest, thisHeight, container, minWidth, winW, i;
		
		container = $(cont);
		group = container.length > 0 ? container.find(grp) : $(grp);
		groupLength = group.length;
		minWidth = minwid;
		
		if(minWidth !== null && minWidth !== '' && isNaN(minWidth) === false) {
			winW = $(window).width();
		}

		if (groupLength) {
			if (typeof winW === 'undefined' || (typeof winW !== 'undefined' && winW >= minWidth)) {
				tallest = 0;
				thisHeight = 0;
				group.css({'height':'auto'});
				for (i = 0; i < groupLength; i += 1) {
					thisHeight = group.eq(i).height();
					if (thisHeight > tallest) {
						tallest = thisHeight;
					}
				}
				group.css({'height':tallest+'px'});
			}
			else {
				group.css({'height':'auto'});
			}
		}
		console.log('equalH is ON for ' + groupLength + ' element(s)');
	},
	/**
	 * based on http://css-tricks.com/equal-height-blocks-in-rows/
	 * eqalHRow('.elements', '#container', 'minWidth'); 1-required, 2-3-optional
	 */
	eqalHRow: function(grp, cont, minwid) {
		var currentTallest = 0,
			currentRowStart = 0,
			rowDivs = [],
			rowDivsLen = 0,
			$el,
			topPosition = 0,
			$container = $(cont),
			$elements = $container.length > 0 ? $container.find(grp) : $(grp),
			currentDiv,
			winW,
			minWidth = minwid;

		if(minWidth !== null && minWidth !== '' && isNaN(minWidth) === false) {
			winW = $(window).width();
		}

		if ($elements.length) {
			$elements.css({'height':'auto'});

			if (typeof winW === 'undefined' || (typeof winW !== 'undefined' && winW >= minWidth)) {
				$elements.each(function() {

					$el = $(this);
					topPosition = $el.position().top;

					if (currentRowStart != topPosition) {
						rowDivsLen = rowDivs.length;

						// we just came to a new row.  Set all the heights on the completed row
						for (currentDiv = 0; currentDiv < rowDivsLen; currentDiv += 1) {
							rowDivs[currentDiv].height(currentTallest);
						}

						// set the variables for the new row
						rowDivs.length = 0; // empty the array
						rowDivsLen = 0;
						currentRowStart = topPosition;
						currentTallest = $el.height();
						rowDivs.push($el);

					} else {
						// another div on the current row.  Add it to the list and check if it's taller
						rowDivs.push($el);
						currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
					}

					rowDivsLen = rowDivs.length;

					// do the last row
					for (currentDiv = 0; currentDiv < rowDivsLen; currentDiv += 1) {
						rowDivs[currentDiv].height(currentTallest);
					}

				});
			}
		}
	},

	equalHFlex: function(items, container) {
		var s = document.body || document.documentElement;
		s = s.style;
		if (typeof s.webkitFlexWrap != 'undefined' || typeof s.msFlexWrap != 'undefined' || typeof s.flexWrap != 'undefined') {
			return true;
		}

		var $container, $items, perRow, maxHeight, itemHeight, $row;
	 
		$container = $(container);
		if($container.length) {
			$items = $container.find(items);
			$items.css({'height':'auto'});

			perRow = Math.floor($container.width() / $items.eq(0).width());
			
			if (perRow === null || perRow < 2) {
				return true;
			}

			for (var i = 0, j = $items.length; i < j; i += perRow) {
				maxHeight = 0;
				$row = $items.slice(i, i + perRow);

				$row.each( function() {
					itemHeight = parseInt($( this ).outerHeight());
					if (itemHeight > maxHeight) {
						maxHeight = itemHeight;
					}
				});
				$row.css({'height':maxHeight});
			}
		}
	},

	/**
	 * Window location
	 */
	windowLocation: function(el, url) {
		$(el).on('click', function(e) {
			e.preventDefault();
			window.location.href = url;
		});
	},
	/**
	 * Toggle
	 */
	toggle: function(event, elon, el) {
		var $el = $(el);

		$el.on(event, elon, function(e) {
			e.preventDefault();
			$el.toggle();
		});
	},
	
	/**
	 * Variation of the phrase
	 * Usage example: phraseVariation('#js-productsNumber', '#js-productsText', ['produkt','produkty','produktów']);
	 */
	phraseVariation: function(valueId, targetTxt, variety) {
		var ct, $tg, variations, dt;
		
		$tg = $(valueId);
		dt = $tg.data('count');
		if (typeof dt !== 'undefined') {
			ct = $(valueId).data('count');
		}
		else {
			ct = $tg.text();
		}
		ct = parseInt(ct, 10);
		if(isNaN(ct) === false) {
			$tg = $(targetTxt);
			variations = variety;
			
			if (ct % 10 <= 1 || ct % 10 >= 5 || (ct % 100 >= 11 && ct % 100 <= 19)) {
				$tg.text(variations[2]);
			}
			else {
				if (ct !== 1) {
					$tg.text(variations[1]);
				}
				else {
					$tg.text(variations[0]);
				}
			}
		}
	},
	
	/**
	 * single characters
	 */
	singleChar: function(target) {
		$(target).contents().filter(function(){
			return this.nodeType == 3;
		}).each(function(){
			this.nodeValue = this.nodeValue.replace(/(\s\w)\s/g,"$1\xA0");
		});
	},
	
	/**
	 * cookies
	 */
	checkCookie: function(cname, cvalue, exdays, callbk, setnew) {
		var cookieName, cookieValue, expireDays, cookieCallback, ck, setNew;
		
		var setCookie = function(cname, cvalue, exdays) {
			var d, expires;
			d = new Date();
			d.setTime(d.getTime() + (exdays * 24*60*60*1000));
			expires = "expires=" + d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		getCookie = function(cname) {
			var name, ca, i, c;
			name = cname + "=";
			ca = document.cookie.split(';');
			for(i = 0; i < ca.length; i += 1) {
				c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) != -1) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		};
		
		cookieName = cname;
		cookieValue = cvalue;
		expireDays = exdays;
		cookieCallback = callbk;
		setNew = setnew || true;
		ck = getCookie(cookieName);
		if (!ck || ck != cookieValue) {
			if (setNew) {
				setCookie(cookieName, cookieValue, expireDays);
			}
			if (cookieCallback && typeof cookieCallback === "function") {
				cookieCallback.apply(this);
			}
		}
	}
};