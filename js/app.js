'use strict';

var enp = enp || {};
namespace('enp.APP.app');
enp.APP.app = {
	resizeTimer: null,
	delayTime: 300, // delay for window resize
	isReady: null,

	// $(document).ready()
	winReady: function() {
		enp.APP.app.isReady = true;

	},

	// $(window).on('load')
	winLoad: function() {
		
	},

	// $(window).on('resize')
	winResize: function() {

	},

	winResizeTimer: function() {
		if (enp.APP.app.isReady) {
			if (enp.APP.app.resizeTimer) {
				clearTimeout(enp.APP.app.resizeTimer);
			}
			enp.APP.app.resizeTimer = setTimeout(enp.APP.app.winResize, enp.APP.app.delayTime);
		}
	}
};

$(document).ready(enp.APP.app.winReady);

$(window)
	.on('load', enp.APP.app.winLoad)
	.on('resize', enp.APP.app.winResizeTimer);
