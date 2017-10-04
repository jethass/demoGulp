var gulp=require('gulp'),
coffee=require('gulp-coffee'),
compass=require('gulp-compass'),
plumber=require('gulp-plumber'),
useref=require('gulp-useref'),
gulpif = require('gulp-if'),
uglify= require('gulp-uglify'),
minifyCss = require('gulp-minify-css'),
imagemin = require('gulp-imagemin'),
clean = require('gulp-clean'),
zip = require('gulp-zip'),
livereload=require('gulp-livereload'),
svgSprite	= require('gulp-svg-sprite');


//génerer un sprite depuis plusieurs svg
gulp.task('svg', function(){
    return gulp.src('./src/*.svg')
           .pipe(plumber())
           .pipe(svgSprite({
                 mode: {
                   symbol: {
                     dest: './',
                     sprite: 'sprite.svg'
                   }
                 }
            }))
           .pipe(gulp.dest('./'));
});



gulp.task('coffee',function(){

  /*transformer coffee to js */
    return  gulp.src('js/*.coffee')
     .pipe(plumber())
     .pipe( coffee({
     	  bare: true
     }) )
     .pipe( gulp.dest('js') );

});

gulp.task('compass',function(){

   /*transformer scss to css */
    return  gulp.src('css/*.scss')
     .pipe(plumber())
     .pipe( compass({
     	css: 'css',
     	sass: 'css',
     	image: 'img'
     }) )
     .pipe( gulp.dest('css') );

});

/*supprimer le repertoire de prod et le regenerer */
gulp.task('clean',function(){
     return  gulp.src('prod',{read: false}).pipe( clean() );
});

gulp.task('img',['clean'],function(){
    /* minifier les images */
     return gulp.src('img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('prod/img'));
});

/*task par defaut */
gulp.task('prod',['coffee','compass','img'] , function(){
     
     /* regenerer les assets : css minifier et js minifier */
     var assets = useref.assets();
 
     return gulp.src('*.html')
        .pipe(assets)
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('prod'));
    
});

gulp.task('default',['prod'],function(){
     /* genère le repertoire prod zipé */
    return gulp.src('prod/**/*')
        .pipe(zip('prod.zip'))
        .pipe(gulp.dest('.'));
});


/* watch tasks */
gulp.task('watch', function(){

  var server=livereload();
  
  /*watch changement de fichier coffee script  et excute coffee*/   
  gulp.watch('js/*.coffee',['coffee']).on('change',function(event){
           console.log('le fichier '+event.path+' a ete modifie');
  });

  /*watch changement de fichier coffee script  et excute coffee*/   
  gulp.watch('css/*.scss',['compass']).on('change',function(event){
           console.log('le fichier '+event.path+' a ete modifie');
  });


 /* lance le live reload dé qu'on a un fichier modifié */ 
 gulp.watch(['*.html','js/*.js','css/*.css']).on('change',function(event){
           //server.changed(event.path);
           livereload.reload(event.path);
  });

});
