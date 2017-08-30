var gulp = require('gulp');
var sass = require('gulp-sass');
var tildeImporter = require('node-sass-tilde-importer');
var del = require('del');

const alfrescoLibs = [
    'ng2-activiti-analytics',
    'ng2-activiti-diagrams',
    'ng2-activiti-form',
    'ng2-activiti-processlist',
    'ng2-activiti-tasklist',
    'ng2-alfresco-core',
    'ng2-alfresco-datatable',
    'ng2-alfresco-documentlist',
    'ng2-alfresco-login',
    'ng2-alfresco-search',
    'ng2-alfresco-tag',
    'ng2-alfresco-upload',
    'ng2-alfresco-userinfo',
    'ng2-alfresco-viewer',
    'ng2-alfresco-webscript'
];

gulp.task('build', function () {
    var libGlobs = alfrescoLibs.map(function(lib) {
        return 'node_modules/' + lib + '/**/*.scss';
    });

    gulp.src(libGlobs, { base: 'node_modules/' })
        .pipe(gulp.dest('dist'));

    gulp.src('src/*.scss', { base: 'src/' })
        .pipe(gulp.dest('dist'));

});

gulp.task('build:dev', function () {
    var libGlobs = alfrescoLibs.map(function(lib) {
        return '../ng2-components/' + lib + '/src/**/*.scss';
    });

    gulp.src(libGlobs, { base: '../ng2-components/' })
        .pipe(gulp.dest('dist'));

    gulp.src('src/*.scss', { base: 'src/' })
        .pipe(gulp.dest('dist'));
});

gulp.task('precompile', function () {
    gulp.src('src/prebuilt/*.scss', { base: 'src/' })
        .pipe(gulp.dest('dist'));
});

gulp.task('compile', function () {
    gulp.src('dist/prebuilt/*.scss')
        .pipe(sass({
                importer: tildeImporter,
                includePaths : ['dist', 'node_modules']
            }).on('error', sass.logError))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('postcompile', function() {
    return del(['dist/prebuilt']);
});
