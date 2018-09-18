
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');



gulp.task('default', function () {
    require('dotenv').config();
    nodemon({
        script: 'server.js',
        ext: 'js',
        env: {
            PORT:8000
        },
        ignore: ['./node_modules/**']
    }).on('restart', function(){
        console.log('Change Detected, Restarting ' + new Date().toLocaleTimeString());
    });
});

