var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-htmlmin'),
	server = require('gulp-server-livereload'),
	concat = require('gulp-concat');

	var env, 
	jsSources, 
	sassSources, 
	htmlSources, 
	outputDir,
	sassStyle;

	env = process.env.NODE_ENV || 'development';

	if (env ==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
}

else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

jsSources = [outputDir + '*.js'];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify()))
		.pipe(gulp.dest(outputDir +'js'))
		
});


gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir + '/images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		

		});


gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/*.json', ['json']);

});

gulp.task('webserver', function() {
  gulp.src(outputDir)
    .pipe(server({
      livereload: true,
      directoryListing: false,
      defaultFile: 'index.html'
    
    }));
});

gulp.task('html', function () {
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env === 'production', minifyHTML()))
	.pipe(gulpif(env === 'production', gulp.dest('builds/')))
	
});

gulp.task('default', ['html', 'js', 'compass', 'webserver','watch']);