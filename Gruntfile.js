module.exports = function( grunt ) {

	// Config
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),
		sass: { //SASS on main.scss
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files: {
                    'src/compile.css': 'src/scss/style.scss'
                }
            }
        },
		postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                },

                processors: [
                    require('autoprefixer')({ browsers: 'last 3 versions' }), // add vendor prefixes 
                ]
            },
            dist: {
                src: 'src/compile.css',
                dest: 'public/files/style.min.css'
            }
        },
		clean: {
			build: {
				src: [ 'src/compile.css' ]
			}
		},
		watch: {
			css: {
				files: [ 'src/scss/**/*.scss' ],
				tasks: [ 'sass', 'postcss', 'clean' ],
				options: {
					spawn: false
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-postcss' );

	grunt.registerTask( 'default', ['sass', 'postcss', 'clean'] );
	grunt.registerTask( 'dev', [ 'watch' ] );

};