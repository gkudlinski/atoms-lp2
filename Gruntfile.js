module.exports = function (grunt) {
	var imageDest;
	imageDest = "/media/cache/resolve/filemanager_original/images/LP/";
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			origin: {
				options: {
					sassDir: 'css',
					cssDir: 'css',
					environment: 'production',
					sourcemap: false
				}
			}
		},
		concat: {
            options: {
                process: function (src, filepath) {
                    var fileExtension = filepath.match(/\.[0-9a-z]+$/i);
                    if (fileExtension !== undefined && fileExtension == ".html") {
                        var regex;
                        // get body content
                        regex = /<body[^>]*>((.|[\n\r])*)<\/body>/im.exec(src);
                        if (src.length > 1) {
                            src = regex[1];
                        }
                        // remove scripts
                        src = src.replace(/<script[^>]*>((.|[\n\r])*)<\/script>/im, '');
                        // replace image source
                        src = src.replace(/src="images/gm, 'src="' + imageDest);
                        src = src.replace(/src='images/gm, "src='" + imageDest);
                        src = src.replace(/src="img/gm, 'src="' + imageDest);
                        src = src.replace(/src='img/gm, "src='" + imageDest);
                        // remove first tab in line
                        src = src.replace(/^\t/gm, '');
                        // remove empty lines
                        src = src.replace(/^\s*\n/gm, '');
                    }
                    if (filepath == "css/style.css") {
                        src = "<style>\n" + src;
                        // remove font-faces
                        src = src.replace(/@font-face{[^\}]*\}/g, '');
                        // replace image source 
                        src = src.replace(/\.\.\/images/gm, imageDest);
                        src = src.replace(/\.\.\/img/gm, imageDest);
                        src += "</style>";
                    }
                    return src;
                }
            },
			dist: {
				src: ['index.html', 'css/style.css'],
				dest: '_dist/dist.txt',
			},
		},
		notify: {
			ready: {
				options: {
					title: 'Sprawdzaj!',
					message: 'Wszystko gotowe'
				}
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'css/style.css': 'css/style.scss'
				}
			}
		},
		clean: ["_dist/*"],
		stylizeSCSS: {
			options: {
				extraLine: false,
				oneLine: false
			},
			target: {
				files: [{
					expand: true,
					src: ['css/style.scss']
				}]
			}
		},
		fixindent: {
			stylesheets: {
				src: [
					'css/style.scss'
				],
				dest: 'css/style.css',
				options: {
					style: 'tab',
					size: 1
				}
			}
		},
		watch: {
			global: {
				files: ['css/*.scss'],
				tasks: ['stylizeSCSS', 'fixindent', 'sass', 'clean', 'concat', 'reload', 'notify:ready'],
				options: {
					nospawn: true
				},
			},
			html: {
				files: ['*.html'],
				tasks: ['concat', 'reload', 'notify:ready'],
				options: {
					nospawn: true
				}
			}
		},
		reload: {
			port: 6001,
	        proxy: {
	            host: 'localhost',
	        }
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-fixindent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-scss-stylize');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-reload');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.registerTask('default', ['watch']);
};