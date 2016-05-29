var casper = require("casper").create();
casper.options.clientScripts = ["jquery.js"];
viewportSizes = [
[1440, 900, 768, 600, 340]
];

var url = process.cwd().split('\\').pop();
mainDir = 'casperjs';
saveDir = url.replace(/[^a-zA-Z0-9]/gi, '-').replace(/^https?-+/, '');

var makeScreenshots = function() {
	casper.each(viewportSizes, function(self, viewportSize, i) {
		var width = viewportSize[0],
		height = viewportSize[1];
		casper.wait(5000, function() {
			this.viewport(width, height);
			casper.thenOpen(url, function() {
				this.echo('Opening at ' + width);
				var FPfilename = mainDir + '/' + saveDir + '/fullpage-' + width + ".png";
				var ACfilename = mainDir + '/' + saveDir + '/' + width + '-' + height + ".png";
				this.captureSelector(FPfilename, 'body');
				this.capture(ACfilename, {
					top: 0,
					left: 0,
					width: width,
					height: height
				});
				this.echo('snapshot taken');
			});
		});
	});
};

casper.start(url, function() {
	casper.echo(this.getCurrentUrl());
});
casper.then(function() {
	makeScreenshots();
});

casper.on("page.error", function(msg, trace) {
	this.echo("Error: " + msg, "ERROR");
});
casper.run(function() {
	this.echo('Finished captures for ' + url).exit();
});